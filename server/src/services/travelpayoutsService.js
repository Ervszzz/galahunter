const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10-minute cache

const TP_BASE = 'https://api.travelpayouts.com';
const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const MARKER = process.env.TRAVELPAYOUTS_MARKER;

// Build TravelPayouts affiliate booking URL
// Date format: DDMM (e.g. 0115 for Jan 15)
function buildBookingUrl(origin, destination, departDate, passengers = 1) {
  if (!departDate) return null;
  const [, month, day] = departDate.split('-');
  return `https://www.aviasales.com/search/${origin}${day}${month}${destination}${passengers}?marker=${MARKER}`;
}

// Normalize TravelPayouts /v1/prices/cheap response to Amadeus-compatible shape
// so all frontend components work without changes
function normalizeOffers(origin, destination, destData, currency, departDate, passengers) {
  if (!destData || typeof destData !== 'object') return [];

  return Object.entries(destData).map(([idx, offer]) => {
    const depAt = offer.departure_at || `${departDate}T00:00:00`;
    const stops = offer.transfers ?? 0;

    // Build minimal segments array (1 segment per offer from TP cheap API)
    const segments = [
      {
        departure: { iataCode: origin, at: depAt },
        arrival:   { iataCode: destination, at: offer.return_at || '' },
        carrierCode: offer.airline || '',
        number: String(offer.flight_number || ''),
      },
    ];

    // Add a placeholder stop segment so stop count displays correctly
    for (let i = 0; i < stops; i++) {
      segments.push({ departure: {}, arrival: {}, carrierCode: '', number: '' });
    }

    return {
      id: `${origin}-${destination}-${idx}-${offer.departure_at || departDate}`,
      price: { total: String(offer.price), currency },
      itineraries: [{ duration: '', segments }],
      numberOfBookableSeats: null,
      bookingUrl: buildBookingUrl(origin, destination, depAt.split('T')[0], passengers),
    };
  });
}

async function searchFlights({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults = 1,
  currencyCode = 'PHP',
}) {
  const cacheKey = `search:${originLocationCode}:${destinationLocationCode}:${departureDate}:${returnDate}:${currencyCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const params = {
    origin:      originLocationCode,
    destination: destinationLocationCode,
    depart_date: departureDate,
    currency:    currencyCode,
    token:       TOKEN,
  };
  if (returnDate) params.return_date = returnDate;

  const { data } = await axios.get(`${TP_BASE}/v1/prices/cheap`, { params });

  if (!data.success) throw new Error(data.error || 'TravelPayouts API error');

  const destData = data.data?.[destinationLocationCode] || {};
  const offers = normalizeOffers(
    originLocationCode,
    destinationLocationCode,
    destData,
    data.currency || currencyCode,
    departureDate,
    Number(adults),
  );

  const result = { data: offers, dictionaries: {}, cachedAt: Date.now() };
  cache.set(cacheKey, result);
  return result;
}

async function getCalendar({ origin, destination, month, currency = 'PHP' }) {
  const cacheKey = `calendar:${origin}:${destination}:${month}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${TP_BASE}/v1/prices/calendar`, {
    params: { origin, destination, month, currency, token: TOKEN },
  });

  const result = { data, cachedAt: Date.now() };
  cache.set(cacheKey, result);
  return result;
}

async function getPopular({ origin = 'MNL', currency = 'PHP', limit = 30 } = {}) {
  const cacheKey = `popular:${origin}:${currency}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${TP_BASE}/v2/prices/latest`, {
    params: { origin, currency, token: TOKEN, limit },
  });

  const result = { data, cachedAt: Date.now() };
  cache.set(cacheKey, result);
  return result;
}

module.exports = { searchFlights, getCalendar, getPopular };
