"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export default function HeroBanner() {
  if (!isOn('ecom.heroBanner')) return null;
  return (
    <section className="ecom-hero">
      <div className="banner">Economize no seu café da manhã! 40% OFF no 2º</div>
    </section>
  );
}
