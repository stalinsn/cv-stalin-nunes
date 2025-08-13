"use client";
import React, { useRef } from 'react';
import { isOn } from '../../config/featureFlags';

export default function Carousel({ children, title }: { children: React.ReactNode; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  if (!isOn('ecom.carousel')) return null;
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };
  return (
    <section className="ecom-section container" aria-label={title}>
      <div className="ecom-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button aria-label="Anterior" onClick={() => scroll(-1)}>‹</button>
          <button aria-label="Próximo" onClick={() => scroll(1)}>›</button>
        </div>
      </div>
      <div ref={ref} style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '70%', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
        {children}
      </div>
    </section>
  );
}
