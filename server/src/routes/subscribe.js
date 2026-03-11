const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const FILE = path.join(__dirname, '../../data/subscribers.json');

async function read() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { return []; }
}
async function write(data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

// POST /api/subscribe  { email }
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address required.' });
    }

    const subscribers = await read();
    if (subscribers.find((s) => s.email === email)) {
      return res.json({ message: 'Already subscribed!' });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await write(subscribers);
    res.json({ message: 'Subscribed successfully!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
