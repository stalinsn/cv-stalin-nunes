"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { OrderForm, OrderFormItem, ShippingData, Address, Totalizer } from '../types/orderForm';
import { safeJsonGet, safeJsonSet } from '@/utils/safeStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { useCart } from './CartContext';
import { isVtexLive } from '../lib/runtimeConfig';
import { simulateShipping } from '../lib/vtexCheckoutService';
import { buildOrderPricing } from '../lib/pricing';

const STORAGE_KEY = STORAGE_KEYS.orderForm;

function generateId() {
  const cryptoObj: unknown = (typeof crypto !== 'undefined') ? (crypto as unknown) : undefined;
  if (cryptoObj && typeof cryptoObj === 'object' && 'randomUUID' in (cryptoObj as Record<string, unknown>)) {
    return (cryptoObj as { randomUUID: () => string }).randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
    ) {
      return false;
    }
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
    if (
      totalizerLeft.id !== totalizerRight.id ||
      totalizerLeft.name !== totalizerRight.name ||
      totalizerLeft.value !== totalizerRight.value
    ) {
      return false;
    }
  }
  return true;
}

function normalizeShipping(shipping?: Partial<ShippingData> | null): ShippingData {
  return {
    countries: shipping?.countries || [],
    availableAddresses: shipping?.availableAddresses || [],
    selectedAddress: shipping?.selectedAddress || null,
    deliveryOptions: shipping?.deliveryOptions || [],
    pickupOptions: shipping?.pickupOptions || [],
    isValid: Boolean(shipping?.isValid),
  };
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
  const [orderForm, setOrderForm] = useState<OrderForm>(() => ({
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
      isValid: false,
    },
    messages: { couponMessages: [], generalMessages: [] },
    shipping: { countries: [], availableAddresses: [], selectedAddress: null, deliveryOptions: [], pickupOptions: [], isValid: false },
    userProfileId: null,
    userType: 'STORE_USER',
    clientProfileData: null,
    clientPreferencesData: { locale: 'pt-BR', optInNewsletter: null },
    allowManualPrice: false,
    customData: null,
  }));
  const [hydrated, setHydrated] = useState(false);
  const orderFormRef = useRef(orderForm);

  useEffect(() => {
    orderFormRef.current = orderForm;
  }, [orderForm]);

  useEffect(() => {
    if (!hydrated) return;
    safeJsonSet(STORAGE_KEY, orderForm);
  }, [orderForm, hydrated]);

  useEffect(() => {
    const persisted = safeJsonGet<OrderForm | null>(STORAGE_KEY, null);
    if (persisted) {
      setOrderForm((prev) => {
        const merged: OrderForm = {
          ...prev,
          ...persisted,
          marketingData: { ...prev.marketingData, ...(persisted.marketingData || {}) },
          paymentData: { ...prev.paymentData, ...(persisted.paymentData || {}) },
          messages: { ...prev.messages, ...(persisted.messages || {}) },
          shipping: normalizeShipping(persisted.shipping),
          clientPreferencesData: { ...prev.clientPreferencesData, ...(persisted.clientPreferencesData || {}) },
        };
        const pricing = buildOrderPricing({
          items: merged.items,
          shipping: merged.shipping,
          coupon: merged.marketingData.coupon,
        });
        return {
          ...merged,
          totalizers: pricing.totalizers,
          value: pricing.value,
          messages: { ...merged.messages, couponMessages: pricing.couponMessages },
        };
      });
    }
    setHydrated(true);
  }, []);

  const refreshFromCart = React.useCallback(() => {
    setOrderForm((prev) => {
      const items: OrderFormItem[] = Object.values(cart.items).map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        listPrice: item.listPrice,
        unit: item.unit,
        packSize: item.packSize,
        quantity: item.qty,
      }));

      const pricing = buildOrderPricing({
        items,
        shipping: prev.shipping,
        coupon: prev.marketingData.coupon,
      });

      if (
        itemsEqual(prev.items, items) &&
        totalizersEqual(prev.totalizers, pricing.totalizers) &&
        prev.value === pricing.value &&
        prev.messages.couponMessages.join('|') === pricing.couponMessages.join('|')
      ) {
        return prev;
      }

      return {
        ...prev,
        items,
        totalizers: pricing.totalizers,
        value: pricing.value,
        messages: { ...prev.messages, couponMessages: pricing.couponMessages },
      };
    });
  }, [cart.items]);

  useEffect(() => {
    refreshFromCart();
  }, [refreshFromCart]);

  const updateMarketing = React.useCallback((data: Partial<OrderForm['marketingData']>) => {
    setOrderForm((prev) => {
      const marketingData = { ...prev.marketingData, ...data };
      const pricing = buildOrderPricing({
        items: prev.items,
        shipping: prev.shipping,
        coupon: marketingData.coupon,
      });
      return {
        ...prev,
        marketingData,
        totalizers: pricing.totalizers,
        value: pricing.value,
        messages: { ...prev.messages, couponMessages: pricing.couponMessages },
      };
    });
  }, []);

  const updatePreferences = React.useCallback((data: Partial<OrderForm['clientPreferencesData']>) => {
    setOrderForm((prev) => ({ ...prev, clientPreferencesData: { ...prev.clientPreferencesData, ...data } }));
  }, []);

  const setShipping = React.useCallback((params: { address?: Address | null; option?: { id: string; name: string; price: number; estimate?: string } | null }) => {
    setOrderForm((prev) => {
      const shipping: ShippingData = {
        ...prev.shipping,
        selectedAddress: params.address === undefined ? prev.shipping.selectedAddress : (params.address ?? null),
        deliveryOptions: params.option ? [params.option] : prev.shipping.deliveryOptions,
        isValid: Boolean(params.address) || Boolean(params.option) || prev.shipping.isValid,
      };

      const pricing = buildOrderPricing({
        items: prev.items,
        shipping,
        coupon: prev.marketingData.coupon,
      });

      return {
        ...prev,
        shipping,
        totalizers: pricing.totalizers,
        value: pricing.value,
        messages: { ...prev.messages, couponMessages: pricing.couponMessages },
      };
    });

    if (isVtexLive() && (params.address || params.option === undefined)) {
      setTimeout(async () => {
        try {
          const latest = orderFormRef.current;
          const address = params.address ?? latest.shipping.selectedAddress;
          if (!address) return;
          const update = await simulateShipping(address, latest.items);
          if (!update) return;

          setOrderForm((prev) => {
            const shipping: ShippingData = {
              ...prev.shipping,
              ...update.shipping,
              selectedAddress: update.shipping.selectedAddress ?? prev.shipping.selectedAddress,
            };
            const pricing = buildOrderPricing({
              items: prev.items,
              shipping,
              coupon: prev.marketingData.coupon,
            });
            return {
              ...prev,
              shipping,
              totalizers: pricing.totalizers,
              value: pricing.value,
              messages: { ...prev.messages, couponMessages: pricing.couponMessages },
            };
          });
        } catch {
          // silent fallback to local pricing flow
        }
      }, 0);
    }
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({ orderForm, setOrderForm, refreshFromCart, updateMarketing, updatePreferences, setShipping }),
    [orderForm, refreshFromCart, updateMarketing, updatePreferences, setShipping],
  );

  return <OrderFormCtx.Provider value={ctx}>{children}</OrderFormCtx.Provider>;
}

export function useOrderForm() {
  const ctx = useContext(OrderFormCtx);
  if (!ctx) throw new Error('useOrderForm deve ser usado dentro de <OrderFormProvider>');
  return ctx;
}
