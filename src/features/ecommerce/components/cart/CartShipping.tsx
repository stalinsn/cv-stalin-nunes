"use client";
import React from 'react';
import { useOrderForm } from '../../state/OrderFormContext';
import { inRange, lookupCep, estimateShipping } from '../../lib/cepService';
import { formatBRL } from '../../utils/currency';

const RANGE_START = '00000-001';
const RANGE_END = '40000-999';

export function CartShipping() {
  const { orderForm, setShipping } = useOrderForm();
  const [cep, setCep] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onCalc = async () => {
    setError(null);
    setLoading(true);
    try {
      const ok = inRange(cep, RANGE_START, RANGE_END);
      if (!ok) {
        setError(`Entregamos somente entre ${RANGE_START} e ${RANGE_END}.`);
        return;
      }
      const addr = await lookupCep(cep);
      const { option } = estimateShipping(cep);
      setShipping({ address: addr ? { street: addr.street, neighborhood: addr.neighborhood, city: addr.city, state: addr.state, postalCode: addr.cep, country: addr.country } : null, option });
    } finally {
      setLoading(false);
    }
  };

  const selected = orderForm.shipping.selectedAddress;
  const shippingValue = orderForm.totalizers.find((t) => t.id === 'Shipping')?.value || 0;

  return (
    <div className="cart-shipping">
      <h3>Calcular frete</h3>
      <div className="shipping-form">
        <input
          placeholder="CEP (00000-000)"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
        />
        <button onClick={onCalc} disabled={loading}>{loading ? 'Calculando…' : 'Calcular'}</button>
      </div>
      {error && <div className="shipping-error">{error}</div>}
      {selected && (
        <div className="shipping-address">
          <div><strong>Entrega em:</strong> {selected.street ? `${selected.street}, ` : ''}{selected.neighborhood ? `${selected.neighborhood}, ` : ''}{selected.city} - {selected.state} • CEP {selected.postalCode}</div>
          <div className="shipping-price"><strong>Frete:</strong> {formatBRL(shippingValue)} — Entrega Padrão</div>
        </div>
      )}
    </div>
  );
}
