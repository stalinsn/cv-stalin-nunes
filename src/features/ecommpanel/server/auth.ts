import 'server-only';

import { cookies, headers } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { PANEL_RUNTIME, PANEL_SECURITY } from '../config/security';
import type { AuthenticatedPanelUser, PanelPermission, PanelUserRecord } from '../types/auth';
import { safeCompare, sha256 } from './crypto';
import {
  deleteSession,
  ensureSeededUsers,
  getSession,
  getUserById,
  sanitizeUser,
  touchSession,
} from './mockStore';
import { withResolvedPermissions } from './rbac';
import { getClientIp, getUserAgent } from './requestMeta';

export type PanelAuthContext = {
  rawSessionId: string;
  user: AuthenticatedPanelUser;
  csrfToken: string;
};

function toAuthenticatedUser(record: PanelUserRecord): AuthenticatedPanelUser {
  return withResolvedPermissions(sanitizeUser(record));
}

export function setAuthCookies(response: NextResponse, rawSessionId: string, csrfToken: string): void {
  response.cookies.set(PANEL_SECURITY.sessionCookieName, rawSessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: PANEL_RUNTIME.secureCookie,
    path: '/',
    maxAge: Math.floor(PANEL_SECURITY.sessionTtlMs / 1000),
  });

  response.cookies.set(PANEL_SECURITY.csrfCookieName, csrfToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: PANEL_RUNTIME.secureCookie,
    path: '/',
    maxAge: Math.floor(PANEL_SECURITY.sessionTtlMs / 1000),
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete({ name: PANEL_SECURITY.sessionCookieName, path: '/' });
  response.cookies.delete({ name: PANEL_SECURITY.csrfCookieName, path: '/' });
}

export function isTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('host');
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function hasValidCsrf(req: NextRequest, csrfToken: string): boolean {
  const headerToken = req.headers.get('x-csrf-token')?.trim();
  const cookieToken = req.cookies.get(PANEL_SECURITY.csrfCookieName)?.value?.trim();
  if (!headerToken || !cookieToken) return false;
  if (!safeCompare(cookieToken, csrfToken)) return false;
  return safeCompare(headerToken, csrfToken);
}

export function hasPermission(user: AuthenticatedPanelUser, permission: PanelPermission): boolean {
  return user.permissions.includes(permission);
}

function validateRequestFingerprint(req: NextRequest, userAgentHash: string, ipHash: string): boolean {
  const incomingUaHash = sha256(getUserAgent(req));
  const incomingIpHash = sha256(getClientIp(req));

  // User-Agent hash must match. IP mismatch is tolerated due NAT/mobile changes.
  if (!safeCompare(incomingUaHash, userAgentHash)) return false;
  void incomingIpHash;
  void ipHash;
  return true;
}

export async function getApiAuthContext(req: NextRequest, options?: { touch?: boolean }): Promise<PanelAuthContext | null> {
  await ensureSeededUsers();
  const rawSessionId = req.cookies.get(PANEL_SECURITY.sessionCookieName)?.value;
  if (!rawSessionId) return null;

  const session = options?.touch === false ? getSession(rawSessionId) : touchSession(rawSessionId);
  if (!session) {
    deleteSession(rawSessionId);
    return null;
  }

  const expired = Date.now() >= new Date(session.expiresAt).getTime();
  if (expired) {
    deleteSession(rawSessionId);
    return null;
  }

  const userRecord = getUserById(session.userId);
  if (!userRecord || !userRecord.active) {
    deleteSession(rawSessionId);
    return null;
  }

  if (!validateRequestFingerprint(req, session.userAgentHash, session.ipHash)) {
    deleteSession(rawSessionId);
    return null;
  }

  return {
    rawSessionId,
    user: toAuthenticatedUser(userRecord),
    csrfToken: session.csrfToken,
  };
}

export async function getPanelUserFromCookies(): Promise<AuthenticatedPanelUser | null> {
  await ensureSeededUsers();

  const cookieStore = await cookies();
  const rawSessionId = cookieStore.get(PANEL_SECURITY.sessionCookieName)?.value;
  if (!rawSessionId) return null;

  const session = touchSession(rawSessionId);
  if (!session) return null;

  const expired = Date.now() >= new Date(session.expiresAt).getTime();
  if (expired) {
    deleteSession(rawSessionId);
    return null;
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get('user-agent') || 'unknown';
  if (!safeCompare(sha256(userAgent), session.userAgentHash)) {
    deleteSession(rawSessionId);
    return null;
  }

  const userRecord = getUserById(session.userId);
  if (!userRecord || !userRecord.active) {
    deleteSession(rawSessionId);
    return null;
  }

  return toAuthenticatedUser(userRecord);
}
