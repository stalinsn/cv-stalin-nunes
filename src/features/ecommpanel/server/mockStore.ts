import 'server-only';
import {
  type PanelAuditEvent,
  type PanelPermission,
  type PanelResetToken,
  type PanelRoleId,
  type PanelSession,
  type PanelUser,
  type PanelUserRecord,
} from '../types/auth';
import { hashPassword } from './password';
import { nowIso, randomToken, sha256 } from './crypto';
import { PANEL_SECURITY } from '../config/security';

type MockDb = {
  users: Map<string, PanelUserRecord>;
  sessions: Map<string, PanelSession>;
  resetTokens: Map<string, PanelResetToken>;
  auditLogs: PanelAuditEvent[];
  seeded: boolean;
};

declare global {
  var __ECOMMPANEL_DB__: MockDb | undefined;
}

function getDb(): MockDb {
  if (!global.__ECOMMPANEL_DB__) {
    global.__ECOMMPANEL_DB__ = {
      users: new Map(),
      sessions: new Map(),
      resetTokens: new Map(),
      auditLogs: [],
      seeded: false,
    };
  }
  return global.__ECOMMPANEL_DB__;
}

export function sanitizeUser(record: PanelUserRecord): PanelUser {
  const { passwordHash: _passwordHash, failedAttempts: _failedAttempts, lockUntil: _lockUntil, ...safeUser } = record;
  void _passwordHash;
  void _failedAttempts;
  void _lockUntil;
  return safeUser;
}

function pushAudit(event: Omit<PanelAuditEvent, 'id' | 'createdAt'>): void {
  const db = getDb();
  db.auditLogs.unshift({
    id: randomToken(8),
    createdAt: nowIso(),
    ...event,
  });
  if (db.auditLogs.length > 500) {
    db.auditLogs.length = 500;
  }
}

export async function ensureSeededUsers(): Promise<void> {
  const db = getDb();
  if (db.seeded) return;

  const now = nowIso();
  const mainPasswordHash = await hashPassword('Admin@123456');
  const ownerPasswordHash = await hashPassword('Lojista@123456');

  const main: PanelUserRecord = {
    id: 'usr-main-001',
    email: 'main@ecommpanel.local',
    name: 'Main Admin',
    roleIds: ['main_admin'],
    permissionsAllow: [],
    permissionsDeny: [],
    active: true,
    mustChangePassword: false,
    createdAt: now,
    updatedAt: now,
    passwordHash: mainPasswordHash,
    failedAttempts: 0,
  };

  const owner: PanelUserRecord = {
    id: 'usr-owner-001',
    email: 'owner@ecommpanel.local',
    name: 'Dono da Loja',
    roleIds: ['store_owner'],
    permissionsAllow: [],
    permissionsDeny: [],
    active: true,
    mustChangePassword: false,
    createdAt: now,
    updatedAt: now,
    passwordHash: ownerPasswordHash,
    failedAttempts: 0,
  };

  db.users.set(main.id, main);
  db.users.set(owner.id, owner);
  db.seeded = true;

  pushAudit({
    actorUserId: main.id,
    event: 'seed.main-user-created',
    outcome: 'success',
    target: main.email,
  });
  pushAudit({
    actorUserId: main.id,
    event: 'seed.store-owner-created',
    outcome: 'success',
    target: owner.email,
  });
}

export function getUserByEmail(email: string): PanelUserRecord | null {
  const db = getDb();
  const target = email.trim().toLowerCase();
  for (const user of db.users.values()) {
    if (user.email.toLowerCase() === target) return user;
  }
  return null;
}

export function getUserById(userId: string): PanelUserRecord | null {
  const db = getDb();
  return db.users.get(userId) || null;
}

