import 'server-only';
import {
  PANEL_PERMISSIONS,
  type AuthenticatedPanelUser,
  type PanelPermission,
  type PanelRole,
  type PanelRoleId,
  type PanelUser,
} from '../types/auth';

const ALL_PERMISSIONS = [...PANEL_PERMISSIONS];

export const PANEL_ROLES_MAP: Record<PanelRoleId, PanelRole> = {
  main_admin: {
    id: 'main_admin',
    name: 'Main Admin',
    description: 'Full control. Can manage all users, roles, permissions and critical settings.',
    permissions: ALL_PERMISSIONS,
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Operational full-access except superuser permission.',
    permissions: ALL_PERMISSIONS.filter((permission) => permission !== 'security.superuser'),
  },
  store_owner: {
    id: 'store_owner',
    name: 'Store Owner',
    description: 'Owns store operations and configuration without user/permission administration.',
    permissions: ALL_PERMISSIONS.filter((permission) => {
      return !['users.manage', 'roles.manage', 'permissions.grant', 'security.superuser'].includes(permission);
    }),
  },
  site_editor: {
    id: 'site_editor',
    name: 'Site Editor',
    description: 'Can update storefront layout/content and feature modules.',
    permissions: ['dashboard.read', 'site.layout.manage', 'site.content.manage', 'featureFlags.manage'],
  },
  catalog_manager: {
    id: 'catalog_manager',
    name: 'Catalog Manager',
    description: 'Can manage products, descriptions and pricing.',
    permissions: ['dashboard.read', 'catalog.products.manage', 'catalog.content.manage', 'catalog.pricing.manage'],
  },
  logistics_manager: {
    id: 'logistics_manager',
    name: 'Logistics Manager',
    description: 'Can manage shipping/logistics and order operations.',
    permissions: ['dashboard.read', 'logistics.manage', 'orders.manage'],
  },
  settings_manager: {
    id: 'settings_manager',
    name: 'Settings Manager',
    description: 'Can update store settings including minimum purchase amount.',
    permissions: ['dashboard.read', 'store.settings.manage', 'store.minimumPurchase.manage', 'integrations.manage', 'api.keys.manage'],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only visibility for dashboard and logs.',
    permissions: ['dashboard.read', 'audit.read'],
  },
};

export function resolvePermissions(user: PanelUser): PanelPermission[] {
  const granted = new Set<PanelPermission>();

  for (const roleId of user.roleIds) {
    const role = PANEL_ROLES_MAP[roleId];
    if (!role) continue;
    role.permissions.forEach((permission) => granted.add(permission));
  }

  user.permissionsAllow.forEach((permission) => granted.add(permission));
  user.permissionsDeny.forEach((permission) => granted.delete(permission));

  return Array.from(granted);
}

export function withResolvedPermissions(user: PanelUser): AuthenticatedPanelUser {
  return { ...user, permissions: resolvePermissions(user) };
}

export function hasPermission(user: AuthenticatedPanelUser, permission: PanelPermission): boolean {
  return user.permissions.includes(permission);
}

export function assertPermission(user: AuthenticatedPanelUser, permission: PanelPermission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}

export function canGrantPermissions(actor: AuthenticatedPanelUser, requestedPermissions: PanelPermission[]): boolean {
  if (hasPermission(actor, 'security.superuser')) return true;
  return requestedPermissions.every((permission) => hasPermission(actor, permission));
}
