'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { safeJsonGet, safeJsonSet, withVersion } from '@/utils/safeStorage';

type PanelAdminNavProps = {
  canManageUsers: boolean;
};

type NavItem = {
  id: string;
  href?: string;
  label: string;
  description: string;
  defaultExpanded?: boolean;
  children?: NavItem[];
};

type NavUiState = {
  expanded: Record<string, boolean>;
};

const PANEL_NAV_STORAGE_KEY = withVersion('ecommpanel.admin-nav.ui', 'v1');

export default function PanelAdminNav({ canManageUsers }: PanelAdminNavProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [uiStateLoaded, setUiStateLoaded] = useState(false);

  const accessLinks: NavItem[] = [
    { id: 'dashboard', href: '/ecommpanel/admin', label: 'Dashboard', description: 'Visão geral e saúde do ambiente' },
    ...(canManageUsers ? [{ id: 'users', href: '/ecommpanel/admin/users', label: 'Usuários', description: 'Perfis, papéis e permissões' }] : []),
  ];

  const experienceLinks: NavItem[] = [
    {
      id: 'theme',
      label: 'Tema',
      description: 'Preset, campanha e overrides de cor',
      defaultExpanded: true,
      children: [
        { id: 'theme-overview', href: '/ecommpanel/admin/site/theme', label: 'Visão geral', description: 'Resumo da direção visual publicada' },
        { id: 'theme-preset', href: '/ecommpanel/admin/site/theme/preset', label: 'Preset', description: 'Tema base e campanha ativa' },
        { id: 'theme-overrides', href: '/ecommpanel/admin/site/theme/overrides', label: 'Overrides', description: 'Tokens manuais de sobreposição' },
      ],
    },
    {
      id: 'template',
      label: 'Template',
      description: 'Campos fixos da estrutura da loja',
      defaultExpanded: true,
      children: [
        { id: 'template-overview', href: '/ecommpanel/admin/site/template', label: 'Visão geral', description: 'Visão consolidada do template' },
        { id: 'template-header', href: '/ecommpanel/admin/site/template/header', label: 'Header', description: 'Marca, busca, links e CTA' },
        { id: 'template-home', href: '/ecommpanel/admin/site/template/home', label: 'Home', description: 'Hero, vitrines, serviços e faixas' },
        { id: 'template-footer', href: '/ecommpanel/admin/site/template/footer', label: 'Footer', description: 'Colunas, apps, social e copy' },
      ],
    },
    {
      id: 'mega-menu',
      label: 'Mega Menu',
      description: 'Departamentos, colunas e links do dropdown',
      defaultExpanded: true,
      children: [
        { id: 'mega-menu-overview', href: '/ecommpanel/admin/site/mega-menu', label: 'Visão geral', description: 'Resumo operacional do menu' },
        { id: 'mega-menu-base', href: '/ecommpanel/admin/site/mega-menu/base', label: 'Base', description: 'Botão e contexto estrutural' },
        { id: 'mega-menu-tree', href: '/ecommpanel/admin/site/mega-menu/tree', label: 'Árvore', description: 'Departamentos, seções e links' },
      ],
    },
    { id: 'routes', href: '/ecommpanel/admin/site/routes', label: 'Rotas', description: 'Criar, remover e restaurar páginas' },
    { id: 'editor', href: '/ecommpanel/admin/site/editor', label: 'Editor', description: 'Montar layout e pré-visualizar rascunhos' },
    { id: 'blocks', href: '/ecommpanel/admin/site/blocks', label: 'Blocos', description: 'Biblioteca de componentes reutilizáveis' },
  ];

  const externalLinks: NavItem[] = [{ id: 'storefront', href: '/e-commerce', label: 'Storefront', description: 'Abrir vitrine da loja' }];

  useEffect(() => {
    const uiState = safeJsonGet<NavUiState>(PANEL_NAV_STORAGE_KEY, { expanded: {} });
    setExpandedGroups(uiState.expanded || {});
    setUiStateLoaded(true);
  }, []);

  function setGroupExpanded(key: string, nextValue: boolean) {
    setExpandedGroups((prev) => {
      const next = { ...prev, [key]: nextValue };
      if (uiStateLoaded) {
        safeJsonSet<NavUiState>(PANEL_NAV_STORAGE_KEY, { expanded: next });
      }
      return next;
    });
  }

  function isPathActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isItemActive(item: NavItem): boolean {
    if (item.href && isPathActive(item.href)) return true;
    return item.children?.some(isItemActive) ?? false;
  }

  function renderNavItem(item: NavItem, nested = false) {
    const active = isItemActive(item);

    if (!item.children?.length) {
      return (
        <Link
          key={item.id}
          href={item.href || '#'}
          className={`panel-nav-link ${nested ? 'panel-nav-link--nested' : ''} ${active ? 'is-active' : ''}`}
          aria-current={active ? 'page' : undefined}
        >
          <span className="panel-nav-link-label">{item.label}</span>
          <span className="panel-nav-link-description">{item.description}</span>
        </Link>
      );
    }

    const storageKey = `item:${item.id}`;
    const isOpen = expandedGroups[storageKey] ?? item.defaultExpanded ?? active;

    return (
      <details
        key={item.id}
        className={`panel-nav-branch ${nested ? 'panel-nav-branch--nested' : ''}`}
        open={isOpen}
        onToggle={(event) => setGroupExpanded(storageKey, event.currentTarget.open)}
      >
        <summary className={`panel-nav-link panel-nav-link--branch ${active ? 'is-active' : ''}`} aria-expanded={isOpen}>
          <span className="panel-nav-link-copy">
            <span className="panel-nav-link-label">{item.label}</span>
            <span className="panel-nav-link-description">{item.description}</span>
          </span>
          <span className="panel-nav-link-meta">
            <span className="panel-accordion-chevron" aria-hidden="true" />
          </span>
        </summary>

        <div className="panel-nav-children">
          {item.children.map((child) => renderNavItem(child, true))}
        </div>
      </details>
    );
  }

  function renderLinks(title: string, links: NavItem[], key: string, defaultOpen: boolean) {
    const fallbackOpen = defaultOpen || links.some(isItemActive);
    const isOpen = expandedGroups[key] ?? fallbackOpen;

    return (
      <details
        className="panel-nav-group panel-nav-group--accordion"
        open={isOpen}
        onToggle={(event) => setGroupExpanded(key, event.currentTarget.open)}
      >
        <summary className="panel-nav-summary" aria-expanded={isOpen}>
          <span className="panel-nav-title">{title}</span>
          <span className="panel-nav-summary__meta">
            <span className="panel-accordion-chevron" aria-hidden="true" />
          </span>
        </summary>

        <div className="panel-nav-links">
          {links.map((item) => renderNavItem(item))}
        </div>
      </details>
    );
  }

  return (
    <nav className="panel-nav" aria-label="Menu administrativo">
      {renderLinks('Acesso', accessLinks, 'group:access', true)}
      {renderLinks('Experiência do Site', experienceLinks, 'group:experience', true)}
      {renderLinks('Navegação Externa', externalLinks, 'group:external', false)}
    </nav>
  );
}
