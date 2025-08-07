const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  trainer: {
    type: String
  },
  price: {
    type: Number,
    default: 100
  }
});

module.exports = mongoose.model('Slot', SlotSchema);
