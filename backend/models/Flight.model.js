const mongoose = require('mongoose');

const cabinClassSchema = new mongoose.Schema({
  className: String,
  classCode: { type: String, enum: ['Economy', 'Business', 'First'] },
  totalSeats: Number,
  availableSeats: Number,
  price: Number,
  baggage: String,
  cabinBaggage: String,
  meal: Boolean,
  refundable: Boolean
}, { _id: false });

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  airlineCode: { type: String, required: true },
  airlineLogo: { type: String, default: '' },
  from: { type: String, required: true },
  fromCode: { type: String, required: true },
  to: { type: String, required: true },
  toCode: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  stops: { type: Number, default: 0 },
  stopDetails: [{
    airport: String,
    layoverDuration: String
  }],
  cabinClasses: [cabinClassSchema],
  aircraft: { type: String, default: 'Boeing 737' },
  rating: { type: Number, default: 4.0 },
  isActive: { type: Boolean, default: true },
  date: { type: Date, required: true }
}, { timestamps: true });

flightSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Flight', flightSchema);
