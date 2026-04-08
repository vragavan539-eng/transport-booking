const mongoose = require('mongoose');

const trainStopSchema = new mongoose.Schema({
  station: String,
  stationCode: String,
  arrivalTime: String,
  departureTime: String,
  day: { type: Number, default: 0 },
  distance: Number
}, { _id: false });

const trainClassSchema = new mongoose.Schema({
  className: String,
  classCode: String,
  totalSeats: Number,
  availableSeats: Number,
  price: Number
}, { _id: false });

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  from: { type: String, required: true },
  fromCode: { type: String, required: true },
  to: { type: String, required: true },
  toCode: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  trainType: {
    type: String,
    enum: ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Duronto', 'Vande Bharat', 'Passenger'],
    required: true
  },
  classes: [trainClassSchema],
  stops: [trainStopSchema],
  runningDays: [String],
  rating: { type: Number, default: 4.0 },
  isActive: { type: Boolean, default: true },
  date: { type: Date, required: true }
}, { timestamps: true });

trainSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Train', trainSchema);
