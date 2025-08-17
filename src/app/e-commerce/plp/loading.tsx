export default function Loading() {
  return (
    <section className="plp-container">
      <div className="plp-layout">
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 20, width: 220, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: 160, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 28, width: '100%', marginBottom: 10 }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, width: '100%' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
