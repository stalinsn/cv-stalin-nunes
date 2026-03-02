import { PLPSkeleton } from '../../../features/ecommerce/components/plp/PLPSkeleton';

export default function Loading() {
  return (
    <section className="plp-container">
      <div className="plp-layout">
        <PLPSkeleton cards={12} />
      </div>
    </section>
  );
}
