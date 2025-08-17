"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { OrderForm, OrderFormItem, Totalizer, ShippingData, Address } from '../types/orderForm';
import { safeJsonGet, safeJsonSet } from '@/utils/safeStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { useCart } from './CartContext';
import { isVtexLive } from '../lib/runtimeConfig';
import { simulateShipping } from '../lib/vtexCheckoutService';

const STORAGE_KEY = STORAGE_KEYS.orderForm;

function generateId() {
  const cryptoObj: unknown = (typeof crypto !== 'undefined') ? (crypto as unknown) : undefined;
  if (cryptoObj && typeof cryptoObj === 'object' && 'randomUUID' in (cryptoObj as Record<string, unknown>)) {
    return (cryptoObj as { randomUUID: () => string }).randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function buildTotalizers(items: OrderFormItem[], prev: Totalizer[] = []): Totalizer[] {
  const itemsTotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const others = prev.filter((t) => t.id !== 'Items');
  return [
    ...others,
    { id: 'Items', name: 'Itens', value: itemsTotal },
  ];
}

function computeValue(totalizers: Totalizer[]) {
  return totalizers.reduce((sum, t) => sum + t.value, 0);
}

function itemsEqual(left: OrderFormItem[], right: OrderFormItem[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    const itemLeft = left[index];
    const itemRight = right[index];
    if (!itemLeft || !itemRight) return false;
    if (
      itemLeft.id !== itemRight.id ||
      itemLeft.name !== itemRight.name ||
      itemLeft.price !== itemRight.price ||
      itemLeft.image !== itemRight.image ||
      itemLeft.listPrice !== itemRight.listPrice ||
      itemLeft.unit !== itemRight.unit ||
      itemLeft.packSize !== itemRight.packSize ||
      itemLeft.quantity !== itemRight.quantity
    ) return false;
  }
  return true;
}

function totalizersEqual(left: Totalizer[], right: Totalizer[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    const totalizerLeft = left[index];
    const totalizerRight = right[index];
    if (!totalizerLeft || !totalizerRight) return false;
    if (totalizerLeft.id !== totalizerRight.id || totalizerLeft.name !== totalizerRight.name || totalizerLeft.value !== totalizerRight.value) return false;
  }
  return true;
}

type Ctx = {
  orderForm: OrderForm;
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>;
  refreshFromCart: () => void;
  updateMarketing: (data: Partial<OrderForm['marketingData']>) => void;
  updatePreferences: (data: Partial<OrderForm['clientPreferencesData']>) => void;
  setShipping: (params: { address?: Address | null; option?: { id: string; name: string; price: number; estimate?: string } | null }) => void;
};

const OrderFormCtx = createContext<Ctx | null>(null);

export function OrderFormProvider({ children }: { children: React.ReactNode }) {
  const { state: cart } = useCart();
  const [orderForm, setOrderForm] = useState<OrderForm>(() => {
    const empty: OrderForm = {
      id: generateId(),
      items: [],
      value: 0,
      totalizers: [],
      marketingData: {},
      canEditData: true,
      loggedIn: false,
      paymentData: { 
        paymentSystems: [
          { id: 'pix', name: 'PIX' },
          { id: 'cash_on_delivery', name: 'Pagamento na entrega' },
          { id: 'credit_card', name: 'Cartão de crédito' },
        ],
        payments: [],
        installmentOptions: [],
        availableAccounts: [],
        isValid: false 
      },
      messages: { couponMessages: [], generalMessages: [] },
      shipping: { countries: [], availableAddresses: [], selectedAddress: null, deliveryOptions: [], pickupOptions: [], isValid: false },
      userProfileId: null,
      userType: 'STORE_USER',
      clientProfileData: null,
      clientPreferencesData: { locale: 'pt-BR', optInNewsletter: null },
      allowManualPrice: false,
      customData: null,
    };
    return empty;
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
  if (!hydrated) return;
    safeJsonSet(STORAGE_KEY, orderForm);
  }, [orderForm, hydrated]);

  useEffect(() => {
    const persisted = safeJsonGet<OrderForm | null>(STORAGE_KEY, null);
    if (persisted) {
      setOrderForm((prev) => ({ ...prev, ...persisted }));
    }
    setHydrated(true);
  }, []);

  const refreshFromCart = React.useCallback(() => {
    setOrderForm((prev) => {
      const items: OrderFormItem[] = Object.values(cart.items).map((it) => ({
        id: it.id,
        name: it.name,
        image: it.image,
        price: it.price,
        listPrice: it.listPrice,
        unit: it.unit,
        packSize: it.packSize,
        quantity: it.qty,
      }));
      const totalizers = buildTotalizers(items, prev.totalizers);
      const value = computeValue(totalizers);
      if (itemsEqual(prev.items, items) && totalizersEqual(prev.totalizers, totalizers) && prev.value === value) {
        return prev;
      }
      return { ...prev, items, totalizers, value };
    });
  }, [cart.items]);

  useEffect(() => {
    refreshFromCart();
  }, [refreshFromCart]);

  const updateMarketing = React.useCallback((data: Partial<OrderForm['marketingData']>) => {
    setOrderForm((prev) => ({ ...prev, marketingData: { ...prev.marketingData, ...data } }));
  }, []);
  const updatePreferences = React.useCallback((data: Partial<OrderForm['clientPreferencesData']>) => {
    setOrderForm((prev) => ({ ...prev, clientPreferencesData: { ...prev.clientPreferencesData, ...data } }));
  }, []);

  const setShipping = React.useCallback((params: { address?: Address | null; option?: { id: string; name: string; price: number; estimate?: string } | null }) => {
    setOrderForm((prev) => {
      const shipping: ShippingData = {
        ...prev.shipping,
        selectedAddress: params.address === undefined ? prev.shipping.selectedAddress : (params.address ?? null),
        deliveryOptions: params.option
          ? [
              ...prev.shipping.deliveryOptions.filter((o) => o.id !== params.option!.id),
              params.option,
            ]
          : prev.shipping.deliveryOptions,
        isValid: params.address ? true : prev.shipping.isValid,
      };

      const withoutShipping = prev.totalizers.filter((t) => t.id !== 'Shipping');
      const totalizers = params.option
        ? [...withoutShipping, { id: 'Shipping', name: 'Frete', value: params.option.price }]
        : withoutShipping;
      const recomputed = buildTotalizers(prev.items, totalizers);
      const value = computeValue(recomputed);
      return { ...prev, shipping, totalizers: recomputed, value };
    });

    // If VTEX live, try to simulate shipping against VTEX based on current items/address
    if (isVtexLive() && (params.address || params.option === undefined)) {
      setTimeout(async () => {
        try {
          const upd = await simulateShipping((params.address ?? null) || orderForm.shipping.selectedAddress || {}, orderForm.items);
          if (upd) {
            setOrderForm((prev) => {
              const mergedShipping: ShippingData = { ...prev.shipping, ...upd.shipping };
              const withoutShipping = prev.totalizers.filter((t) => t.id !== 'Shipping');
              const totalizers = upd.totalizers.length ? [...withoutShipping, ...upd.totalizers] : withoutShipping;
              const recomputed = buildTotalizers(prev.items, totalizers);
              const value = computeValue(recomputed);
              return { ...prev, shipping: mergedShipping, totalizers: recomputed, value };
            });
          }
        } catch {
          // silent fallback to local logic
        }
      }, 0);
    }
  }, [orderForm.items, orderForm.shipping.selectedAddress]);

  const ctx = useMemo<Ctx>(() => ({ orderForm, setOrderForm, refreshFromCart, updateMarketing, updatePreferences, setShipping }), [orderForm, refreshFromCart, updateMarketing, updatePreferences, setShipping]);
  return <OrderFormCtx.Provider value={ctx}>{children}</OrderFormCtx.Provider>;
}

export function useOrderForm() {
  const ctx = useContext(OrderFormCtx);
  if (!ctx) throw new Error('useOrderForm deve ser usado dentro de <OrderFormProvider>');
  return ctx;
}
