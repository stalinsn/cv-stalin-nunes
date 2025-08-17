"use client";
import React from 'react';
import { CartProvider } from '../../features/ecommerce/state/CartContext';
import { OrderFormProvider } from '../../features/ecommerce/state/OrderFormContext';
import { UIProvider } from '../../features/ecommerce/state/UIContext';

export function EcomProviders({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>
        <OrderFormProvider>{children}</OrderFormProvider>
      </CartProvider>
    </UIProvider>
  );
}
