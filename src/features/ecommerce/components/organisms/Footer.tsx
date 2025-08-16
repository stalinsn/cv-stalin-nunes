"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export default function Footer() {
  if (!isOn('ecom.footer')) return null;
  return (
    <footer className="ecom-footer">
      <div className="ecom-footer__grid">
          <div className="ecom-footer__col">
            <h4>Institucional</h4>
            <ul>
              <li><a href="#">Quem somos</a></li>
              <li><a href="#">Lojas e horários</a></li>
              <li><a href="#">Trabalhe conosco</a></li>
            </ul>
          </div>
          <div className="ecom-footer__col">
            <h4>Atendimento</h4>
            <ul>
              <li><a href="#">Central de ajuda</a></li>
              <li><a href="#">Trocas e devoluções</a></li>
              <li><a href="#">Fale conosco</a></li>
            </ul>
          </div>
          <div className="ecom-footer__col">
            <h4>Políticas</h4>
            <ul>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Termos de uso</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
          <div className="ecom-footer__col">
            <h4>Baixe o app</h4>
            <div className="ecom-footer__apps">
              <a href="#" aria-label="App Store"> App Store</a>
              <a href="#" aria-label="Google Play">▶ Google Play</a>
            </div>
            <h4>Receba novidades</h4>
            <form className="ecom-footer__newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Seu e-mail" aria-label="E-mail" />
              <button type="submit">Assinar</button>
            </form>
          </div>
        </div>
        <div className="ecom-footer__bar">
          <small>© {new Date().getFullYear()} SuperMart • Preços e condições válidos para compras online.</small>
          <div className="ecom-footer__social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>
    </footer>
  );
}
