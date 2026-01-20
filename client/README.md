# Frontend (Client)

React + Vite frontend for the Hotel Management System.

## Requirements

- Node.js (LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

App runs on: `http://localhost:5173`

## Build / Preview

```bash
npm run build
npm run preview
```

## Backend (local)

This frontend is expected to talk to a locally running backend, typically:

- API base URL: `http://localhost:5000`

If you need to change the API base URL, check where requests are made in `src/` (for example in `src/components/` or `src/services/`).
