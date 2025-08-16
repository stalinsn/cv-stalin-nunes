import React from 'react';
import '../../styles/ecommerce/index.css';
import { EcomProviders } from './providers';

export const metadata = { title: 'E-commerce' };

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return (
    <EcomProviders>{children}</EcomProviders>
  );
}
