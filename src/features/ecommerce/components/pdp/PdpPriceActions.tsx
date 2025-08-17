"use client";
import React from 'react';
import { useCart } from '../../state/CartContext';

export function PdpPriceActions({ id, name, image, price, listPrice, unit, packSize }: { id: string; name: string; image?: string; price: number; listPrice?: number; unit?: string; packSize?: number }) {
  const { add, inc, dec, state } = useCart();
  const item = state.items[id];
  const hasItems = item && item.qty > 0;
  
  return (
    <div className="pdp__actions">
      {!hasItems ? (
        <button 
          className="add-to-cart-btn" 
          onClick={() => add({ id, name, price, listPrice, image, unit, packSize })}
        >
          ADICIONAR AO CARRINHO
        </button>
      ) : (
        <div className="qty-controls">
          <button className="qty-btn" onClick={() => dec(id)}>−</button>
          <span className="qty-display">{item.qty}</span>
          <button className="qty-btn" onClick={() => inc(id)}>+</button>
        </div>
      )}
    </div>
  );
}
