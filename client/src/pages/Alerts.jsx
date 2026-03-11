import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';

const INITIAL_FORM = { origin: '', destination: '', maxPrice: '', currency: 'PHP' };

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
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-700 text-gh-body">Price Alerts</h1>
        <p className="text-gh-muted text-sm mt-1">
          Set a target price. We&apos;ll track routes so you know when to book.
        </p>
      </div>

      {/* Create Alert Form */}
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <h2 className="font-heading text-lg font-600 text-gh-body">Create New Alert</h2>

        {submitted && (
          <div className="bg-green-950 border border-green-800 text-green-300 rounded-xl px-4 py-3 text-sm">
            ✅ Alert created! We&apos;ll watch this route for you.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              From <span className="label-muted">(IATA)</span>
            </label>
            <input
              className="input-field uppercase font-mono tracking-widest"
              placeholder="MNL"
              maxLength={3}
              value={form.origin}
              onChange={(e) => update('origin', e.target.value.toUpperCase())}
              required
            />
          </div>

          <div>
            <label className="label">
              To <span className="label-muted">(IATA)</span>
            </label>
            <input
              className="input-field uppercase font-mono tracking-widest"
              placeholder="SIN"
              maxLength={3}
              value={form.destination}
              onChange={(e) => update('destination', e.target.value.toUpperCase())}
              required
            />
          </div>

          <div>
            <label className="label">Max Price ({form.currency})</label>
            <input
              type="number"
              className="input-field"
              placeholder="5000"
              min={1}
              value={form.maxPrice}
              onChange={(e) => update('maxPrice', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Currency</label>
            <select
              className="input-field"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
            >
              <option value="PHP">PHP — Philippine Peso</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="SGD">SGD — Singapore Dollar</option>
              <option value="JPY">JPY — Japanese Yen</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          🔔 Create Alert
        </button>
      </form>

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-4">🔕</p>
          <p className="text-base font-medium text-gh-body">No alerts yet</p>
          <p className="text-sm text-gh-muted mt-1">Create one above to start tracking prices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-heading text-base font-600 text-gh-muted">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`card flex items-center justify-between gap-4 transition-opacity ${
                !alert.active ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 w-2 h-2 rounded-full ${
                    alert.active ? 'bg-gh-light' : 'bg-gh-muted'
                  }`}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gh-body">
                    {alert.origin} → {alert.destination}
                  </p>
                  <p className="text-xs text-gh-muted truncate">
                    Max {alert.currency}{' '}
                    {parseFloat(alert.maxPrice).toLocaleString()} &middot; Added{' '}
                    {new Date(alert.createdAt).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  {alert.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="btn-danger text-sm px-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
