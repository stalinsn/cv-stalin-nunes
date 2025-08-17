import React from 'react';
import '../../styles/ecommerce/index.css';
import { EcomProviders } from './providers';
import EcommerceLayoutClient from './layout-client';
import Header from '../../features/ecommerce/components/organisms/Header';
import Footer from '../../features/ecommerce/components/organisms/Footer';
import { Suspense } from 'react';

export const metadata = { title: 'E-commerce' };

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return (
    <EcomProviders>
      <Suspense
        fallback={
          <main className="ecom" data-theme="light">
            <Header />
            {children}
            <Footer />
          </main>
        }
      >
        <EcommerceLayoutClient>
          <main className="ecom" data-theme="light">
            <Header />
            {children}
            <Footer />
          </main>
        </EcommerceLayoutClient>
      </Suspense>
    </EcomProviders>
  );
}
