"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useOrderForm } from '../../state/OrderFormContext';
import { useCart } from '../../state/CartContext';
import type { Address } from '../../types/orderForm';
import { lookupCep } from '../../lib/cepService';
import { formatBRL } from '../../utils/currency';
import { safeGet, safeSet } from '@/utils/safeStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';


type PaymentMethod = 'pix' | 'cash_on_delivery' | 'credit_card';
function maskCEP(value: string) { return value.replace(/\D/g, '').slice(0,8).replace(/(\d{5})(\d)/, '$1-$2'); }
function maskUF(value: string) { return value.replace(/[^a-zA-Z]/g, '').slice(0,2).toUpperCase(); }
function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0,11);
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}
function maskCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}
function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.replace(/(\d{2})(\d{0,2})/, (m, mm, yy) => (yy ? `${mm}/${yy}` : mm));
}
function maskCVC(value: string) { return value.replace(/\D/g, '').slice(0, 4); }

export default function CheckoutView() {
  const { orderForm, setOrderForm, setShipping } = useOrderForm();
  const { clear } = useCart();
  const [step, setStep] = useState<'profile' | 'address' | 'shipping' | 'payment' | 'review'>('profile');
  const [pm, setPm] = useState<PaymentMethod>('pix');
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState<Address>(() => orderForm.shipping.selectedAddress || {});
  const [ship, setShip] = useState<'standard' | 'express'>('standard');
  const [phone, setPhone] = useState<string>(orderForm.clientProfileData?.phone ?? '');
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvc, setCcCvc] = useState('');
  const [ccHolder, setCcHolder] = useState('');

  useEffect(() => {
    setAddr(orderForm.shipping.selectedAddress || {});
  const shippingVal = orderForm.totalizers.find(totalizer => totalizer.id === 'Shipping')?.value;
    if (shippingVal && shippingVal >= 35) setShip('express');
    const savedPm = safeGet(STORAGE_KEYS.checkoutPm);
    if (savedPm) setPm(savedPm as PaymentMethod);
    const savedShip = safeGet(STORAGE_KEYS.checkoutShip) as 'standard' | 'express' | null;
    if (savedShip === 'standard' || savedShip === 'express') setShip(savedShip);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsTotal = useMemo(() => {
  return orderForm.totalizers.find(totalizer => totalizer.id === 'Items')?.value ?? 0;
  }, [orderForm.totalizers]);
  const shippingValue = useMemo(() => {
  return orderForm.totalizers.find(totalizer => totalizer.id === 'Shipping')?.value ?? 0;
  }, [orderForm.totalizers]);
  const discounts = useMemo(() => {
  return orderForm.totalizers.find(totalizer => totalizer.id === 'Discounts')?.value ?? 0;
  }, [orderForm.totalizers]);
  const grandTotal = useMemo(() => itemsTotal + shippingValue - discounts, [itemsTotal, shippingValue, discounts]);

  function updateProfile(data: Partial<NonNullable<typeof orderForm.clientProfileData>>) {
    setOrderForm(prev => ({ ...prev, clientProfileData: { ...(prev.clientProfileData ?? {}), ...data } }));
  }

  function updateAddress(a: Address) {
    setAddr(a);
    setShipping({ address: a });
  }

  function placeOrder() {
    if (!orderForm.items.length) {
      alert('Seu carrinho está vazio.');
      return;
    }
    if (!orderForm.clientProfileData?.email) {
      setStep('profile');
      alert('Preencha seus dados de identificação.');
      return;
    }
    if (!orderForm.shipping.selectedAddress?.postalCode) {
      setStep('address');
      alert('Informe seu endereço.');
      return;
    }
    setPlacing(true);
    setOrderForm(prev => ({
      ...prev,
      paymentData: {
        ...prev.paymentData,
        payments: [{ system: pm, value: grandTotal }],
        isValid: true,
      },
    }));
    const payload = {
      orderFormId: orderForm.id,
      items: orderForm.items,
      clientProfileData: orderForm.clientProfileData,
      shipping: orderForm.shipping,
      payments: [{ system: pm, value: grandTotal }],
      totalizers: orderForm.totalizers,
      value: grandTotal,
    };

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((res) => {
        try { clear(); } catch {}
        setOrderForm(prev => ({ ...prev, items: [], totalizers: [], value: 0 }));
        window.location.href = `/e-commerce/checkout/confirmation?orderId=${encodeURIComponent(res.orderId)}`;
  })
  .catch((e) => {
        alert('Falha ao fechar pedido: ' + e.message);
  })
  .finally(() => setPlacing(false));
  }

  return (
    <div className="checkout">
      <div className="checkout__content">
        <section className="co-step">
          <header className="co-step__header" onClick={() => setStep('profile')}>
            <h2>1. Identificação</h2>
          </header>
          {step === 'profile' && (
            <div className="co-step__body">
              <div className="co-field">
                <label>Nome</label>
                <input
                  type="text"
                  defaultValue={orderForm.clientProfileData?.firstName ?? ''}
                  onBlur={(e) => updateProfile({ firstName: e.target.value })}
                />
              </div>
              <div className="co-field">
                <label>Sobrenome</label>
                <input
                  type="text"
                  defaultValue={orderForm.clientProfileData?.lastName ?? ''}
                  onBlur={(e) => updateProfile({ lastName: e.target.value })}
                />
              </div>
              <div className="co-field">
                <label>E-mail</label>
                <input
                  type="email"
                  defaultValue={orderForm.clientProfileData?.email ?? ''}
                  onBlur={(e) => updateProfile({ email: e.target.value })}
                />
              </div>
              <div className="co-field">
                <label>Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 91234-5678"
                  value={maskPhone(phone)}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  onBlur={() => updateProfile({ phone })}
                />
              </div>
              <div className="co-actions">
                <button onClick={() => setStep('address')}>Continuar</button>
              </div>
            </div>
          )}
        </section>

        <section className="co-step">
          <header className="co-step__header" onClick={() => setStep('address')}>
            <h2>2. Endereço</h2>
          </header>
          {step === 'address' && (
            <div className="co-step__body">
              <div className="co-grid">
                <div className="co-field">
                  <label>CEP</label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={maskCEP(addr.postalCode || '')}
                    onChange={(e) => setAddr({ ...addr, postalCode: maskCEP(e.target.value) })}
                    onBlur={async (e) => {
                      const data = await lookupCep(e.target.value);
                      if (data) {
                        const merged = {
                          ...addr,
                          postalCode: data.cep,
                          street: data.street ?? addr.street,
                          neighborhood: data.neighborhood ?? addr.neighborhood,
                          city: data.city ?? addr.city,
                          state: data.state ?? addr.state,
                          country: data.country ?? addr.country,
                        };
                        updateAddress(merged);
                      } else {
                        updateAddress({ ...addr, postalCode: maskCEP(e.target.value) });
                      }
                    }}
                  />
                </div>
                <div className="co-field"><label>Rua</label><input type="text" value={addr.street || ''} onChange={(e)=>setAddr({ ...addr, street: e.target.value })} onBlur={()=>updateAddress(addr)} /></div>
                <div className="co-field"><label>Número</label><input type="text" value={addr.number || ''} onChange={(e)=>setAddr({ ...addr, number: e.target.value })} onBlur={()=>updateAddress(addr)} /></div>
                <div className="co-field"><label>Complemento</label><input type="text" value={addr.complement || ''} onChange={(e)=>setAddr({ ...addr, complement: e.target.value })} onBlur={()=>updateAddress(addr)} /></div>
                <div className="co-field"><label>Bairro</label><input type="text" value={addr.neighborhood || ''} onChange={(e)=>setAddr({ ...addr, neighborhood: e.target.value })} onBlur={()=>updateAddress(addr)} /></div>
                <div className="co-field"><label>Cidade</label><input type="text" value={addr.city || ''} onChange={(e)=>setAddr({ ...addr, city: e.target.value })} onBlur={()=>updateAddress(addr)} /></div>
                <div className="co-field"><label>UF</label><input type="text" maxLength={2} value={addr.state || ''} onChange={(e)=>setAddr({ ...addr, state: maskUF(e.target.value) })} onBlur={()=>updateAddress(addr)} /></div>
              </div>
              <div className="co-actions">
                <button onClick={() => setStep('shipping')}>Continuar</button>
              </div>
            </div>
          )}
        </section>

        <section className="co-step">
          <header className="co-step__header" onClick={() => setStep('shipping')}>
            <h2>3. Entrega</h2>
          </header>
          {step === 'shipping' && (
            <div className="co-step__body">
              <div className="co-radio">
                <label>
                  <input type="radio" name="ship" checked={ship === 'standard'} onChange={() => { setShip('standard'); safeSet(STORAGE_KEYS.checkoutShip, 'standard'); setShipping({ option: { id: 'standard', name: 'Entrega Padrão', price: 15 } }); }} />
                  Entrega Padrão (2-5 dias úteis)
                </label>
              </div>
              <div className="co-radio">
                <label>
                  <input type="radio" name="ship" checked={ship === 'express'} onChange={() => { setShip('express'); safeSet(STORAGE_KEYS.checkoutShip, 'express'); setShipping({ option: { id: 'express', name: 'Entrega Expressa', price: 35 } }); }} />
                  Entrega Expressa (1-2 dias úteis)
                </label>
              </div>
              <div className="co-actions">
                <button onClick={() => setStep('payment')}>Continuar</button>
              </div>
            </div>
          )}
        </section>

        <section className="co-step">
          <header className="co-step__header" onClick={() => setStep('payment')}>
            <h2>4. Pagamento</h2>
          </header>
          {step === 'payment' && (
            <div className="co-step__body">
              <div className="co-radio"><label><input type="radio" name="pm" checked={pm==='pix'} onChange={()=>{ setPm('pix'); safeSet(STORAGE_KEYS.checkoutPm, 'pix'); setOrderForm(prev=>({ ...prev, paymentData: { ...prev.paymentData, payments: [{ system: 'pix', value: grandTotal }], isValid: true } })); }} />PIX</label></div>
              <div className="co-radio"><label><input type="radio" name="pm" checked={pm==='cash_on_delivery'} onChange={()=>{ setPm('cash_on_delivery'); safeSet(STORAGE_KEYS.checkoutPm, 'cash_on_delivery'); setOrderForm(prev=>({ ...prev, paymentData: { ...prev.paymentData, payments: [{ system: 'cash_on_delivery', value: grandTotal }], isValid: true } })); }} />Pagamento na entrega</label></div>
              <div className="co-radio"><label><input type="radio" name="pm" checked={pm==='credit_card'} onChange={()=>{ setPm('credit_card'); safeSet(STORAGE_KEYS.checkoutPm, 'credit_card'); setOrderForm(prev=>({ ...prev, paymentData: { ...prev.paymentData, payments: [{ system: 'credit_card', value: grandTotal }], isValid: true } })); }} />Cartão de crédito</label></div>
              {pm === 'credit_card' && (
                <div className="co-grid">
                  <div className="co-field"><label>Número do cartão</label><input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={ccNumber} onChange={(e)=>setCcNumber(maskCardNumber(e.target.value))} /></div>
                  <div className="co-field"><label>Validade</label><input type="text" inputMode="numeric" placeholder="MM/AA" value={ccExpiry} onChange={(e)=>setCcExpiry(maskExpiry(e.target.value))} /></div>
                  <div className="co-field"><label>CVC</label><input type="text" inputMode="numeric" placeholder="123" value={ccCvc} onChange={(e)=>setCcCvc(maskCVC(e.target.value))} /></div>
                  <div className="co-field"><label>Titular</label><input type="text" placeholder="Nome completo" value={ccHolder} onChange={(e)=>setCcHolder(e.target.value)} /></div>
                </div>
              )}
              <div className="co-actions">
                <button onClick={() => setStep('review')}>Revisão</button>
              </div>
            </div>
          )}
        </section>

        <section className="co-step">
          <header className="co-step__header" onClick={() => setStep('review')}>
            <h2>5. Revisão e Finalização</h2>
          </header>
          {step === 'review' && (
            <div className="co-step__body">
              <ul className="co-items">
                {orderForm.items.map(item => (
                  <li key={item.id} className="co-item"><span>{item.name}</span><span>x{item.quantity}</span><span>{formatBRL(item.price*item.quantity)}</span></li>
                ))}
              </ul>
              <div className="co-summary">
                <div><span>Itens</span><b>{formatBRL(itemsTotal)}</b></div>
                <div><span>Frete</span><b>{formatBRL(shippingValue)}</b></div>
                {discounts ? <div><span>Descontos</span><b>- {formatBRL(discounts)}</b></div> : null}
                <div className="co-total"><span>Total</span><b>{formatBRL(grandTotal)}</b></div>
              </div>
              <div className="co-actions">
                <button className="co-place" onClick={placeOrder} disabled={placing}>{placing ? 'Finalizando…' : 'Finalizar pedido'}</button>
              </div>
            </div>
          )}
        </section>
      </div>

      <aside className="checkout__aside">
        <div className="co-card">
          <h3>Resumo</h3>
          <div className="co-row"><span>Itens</span><span>{formatBRL(itemsTotal)}</span></div>
          <div className="co-row"><span>Frete</span><span>{formatBRL(shippingValue)}</span></div>
          {discounts ? <div className="co-row"><span>Descontos</span><span>- {formatBRL(discounts)}</span></div> : null}
          <div className="co-row co-row--total"><span>Total</span><span>{formatBRL(grandTotal)}</span></div>
        </div>
      </aside>
    </div>
  );
}
