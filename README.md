# LedgerWise

A personal finance app that connects to real bank accounts and shows your transactions in one place. Built for a small friends & family user base, with an architecture designed to scale.

**Stack:** React Native (Expo) · FastAPI · Supabase · Teller API

---

## What it does

- Connect your bank account via [Teller](https://teller.io) (supports 10,000+ US institutions)
- View all transactions across linked accounts in a single feed
- Works on web and iOS from the same codebase

## Project structure

```
├── backend/     FastAPI backend — Teller proxy, auth, database
└── frontend/    Expo app — runs as web app and iOS/Android
```

---

## Running locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- Teller credentials (App ID + certificate files) — ask the project owner

### 1. Set up credentials

Place the Teller certificate files in `backend/certs/`:
- `backend/certs/certificate.pem`
- `backend/certs/private_key.pem`

Create `backend/.env`:

```
TELLER_CERT_PATH=certs/certificate.pem
TELLER_KEY_PATH=certs/private_key.pem
TELLER_ENV=sandbox
CORS_ORIGINS=["http://localhost:8081"]
```

Create `frontend/.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_TELLER_APP_ID=your_teller_app_id_here
```

### 2. Install dependencies

```bash
make install
```

### 3. Run

```bash
make backend   # start the FastAPI server
make frontend  # start the Expo dev server
```

That's it — backend runs on `http://localhost:8000`, frontend on `http://localhost:8081`.

---

### Platform-specific notes

#### iOS simulator

```bash
make frontend
# Press 'i' to open in iOS simulator
```

> **iOS simulator tip:** Go to **I/O → Keyboard → disable "Connect Hardware Keyboard"** in the Simulator menu bar, otherwise typing in the Teller Connect login form will cause the page to refresh.

#### Physical phone

Your phone can't reach `localhost` — you need to use your Mac's local network IP instead.

1. Find your Mac's IP:
   ```bash
   ipconfig getifaddr en0
   ```

2. Update `frontend/.env`:
   ```
   EXPO_PUBLIC_API_URL=http://<your-mac-ip>:8000
   ```

3. Update `backend/.env` to add the IP to CORS origins:
   ```
   CORS_ORIGINS=["http://localhost:8081","http://<your-mac-ip>:8081"]
   ```

> Your Mac's local IP can change when you reconnect to WiFi. Re-run `ipconfig getifaddr en0` if it stops working.

### Teller sandbox credentials

When prompted by Teller Connect in sandbox mode, use:
- **Username:** `username`
- **Password:** `password`

---

## Deployment

- **Backend:** Railway — push to `main` and it auto-deploys
- **Frontend (web):** Vercel — push to `main` and it auto-deploys
- **Frontend (iOS):** EAS Build — `eas build --platform ios` (Phase 2)
