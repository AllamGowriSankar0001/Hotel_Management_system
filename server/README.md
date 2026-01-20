# Backend (Server)

Express + MongoDB backend for the Hotel Management System.

## Requirements

- Node.js (LTS recommended)
- npm
- MongoDB (local or Atlas)

## Setup (local)

```bash
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODBURL=mongodb://127.0.0.1:27017/hotel_management
JWT_SECRET=change_me
```

## Run

Development (nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on: `http://localhost:5000`

## Notes

- Don’t commit `server/.env`.
- Ensure `node_modules/` is ignored in Git.