export function listUsers(): PanelUser[] {
  const db = getDb();
  return Array.from(db.users.values())
    .map(sanitizeUser)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createUser(input: {
  email: string;
  name: string;
  roleIds: PanelRoleId[];
  permissionsAllow?: PanelPermission[];
  permissionsDeny?: PanelPermission[];
  passwordHash: string;
  actorUserId?: string;
}): PanelUser {
  const db = getDb();
  const now = nowIso();
  const id = `usr-${randomToken(6)}`;
  const user: PanelUserRecord = {
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    roleIds: input.roleIds,
    permissionsAllow: input.permissionsAllow || [],
    permissionsDeny: input.permissionsDeny || [],
    active: true,
    mustChangePassword: true,
    createdAt: now,
    updatedAt: now,
    passwordHash: input.passwordHash,
    failedAttempts: 0,
  };

  db.users.set(id, user);

  pushAudit({
    actorUserId: input.actorUserId,
    event: 'user.created',
    outcome: 'success',
    target: user.email,
    details: {
      roles: user.roleIds.join(','),
      permissionsAllow: user.permissionsAllow.length,
      permissionsDeny: user.permissionsDeny.length,
    },
  });

  return sanitizeUser(user);
}

export function setUserPassword(userId: string, passwordHash: string): void {
  const db = getDb();
  const found = db.users.get(userId);
  if (!found) return;
  found.passwordHash = passwordHash;
  found.mustChangePassword = false;
  found.updatedAt = nowIso();
  found.failedAttempts = 0;
  found.lockUntil = undefined;
  db.users.set(found.id, found);
}

export function recordFailedLogin(userId: string): { locked: boolean; lockUntil?: string } {
  const db = getDb();
  const found = db.users.get(userId);
  if (!found) return { locked: false };

  found.failedAttempts += 1;
  found.updatedAt = nowIso();

  if (found.failedAttempts >= PANEL_SECURITY.loginMaxAttempts) {
    found.lockUntil = new Date(Date.now() + PANEL_SECURITY.loginLockMs).toISOString();
    db.users.set(found.id, found);
    return { locked: true, lockUntil: found.lockUntil };
  }

  db.users.set(found.id, found);
  return { locked: false };
}

export function resetFailedLogin(userId: string): void {
  const db = getDb();
  const found = db.users.get(userId);
  if (!found) return;
  found.failedAttempts = 0;
  found.lockUntil = undefined;
  found.lastLoginAt = nowIso();
  found.updatedAt = nowIso();
  db.users.set(found.id, found);
}

export function isUserLocked(user: PanelUserRecord): boolean {
  if (!user.lockUntil) return false;
  return Date.now() < new Date(user.lockUntil).getTime();
}

export function createSession(input: { userId: string; userAgent: string; ip: string }): { session: PanelSession; rawSessionId: string } {
  const db = getDb();
  const rawSessionId = randomToken(24);
  const id = sha256(rawSessionId);
  const now = Date.now();
  const hardExpiresAt = new Date(now + PANEL_SECURITY.sessionTtlMs).toISOString();
  const session: PanelSession = {
    id,
    userId: input.userId,
    csrfToken: randomToken(16),
    createdAt: new Date(now).toISOString(),
    hardExpiresAt,
    lastSeenAt: new Date(now).toISOString(),
    expiresAt: hardExpiresAt,
    userAgentHash: sha256(input.userAgent || 'unknown-ua'),
    ipHash: sha256(input.ip || 'unknown-ip'),
  };
  db.sessions.set(id, session);
  return { session, rawSessionId };
}

export function getSession(rawSessionId: string): PanelSession | null {
  const db = getDb();
  return db.sessions.get(sha256(rawSessionId)) || null;
}

export function touchSession(rawSessionId: string): PanelSession | null {
  const db = getDb();
  const id = sha256(rawSessionId);
  const found = db.sessions.get(id);
  if (!found) return null;
  const now = Date.now();
  const hardExpiresAt = new Date(found.hardExpiresAt || found.expiresAt).getTime();
  if (hardExpiresAt <= now) {
    db.sessions.delete(id);
    return null;
  }

  const newIdleExpiry = new Date(now + PANEL_SECURITY.sessionIdleTtlMs).getTime();
  found.lastSeenAt = new Date(now).toISOString();
  // Keep the shortest between absolute hard TTL and idle window.
  found.expiresAt = new Date(Math.min(hardExpiresAt, newIdleExpiry)).toISOString();
  db.sessions.set(id, found);
  return found;
}

export function deleteSession(rawSessionId: string): void {
  const db = getDb();
  db.sessions.delete(sha256(rawSessionId));
}

export function deleteSessionsByUser(userId: string): number {
  const db = getDb();
  let deleted = 0;
  for (const [id, session] of db.sessions.entries()) {
    if (session.userId !== userId) continue;
    db.sessions.delete(id);
    deleted += 1;
  }
  return deleted;
}

export function issueResetToken(userId: string): PanelResetToken {
  const db = getDb();
  const raw = randomToken(24);
  const token = sha256(raw);
  const now = Date.now();
  const record: PanelResetToken = {
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + PANEL_SECURITY.resetPasswordTtlMs).toISOString(),
  };
  db.resetTokens.set(token, record);
  return record;
}

export function findResetTokenByRaw(rawToken: string): PanelResetToken | null {
  const db = getDb();
  const hashed = sha256(rawToken);
  const token = db.resetTokens.get(hashed);
  if (!token) return null;
  if (token.usedAt) return null;
  if (Date.now() > new Date(token.expiresAt).getTime()) return null;
  return token;
}

export function consumeResetToken(rawToken: string): PanelResetToken | null {
  const db = getDb();
  const hashed = sha256(rawToken);
  const token = db.resetTokens.get(hashed);
  if (!token) return null;
  if (token.usedAt) return null;
  if (Date.now() > new Date(token.expiresAt).getTime()) return null;
  token.usedAt = nowIso();
  db.resetTokens.set(token.token, token);
  return token;
}

export function addAuditEvent(event: Omit<PanelAuditEvent, 'id' | 'createdAt'>): void {
  pushAudit(event);
}

export function listAuditEvents(limit = 50): PanelAuditEvent[] {
  const db = getDb();
  return db.auditLogs.slice(0, limit);
}

export function mockResetTokenForUser(email: string): string | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  const raw = randomToken(24);
  const record: PanelResetToken = {
    token: sha256(raw),
    userId: user.id,
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + PANEL_SECURITY.resetPasswordTtlMs).toISOString(),
  };
  const db = getDb();
  db.resetTokens.set(record.token, record);
  return raw;
}
