const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatNumber: String,
  idType: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'Driving License'] },
  idNumber: String
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    default: () => 'BK' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transportType: {
    type: String,
    enum: ['Bus', 'Train', 'Flight'],
    required: true
  },
  transportId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'transportType'
  },
  passengers: {
    type: [passengerSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one passenger required']
  },
  classType: String,
  from: { type: String, required: true },
  to: { type: String, required: true },
  journeyDate: { type: Date, required: true },
  departureTime: String,
  arrivalTime: String,
  totalFare: { type: Number, required: true },
  baseFare: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  convenienceFee: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Pending', 'Completed'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Refunded', 'Pending'],
    default: 'Paid'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    default: 'Credit Card'
  },
  cancellationReason: String,
  refundAmount: Number,
  contactEmail: String,
  contactPhone: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
