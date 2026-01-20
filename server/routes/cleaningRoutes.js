const express = require('express');
const router = express.Router();
const Cleaning = require('../models/cleaningModel');
const Room = require('../models/roomsModel');
const authorizeRoles = require('../middleware/authorizeRoles');
const verifyToken = require('../middleware/verifytoken');
// Create a cleaning record
router.get('/allcleanings', async (req, res) => {
    const cleanings = await Cleaning.find();
    res.status(200).json(cleanings);
})
router.post('/startcleaning/:roomNo', verifyToken, authorizeRoles('admin','reception'), async (req, res) => {
    const { roomNo,  assignedTo, status } = req.body;
    try {
        const cleaning = await Cleaning.create({
            roomNo,
            assignedTo,
            status:'IN_PROGRESS'
        });
        const room = await Room.findOne({ roomNo: roomNo });
        room.status = 'under_maintenance';
        await room.save();
        res.status(201).json(cleaning);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/completecleaning/:roomNo', verifyToken, authorizeRoles('admin','reception'), async (req, res) => {
    try{
        const { roomNo } = req.params;
        const cleaningRecord = await Cleaning.findOne({ roomNo: roomNo, status: 'IN_PROGRESS' }).sort({createdAt:-1});
        if(!cleaningRecord){
            return res.status(404).json({ message: 'Cleaning record not found' });
        }
        cleaningRecord.status = 'COMPLETED';
        await cleaningRecord.save();
        const room = await Room.findOne({ roomNo: roomNo });
        room.status = 'available';
        await room.save();
        res.status(200).json({ message: 'Cleaning completed successfully', cleaningRecord });
    
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})
module.exports = router;
