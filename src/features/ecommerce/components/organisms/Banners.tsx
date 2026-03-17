"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export function HeroBannerLarge() {
  return (
    <section className="ecom-banner">
      <div className="ecom-banner__hero">Economize com combos — mobile-first banner</div>
    </section>
  );
}

export function StripsBelow() {
  const show1 = isOn('ecom.home.banner.strip.1');
  const show2 = isOn('ecom.home.banner.strip.2');
  const show3 = isOn('ecom.home.banner.strip.3');
  if (!show1 && !show2 && !show3) return null;
  return (
    <section className="ecom-strips">
      {show1 ? <div className="ecom-strip">Faixa promocional 1</div> : null}
      {show2 ? <div className="ecom-strip">Faixa promocional 2</div> : null}
      {show3 ? <div className="ecom-strip">Faixa promocional 3</div> : null}
    </section>
  );
}
