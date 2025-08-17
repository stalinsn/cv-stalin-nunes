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
  const hasItems = !!(item && item.qty > 0);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const slug = url && url.includes('/p') ? url.split('/').filter(Boolean).slice(-2, -1)[0] : id;
  const href = `/e-commerce/${slug}/p`;
  
  return (
    <div className="product-card">
      <Link href={href} className="product-card__img" aria-label={`Ver detalhes de ${name}`} prefetch={false}>
        <Image 
          src={image} 
          alt={name} 
          width={320} 
          height={200} 
          sizes="(max-width: 768px) 45vw, (max-width: 1200px) 30vw, 320px"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }} 
          loading="lazy"
        />
        <DiscountBadge price={price} listPrice={listPrice} />
      </Link>
      <div className="product-card__info">
  <h3 className="product-card__title"><Link href={href} prefetch={false}>{name}</Link></h3>
        <PriceBlock price={price} listPrice={listPrice} unit={unit} />
  {packSize && <div className="product-card__pack">Pacote c/ {packSize}</div>}
      </div>
      <div className="product-card__cta">
        {!(mounted && hasItems) ? (
          <Button onClick={() => add({ id, name, price, listPrice, image, unit, packSize })}>Adicionar</Button>
        ) : (
          <QuantitySelector value={item.qty} onDec={() => dec(id)} onInc={() => inc(id)} />
        )}
      </div>
    </div>
  );
}
