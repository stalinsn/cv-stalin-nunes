"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useOrderForm } from '../../state/OrderFormContext';
import { formatBRL } from '../../utils/currency';
import { CartShipping } from './CartShipping';

export function CartSummary() {
  const { orderForm, updateMarketing } = useOrderForm();
  const router = useRouter();
  const [coupon, setCoupon] = React.useState(orderForm.marketingData.coupon || '');

  const itemsTotal = orderForm.totalizers.find((t) => t.id === 'Items')?.value || 0;
  const shipping = orderForm.totalizers.find((t) => t.id === 'Shipping')?.value || 0;
  const discounts = orderForm.totalizers.find((t) => t.id === 'Discounts')?.value || 0;

  return (
    <aside className="cart-summary">
      <div className="cart-summary__box">
        <h2>Resumo</h2>
  <div className="summary-row"><span>Itens</span><strong>{formatBRL(itemsTotal)}</strong></div>
  <div className="summary-row"><span>Frete</span><strong>{formatBRL(shipping)}</strong></div>
  <div className="summary-row"><span>Descontos</span><strong>- {formatBRL(Math.abs(discounts))}</strong></div>
  <div className="summary-row summary-row--total"><span>Total</span><strong>{formatBRL(orderForm.value)}</strong></div>

  <div className="coupon-box">
          <label htmlFor="coupon">Cupom</label>
          <div className="coupon-input">
            <input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Digite seu cupom" />
            <button onClick={() => updateMarketing({ coupon })}>Aplicar</button>
          </div>
        </div>

  <CartShipping />

  <button className="checkout-btn" onClick={() => router.push('/e-commerce/checkout')}>Continuar para Checkout</button>
      </div>
    </aside>
  );
}
