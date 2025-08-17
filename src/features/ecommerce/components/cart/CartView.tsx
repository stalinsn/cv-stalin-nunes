"use client";
import React from 'react';
import { useOrderForm } from '../../state/OrderFormContext';
import { CartItems } from './CartItems';
import { CartSummary } from './CartSummary';

export function CartView() {
  const { orderForm } = useOrderForm();
  const hasItems = orderForm.items.length > 0;
  return (
    <section className="container cart-page">
      <h1 className="cart-title">Seu carrinho</h1>
      {hasItems ? (
        <div className="cart-layout">
          <CartItems />
          <CartSummary />
        </div>
      ) : (
        <div className="cart-empty">Seu carrinho está vazio.</div>
      )}
    </section>
  );
}
