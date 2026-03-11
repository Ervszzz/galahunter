import { useSavedFlights } from '../hooks/useSavedFlights';

function parseDuration(iso = '') {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}h` : '';
  const m = match[2] ? `${match[2]}m` : '';
  return [h, m].filter(Boolean).join(' ') || iso;
}

function formatTime(isoDateTime) {
  if (!isoDateTime) return '--:--';
  return new Date(isoDateTime).toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(isoDateTime) {
  if (!isoDateTime) return '';
  return new Date(isoDateTime).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  });
}

function ItineraryRow({ itinerary, label }) {
  const segments = itinerary.segments || [];
  const first = segments[0];
  const last = segments[segments.length - 1];
  const stops = segments.length - 1;

  const isReturn = label === 'Return';

  return (
    <div className="rounded-xl px-4 py-3 bg-gh-bg border border-gh-border">
      <p className={`text-xs font-semibold mb-2 ${isReturn ? 'text-gh-muted' : 'text-gh-light'}`}>
        {label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="text-center min-w-[3.5rem]">
          <p className="text-lg font-bold text-gh-body leading-none">{formatTime(first?.departure?.at)}</p>
          <p className="text-sm font-semibold text-gh-body mt-0.5">{first?.departure?.iataCode}</p>
          <p className="text-xs text-gh-muted">{formatDate(first?.departure?.at)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center px-1">
          <p className="text-xs text-gh-muted">{parseDuration(itinerary.duration)}</p>
          <div className="relative w-full flex items-center my-0.5">
            <div className="flex-1 h-px bg-gh-border" />
            <span className="px-1 text-gh-accent text-xs">✈</span>
            <div className="flex-1 h-px bg-gh-border" />
          </div>
          <p className="text-xs text-gh-muted">
            {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="text-center min-w-[3.5rem]">
          <p className="text-lg font-bold text-gh-body leading-none">{formatTime(last?.arrival?.at)}</p>
          <p className="text-sm font-semibold text-gh-body mt-0.5">{last?.arrival?.iataCode}</p>
          <p className="text-xs text-gh-muted">{formatDate(last?.arrival?.at)}</p>
        </div>
      </div>
    </div>
  );
}

export default function FlightCard({ offer, dictionaries = {} }) {
  const { saveFlight, removeFlight, isFlightSaved } = useSavedFlights();
  const saved = isFlightSaved(offer.id);

  const outbound = offer.itineraries?.[0];
  const returnLeg = offer.itineraries?.[1];
  const firstSeg = outbound?.segments?.[0];
  const carrierCode = firstSeg?.carrierCode ?? '';
  const carrierName = dictionaries?.carriers?.[carrierCode] || carrierCode;

  const price = parseFloat(offer.price?.total ?? 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="card flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gh-body">{carrierName || 'Airline'}</p>
          <p className="text-xs text-gh-muted mt-0.5">
            {carrierCode} {firstSeg?.number}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gh-light">
            {offer.price?.currency} {price}
          </p>
          <p className="text-xs text-gh-muted">total · all fees</p>
        </div>
      </div>

      {/* Itineraries */}
      {outbound && <ItineraryRow itinerary={outbound} label="Outbound" />}
      {returnLeg && <ItineraryRow itinerary={returnLeg} label="Return" />}

      {/* Low seats warning */}
      {offer.numberOfBookableSeats && (
        <p className="badge-discount self-start">
          ⚡ {offer.numberOfBookableSeats} seat{offer.numberOfBookableSeats > 1 ? 's' : ''} left
        </p>
      )}

      {/* Actions */}
      <button
        onClick={() => (saved ? removeFlight(offer.id) : saveFlight(offer))}
        className={saved ? 'btn-secondary w-full' : 'btn-primary w-full'}
      >
        {saved ? '♥ Saved' : '♡ Save Deal'}
      </button>
    </div>
  );
}
