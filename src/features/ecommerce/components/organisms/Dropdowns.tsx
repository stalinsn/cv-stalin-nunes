"use client";
import React from 'react';
import { Dropdown } from '../atoms/Dropdown';
import type { MegaCategory } from './MegaMenu';
import { useState } from 'react';
import rawCategories from '../../data/categories.json';
import { isVtexLive } from '../../lib/runtimeConfig';
import { MegaMenu } from './MegaMenu';

type Category = { id: string; slug: string; name: string; parentId: string | null; productIds: string[]; children?: { id: string; slug: string; name: string }[] };
const allCats = rawCategories as unknown as Category[];

function mapToMega(cats: Category[]): MegaCategory[] {
  return cats
    .filter((c) => (c.productIds?.length || 0) > 0 || (c.children?.length || 0) > 0)
    .map((c) => ({
      key: c.slug,
      label: c.name,
      href: `/e-commerce/plp?categoria=${encodeURIComponent(c.slug)}`,
      sections: [
        {
          items: (c.children || []).map((ch) => ({
            name: ch.name,
            href: `/e-commerce/plp?categoria=${encodeURIComponent(c.slug)}&dept=${encodeURIComponent(ch.name)}`,
          })),
        },
      ],
    }));
}

export function DepartmentsDropdown({ trigger }: { trigger?: React.ReactNode }) {
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const [cats, setCats] = useState<MegaCategory[]>(mapToMega(allCats));

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isVtexLive()) return;
      try {
        const res = await fetch('/api/vtex/categories', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        // Map VTEX category tree to our simplified Category shape
        type VNode = { id: number; name: string; url: string; children?: VNode[] };
        const top: Category[] = (data as VNode[]).map((n) => ({
          id: String(n.id),
          slug: (n.url || n.name).split('/').filter(Boolean).slice(-1)[0].toLowerCase(),
          name: n.name,
          parentId: null,
          productIds: [],
          children: (n.children || []).map((ch) => ({ id: String(ch.id), slug: (ch.url || ch.name).split('/').filter(Boolean).slice(-1)[0].toLowerCase(), name: ch.name })),
        }));
        if (!cancelled) setCats(mapToMega(top));
      } catch { /* ignore */ }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const toggle = (key: string) => setOpenKeys((s) => ({ ...s, [key]: !s[key] }));
  const categories = cats;
  return (
    <Dropdown
      trigger={
        trigger ?? (
          <button className="ecom-nav__btn ecom-nav__btn--departments">☰ Departamentos</button>
        )
      }
      className="dropdown--departments dropdown--departments-full"
    >
      {/* Desktop: mega menu */}
      <div className="hide-on-mobile">
        <MegaMenu categories={categories} />
      </div>
      {/* Mobile: full-height accordion */}
      <div className="show-on-mobile">
        <div className="departments-accordion" role="menu" aria-label="Departamentos">
          {categories.map((cat) => {
            const isOpen = !!openKeys[cat.key];
            return (
              <div key={cat.key} className={`dept-item ${isOpen ? 'is-open' : ''}`}>
                <button className="dept-item__header" onClick={() => toggle(cat.key)} aria-expanded={isOpen}>
                  <span className="dept-item__label">{cat.label}</span>
                  <span className="dept-item__chev" aria-hidden>›</span>
                </button>
                {isOpen && (
                  <div className="dept-item__panel">
                    {cat.sections.map((sec, i) => (
                      <ul key={i} className="dept-item__list">
                        {sec.items.map((it, j) => (
                          <li key={j}><a className="dept-item__link" href={it.href || '#'}>{it.name}</a></li>
                        ))}
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Dropdown>
  );
}

