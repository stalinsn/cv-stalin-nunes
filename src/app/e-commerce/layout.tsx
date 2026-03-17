import React from 'react';
import '../../styles/ecommerce/index.css';
import { EcomProviders } from './providers';
import EcommerceLayoutClient from './layout-client';
import Header from '../../features/ecommerce/components/organisms/Header';
import Footer from '../../features/ecommerce/components/organisms/Footer';
import { Suspense } from 'react';
import { isOn } from '../../features/ecommerce/config/featureFlags';
import { resolveStorefrontTemplate } from '../../features/ecommerce/server/storefrontTemplateResolver';
import { resolveStorefrontTheme } from '../../features/site-runtime/storefrontTheme';

export const metadata = { title: 'E-commerce' };

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const showHeader = isOn('ecom.layout.header');
  const showFooter = isOn('ecom.layout.footer');
  const template = resolveStorefrontTemplate();
  const resolvedTheme = resolveStorefrontTheme(template.theme);
  const storefrontMainProps = {
    className: 'ecom',
    'data-theme': resolvedTheme.preset,
    'data-campaign': resolvedTheme.campaign,
    style: resolvedTheme.variables,
  } as const;

  return (
    <EcomProviders>
      <Suspense
        fallback={
          <main {...storefrontMainProps}>
            {showHeader ? <Header template={template} /> : null}
            {children}
            {showFooter ? <Footer template={template} /> : null}
          </main>
        }
      >
        <EcommerceLayoutClient>
          <main {...storefrontMainProps}>
            {showHeader ? <Header template={template} /> : null}
            {children}
            {showFooter ? <Footer template={template} /> : null}
          </main>
        </EcommerceLayoutClient>
      </Suspense>
    </EcomProviders>
  );
}
