"use client";
import React from 'react';
import Image from 'next/image';
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
};

export default function ProductCard({ id, name, image = '/file.svg', price, listPrice, unit, packSize }: Props) {
  const { add, inc, dec, state } = useCart();
  const item = state.items[id];
  return (
    <div className="product-card">
      <div className="product-card__img">
        <Image src={image} alt={name} width={320} height={200} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
        <DiscountBadge price={price} listPrice={listPrice} />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__title">{name}</h3>
        <PriceBlock price={price} listPrice={listPrice} unit={unit} />
  {packSize && <div className="product-card__pack">Pacote c/ {packSize}</div>}
      </div>
      {!item ? (
        <Button onClick={() => add({ id, name, price, image })} className="w-full mt-2">Adicionar</Button>
      ) : (
        <div className="w-full mt-2">
          <QuantitySelector value={item.qty} onDec={() => dec(id)} onInc={() => inc(id)} />
        </div>
      )}
    </div>
  );
}
