"use client";
import { catalogProducts } from './catalog';
import { UIProduct } from '../types/product';

export function useProducts(): UIProduct[] {
  return catalogProducts;
}
