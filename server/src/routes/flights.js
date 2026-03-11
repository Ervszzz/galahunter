const express = require('express');
const axios = require('axios');
const router = express.Router();
const { searchFlights, getCalendar, getPopular } = require('../services/travelpayoutsService');

// GET /api/flights/airports?term=manila
// Proxies TravelPayouts Places2 autocomplete (no auth required)
router.get('/airports', async (req, res, next) => {
  try {
    const { term } = req.query;
    if (!term || term.length < 2) return res.json([]);

    const { data } = await axios.get(
      `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(term)}&locale=en&types[]=city&types[]=airport&limit=7`
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/flights/search
// Query: { originLocationCode, destinationLocationCode, departureDate?(optional),
//          returnDate?, adults?, currencyCode? }
router.get('/search', async (req, res, next) => {
  try {
    const { originLocationCode, destinationLocationCode } = req.query;

    if (!originLocationCode || !destinationLocationCode) {
      return res.status(400).json({
        error: 'Missing required fields',
        detail: 'originLocationCode and destinationLocationCode are required',
      });
    }

    const data = await searchFlights(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/flights/calendar
// Query: { origin, destination, month (YYYY-MM), currency? }
router.get('/calendar', async (req, res, next) => {
  try {
    const { origin, destination, month } = req.query;

    if (!origin || !destination || !month) {
      return res.status(400).json({
        error: 'Missing required fields',
        detail: 'origin, destination, and month (YYYY-MM) are required',
      });
    }

    const data = await getCalendar(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/flights/popular
// Query: { origin? (default MNL), currency? }
router.get('/popular', async (req, res, next) => {
  try {
    const data = await getPopular(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
