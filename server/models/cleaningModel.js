const mongoose = require('mongoose');
const { type } = require('node:os');
const cleaningSchema = new mongoose.Schema(
  {
    roomNo: {
      type:String,
      required: true,
    },

    assignedTo: {
      type: String,
      default: null
      // required: true,
    },

    status: {
      type: String,
      enum: ["cleaning_needed", "IN_PROGRESS", "COMPLETED"],
      default: "cleaning_needed",
    },
    assignedAt:{
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

module.exports = mongoose.model('Cleaning', cleaningSchema);