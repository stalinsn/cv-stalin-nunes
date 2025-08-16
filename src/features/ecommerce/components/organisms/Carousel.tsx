"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isOn } from '../../config/featureFlags';
import type { ShelfConfig, ShelfVariant } from '../../config/shelfConfig';
import Image from 'next/image';

type Props = {
  children: React.ReactNode;
  title: string;
  config?: ShelfConfig;
};

export default function Carousel({ children, title, config }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number>(240);
  const [visible, setVisible] = useState<number>(5);
  const GAP = 12; // px - balanced spacing
  const PEEK = 0.5; // half card peek when overflow exists
  // No drag-to-scroll; smooth only via arrow buttons

  const childCount = useMemo(() => React.Children.count(children), [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calc = () => {
      const w = el.clientWidth;
      // Back to original responsive visible counts but with better spacing
      let v = w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 768 ? 3 : 2;
      // If there is a side banner and we are on desktop, target 4 visible items (aligned with spec)
      const hasBanner = Boolean(config?.banner);
      if (w >= 1024 && hasBanner) v = 4;
      if (w >= 1280 && !hasBanner) v = 5;
      setVisible(v);
  // Compute card width based on visible slots (no stretching for small counts)
  const hasPeek = childCount > v;
  // If peeking, there is an extra gap between the last full card and the half card
  const gaps = hasPeek ? v * GAP : (v - 1) * GAP;
  const denom = hasPeek ? v + PEEK : v;
  const cw = (w - gaps) / denom;
  // Reasonable minimum card width - not too big
  const minCardWidth = w >= 1024 ? 220 : w >= 768 ? 200 : 180;
  setCardWidth(Math.max(minCardWidth, Math.floor(cw)));
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [childCount, config]);

  if (!isOn('ecom.carousel')) return null;
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = (cardWidth + GAP) * visible; // page-by-page
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(el.scrollLeft + dir * step, max));
    el.scrollTo({ left: target, behavior: 'smooth' });
  };
  const variant: ShelfVariant = config?.variant ?? 'default';
  const hasBanner = Boolean(config?.banner?.image);
  const bannerPos = config?.banner?.position ?? 'left';
  const shouldShowArrows = childCount > visible;

  return (
    <section className={`ecom-section shelf shelf--${variant}`} aria-label={title}>
      <div className="shelf__header" style={{ justifyContent: config?.titleAlign === 'center' ? 'center' : 'space-between' }}>
        <div style={{ display: 'grid' }}>
          <span className="shelf__title">{title}</span>
          {config?.subtitle && <span className="text-light" style={{ fontSize: 12 }}>{config.subtitle}</span>}
        </div>
        <div className="shelf__actions">
          {config?.seeMoreHref && (
            <a className="shelf__see-more" href={config.seeMoreHref}>Ver mais</a>
          )}
          {shouldShowArrows && (
            <>
              <button aria-label="Anterior" className="carousel-arrow" onClick={() => scroll(-1)}>‹</button>
              <button aria-label="Próximo" className="carousel-arrow" onClick={() => scroll(1)}>›</button>
            </>
          )}
        </div>
      </div>
      <div className={`shelf__body ${hasBanner ? 'has-banner' : ''} banner-${bannerPos}`}>
        {hasBanner && (
          <a className="shelf__banner" href={config?.banner?.href ?? '#'} aria-label={config?.banner?.alt ?? 'Banner'}>
            <Image src={config!.banner!.image} alt={config!.banner!.alt ?? ''} width={400} height={300} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          </a>
        )}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: `${cardWidth}px`,
            gap: GAP,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            paddingBottom: 8,
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: 'start', // Align products to the left
          }}
          className="ecom-carousel"
        >
          {React.Children.map(children, (child) => (
            <div data-snap style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>{child}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
