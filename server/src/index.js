require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flightRoutes = require('./routes/flights');
const subscribeRoutes = require('./routes/subscribe');
const alertsRoutes = require('./routes/alerts');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'GalaHunter', timestamp: new Date().toISOString() });
});

app.use('/api/flights', flightRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/alerts', alertsRoutes);
app.use(errorHandler);

// Only start the HTTP server when running locally (not on Vercel serverless)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`✈️  GalaHunter server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
