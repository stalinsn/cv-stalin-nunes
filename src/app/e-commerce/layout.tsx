import React from 'react';
import '../../styles/ecommerce/index.css';
import { EcomProviders } from './providers';
import EcommerceLayoutClient from './layout-client';
import Header from '../../features/ecommerce/components/organisms/Header';
import Footer from '../../features/ecommerce/components/organisms/Footer';
import { Suspense } from 'react';
import { isOn } from '../../features/ecommerce/config/featureFlags';

export const metadata = { title: 'E-commerce' };

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const showHeader = isOn('ecom.layout.header');
  const showFooter = isOn('ecom.layout.footer');
  return (
    <EcomProviders>
      <Suspense
        fallback={
          <main className="ecom" data-theme="default" data-campaign="none">
            {showHeader ? <Header /> : null}
            {children}
            {showFooter ? <Footer /> : null}
          </main>
        }
      >
        <EcommerceLayoutClient>
          <main className="ecom" data-theme="default" data-campaign="none">
            {showHeader ? <Header /> : null}
            {children}
            {showFooter ? <Footer /> : null}
          </main>
        </EcommerceLayoutClient>
      </Suspense>
    </EcomProviders>
  );
}
