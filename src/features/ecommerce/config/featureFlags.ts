// Feature flags centralizados para o e-commerce
// Cada flag pode ser lida nos componentes para habilitar/desabilitar blocos.
// Futuramente, estas flags podem ser carregadas de um painel externo.

export type FlagKey =
  | 'ecom.header'
  | 'ecom.footer'
  | 'ecom.heroBanner'
  | 'ecom.servicesBar'
  | 'ecom.carousel'
  | 'ecom.showcaseDaily'
  | 'ecom.showcaseGrocery'
  | 'ecom.cart';

export type FeatureFlags = Record<FlagKey, boolean>;

export const featureFlags: FeatureFlags = {
  'ecom.header': true,
  'ecom.footer': true,
  'ecom.heroBanner': true,
  'ecom.servicesBar': true,
  'ecom.carousel': true,
  'ecom.showcaseDaily': true,
  'ecom.showcaseGrocery': true,
  'ecom.cart': true,
};

export const isOn = (key: FlagKey) => featureFlags[key];
