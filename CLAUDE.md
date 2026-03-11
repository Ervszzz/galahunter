# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

For every change request — no matter how small — follow this flow:

1. **Sync `main` first** — always run `git checkout main && git pull origin main` before creating a branch to avoid conflicts
2. **Create a branch** off `main` using these prefixes: `feat/`, `fix/`, `chore/`, `refactor/` — e.g. `feat/cheapest-dates-ui`, `fix/token-refresh-bug`
3. **Make the changes** and commit them to that branch
4. **Push and open a PR** targeting `main` using `gh pr create`
5. **Return the PR URL** at the end of your response

Use kebab-case for the feature name, keep it concise (2–4 words max).

## Commands

### Development
```bash
npm run dev              # Start both frontend (port 5173) and backend (port 3001) concurrently
npm run dev:server       # Backend only
npm run dev:client       # Frontend only
npm run install:all      # Install deps for root + server + client in one shot
```

### Client
```bash
cd client && npm run build    # Production build (outputs to client/dist/)
cd client && npm run preview  # Preview the production build locally
```

### Backend
```bash
cd server && npm start        # Production start (no file watching)
```

## Architecture

### Monorepo Layout
- `server/` — Node.js/Express API, never imported by the client
- `client/` — React + Vite SPA, talks only to `/api/*` endpoints
- Root `package.json` uses `concurrently` to run both; no shared code between the two

### Frontend Data Flow
```
pages/ → hooks/ → services/flightService.js → /api (Vite proxy) → Express
```
- **`services/flightService.js`** is the single Axios integration point. All backend calls go through here.
- **`context/AppContext.jsx`** holds global state (saved flights, price alerts) and syncs to `localStorage`. Pages consume it via `useSavedFlights` and `useAlerts` hooks which are thin wrappers around `useApp()`.
- **`useFlightSearch`** is the only hook with local async state (form, results, loading, error). It lives entirely in the Home page scope.
- Vite's proxy (`/api` → `http://localhost:3001`) means no hardcoded backend URLs exist in frontend code.

### Backend Structure
- **`amadeusService.js`** manages Amadeus OAuth2 tokens in-memory (module-level variables). Tokens are cached and refreshed automatically when within 60 seconds of expiry — no DB or Redis needed.
- Routes are thin: they validate required fields, delegate to `amadeusService`, and pass errors to the global `errorHandler` middleware.
- CORS is restricted to `localhost:5173` and `localhost:4173` (Vite preview).

### State Persistence
Saved flights and alerts are stored in `localStorage` under keys `galahunter_saved` and `galahunter_alerts`. There is no database.

## Environment Setup

Copy `.env.example` to `server/.env` before starting the server:
```
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
PORT=3001
```
Get free test API keys at https://developers.amadeus.com (Self-Service Workspace → Create new app).

## Key Amadeus API Details

| Endpoint | Method | Used for |
|---|---|---|
| `/v1/security/oauth2/token` | POST | OAuth2 client_credentials token |
| `/v2/shopping/flight-offers` | GET | Flight search results |
| `/v1/shopping/flight-dates` | GET | Cheapest fare dates |

Flight offer responses include a `data[]` array and a `dictionaries` object (carrier names, aircraft codes). Both are passed down to `FlightCard` for display.
