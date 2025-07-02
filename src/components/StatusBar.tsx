'use client';

import React, { useState } from 'react';

interface StatusBarProps {
  loading: boolean;
  statusMessage: string;
  tokensUsed: number | null;
  elapsedTime: number | null;
  payloadSize: number | null;
  charCount: number | null;
  model: string;
}

export default function StatusBar({
  loading,
  statusMessage,
  tokensUsed,
  elapsedTime,
  payloadSize,
  charCount,
  model,
}: StatusBarProps) {
  const [expanded, setExpanded] = useState(false);

  if (!loading && !statusMessage) return null;

  const dolar = 5.2; // Base de conversão manual
  const costUSD = tokensUsed ? (tokensUsed / 1000) * 0.002 : 0;
  const costBRL = costUSD * dolar;
  const speed =
    tokensUsed && elapsedTime ? (tokensUsed / elapsedTime).toFixed(2) : null;
  const requisicoesPorDolar =
    costUSD > 0 ? (1 / costUSD).toFixed(0) : '∞';

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        background: '#111',
        color: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        zIndex: 9999,
        width: expanded ? '370px' : '230px',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{statusMessage}</p>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {expanded ? '⬆️' : '⬇️'}
        </button>
      </div>

      {expanded && (
        <>
          <hr style={{ border: '0.5px solid #333' }} />
          {tokensUsed !== null && <p>🧠 Tokens usados: {tokensUsed}</p>}
          {elapsedTime !== null && (
            <p>⏱️ Tempo: {elapsedTime.toFixed(2)}s</p>
          )}
          {speed && <p>⚡ Velocidade: {speed} tokens/s</p>}
          {payloadSize && <p>📦 Payload: {payloadSize.toFixed(2)} KB</p>}
          {charCount && <p>📝 Caracteres: {charCount}</p>}
          {costUSD > 0 && (
            <>
              <p>
                💰 Custo estimado: ${costUSD.toFixed(5)} (~R$
                {costBRL.toFixed(5)})
              </p>
              <p>
                🧾 Com $1 você faz aprox. {requisicoesPorDolar} requisições
                desse tamanho
              </p>
              <p style={{ fontSize: '0.75rem', color: '#aaa' }}>
                ⚠️ Base: dólar = R$5,20
              </p>
            </>
          )}
          <p>🤖 Modelo: {model}</p>
        </>
      )}
    </div>
  );
}
