"use client";
import React from 'react';
import { isOn } from '../../config/featureFlags';

export default function Footer() {
  const enabled = isOn('ecom.footer');
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState<[boolean, boolean, boolean, boolean]>([true, true, true, true]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = (m: MediaQueryList | MediaQueryListEvent) => {
      const mql = 'matches' in m ? m.matches : (m as MediaQueryList).matches;
      setIsMobile(mql);
      setOpen(mql ? [false, false, false, false] : [true, true, true, true]);
    };
    apply(mq);
    const handler = (e: MediaQueryListEvent) => apply(e);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const toggle = (i: number) => {
  if (!isMobile) return;
    setOpen((prev) => {
      const next = [...prev] as [boolean, boolean, boolean, boolean];
      next[i] = !next[i];
      return next;
    });
  };

  if (!enabled) return null;

  return (
    <footer className="ecom-footer">
      <div className="ecom-footer__grid">
          <div className="ecom-footer__col">
            <button className="ecom-footer__toggle" aria-expanded={open[0]} aria-controls="footer-sec-0" onClick={() => toggle(0)}>
              <span>Institucional</span>
              <span className="ecom-footer__chevron" aria-hidden>▾</span>
            </button>
            <div id="footer-sec-0" className="ecom-footer__content" data-open={open[0] ? 'true' : 'false'}>
              <ul>
                <li><a href="#">Quem somos</a></li>
                <li><a href="#">Lojas e horários</a></li>
                <li><a href="#">Trabalhe conosco</a></li>
              </ul>
            </div>
          </div>
          <div className="ecom-footer__col">
            <button className="ecom-footer__toggle" aria-expanded={open[1]} aria-controls="footer-sec-1" onClick={() => toggle(1)}>
              <span>Atendimento</span>
              <span className="ecom-footer__chevron" aria-hidden>▾</span>
            </button>
            <div id="footer-sec-1" className="ecom-footer__content" data-open={open[1] ? 'true' : 'false'}>
              <ul>
                <li><a href="#">Central de ajuda</a></li>
                <li><a href="#">Trocas e devoluções</a></li>
                <li><a href="#">Fale conosco</a></li>
              </ul>
            </div>
          </div>
          <div className="ecom-footer__col">
            <button className="ecom-footer__toggle" aria-expanded={open[2]} aria-controls="footer-sec-2" onClick={() => toggle(2)}>
              <span>Políticas</span>
              <span className="ecom-footer__chevron" aria-hidden>▾</span>
            </button>
            <div id="footer-sec-2" className="ecom-footer__content" data-open={open[2] ? 'true' : 'false'}>
              <ul>
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Termos de uso</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="ecom-footer__col">
            <button className="ecom-footer__toggle" aria-expanded={open[3]} aria-controls="footer-sec-3" onClick={() => toggle(3)}>
              <span>Apps e Newsletter</span>
              <span className="ecom-footer__chevron" aria-hidden>▾</span>
            </button>
            <div id="footer-sec-3" className="ecom-footer__content" data-open={open[3] ? 'true' : 'false'}>
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
