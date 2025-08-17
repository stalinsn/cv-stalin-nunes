export default function Loading() {
  return (
    <section className="container pdp">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
        <div className="skeleton" style={{ height: 420, width: '100%' }} />
        <div>
          <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 42, width: '30%', marginBottom: 18 }} />
          <div className="skeleton" style={{ height: 48, width: '40%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 160, width: '100%' }} />
        </div>
      </div>
    </section>
  );
}
