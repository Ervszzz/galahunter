const shimmer = {
  background: 'linear-gradient(90deg, #1a2035 25%, #2a3a6e 50%, #1a2035 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 6,
};

function Bar({ width, height = 12, style = {} }) {
  return <div style={{ width, height, ...shimmer, ...style }} />;
}

export default function SkeletonCard() {
  return (
    <div className="card" style={{ animation: 'none' }}>
      {/* Cabin badge */}
      <Bar width={70} height={10} style={{ marginBottom: 10 }} />

      {/* Emoji + save row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <Bar width={38} height={38} style={{ borderRadius: 8 }} />
        <Bar width={24} height={24} style={{ borderRadius: '50%' }} />
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div>
          <Bar width={48} height={26} style={{ marginBottom: 4 }} />
          <Bar width={32} height={10} />
        </div>
        <div style={{ flex: 1, height: 1, background: '#1a2035' }} />
        <span style={{ fontSize: 14, color: '#1a2035' }}>✈</span>
        <div style={{ flex: 1, height: 1, background: '#1a2035' }} />
        <div style={{ textAlign: 'right' }}>
          <Bar width={48} height={26} style={{ marginBottom: 4 }} />
          <Bar width={32} height={10} />
        </div>
      </div>

      <div className="gh-divider" />

      {/* Info pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[64, 90, 72, 80].map((w, i) => (
          <Bar key={i} width={w} height={22} style={{ borderRadius: 999 }} />
        ))}
      </div>

      {/* Price + buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Bar width={110} height={32} style={{ marginBottom: 6 }} />
          <Bar width={80} height={10} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bar width={90} height={34} style={{ borderRadius: 10 }} />
          <Bar width={90} height={34} style={{ borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}
