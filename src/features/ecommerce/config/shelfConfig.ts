import type { FlagKey } from './featureFlags';

export type ShelfVariant = 'default' | 'brand' | 'dark';

export type ShelfConfig = {
  variant?: ShelfVariant;
  seeMoreHref?: string;
  subtitle?: string;
  titleAlign?: 'left' | 'center';
  banner?: {
    image: string;
    alt?: string;
    href?: string;
    position?: 'left' | 'right';
  };
};

// Temporary, managed by code flags; later will be fetched from a CMS/panel
export const shelfConfig: Partial<Record<FlagKey, ShelfConfig>> = {
  'ecom.showcaseDaily': {
    variant: 'brand',
    seeMoreHref: '#',
    banner: {
      image: '/window.svg',
      alt: 'Cashback',
      href: '#',
      position: 'left',
    },
  },
  'ecom.showcaseGrocery': {
    variant: 'default',
  },
};
