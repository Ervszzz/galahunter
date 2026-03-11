const axios = require('axios');

const AMADEUS_BASE = 'https://test.api.amadeus.com';
const TOKEN_URL = `${AMADEUS_BASE}/v1/security/oauth2/token`;
const FLIGHT_OFFERS_URL = `${AMADEUS_BASE}/v2/shopping/flight-offers`;
const FLIGHT_DATES_URL = `${AMADEUS_BASE}/v1/shopping/flight-dates`;

// In-memory token cache — module is a singleton in Node.js
let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  // Reuse token if it has more than 60 seconds left
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_CLIENT_ID,
    client_secret: process.env.AMADEUS_CLIENT_SECRET,
  });

  const response = await axios.post(TOKEN_URL, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  cachedToken = response.data.access_token;
  // expires_in is in seconds
  tokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

async function searchFlights(params) {
  const token = await getAccessToken();

  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults = 1,
    travelClass = 'ECONOMY',
    nonStop = false,
    max = 20,
    currencyCode = 'PHP',
  } = params;

  const queryParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    travelClass,
    nonStop,
    max,
    currencyCode,
  };

  if (returnDate) queryParams.returnDate = returnDate;

  const response = await axios.get(FLIGHT_OFFERS_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: queryParams,
  });

  return response.data;
}

async function getCheapestDates(params) {
  const token = await getAccessToken();

  const {
    origin,
    destination,
    departureDate,
    oneWay = false,
    duration,
    nonStop = false,
    viewBy = 'DATE',
    currencyCode = 'PHP',
  } = params;

  const queryParams = {
    origin,
    destination,
    currencyCode,
    viewBy,
    oneWay,
    nonStop,
  };

  if (departureDate) queryParams.departureDate = departureDate;
  if (duration) queryParams.duration = duration;

  const response = await axios.get(FLIGHT_DATES_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: queryParams,
  });

  return response.data;
}

module.exports = { searchFlights, getCheapestDates };
