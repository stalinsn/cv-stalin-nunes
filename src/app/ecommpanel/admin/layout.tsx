import { redirect } from 'next/navigation';
import PanelLogoutButton from '@/features/ecommpanel/components/PanelLogoutButton';
import PanelAdminNav from '@/features/ecommpanel/components/PanelAdminNav';
import { getPanelUserFromCookies } from '@/features/ecommpanel/server/auth';

export default async function EcommPanelAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getPanelUserFromCookies();

  if (!user) {
    redirect('/ecommpanel/login');
  }

  const canManageUsers = user.permissions.includes('users.manage');

  return (
    <>
      <header className="panel-topbar">
        <div className="panel-topbar-content">
          <div className="panel-brand">
            <strong>EcommPanel</strong>
            <span>Controle administrativo modular do e-commerce</span>
          </div>

          <div className="panel-top-actions">
            <span className="panel-user-chip">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </span>
            <PanelLogoutButton />
          </div>
        </div>
      </header>

      <div className="panel-shell panel-shell--admin">
        <div className="panel-admin-grid">
          <aside className="panel-sidebar">
            <PanelAdminNav canManageUsers={canManageUsers} />
          </aside>
          <div className="panel-admin-content">{children}</div>
        </div>
      </div>
    </>
  );
}
