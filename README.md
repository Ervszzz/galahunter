# GalaHunter ✈️

Flight deals web app for Filipino travelers. Powered by [TravelPayouts](https://travelpayouts.com).

## Setup

### 1. Get TravelPayouts credentials

1. Sign up at [travelpayouts.com](https://travelpayouts.com)
2. Go to **Programs → Flight tickets** and join the Aviasales program
3. Your **Token** is at **Account → API → Token**
4. Your **Marker** (affiliate ID) is shown in the dashboard — it's a numeric ID like `12345`

### 2. Configure environment

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```
TRAVELPAYOUTS_TOKEN=your_token_here
TRAVELPAYOUTS_MARKER=your_marker_here
PORT=3001
```

### 3. Install & run

```bash
npm run install:all
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3001`.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/flights/search` | Cheapest tickets for a route & date |
| `GET /api/flights/calendar` | Cheapest fares per day in a month |
| `GET /api/flights/popular` | Latest prices from Manila |

Responses are cached for **10 minutes** to avoid rate limits.

## Affiliate links

"Book Now" buttons link to Aviasales with your `MARKER` appended as an affiliate parameter. You earn commission on completed bookings made through these links.

> **Note:** Booking links are affiliate links via the TravelPayouts / Aviasales partner program.
