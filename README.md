# Hotel Management System

Full‑stack hotel management web app with a **React (Vite)** frontend and a **Node.js (Express) + MongoDB (Mongoose)** backend.

## Project structure

- `client/` — Frontend (React + Vite)
- `server/` — Backend (Express API)

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local or MongoDB Atlas)

## Quick start (local)

### 1) Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODBURL=mongodb://127.0.0.1:27017/hotel_management
JWT_SECRET=change_me
```

Run the API:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2) Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Scripts

### Frontend (`client/`)

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

### Backend (`server/`)

- `npm run dev` — start with nodemon
- `npm start` — start with node

## Environment variables

Backend (`server/.env`):

- `PORT` — API port (example: `5000`)
- `MONGODBURL` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret

## Notes for GitHub

- Make sure `node_modules/` is not committed (both `client/` and `server/`).
- Do not commit `server/.env` (store secrets locally).


