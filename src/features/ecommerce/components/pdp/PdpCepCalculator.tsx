"use client";
import React from 'react';
import { Button } from '../atoms/Button';

type Quote = { id: string; name: string; sla: string; price: number };

function normalizeCep(input: string) {
  return (input || "").replace(/\D/g, "").slice(0, 8);
}

function formatCep(onlyDigits: string) {
  if (!onlyDigits) return "";
  const v = onlyDigits.replace(/\D/g, "").slice(0, 8);
  if (v.length <= 5) return v;
  return `${v.slice(0, 5)}-${v.slice(5)}`;
}

function isValidCep(onlyDigits: string) {
  return /^\d{8}$/.test(onlyDigits);
}

export function PdpCepCalculator() {
  const [raw, setRaw] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [quotes, setQuotes] = React.useState<Quote[] | null>(null);

  React.useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('ecom_cep') : null;
    if (saved) setRaw(saved);
  }, []);

  const onlyDigits = normalizeCep(raw);
  const masked = formatCep(onlyDigits);
  const valid = isValidCep(onlyDigits);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = normalizeCep(e.target.value);
    setRaw(v);
    setError(null);
  };

  const simulateFetch = async (cepDigits: string): Promise<Quote[]> => {
    // Mock quotes; in real use, call backend/shipping API
    // Make up a tiny variance based on last two digits
    const suffix = parseInt(cepDigits.slice(-2), 10) || 0;
    const base = 1290 + (suffix % 5) * 100; // cents
    const fast = 2490 + (suffix % 3) * 150; // cents
    return [
      { id: 'normal', name: 'Entrega normal', sla: '3-5 dias úteis', price: base / 100 },
      { id: 'express', name: 'Entrega expressa', sla: '1-2 dias úteis', price: fast / 100 },
      { id: 'pickup', name: 'Retirada na loja', sla: 'Hoje', price: 0 },
    ];
  };

  const onCalc = async () => {
    setError(null);
    setQuotes(null);
    if (!valid) {
      setError('Informe um CEP válido (ex: 01001-000)');
      return;
    }
    try {
      setLoading(true);
      const res = await simulateFetch(onlyDigits);
      setQuotes(res);
      if (typeof window !== 'undefined') window.localStorage.setItem('ecom_cep', onlyDigits);
  } catch {
      setError('Não foi possível calcular o frete agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const clearCep = () => {
    setRaw("");
    setQuotes(null);
    setError(null);
    if (typeof window !== 'undefined') window.localStorage.removeItem('ecom_cep');
  };

  return (
    <div className="pdp__cep">
      <label htmlFor="cep" className="cep-label">Calcular frete e prazo</label>
      <div className="cep-form">
        <input
          id="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Digite seu CEP"
          value={masked}
          onChange={onChange}
          className={`cep-input ${valid ? '' : raw ? 'is-invalid' : ''}`}
          aria-invalid={!valid && !!raw}
        />
        {raw && (
          <button type="button" className="cep-clear" onClick={clearCep} aria-label="Limpar CEP">×</button>
        )}
        <Button onClick={onCalc} disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </Button>
      </div>
      {error && <div className="cep-error" role="alert">{error}</div>}
      {quotes && (
        <ul className="cep-result" aria-live="polite">
          {quotes.map((q) => (
            <li key={q.id} className="cep-result__item">
              <div className="left">
                <strong>{q.name}</strong>
                <small>{q.sla}</small>
              </div>
              <div className="right">
                {q.price === 0 ? <strong className="free">Grátis</strong> : <strong>R$ {q.price.toFixed(2)}</strong>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
