// Small helper to parse boolean-like env vars. Accepts: '1', 'true', 'yes', 'on'.
function envBool(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  switch (String(value).trim().toLowerCase()) {
    case '1':
    case 'true':
    case 'yes':
    case 'on':
      return true;
    case '0':
    case 'false':
    case 'no':
    case 'off':
      return false;
    default:
      return fallback;
  }
}

const IS_PROD = process.env.NODE_ENV === 'production';
// Demo-only UI is disabled in production by default, regardless of env.
const DEMO = !IS_PROD && envBool(process.env.NEXT_PUBLIC_IS_DEMO, false);

const BASE_FEATURE_FLAGS = {
  // Legacy keys (kept for compatibility with existing components/docs)
  'ecom.header': true,
  'ecom.footer': true,
  'ecom.heroBanner': true,
  'ecom.servicesBar': true,
  'ecom.carousel': true,
  'ecom.showcaseDaily': true,
  'ecom.showcaseGrocery': true,
  'ecom.demoBanners': DEMO,
  'ecom.demoShelves': DEMO,
  'ecom.cart': true,

  // Layout-level flags
  'ecom.layout.header': true,
  'ecom.layout.footer': true,
  'ecom.layout.drawerCart': true,
  'ecom.siteResolver.enabled': true,
  'ecom.siteResolver.overrideHome': true,

  // Header flags
  'ecom.header.promoBar': true,
  'ecom.header.deliveryPill': true,
  'ecom.header.utilBar': true,
  'ecom.header.util.club': true,
  'ecom.header.util.help': true,
  'ecom.header.util.login': true,
  'ecom.header.topRow': true,
  'ecom.header.logo': true,
  'ecom.header.search': true,
  'ecom.header.actions.favorite': true,
  'ecom.header.actions.cart': true,
  'ecom.header.actions.loginQuick': true,
  'ecom.header.nav': true,
  'ecom.header.nav.departments': true,
  'ecom.header.nav.meta': true,
  'ecom.header.condensed': true,
  'ecom.header.backToTop': true,

  // Home flags
  'ecom.home.hero.main': true,
  'ecom.home.showcase.daily': true,
  'ecom.home.services': true,
  'ecom.home.showcase.grocery': true,
  'ecom.home.banner.heroLarge': DEMO,
  'ecom.home.banner.strip.1': DEMO,
  'ecom.home.banner.strip.2': DEMO,
  'ecom.home.banner.strip.3': DEMO,
  'ecom.home.demo.carousel.twoItems': DEMO,
  'ecom.home.demo.carousel.manyItems': DEMO,

  // PLP flags
  'ecom.plp.header': true,
  'ecom.plp.toolbar': true,
  'ecom.plp.facets': true,
  'ecom.plp.grid': true,
  'ecom.plp.pagination': true,
  'ecom.plp.emptyState': true,
  'ecom.plp.loadingSkeleton': true,

  // PDP flags
  'ecom.pdp.breadcrumbs': true,
  'ecom.pdp.gallery': true,
  'ecom.pdp.priceActions': true,
  'ecom.pdp.primeBadge': true,
  'ecom.pdp.about': true,
  'ecom.pdp.tabs': true,
  'ecom.pdp.extraPanels': true,
  'ecom.pdp.related': true,

  // Cart page flags
  'ecom.cartPage.title': true,
  'ecom.cartPage.items': true,
  'ecom.cartPage.summary': true,
  'ecom.cartPage.empty': true,

  // Drawer cart flags
  'ecom.drawer.promotionBanner': true,
  'ecom.drawer.viewSwitch': true,
  'ecom.drawer.list.compact': true,
  'ecom.drawer.list.detailed': true,
  'ecom.drawer.footerSummary': true,

  // Checkout flags
  'ecom.checkout.error': true,
  'ecom.checkout.step.profile': true,
  'ecom.checkout.step.address': true,
  'ecom.checkout.step.shipping': true,
  'ecom.checkout.step.payment': true,
  'ecom.checkout.step.review': true,
  'ecom.checkout.asideSummary': true,
} as const;

export type FlagKey = keyof typeof BASE_FEATURE_FLAGS;
export type FeatureFlags = Record<FlagKey, boolean>;

export const featureFlags = Object.freeze(BASE_FEATURE_FLAGS) as FeatureFlags;

export function isOn(key: FlagKey | string): boolean {
  return (featureFlags as Record<string, boolean>)[key] ?? false;
}

export function isOff(key: FlagKey | string): boolean {
  return !isOn(key);
}
