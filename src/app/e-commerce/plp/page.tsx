import React, { Suspense } from 'react';
import PLPClient from './PLPClient';

export default function PLPPage() {
  return (
    <Suspense fallback={<section className="plp-container"><div style={{ padding: 16 }}>Carregando…</div></section>}>
      <PLPClient />
    </Suspense>
  );
}
