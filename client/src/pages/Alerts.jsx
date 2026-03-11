import { useState, useEffect } from 'react';
import { createAlert, getAlerts } from '../services/flightService';

const INITIAL_FORM = { origin: '', destination: '', email: '' };

export default function Alerts() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then(setAlerts).catch(() => {});
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.origin || !form.email) return;
    setLoading(true);
    setError(null);
    try {
      await createAlert(form);
      setForm(INITIAL_FORM);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      getAlerts().then(setAlerts).catch(() => {});
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 6 }}>
          Promo Alerts
        </h1>
        <p style={{ color: '#4a5568', fontSize: 14 }}>
          Tell us where you want to fly. We&apos;ll watch for promos and seat sales on that route.
        </p>
      </div>

      {/* Create Alert */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 20 }}>
          🔔 Create New Alert
        </h2>

        {submitted && (
          <div style={{ background: 'rgba(20,83,45,0.3)', border: '1px solid rgba(22,101,52,0.5)', color: '#86efac', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 }}>
            ✅ Alert created! We&apos;ll watch this route for you.
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(185,28,28,0.4)', color: '#fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label className="label">From (IATA) *</label>
            <input className="gh-input" placeholder="MNL" maxLength={3}
              value={form.origin} onChange={(e) => update('origin', e.target.value.toUpperCase())}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 2 }} required />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label className="label">To (IATA) — optional</label>
            <input className="gh-input" placeholder="Any" maxLength={3}
              value={form.destination} onChange={(e) => update('destination', e.target.value.toUpperCase())}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 2 }} />
          </div>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label className="label">Email *</label>
            <input type="email" className="gh-input" placeholder="you@email.com"
              value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="book-btn" style={{ padding: '11px 24px' }} disabled={loading}>
              {loading ? 'Saving…' : 'Set Alert →'}
            </button>
          </div>
        </form>
      </div>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔕</div>
          <p style={{ fontSize: 16, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>No alerts yet</p>
          <p style={{ fontSize: 13, color: '#4a5568' }}>Create one above to start tracking promos.</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: '#2d3748', marginBottom: 14 }}>
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''} active
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: 18 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6389ff', display: 'inline-block', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>
                      {alert.origin}{alert.destination ? ` → ${alert.destination}` : ' → Anywhere'}
                    </p>
                    <p style={{ fontSize: 12, color: '#4a5568', marginTop: 2 }}>
                      {alert.email}
                      {' · '}Added {new Date(alert.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
