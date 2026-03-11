import { useState } from 'react';
import { subscribe } from '../services/flightService';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await subscribe(email);
      setStatus('success');
      setMessage(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 56, textAlign: 'center', padding: '40px 32px' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 8 }}>
        Get promo alerts in your inbox
      </h2>
      <p style={{ fontSize: 14, color: '#4a5568', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
        We hunt for seat sales and promo fares daily. Subscribe to get the best deals delivered to you.
      </p>

      {status === 'success' && (
        <div style={{ background: 'rgba(20,83,45,0.3)', border: '1px solid rgba(22,101,52,0.5)', color: '#86efac', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
          ✅ {message}
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(185,28,28,0.4)', color: '#fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
          ⚠️ {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          type="email"
          className="gh-input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1, minWidth: 220 }}
        />
        <button type="submit" className="book-btn" style={{ padding: '11px 24px' }} disabled={loading}>
          {loading ? 'Subscribing…' : 'Subscribe →'}
        </button>
      </form>
    </div>
  );
}
