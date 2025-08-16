"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DiscountBadge } from '../molecules/DiscountBadge';

export function PdpGallery({ image, name, price, listPrice }: { image?: string; name: string; price: number; listPrice?: number }) {
  const fallback = '/file.svg';
  const thumbs = [image || fallback, image || fallback, image || fallback, image || fallback];
  const [active, setActive] = useState<number>(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const prev = useCallback(() => setActive((s) => (s - 1 + thumbs.length) % thumbs.length), [thumbs.length]);
  const next = useCallback(() => setActive((s) => (s + 1) % thumbs.length), [thumbs.length]);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [prev, next]);

  return (
    <div className="pdp__gallery" data-active={active} ref={galleryRef} tabIndex={0} aria-roledescription="Galeria de imagens" data-active-index={active}>
      <div className="pdp__thumbs-vert" aria-hidden>
        {thumbs.map((t, i) => (
          <button
            key={i}
            type="button"
            className={`thumb ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Ver imagem ${i + 1}`}
          >
            <Image src={t} alt={`${name} - ${i + 1}`} width={80} height={80} />
          </button>
        ))}
      </div>

      <div className="pdp__image">
        <button className="gallery-nav prev" aria-label="Imagem anterior" onClick={prev}>‹</button>
        <div className="pdp__image-inner">
          <Image src={thumbs[active]} alt={name} width={900} height={900} />
        </div>
        <button className="gallery-nav next" aria-label="Próxima imagem" onClick={next}>›</button>

        <div className="pdp__badges">
          <DiscountBadge price={price} listPrice={listPrice} />
        </div>
      </div>
    </div>
  );
}
