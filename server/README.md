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
https://hotel-management-system-2spj.onrender.com/api

## 👤 USER ENDPOINTS

GET     https://hotel-management-system-2spj.onrender.com/api/users/allusers
GET     https://hotel-management-system-2spj.onrender.com/api/users/role/:role
GET     https://hotel-management-system-2spj.onrender.com/api/users/user/:id
POST    https://hotel-management-system-2spj.onrender.com/api/users/createuser
PUT     https://hotel-management-system-2spj.onrender.com/api/users/updateuser/:id
PUT     https://hotel-management-system-2spj.onrender.com/api/users/updatepassword/:id
POST    https://hotel-management-system-2spj.onrender.com/api/users/login
DELETE  https://hotel-management-system-2spj.onrender.com/api/users/deleteuser/:id

## 🏨 ROOM ENDPOINTS

POST    https://hotel-management-system-2spj.onrender.com/api/rooms/createrooms
GET     https://hotel-management-system-2spj.onrender.com/api/rooms/allrooms
GET     https://hotel-management-system-2spj.onrender.com/api/rooms/type/:roomType
GET     https://hotel-management-system-2spj.onrender.com/api/rooms/room/:roomNo
GET     https://hotel-management-system-2spj.onrender.com/api/rooms/floor/:floor
PUT     https://hotel-management-system-2spj.onrender.com/api/rooms/updateroom/:roomNo

## 📅 RESERVATION ENDPOINTS

POST    https://hotel-management-system-2spj.onrender.com/api/reservations/roomreservation/:roomNo
PUT     https://hotel-management-system-2spj.onrender.com/api/reservations/update/reservation/:guestPhone
PUT     https://hotel-management-system-2spj.onrender.com/api/reservations/checkout/reservation/:guestPhone
DELETE  https://hotel-management-system-2spj.onrender.com/api/reservations/update/reservation/:guestPhone

## 🧹 CLEANING ENDPOINTS

GET     https://hotel-management-system-2spj.onrender.com/api/cleanings/allcleanings
POST    https://hotel-management-system-2spj.onrender.com/api/cleanings/startcleaning
POST    https://hotel-management-system-2spj.onrender.com/api/cleanings/completecleaning

---

Notes
- Some endpoints require authorization middleware (JWT + role checks).
- Adjust `PORT` or base URL as needed in `.env`.

Next steps: I can convert these endpoints into Swagger/OpenAPI, generate a Postman collection, or tweak this README if you want.