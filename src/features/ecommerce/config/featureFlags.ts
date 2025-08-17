export type FlagKey =
  | 'ecom.header'
  | 'ecom.footer'
  | 'ecom.heroBanner'
  | 'ecom.servicesBar'
  | 'ecom.carousel'
  | 'ecom.showcaseDaily'
  | 'ecom.showcaseGrocery'
  | 'ecom.demoBanners'
  | 'ecom.demoShelves'
  | 'ecom.cart';

export type FeatureFlags = Record<FlagKey, boolean>;

// Small helper to parse boolean-like env vars. Accepts: '1', 'true', 'yes', 'on'.
function envBool(val: string | undefined, fallback = false): boolean {
  if (val == null) return fallback;
  switch (String(val).trim().toLowerCase()) {
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
// Enable it locally by setting NEXT_PUBLIC_IS_DEMO=true in .env.local.
const DEMO = !IS_PROD && envBool(process.env.NEXT_PUBLIC_IS_DEMO, false);

export const featureFlags = Object.freeze({
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
} satisfies FeatureFlags);

export function isOn(key: FlagKey): boolean {
  return featureFlags[key];
}

export function isOff(key: FlagKey): boolean {
  return !featureFlags[key];
}
