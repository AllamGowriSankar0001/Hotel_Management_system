const express = require('express');
const connectDB = require('./dbconnect');
const dotenv = require('dotenv').config();
const cors = require('cors')
const app = express();

const PORT = process.env.PORT
connectDB();
app.use(express.json());
app.use(cors())
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const cleaningRoutes = require('./routes/cleaningRoutes');
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/cleanings', cleaningRoutes);
app.listen(PORT,()=>{
    console.log(`The Server is running in the port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
}) 