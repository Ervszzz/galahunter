import { useState } from 'react';
import { useSavedFlights } from '../hooks/useSavedFlights';
import { useAlerts } from '../hooks/useAlerts';

// Destination emoji map by IATA code
const DEST_EMOJI = {
  NRT: '🗼', HND: '🗼', KIX: '⛩️', NGO: '🏯',
  SIN: '🦁',
  ICN: '🏯', GMP: '🏯',
  DXB: '🕌', AUH: '🕌',
  BKK: '🛕', HKT: '🌴',
  HKG: '🌆',
  SYD: '🦘', MEL: '🎭',
  LHR: '🎡', LGW: '🎡',
  CDG: '🗼',
  LAX: '🌴', SFO: '🌉',
  JFK: '🗽', EWR: '🗽',
  KUL: '🏙️',
  CGK: '🌴',
  MNL: '🌅',
  CEB: '🏖️',
  AMD: '🕌', DEL: '🕌', BOM: '🎭',
  PEK: '🏯', PKX: '🏯', PVG: '🌆', SHA: '🌆',
  AMS: '🌷',
  FCO: '🏛️',
  DOH: '🌟',
  NAN: '🌊',
};

function parseDuration(iso = '') {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}h` : '';
  const m = match[2] ? `${match[2]}m` : '';
  return [h, m].filter(Boolean).join(' ') || iso;
}

function formatTime(isoDateTime) {
  if (!isoDateTime) return '--:--';
  return new Date(isoDateTime).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(isoDateTime) {
  if (!isoDateTime) return '';
  return new Date(isoDateTime).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

function AlertModal({ offer, fromCode, toCode, price, currency, onClose }) {
  const { addAlert } = useAlerts();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSet() {
    addAlert({ origin: fromCode, destination: toCode, maxPrice: price, currency, email });
    setDone(true);
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#0e1422', border: '1px solid #1a2035', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 0 80px rgba(59,93,192,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!done ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🔔</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0' }}>
              Set a Price Alert
            </h2>
            <p style={{ color: '#4a5568', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              We'll notify you when{' '}
              <strong style={{ color: '#93b4ff' }}>{fromCode} → {toCode}</strong>{' '}
              drops below the current price.
            </p>

            {/* Current price info */}
            <div style={{ background: '#07090f', border: '1px solid #1a2035', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#4a5568', fontSize: 13 }}>Current price</span>
                <span style={{ color: '#6389ff', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {currency} {parseFloat(price).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4a5568', fontSize: 13 }}>Route</span>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>{fromCode} → {toCode}</span>
              </div>
            </div>

            <input
              className="gh-input"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, background: 'transparent', border: '1px solid #1a2035', color: '#4a5568', padding: 11, borderRadius: 10, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button onClick={handleSet} className="book-btn" style={{ flex: 2, padding: 11, borderRadius: 10, fontSize: 14 }}>
                Set Alert →
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 2s infinite' }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0' }}>
              Alert Set!
            </h2>
            <p style={{ color: '#4a5568', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              We'll notify you when {fromCode} → {toCode} drops in price. Start saving up!
            </p>
            <button onClick={onClose} className="book-btn" style={{ padding: '11px 40px', borderRadius: 10, fontSize: 14 }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlightCard({ offer, dictionaries = {}, index = 0 }) {
  const { saveFlight, removeFlight, isFlightSaved } = useSavedFlights();
  const [showAlert, setShowAlert] = useState(false);
  const saved = isFlightSaved(offer.id);

  const outbound    = offer.itineraries?.[0];
  const returnLeg   = offer.itineraries?.[1];
  const segments    = outbound?.segments ?? [];
  const firstSeg    = segments[0];
  const lastSeg     = segments[segments.length - 1];
  const stops       = segments.length - 1;

  const fromCode    = firstSeg?.departure?.iataCode ?? '---';
  const toCode      = lastSeg?.arrival?.iataCode ?? '---';
  const carrierCode = firstSeg?.carrierCode ?? '';
  const carrierName = dictionaries?.carriers?.[carrierCode] || carrierCode;
  const cabinClass  = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? offer.travelClass ?? 'ECONOMY';
  const cabinLabel  = { ECONOMY: 'Economy ✈', PREMIUM_ECONOMY: 'Prem. Economy ✈', BUSINESS: 'Business 💺', FIRST: 'First Class 👑' }[cabinClass] ?? cabinClass;
  const price       = parseFloat(offer.price?.total ?? 0);
  const currency    = offer.price?.currency ?? 'PHP';
  const depDate     = firstSeg?.departure?.at;
  const arrDate     = lastSeg?.arrival?.at;
  const destEmoji   = DEST_EMOJI[toCode] ?? '✈️';

  const stopLabel = stops === 0 ? 'Non-stop ✈' : stops === 1 ? '1 Stop 🔄' : `${stops} Stops 🛑`;

  return (
    <>
      <div className="card" style={{ animationDelay: `${index * 0.05}s` }}>

        {/* Cabin class badge — top left */}
        <div style={{ fontSize: 10, color: '#3b5fc0', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
          {cabinLabel}
        </div>

        {/* Emoji + save button row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ fontSize: 38, animation: `float ${3 + index * 0.2}s infinite`, animationDelay: `${index * 0.1}s` }}>
            {destEmoji}
          </div>
          <button className="save-btn" onClick={() => saved ? removeFlight(offer.id) : saveFlight(offer)}>
            {saved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Route display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', color: '#e2e8f0' }}>
              {fromCode}
            </div>
            <div style={{ fontSize: 11, color: '#2d3748' }}>{formatTime(depDate)}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #1a2035, #2a3a6e)' }} />
            <span style={{ fontSize: 14, color: '#3b5fc0' }}>✈</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #2a3a6e, #1a2035)' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', color: '#e2e8f0' }}>
              {toCode}
            </div>
            <div style={{ fontSize: 11, color: '#2d3748' }}>{formatTime(arrDate)}</div>
          </div>
        </div>

        {/* Return leg (if round trip) */}
        {returnLeg && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '8px 10px', background: 'rgba(30,58,138,0.12)', borderRadius: 8, border: '1px solid #1a2035' }}>
            <span style={{ fontSize: 11, color: '#4a5568' }}>Return</span>
            <span style={{ fontSize: 11, color: '#4a5568' }}>{parseDuration(returnLeg.duration)}</span>
            <span style={{ fontSize: 11, color: '#4a5568' }}>
              {returnLeg.segments.length - 1 === 0 ? 'Non-stop' : `${returnLeg.segments.length - 1} stop(s)`}
            </span>
          </div>
        )}

        <div className="gh-divider" />

        {/* Info pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {depDate && (
            <span className="info-pill">📅 {formatDate(depDate)}</span>
          )}
          <span className="info-pill">✈️ {carrierName || carrierCode}</span>
          <span className="info-pill">{parseDuration(outbound?.duration)}</span>
          {stops === 0 ? (
            <span className="info-pill" style={{ color: '#6389ff', borderColor: '#1e3a8a', background: 'rgba(30,58,138,0.15)' }}>
              {stopLabel}
            </span>
          ) : (
            <span className="info-pill">{stopLabel}</span>
          )}
          {offer.numberOfBookableSeats && offer.numberOfBookableSeats <= 4 && (
            <span className="info-pill" style={{ color: '#f87171', borderColor: '#2d1515', background: '#150d0d' }}>
              🔴 {offer.numberOfBookableSeats} seats left
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-1px', lineHeight: 1 }}>
              {currency === 'PHP' ? '₱' : currency}{price.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#2d3748', marginTop: 3 }}>per person · all fees</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="alert-btn" onClick={() => setShowAlert(true)}>🔔 Alert me</button>
            <button
              className="book-btn"
              onClick={() => saved ? removeFlight(offer.id) : saveFlight(offer)}
            >
              {saved ? '❤️ Saved' : 'Save Deal →'}
            </button>
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertModal
          offer={offer}
          fromCode={fromCode}
          toCode={toCode}
          price={price}
          currency={currency}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}
