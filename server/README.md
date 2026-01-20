# Hotel Management System — Backend

This folder contains the backend (Express + MongoDB) for the Hotel Management System.

## Requirements
- Node.js (>= 16)
- MongoDB (connection URI)

## Environment
Create a `.env` file in `server/` with at minimum:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

## Install & Run

```bash
cd server
npm install
# development
npm run dev
# or
node index.js
```

## API Base URL
http://localhost:3000/api

## 👤 USER ENDPOINTS

GET     http://localhost:3000/api/users/allusers
GET     http://localhost:3000/api/users/role/:role
GET     http://localhost:3000/api/users/user/:id
POST    http://localhost:3000/api/users/createuser
PUT     http://localhost:3000/api/users/updateuser/:id
PUT     http://localhost:3000/api/users/updatepassword/:id
POST    http://localhost:3000/api/users/login
DELETE  http://localhost:3000/api/users/deleteuser/:id

## 🏨 ROOM ENDPOINTS

POST    http://localhost:3000/api/rooms/createrooms
GET     http://localhost:3000/api/rooms/allrooms
GET     http://localhost:3000/api/rooms/type/:roomType
GET     http://localhost:3000/api/rooms/room/:roomNo
GET     http://localhost:3000/api/rooms/floor/:floor
PUT     http://localhost:3000/api/rooms/updateroom/:roomNo

## 📅 RESERVATION ENDPOINTS

POST    http://localhost:3000/api/reservations/roomreservation/:roomNo
PUT     http://localhost:3000/api/reservations/update/reservation/:guestPhone
PUT     http://localhost:3000/api/reservations/checkout/reservation/:guestPhone
DELETE  http://localhost:3000/api/reservations/update/reservation/:guestPhone

## 🧹 CLEANING ENDPOINTS

GET     http://localhost:3000/api/cleanings/allcleanings
POST    http://localhost:3000/api/cleanings/startcleaning
POST    http://localhost:3000/api/cleanings/completecleaning

---

Notes
- Some endpoints require authorization middleware (JWT + role checks).
- Adjust `PORT` or base URL as needed in `.env`.

Next steps: I can convert these endpoints into Swagger/OpenAPI, generate a Postman collection, or tweak this README if you want.