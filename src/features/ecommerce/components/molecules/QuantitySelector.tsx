"use client";
import React from 'react';
import { Button } from '../atoms/Button';

export function QuantitySelector({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="qty-selector">
      <Button variant="ghost" aria-label="Diminuir" onClick={onDec}>-</Button>
      <span className="qty-selector__value">{value}</span>
      <Button variant="ghost" aria-label="Aumentar" onClick={onInc}>+</Button>
    </div>
  );
}
