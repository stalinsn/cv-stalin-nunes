"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { useCart } from '../../state/CartContext';
import { PriceBlock } from './PriceBlock';
import { QuantitySelector } from './QuantitySelector';
import { DiscountBadge } from './DiscountBadge';

type Props = {
  id: string;
  name: string;
  image?: string;
  price: number;
  listPrice?: number;
  unit?: string;
  packSize?: number;
  url?: string;
};

export default function ProductCard({ id, name, image = '/file.svg', price, listPrice, unit, packSize, url }: Props) {
  const { add, inc, dec, state } = useCart();
  const item = state.items[id];
  const hasItems = item && item.qty > 0;
  // Prefer slug from detailUrl (/slug/p), fallback to id
  const slug = url && url.includes('/p') ? url.split('/').filter(Boolean).slice(-2, -1)[0] : id;
  const href = `/e-commerce/${slug}/p`;
  
  return (
    <div className="product-card">
      <Link href={href} className="product-card__img" aria-label={`Ver detalhes de ${name}`}>
        <Image src={image} alt={name} width={320} height={200} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
        <DiscountBadge price={price} listPrice={listPrice} />
      </Link>
      <div className="product-card__info">
        <h3 className="product-card__title"><Link href={href}>{name}</Link></h3>
        <PriceBlock price={price} listPrice={listPrice} unit={unit} />
  {packSize && <div className="product-card__pack">Pacote c/ {packSize}</div>}
      </div>
      {!hasItems ? (
        <Button onClick={() => add({ id, name, price, listPrice, image, unit, packSize })} className="w-full mt-2">Adicionar</Button>
      ) : (
        <div className="w-full mt-2">
          <QuantitySelector value={item.qty} onDec={() => dec(id)} onInc={() => inc(id)} />
        </div>
      )}
    </div>
  );
}
