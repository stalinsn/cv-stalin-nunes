"use client";
import React from 'react';
import { CartProvider } from '../../features/ecommerce/state/CartContext';
import { UIProvider } from '../../features/ecommerce/state/UIContext';

export function EcomProviders({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>{children}</CartProvider>
    </UIProvider>
  );
}
