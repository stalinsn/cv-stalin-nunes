import React, { Suspense } from 'react';
import PLPClient from './PLPClient';
import { PLPSkeleton } from '../../../features/ecommerce/components/plp/PLPSkeleton';

export default function PLPPage() {
  return (
    <Suspense fallback={<section className="plp-container"><PLPSkeleton cards={12} /></section>}>
      <PLPClient />
    </Suspense>
  );
}
