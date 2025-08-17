"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationClient() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <h1>Pedido confirmado</h1>
      <p>Obrigado pela sua compra!</p>
      {orderId && <p><strong>Código do pedido:</strong> {orderId}</p>}
      <a href="/e-commerce">Voltar à loja</a>
    </div>
  );
}
