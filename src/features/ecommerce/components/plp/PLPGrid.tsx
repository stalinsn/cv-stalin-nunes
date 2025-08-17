"use client";
import React from 'react';
import ProductCard from '../molecules/ProductCard';
import type { UIProduct } from '../../types/product';

export function PLPGrid({ products }: { products: UIProduct[] }) {
  if (!products?.length) return null;
  return (
    <div className="plp-grid">
      {products.map((p) => (
        <ProductCard key={p.id} id={p.id} name={p.name} image={p.image} price={p.price} listPrice={p.listPrice} unit={p.unit} packSize={p.packSize} url={p.url} />
      ))}
    </div>
  );
}
