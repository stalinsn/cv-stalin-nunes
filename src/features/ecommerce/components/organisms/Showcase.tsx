"use client";
import React from 'react';
import ProductCard from '../molecules/ProductCard';
import { useProducts } from '../../lib/useProducts';
import { isOn } from '../../config/featureFlags';

export default function Showcase({ title, flag }: { title: string; flag: Parameters<typeof isOn>[0] }) {
  const data = useProducts();
  if (!isOn(flag)) return null;
  return (
    <section className="ecom-showcase">
      <h2 className="ecom-section-title">{title}</h2>
      <div className="ecom-grid">
        {data.slice(0, 8).map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} image={p.image} price={p.price} listPrice={p.listPrice} unit={p.unit} packSize={p.packSize} />
        ))}
      </div>
    </section>
  );
}
