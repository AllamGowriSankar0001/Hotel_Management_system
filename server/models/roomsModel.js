const mongoose = require('mongoose');
const { maxHeaderSize } = require('node:http');

const roomSchema = new mongoose.Schema({
    roomNo: {
        type: String,
        required: true,
        maxlength: 3,
        unique: true
    },
    floor: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        enum: ['single', 'double', 'suite'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'cleaning_needed', 'under_maintenance'],
        required: true,
        default: 'available'
    }
   
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
