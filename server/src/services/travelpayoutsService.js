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

// Convert minutes to ISO 8601 duration string (e.g. 160 → "PT2H40M")
function minutesToIso(mins) {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `PT${h > 0 ? h + 'H' : ''}${m > 0 ? m + 'M' : ''}`;
}

// Normalize /v1/prices/cheap response to shared offer shape
function normalizeOffers(origin, destination, destData, currency, departDate, passengers) {
  if (!destData || typeof destData !== 'object') return [];

  return Object.entries(destData).map(([idx, offer]) => {
    const depAt = offer.departure_at || `${departDate}T00:00:00`;
    const stops = offer.transfers ?? 0;

    const segments = [
      {
        departure: { iataCode: origin, at: depAt },
        arrival:   { iataCode: destination, at: offer.return_at || '' },
        carrierCode: offer.airline || '',
        number: String(offer.flight_number || ''),
      },
    ];
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

// Normalize /v2/prices/latest response to shared offer shape
const CABIN_MAP = { 0: 'ECONOMY', 1: 'BUSINESS', 2: 'FIRST' };

function normalizePopularOffer(item, passengers = 1) {
  const { origin, destination, depart_date, value, duration, number_of_changes, trip_class, airline } = item;
  const stops = number_of_changes ?? 0;

  const segments = [
    {
      departure: { iataCode: origin, at: depart_date ? `${depart_date}T00:00:00` : '' },
      arrival:   { iataCode: destination, at: '' },
      carrierCode: airline || '',
      number: '',
    },
    ...Array(stops).fill({ departure: {}, arrival: {}, carrierCode: '', number: '' }),
  ];

  return {
    id: `popular-${origin}-${destination}-${depart_date}`,
    price: { total: String(value), currency: 'PHP' },
    itineraries: [{ duration: minutesToIso(duration), segments }],
    travelClass: CABIN_MAP[trip_class] ?? 'ECONOMY',
    numberOfBookableSeats: null,
    bookingUrl: buildBookingUrl(origin, destination, depart_date, passengers),
  };
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

  const offers = (data.data || []).map((item) => normalizePopularOffer(item));
  const result = { data: offers, dictionaries: {}, cachedAt: Date.now() };
  cache.set(cacheKey, result);
  return result;
}

module.exports = { searchFlights, getCalendar, getPopular };
