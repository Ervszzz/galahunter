# GalaHunter ✈️

Flight promo discovery and alert platform for Filipino travelers. Find seat sales, set route alerts, and book directly with your airline.

## Project Structure

```
galahunter/
├── client/   # React + Vite frontend
└── server/   # Node.js + Express backend
```

## Local Development

### 1. Get TravelPayouts credentials

1. Sign up at [travelpayouts.com](https://travelpayouts.com)
2. Go to **Programs → Flight tickets** and join the Aviasales program
3. Your **Token** is at **Account → API → Token**
4. Your **Marker** (affiliate ID) is shown in the dashboard

### 2. Configure environment

**Backend** — copy root `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Edit `server/.env`:
```
TRAVELPAYOUTS_TOKEN=your_token_here
TRAVELPAYOUTS_MARKER=your_marker_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy `client/.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
`client/.env` (leave as-is for local dev):
```
VITE_API_URL=http://localhost:5000
```

### 3. Install & run

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/flights/search` | Cheapest tickets for a route & date |
| `GET /api/flights/calendar` | Cheapest fares per day in a month |
| `GET /api/flights/popular` | Latest prices from Manila |
| `POST /api/subscribe` | Subscribe email to newsletter |
| `POST /api/alerts` | Create a promo alert for a route |
| `GET /api/alerts` | List all promo alerts |

Responses are cached for **10 minutes** to avoid rate limits.

---

## Deploying the Backend to Railway

1. Push this repo to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Select this repository and set the **Root Directory** to `server`.
4. Railway detects `railway.json` and builds with Nixpacks automatically.
5. Under **Variables**, add:

   | Key | Value |
   |-----|-------|
   | `TRAVELPAYOUTS_TOKEN` | your TravelPayouts API token |
   | `TRAVELPAYOUTS_MARKER` | your TravelPayouts affiliate marker |
   | `FRONTEND_URL` | your Vercel frontend URL (e.g. `https://galahunter.vercel.app`) |

6. After deploy, copy the Railway public URL (e.g. `https://galahunter-production.up.railway.app`).

---

## Deploying the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo.
2. Set **Root Directory** to `client`.
3. Vercel auto-detects Vite. Confirm build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | your Railway backend URL (e.g. `https://galahunter-production.up.railway.app`) |

5. Deploy. The `client/vercel.json` handles SPA routing automatically.

---

## Environment Variable Reference

### Backend (Railway / `server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `TRAVELPAYOUTS_TOKEN` | Yes | API token from TravelPayouts dashboard |
| `TRAVELPAYOUTS_MARKER` | Yes | Affiliate marker ID |
| `PORT` | No | Port to listen on (Railway injects this automatically) |
| `FRONTEND_URL` | Yes (production) | Vercel frontend URL for CORS allowlist |

### Frontend (Vercel / `client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes (production) | Full Railway backend URL — no trailing slash |
