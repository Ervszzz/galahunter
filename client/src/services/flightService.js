import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Normalize error messages from the backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Search for cheap flights via GET /api/flights/search (TravelPayouts)
 * @param {Object} params
 * @param {string} params.originLocationCode       IATA code, e.g. "MNL"
 * @param {string} params.destinationLocationCode  IATA code, e.g. "SIN"
 * @param {string} params.departureDate            YYYY-MM-DD
 * @param {string} [params.returnDate]             YYYY-MM-DD — omit for one-way
 * @param {number} [params.adults]                 default 1
 * @param {string} [params.currencyCode]           default PHP
 * Returns: { data: [...offers], dictionaries: {}, cachedAt: timestamp }
 */
export async function searchFlights(params) {
  const { data } = await api.get('/flights/search', { params });
  return data;
}

/**
 * Get cheapest fares by day in a month via GET /api/flights/calendar
 * @param {Object} params
 * @param {string} params.origin       IATA code
 * @param {string} params.destination  IATA code
 * @param {string} params.month        YYYY-MM
 * @param {string} [params.currency]   default PHP
 */
export async function getCalendar(params) {
  const { data } = await api.get('/flights/calendar', { params });
  return data;
}

/**
 * Get popular/latest destinations from an origin via GET /api/flights/popular
 * @param {Object} [params]
 * @param {string} [params.origin]    IATA code, default MNL
 * @param {string} [params.currency]  default PHP
 */
export async function getPopular(params) {
  const { data } = await api.get('/flights/popular', { params });
  return data;
}

/**
 * Autocomplete airport/city search via GET /api/flights/airports
 * @param {string} term  — e.g. "Manila" or "Sin"
 * Returns array of { id, name, country_name, code, type }
 */
export async function searchAirports(term) {
  const { data } = await api.get('/flights/airports', { params: { term } });
  return data;
}
