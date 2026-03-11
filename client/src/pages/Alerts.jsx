import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';

const INITIAL_FORM = { origin: '', destination: '', maxPrice: '', currency: 'PHP', email: '' };

export default function Alerts() {
  const { alerts, addAlert, removeAlert, toggleAlert } = useAlerts();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.maxPrice) return;
    addAlert(form);
    setForm(INITIAL_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 6 }}>
          Price Alerts
        </h1>
        <p style={{ color: '#4a5568', fontSize: 14 }}>
          Set a target price. We&apos;ll watch routes so you know when to book.
        </p>
      </div>

      {/* Create Alert */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 20 }}>
          🔔 Create New Alert
        </h2>

        {submitted && (
          <div style={{ background: 'rgba(20,83,45,0.3)', border: '1px solid rgba(22,101,52,0.5)', color: '#86efac', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 }}>
            ✅ Alert created! We'll watch this route for you.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label className="label">From (IATA)</label>
            <input className="gh-input" placeholder="MNL" maxLength={3}
              value={form.origin} onChange={(e) => update('origin', e.target.value.toUpperCase())}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 2 }} required />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label className="label">To (IATA)</label>
            <input className="gh-input" placeholder="SIN" maxLength={3}
              value={form.destination} onChange={(e) => update('destination', e.target.value.toUpperCase())}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 2 }} required />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Max Price</label>
            <input type="number" className="gh-input" placeholder="5000" min={1}
              value={form.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} required />
          </div>
          <div style={{ flex: '0 0 auto', width: 120 }}>
            <label className="label">Currency</label>
            <select className="gh-input" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label className="label">Email (optional)</label>
            <input type="email" className="gh-input" placeholder="you@email.com"
              value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="book-btn" style={{ padding: '11px 24px' }}>
              Set Alert →
            </button>
          </div>
        </form>
      </div>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔕</div>
          <p style={{ fontSize: 16, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>No alerts yet</p>
          <p style={{ fontSize: 13, color: '#4a5568' }}>Create one above to start tracking prices.</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: '#2d3748', marginBottom: 14 }}>
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: 18, opacity: alert.active ? 1 : 0.4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: alert.active ? '#6389ff' : '#4a5568', display: 'inline-block', animation: alert.active ? 'pulse-dot 2s infinite' : 'none', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>
                      {alert.origin} → {alert.destination}
                    </p>
                    <p style={{ fontSize: 12, color: '#4a5568', marginTop: 2 }}>
                      Max {alert.currency} {parseFloat(alert.maxPrice).toLocaleString()}
                      {alert.email && ` · ${alert.email}`}
                      {' · '}Added {new Date(alert.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button className="alert-btn" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => toggleAlert(alert.id)}>
                    {alert.active ? 'Pause' : 'Activate'}
                  </button>
                  <button onClick={() => removeAlert(alert.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 500, padding: '7px 10px' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
