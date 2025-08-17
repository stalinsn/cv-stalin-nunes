import React, { Suspense } from 'react';
import ConfirmationClient from './ConfirmationClient';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>Carregando…</div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
