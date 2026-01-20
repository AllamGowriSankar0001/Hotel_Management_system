const express = require('express');
const router = express.Router();
const Room = require('../models/roomsModel');  
const Reservation = require('../models/reservationModel'); 
const authorizeRoles = require('../middleware/authorizeRoles');

router.get("/getallreservations",async(req,res)=>{
    try{
        const reservations = await Reservation.find();
        res.status(200).json({message:'All reservations fetch',Allreservation:reservations})
    }
    catch(err){
        res.status(400).json({messgae:err.message})
    }
})
router.post('/roomreservation/:roomNo', async (req, res) => {
    try {
        const { guestName, guestPhone, status, StayTime, customHours   } = req.body;
        const room = await Room.findOne({ roomNo: req.params.roomNo });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.status !== 'available') {
            return res.status(400).json({ message: 'Room is not available' });
        }
        if (StayTime === 'custom' && !customHours) {
            return res.status(400).json({ message: 'customHours must be provided when StayTime is custom' });
        }
        function chargeCalculate(roomType, StayTime, customHours) {
            const baseCharge = {
                'single': 500,
                'double': 980,
                'suite': 1500
            };
            let totalCharge = 0;

            switch (StayTime.toLowerCase()) {  
                case '12h':
                    totalCharge = baseCharge[roomType] + (baseCharge[roomType] * 0.18);
                    break;
                case '24h':
                    totalCharge = baseCharge[roomType] * 2 + (baseCharge[roomType] * 0.18);  
                    break;
                case 'custom':
                    totalCharge = (baseCharge[roomType] * (customHours / 12)) + (totalCharge[roomType] * 0.18); 
                    break;
                default:
                    throw new Error('Invalid StayTime');
            }
            return totalCharge;
        }
        const totalCharge = chargeCalculate(room.roomType, StayTime, customHours);
        const reservationStatus = status || 'CHECKED_IN';
        const createReservation = await Reservation.create({
            guestName,
            guestPhone,
            status: reservationStatus,
            StayTime,
            customHours: StayTime === 'custom' ? customHours : undefined,  
            roomNo: room.roomNo, 
            charge: totalCharge
        });
        room.status = 'occupied';
        await room.save();
        res.status(201).json({ message: 'Room reserved successfully', reservation: createReservation });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// Checkout route - INLINE to ensure it works
router.put('/checkout/:roomNo', async (req, res) => {
    try {
        const roomNo = String(req.params.roomNo).trim();

        // Handle both string and numeric stored roomNo
        const room =
            (await Room.findOne({ roomNo })) ||
            (await Room.findOne({ roomNo: Number(roomNo) }));
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Grab latest reservation regardless of stored type (string/number)
        const reservation =
            (await Reservation.findOne({ roomNo }).sort({ createdAt: -1 })) ||
            (await Reservation.findOne({ roomNo: Number(roomNo) }).sort({ createdAt: -1 }));

        if (!reservation) {
            return res.status(404).json({ message: `No reservation found for room ${roomNo}` });
        }

        if (reservation.status === 'CHECKED_OUT') {
            return res.status(400).json({ message: 'Already checked out' });
        }

        room.status = 'cleaning_needed';
        await room.save();

        reservation.status = 'CHECKED_OUT';
        await reservation.save();

        res.status(200).json({
            message: 'Checkout successful',
            roomStatus: room.status,
            reservationStatus: reservation.status
        });

    } catch (err) {
        console.error('❌ Checkout error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/update/reservation/:guestPhone',authorizeRoles('admin','reception'), async (req, res) => {
    try {
        const { guestName, guestPhone, roomNo, charge, StayTime, customHours } = req.body;
        const reservation = await Reservation.findOne({ guestPhone: req.params.guestPhone }).sort({createdAt:-1});
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        const room = await Room.findOne({ roomNo: reservation.roomNo });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const roomType = room.roomType; 
        if (StayTime === 'custom' && !customHours) {
            return res.status(400).json({ message: 'customHours must be provided when StayTime is custom' });
        }
        function chargeCalculate(roomType, StayTime, customHours) {
            const baseCharge = {
                'single': 500,
                'double': 980,
                'suite': 1500
            };

            let totalCharge = 0;

            switch (StayTime.toLowerCase()) {
                case '12h':
                    totalCharge = baseCharge[roomType] + (baseCharge[roomType] * 0.18);
                    break;
                case '24h':
                    totalCharge = baseCharge[roomType] * 2 + (baseCharge[roomType] * 0.18);
                    break;
                case 'custom':
                    totalCharge = (baseCharge[roomType] * (customHours / 12)) + (baseCharge[roomType] * 0.18);
                    break;
                default:
                    throw new Error('Invalid StayTime');
            }
            return totalCharge;
        }
        let totalCharge = chargeCalculate(roomType, StayTime, customHours);
        if (roomNo && roomNo !== reservation.roomNo) {
            const newRoom = await Room.findOne({ roomNo });
            if (newRoom) {
                const newRoomType = newRoom.roomType;
                totalCharge = chargeCalculate(newRoomType, StayTime, customHours); 
            }
        }
        if (guestName) reservation.guestName = guestName;
        if (guestPhone) reservation.guestPhone = guestPhone;
        if (roomNo) reservation.roomNo = roomNo;
        if (charge) reservation.charge = totalCharge; 
        if (StayTime) reservation.StayTime = StayTime;
        await reservation.save();
        res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


router.delete('/update/reservation/:guestPhone',authorizeRoles('admin'), async(req,res)=>{
    try{
        const reservation =  await Reservation.findOneAndDelete({ guestPhone: req.params.guestPhone });
        if(!reservation){
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully', reservation });

    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
