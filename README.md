# Hotel Management System

Full-stack hotel management web app with a **React (Vite)** frontend and a **Node.js (Express) + MongoDB (Mongoose)** backend. It covers authentication, role-based access, room inventory, reservations, and cleaning workflows for hotel operations.

## What the project does

- Secure login with JWT
- Role-based permissions (admin, reception, cleaner, etc.)
- Manage rooms (create, list, update status, filter by floor/type)
- Handle reservations (create, update, checkout)
- Cleaning workflow (start/complete cleaning and update room status)
- Dashboard-style UI for daily hotel operations

## Tech stack

- Frontend: React, Vite, React Router, CSS
- Backend: Node.js, Express, JWT, Mongoose/MongoDB
- Tooling: npm, nodemon (dev), dotenv, bcrypt

## Folder structure

- `client/` — React frontend (Vite)
- `server/` — Express API + MongoDB models  
  - `routes/` — API route handlers  
  - `models/` — Mongoose schemas  
  - `middleware/` — auth/role checks  
  - `dbconnect.js` — Mongo connection helper  
  - `index.js` — API entry point  

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local or Atlas)

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

## Environment variables (backend)

- `PORT` — API port (example: `5000`)
- `MONGODBURL` — Mongo connection string
- `JWT_SECRET` — JWT signing secret

## API reference (local)

Base URL: `http://localhost:5000/api`

Authentication: Protected routes expect `Authorization: Bearer <token>`; JWT is issued by the login endpoint.

### Users (`/api/users`)
- `POST /login` — user login (returns JWT)
- `GET /verify` — validate token (protected)
- `GET /allusers` — list users
- `GET /role/:role` — list users by role (protected)
- `GET /user/:id` — get user by ID (protected)
- `POST /createuser` — create user (protected, admin)
- `PUT /updateuser/:id` — update user info (protected)
- `PUT /updatepassword/:id` — update password (protected)
- `DELETE /deleteuser/:id` — delete user (protected)

### Rooms (`/api/rooms`)
- `POST /createrooms` — bulk create rooms with floor info
- `GET /allrooms` — list all rooms
- `GET /allfloors` — list distinct floors
- `GET /type/:roomType` — list rooms by type
- `GET /room/:roomNo` — get room by number
- `GET /floor/:floor` — list rooms by floor
- `PUT /updateroom/:roomNo` — update room status

### Reservations (`/api/reservations`)
- `GET /getallreservations` — list reservations
- `POST /roomreservation/:roomNo` — create reservation for a room
- `PUT /checkout/:roomNo` — checkout and mark room cleaning-needed
- `PUT /update/reservation/:guestPhone` — update reservation by guest phone
- `DELETE /update/reservation/:guestPhone` — delete reservation by guest phone

### Cleaning (`/api/cleanings`)
- `GET /allcleanings` — list cleaning records
- `POST /startcleaning/:roomNo` — start cleaning (protected)
- `POST /completecleaning/:roomNo` — complete cleaning (protected)

