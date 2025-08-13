"use client";
import React from 'react';

export function PriceBlock({ price, listPrice, unit }: { price: number; listPrice?: number; unit?: string }) {
  const hasDiscount = listPrice && listPrice > price;
  return (
    <div className="product-card__prices">
      {hasDiscount && <span className="product-card__list">R$ {listPrice!.toFixed(2)}</span>}
      <span className="product-card__price">R$ {price.toFixed(2)}</span>
      {unit && <span className="product-card__unit">/ {unit}</span>}
    </div>
  );
}
