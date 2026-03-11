const express = require('express');
const router = express.Router();
const { searchFlights, getCalendar, getPopular } = require('../services/travelpayoutsService');

// GET /api/flights/search
// Query: { originLocationCode, destinationLocationCode, departureDate, returnDate?,
//          adults?, currencyCode? }
router.get('/search', async (req, res, next) => {
  try {
    const { originLocationCode, destinationLocationCode, departureDate } = req.query;

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        detail: 'originLocationCode, destinationLocationCode, and departureDate are required',
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
