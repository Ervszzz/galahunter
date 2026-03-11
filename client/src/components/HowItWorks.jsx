const STEPS = [
  {
    icon: '🔍',
    title: 'Discover deals',
    desc: 'We scan hundreds of routes daily and surface the cheapest fares from Manila and other Philippine hubs.',
  },
  {
    icon: '🔔',
    title: 'Set alerts',
    desc: 'Pick a route and get notified the moment a promo or price drop appears — before seats run out.',
  },
  {
    icon: '✈️',
    title: 'Book directly',
    desc: "No middlemen, no hidden fees. Click through straight to Cebu Pacific, AirAsia, or PAL's own website.",
  },
];

export default function HowItWorks() {
  return (
    <div style={{ marginTop: 56 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 6, textAlign: 'center' }}>
        How it works
      </h2>
      <p style={{ fontSize: 14, color: '#4a5568', textAlign: 'center', marginBottom: 28 }}>
        Three steps to your next adventure.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="card"
            style={{ textAlign: 'center', padding: '28px 20px' }}
          >
            <div style={{ fontSize: 36, marginBottom: 14 }}>{step.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 8 }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
