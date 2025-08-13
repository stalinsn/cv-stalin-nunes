"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export default function Footer() {
  if (!isOn('ecom.footer')) return null;
  return (
    <footer className="ecom-footer">
      <div className="ecom-footer__grid">
        <div>
          <strong>Institucional</strong>
          <ul>
            <li>Sobre</li>
            <li>Atendimento</li>
            <li>Políticas</li>
          </ul>
        </div>
        <div>
          <strong>Baixe o App</strong>
          <div className="ecom-footer__apps">App Store • Google Play</div>
        </div>
      </div>
      <small className="ecom-footer__copy">© {new Date().getFullYear()} SuperMart</small>
    </footer>
  );
}
