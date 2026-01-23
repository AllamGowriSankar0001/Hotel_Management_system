const express = require('express');
const router = express.Router();
const Cleaning = require('../models/cleaningModel');
const Room = require('../models/roomsModel');
const authorizeRoles = require('../middleware/authorizeRoles');
const verifyToken = require('../middleware/verifytoken');

// Gets all cleaning tasks in the system
router.get('/allcleanings', async (req, res) => {
    const cleanings = await Cleaning.find();
    res.status(200).json(cleanings);
})

// Starts a cleaning task for a room and assigns a cleaner (admin and reception only)
router.post(
  '/startcleaning/:roomNo',
  verifyToken,
  authorizeRoles('admin', 'reception'),
  async (req, res) => {
    try {
      const { roomNo } = req.params;
      const { assignedTo } = req.body;

      const cleaning = await Cleaning.findOneAndUpdate(
        { roomNo, status: 'cleaning_needed' },
        {
          status: 'IN_PROGRESS',
          assignedTo,
          assignedAt: new Date(),
        },
        { new: true }
      );

      if (!cleaning) {
        return res.status(404).json({ message: 'Cleaning not found or already started' });
      }

      await Room.findOneAndUpdate(
        { roomNo },
        { status: 'under_maintenance' }
      );

      res.status(200).json(cleaning);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Marks a cleaning task as completed and sets room status to available (admin and reception only)
router.post('/completecleaning/:roomNo', verifyToken, authorizeRoles('admin','reception'), async (req, res) => {
    try{
        const { roomNo } = req.params;
        const cleaningRecord = await Cleaning.findOne({ roomNo: roomNo, status: 'IN_PROGRESS' }).sort({createdAt:-1});
        if(!cleaningRecord){
            return res.status(404).json({ message: 'Cleaning record not found' });
        }
        cleaningRecord.status = 'COMPLETED';
        cleaningRecord.completedAt = new Date();
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
