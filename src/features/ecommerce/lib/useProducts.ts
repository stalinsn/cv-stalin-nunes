"use client";
import raw from '../data/products.json';
import { EcommerceItem, UIProduct } from '../types/product';
import { mapToUIProduct } from './mapProduct';

export function useProducts(): UIProduct[] {
  const items = raw as unknown as EcommerceItem[];
  return items.map(mapToUIProduct);
}
