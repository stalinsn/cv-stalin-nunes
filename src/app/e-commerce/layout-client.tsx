"use client";
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useUI } from '../../features/ecommerce/state/UIContext';
import { safeGet, safeSet } from '../../utils/safeStorage';
import {
  ECOM_CAMPAIGNS,
  ECOM_THEMES,
  DEFAULT_ECOM_CAMPAIGN,
  DEFAULT_ECOM_THEME,
} from '../../features/ecommerce/config/styleguide';
const DrawerCart = dynamic(() => import('../../features/ecommerce/components/organisms/DrawerCart'), { ssr: false });

const THEME_STORAGE_KEY = 'ecom.theme.v1';
const CAMPAIGN_STORAGE_KEY = 'ecom.campaign.v1';
const VALID_THEMES: Set<string> = new Set(ECOM_THEMES as readonly string[]);
const VALID_CAMPAIGNS: Set<string> = new Set(ECOM_CAMPAIGNS as readonly string[]);

export default function EcommerceLayoutClient({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const { closeCart } = useUI();
  const hideDrawer = pathname.startsWith('/e-commerce/cart') || pathname.startsWith('/e-commerce/checkout');

  useEffect(() => {
    if (hideDrawer) closeCart();
  }, [hideDrawer, closeCart]);

  useEffect(() => {
    // Fallback simples para navegadores que não suportam :has()
    document.body.classList.add('ecom-body-override');
    // Parse flags from URL
    const enableDebug = params.get('debug') === 'true' || params.get('inspect') === 'true';
    const themeParam = (params.get('theme') || '').trim().toLowerCase();
    const campaignParam = (params.get('campaign') || '').trim().toLowerCase();
    const root = document.querySelector('main.ecom');
    const persistedTheme = (safeGet(THEME_STORAGE_KEY) || '').trim().toLowerCase();
    const persistedCampaign = (safeGet(CAMPAIGN_STORAGE_KEY) || '').trim().toLowerCase();

    const nextTheme = VALID_THEMES.has(themeParam)
      ? themeParam
      : VALID_THEMES.has(persistedTheme)
        ? persistedTheme
        : DEFAULT_ECOM_THEME;
    const nextCampaign = VALID_CAMPAIGNS.has(campaignParam)
      ? campaignParam
      : VALID_CAMPAIGNS.has(persistedCampaign)
        ? persistedCampaign
        : DEFAULT_ECOM_CAMPAIGN;

    if (root && enableDebug) {
      root.setAttribute('data-debug', 'true');
      root.setAttribute('data-inspect', 'true');
    } else if (root) {
      root.removeAttribute('data-debug');
      root.removeAttribute('data-inspect');
    }
    if (root) {
      root.setAttribute('data-theme', nextTheme);
      root.setAttribute('data-campaign', nextCampaign);
    }
    safeSet(THEME_STORAGE_KEY, nextTheme);
    safeSet(CAMPAIGN_STORAGE_KEY, nextCampaign);

    // Friendly label resolver for known ecommerce BEM classes
    const getFriendlyLabel = (el: HTMLElement) => {
      const cname = (el.className || '').toString();
      const rules: Array<[RegExp, string]> = [
        [/\becom-header__promo\b/, 'Header/Promo'],
        [/\becom-header__delivery\b/, 'Header/Delivery'],
        [/\bdelivery-pill\b/, 'Header/Delivery Pill'],
        [/\becom-header__util\b/, 'Header/Utilities'],
        [/\becom-header__top\b/, 'Header/Top'],
        [/\becom-header__brand\b/, 'Header/Brand'],
        [/\becom-header__searchBtn\b/, 'Header/Search Button'],
        [/\becom-header__search\b/, 'Header/Search'],
        [/\becom-header__actions\b/, 'Header/Actions'],
        [/\becom-header__nav\b/, 'Header/Nav'],
        [/\becom-nav__btn--departments\b/, 'Header/Departments Button'],
        [/\becom-nav__btn\b/, 'Header/Nav Button'],
        [/\becom-nav__meta\b/, 'Header/Nav Meta'],
        [/\becom-cartBtn\b/, 'Header/Cart Button'],

        [/\becom-footer__grid\b/, 'Footer/Grid'],
        [/\becom-footer__col\b/, 'Footer/Column'],
        [/\becom-footer__apps\b/, 'Footer/Apps'],
        [/\becom-footer__newsletter\b/, 'Footer/Newsletter'],
        [/\becom-footer__bar\b/, 'Footer/Bottom Bar'],
        [/\becom-footer__social\b/, 'Footer/Social'],
        [/\becom-footer__toggle\b/, 'Footer/Toggle'],
        [/\becom-footer\b/, 'Footer'],

        [/\bpdp-breadcrumbs\b/, 'PDP/Breadcrumbs'],
        [/\bpdp__image\b/, 'PDP/Gallery'],
        [/\bpdp__info\b/, 'PDP/Info'],
        [/\bpdp-tabs\b/, 'PDP/Tabs'],
        [/\bpdp-related\b/, 'PDP/Related'],
        [/\bpdp\b/, 'PDP/Layout'],

        [/\bshelf__title\b/, 'Shelf/Title'],
        [/\bshelf__actions\b/, 'Shelf/Actions'],
        [/\bshelf__body\b/, 'Shelf/Body'],
        [/\bshelf__banner\b/, 'Shelf/Banner'],
        [/\bshelf\b/, 'Shelf'],

        [/\bproduct-card\b/, 'Product Card'],
        [/\bdropdown\b/, 'Dropdown'],
        [/\bdrawer\b/, 'Drawer'],
      ];
      for (const [re, label] of rules) {
        if (re.test(cname)) return label;
      }
      // Fallback: show most specific ecom-* class if present
      const parts = cname.split(/\s+/).filter(Boolean);
      const ecomParts = parts.filter((p) => p.startsWith('ecom-'));
      if (ecomParts.length) return ecomParts.sort((a, b) => b.length - a.length)[0];
      return parts[0] || el.tagName.toLowerCase();
    };

    // Optional hover inspector: shows an outline and a tooltip with friendly label
  let tip: HTMLDivElement | null = null;
    const onMove = (e: MouseEvent) => {
      if (!root || root.getAttribute('data-inspect') !== 'true') return;
      const target = (e.target as HTMLElement) ?? null;
      if (!target) return;
      const el = target.closest('[class]') as HTMLElement | null;
      if (!el) return;
      el.style.outline = '2px dashed rgba(64, 158, 255, 0.8)';
      // cleanup previous highlights shortly after
      setTimeout(() => {
        if (el) el.style.outline = '';
      }, 200);
      if (!tip) {
        tip = document.createElement('div');
        tip.style.position = 'fixed';
        tip.style.zIndex = '9999';
        tip.style.pointerEvents = 'none';
        tip.style.background = 'rgba(0,0,0,0.8)';
        tip.style.color = '#fff';
        tip.style.fontSize = '12px';
        tip.style.padding = '4px 6px';
        tip.style.borderRadius = '4px';
        tip.style.maxWidth = '60vw';
        document.body.appendChild(tip);
      }
      const cls = el.className.toString();
      const label = getFriendlyLabel(el);
      // Add tag and id for context
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      tip.textContent = `${label} — ${tag}${id} — ${cls}`;
      const x = Math.min(e.clientX + 12, window.innerWidth - 20);
      const y = Math.min(e.clientY + 12, window.innerHeight - 20);
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };

    // Prevent navigation while inspecting to avoid accidental route changes
    const onClick = (e: MouseEvent) => {
      if (!root || root.getAttribute('data-inspect') !== 'true') return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest('a,button,[role="button"],[data-action]');
      if (a) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, true);

    // Keyboard toggle: Shift + I to toggle inspect/debug
    const onKeyDown = (e: KeyboardEvent) => {
      const isShiftI = e.shiftKey && (e.key === 'I' || e.key === 'i');
      if (!isShiftI) return;
      const ae = document.activeElement as HTMLElement | null;
      const isTyping = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
      if (isTyping) return; // don't steal while typing
      if (!root) return;
      const active = root.getAttribute('data-inspect') === 'true';
      if (active) {
        root.removeAttribute('data-debug');
        root.removeAttribute('data-inspect');
        if (tip) tip.style.display = 'none';
      } else {
        root.setAttribute('data-debug', 'true');
        root.setAttribute('data-inspect', 'true');
        if (tip) tip.style.display = 'block';
      }
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.body.classList.remove('ecom-body-override');
      const r = document.querySelector('main.ecom');
      if (r) {
        r.removeAttribute('data-debug');
        r.removeAttribute('data-inspect');
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick, true);
  window.removeEventListener('keydown', onKeyDown, true);
      if (tip && tip.parentNode) tip.parentNode.removeChild(tip);
    };
  }, [params]);

  return <>
    {children}
    {!hideDrawer ? <DrawerCart /> : null}
  </>;
}
