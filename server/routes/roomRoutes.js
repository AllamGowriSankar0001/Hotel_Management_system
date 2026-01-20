const express = require('express');
const router = express.Router();
const Room = require('../models/roomsModel');
const authorizeRoles = require('../middleware/authorizeRoles');
const { route } = require('./reservationRoutes');

//create multiple rooms with floors
router.post('/createrooms', async(req,res)=>{
        const createRooms = [];
        const {floor,rooms} = req.body;
        if(!floor || !rooms || !Array.isArray(rooms)){
            return res.status(400).json({ message: 'Floor and rooms array are required' });
        }
         
        try{
            for(const roomData of rooms){
                const {roomNo,roomType,status} = roomData;
                if(!roomNo || !roomType){
                    return res.status(400).json({ message: 'roomNo and roomType are required for each room' });
                }
                const room = await Room.create({
                    roomNo,
                    floor,
                    roomType,
                    status: status || 'available'
                });
                createRooms.push(room);
            }
            res.status(201).json({ message: 'Rooms created successfully', rooms: createRooms });
        }catch(err){
            res.status(500).json({ message: err.message });
        }
        
})
router.get('/allrooms', async(req,res)=>{
    try{
        const rooms =  await Room.find();
        res.status(200).json(rooms);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
router.get('/allfloors',async(req,res)=>{
    try{
        const floors = await Room.distinct("floor")
        res.status(200).json(floors)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})

router.get('/type/:roomType', async(req,res)=>{
    try{
        const rooms =  await Room.find({roomType: req.params.roomType});
        res.status(200).json(rooms);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})
router.get('/room/:roomNo', async(req,res)=>{
    try{
        const room =  await Room.findOne({roomNo: req.params.roomNo});
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }   
});
router.get('/floor/:floor', async(req,res)=>{
    try{
        const rooms =  await Room.find({floor: req.params.floor});
        res.status(200).json(rooms);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
router.put('/updateroom/:roomNo', async(req,res)=>{
    const {status} = req.body;
    try{
        const room =  await Room.findOne({roomNo: req.params.roomNo});
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }
        room.status = status;
        await room.save();
        res.status(200).json(room);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;