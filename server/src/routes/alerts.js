const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const FILE = path.join(__dirname, '../../data/alerts.json');

async function read() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { return []; }
}
async function write(data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

// GET /api/alerts
router.get('/', async (req, res, next) => {
  try {
    res.json(await read());
  } catch (err) {
    next(err);
  }
});

// POST /api/alerts  { origin, destination?, email }
router.post('/', async (req, res, next) => {
  try {
    const { origin, email } = req.body;
    if (!origin || !email) {
      return res.status(400).json({ error: 'origin and email are required.' });
    }

    const alerts = await read();
    alerts.push({
      id: Date.now().toString(),
      origin,
      destination: req.body.destination || null,
      email,
      createdAt: new Date().toISOString(),
      active: true,
    });
    await write(alerts);
    res.status(201).json({ message: 'Alert created!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
