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
 * Search for flight offers via POST /api/flights/search
 * @param {Object} params
 * @param {string} params.originLocationCode       IATA code, e.g. "MNL"
 * @param {string} params.destinationLocationCode  IATA code, e.g. "SIN"
 * @param {string} params.departureDate            YYYY-MM-DD
 * @param {string} [params.returnDate]             YYYY-MM-DD — omit for one-way
 * @param {number} [params.adults]                 default 1
 * @param {string} [params.travelClass]            ECONOMY|PREMIUM_ECONOMY|BUSINESS|FIRST
 * @param {boolean} [params.nonStop]               default false
 * @param {number} [params.max]                    max results, default 20
 * @param {string} [params.currencyCode]           default PHP
 */
export async function searchFlights(params) {
  const { data } = await api.post('/flights/search', params);
  return data;
}

/**
 * Get cheapest fare dates via GET /api/flights/cheapest
 * @param {Object} params
 * @param {string} params.origin       IATA code
 * @param {string} params.destination  IATA code
 * @param {boolean} [params.oneWay]
 * @param {string} [params.departureDate]  YYYY-MM-DD
 */
export async function getCheapestDates(params) {
  const { data } = await api.get('/flights/cheapest', { params });
  return data;
}
