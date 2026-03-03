'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type PanelAdminNavProps = {
  canManageUsers: boolean;
};

type NavItem = {
  href: string;
  label: string;
  description: string;
};

export default function PanelAdminNav({ canManageUsers }: PanelAdminNavProps) {
  const pathname = usePathname();

  const accessLinks: NavItem[] = [
    { href: '/ecommpanel/admin', label: 'Dashboard', description: 'Visão geral e saúde do ambiente' },
    ...(canManageUsers ? [{ href: '/ecommpanel/admin/users', label: 'Usuários', description: 'Perfis, papéis e permissões' }] : []),
  ];

  const experienceLinks: NavItem[] = [
    { href: '/ecommpanel/admin/site/flags', label: 'Flags', description: 'Habilitar/desabilitar experiências' },
    { href: '/ecommpanel/admin/site/routes', label: 'Rotas', description: 'Criar, remover e restaurar páginas' },
    { href: '/ecommpanel/admin/site/editor', label: 'Editor', description: 'Montar layout e pré-visualizar rascunhos' },
    { href: '/ecommpanel/admin/site/blocks', label: 'Blocos', description: 'Biblioteca de componentes reutilizáveis' },
  ];

  const externalLinks: NavItem[] = [{ href: '/e-commerce', label: 'Storefront', description: 'Abrir vitrine da loja' }];

  function renderLinks(title: string, links: NavItem[]) {
    return (
      <div className="panel-nav-group">
        <p className="panel-nav-title">{title}</p>
        {links.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`panel-nav-link ${active ? 'is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="panel-nav-link-label">{item.label}</span>
              <span className="panel-nav-link-description">{item.description}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="panel-nav" aria-label="Menu administrativo">
      {renderLinks('Acesso', accessLinks)}
      {renderLinks('Experiência do Site', experienceLinks)}
      {renderLinks('Navegação Externa', externalLinks)}
    </nav>
  );
}
