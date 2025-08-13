"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export default function ServicesBar() {
  if (!isOn('ecom.servicesBar')) return null;
  return (
    <section className="ecom-services container" aria-label="Serviços exclusivos">
      <div className="ecom-services__grid">
        <div className="ecom-service"><span className="ecom-service__icon">⏰</span><span>Agende dia e hora</span></div>
        <div className="ecom-service"><span className="ecom-service__icon">🏪</span><span>Retire na loja</span></div>
        <div className="ecom-service"><span className="ecom-service__icon">💳</span><span>Cartão e PIX</span></div>
        <div className="ecom-service"><span className="ecom-service__icon">🛡</span><span>Compra segura</span></div>
      </div>
    </section>
  );
}
