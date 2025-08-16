"use client";
import React, { useState } from 'react';

type MegaItem = { name: string; href?: string; isHighlighted?: boolean };
type MegaSection = { title: string; items: MegaItem[] };
export type MegaCategory = { key: string; label: string; sections: MegaSection[] };

export function MegaMenu({ categories }: { categories: MegaCategory[] }) {
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? '');
  const active = categories.find((c) => c.key === activeKey) ?? categories[0];
  return (
    <div className="mega-menu">
      <aside className="mega-menu__aside" role="tablist" aria-label="Categorias">
        {categories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={cat.key === activeKey}
            className={`mega-menu__tab ${cat.key === activeKey ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveKey(cat.key)}
            onFocus={() => setActiveKey(cat.key)}
            onClick={() => setActiveKey(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </aside>
      <div className="mega-menu__panel" role="tabpanel">
        <h3 className="mega-menu__title">{active?.label}</h3>
        <div className="mega-menu__grid">
          {active?.sections.map((sec, i) => (
            <div key={i} className="mega-menu__section">
              <div className="mega-menu__section-title">{sec.title}</div>
              <ul className="mega-menu__list">
                {sec.items.map((it, j) => (
                  <li key={j}>
                    <a className={`mega-menu__link ${it.isHighlighted ? 'is-highlight' : ''}`} href={it.href || '#'}>
                      {it.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
