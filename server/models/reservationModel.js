
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    guestPhone: {
      type: String,
      required: true,
      trim: true,
    },

    checkInDate: {
      type: Date,
      required: true,
      default: Date.now()
    },

    checkOutDate: {
      type: Date,
      required: false,
      default: ''
    },

    status: {
      type: String,
      enum: [
        "CHECKED_IN",
        "CHECKED_OUT","cleaning_needed"],
      default: "CHECKED_IN",
    },
     StayTime: {
        type: String,
        enum: ['12h', '24h', 'custom'],
        required: true
        
    },
    customHours: {
        type: Number,
        default: 0
    },
    charge: {
        type: Number,
        default: 0
    },
    roomNo: {
      type:String,
      required: true,
    }
  }, {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);