const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
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
  bookingDate: {
    type: Date,
    default: Date.now
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: [
    'requires_payment_method',
    'requires_confirmation',
    'requires_action',
    'processing',
    'requires_capture',
    'canceled',
    'succeeded'],
    default: 'pending'
  },
  refundedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Booking', BookingSchema);