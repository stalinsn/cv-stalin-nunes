"use client";
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { safeJsonGet, safeJsonSet } from '@/utils/safeStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  listPrice?: number;
  unit?: string;
  packSize?: number;
};

export type CartState = {
  items: Record<string, CartItem>;
};

const STORAGE_KEY = STORAGE_KEYS.cart;
const initialState: CartState = { items: {} };

type Action =
  | { type: 'ADD'; payload: Omit<CartItem, 'qty'> & { qty?: number } }
  | { type: 'INC'; id: string }
  | { type: 'DEC'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartState };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      return action.payload && action.payload.items ? action.payload : state;
    }
    case 'ADD': {
      const { id, name, price, image, listPrice, unit, packSize, qty = 1 } = action.payload;
      const existing = state.items[id];
      const nextQty = (existing?.qty ?? 0) + qty;
      return {
        items: {
          ...state.items,
          [id]: { id, name, price, image, listPrice, unit, packSize, qty: nextQty },
        },
      };
    }
    case 'INC': {
      const it = state.items[action.id];
      if (!it) return state;
      return { items: { ...state.items, [action.id]: { ...it, qty: it.qty + 1 } } };
    }
    case 'DEC': {
      const it = state.items[action.id];
      if (!it) return state;
      const qty = Math.max(0, it.qty - 1);
      const items = { ...state.items };
      if (qty === 0) delete items[action.id];
      else items[action.id] = { ...it, qty };
      return { items };
    }
    case 'REMOVE': {
      const items = { ...state.items };
      delete items[action.id];
      return { items };
    }
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

const CartCtx = createContext<{
  state: CartState;
  add: (p: Omit<CartItem, 'qty'>, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
  if (!hydrated) return;
    safeJsonSet(STORAGE_KEY, state);
  }, [state, hydrated]);

  useEffect(() => {
    const persisted = safeJsonGet<CartState>(STORAGE_KEY, initialState);
    if (persisted && persisted !== state) {
      dispatch({ type: 'HYDRATE', payload: persisted });
    }
  setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    const itemsArr = Object.values(state.items);
    const totalItems = itemsArr.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = itemsArr.reduce((sum, it) => sum + it.qty * it.price, 0);

    return {
      state,
      add: (p: Omit<CartItem, 'qty'>, qty = 1) => dispatch({ type: 'ADD', payload: { ...p, qty } }),
      inc: (id: string) => dispatch({ type: 'INC', id }),
      dec: (id: string) => dispatch({ type: 'DEC', id }),
      remove: (id: string) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
      totalItems,
      subtotal,
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
