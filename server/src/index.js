require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flightRoutes = require('./routes/flights');
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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✈️  GalaHunter server running on http://localhost:${PORT}`);
});
