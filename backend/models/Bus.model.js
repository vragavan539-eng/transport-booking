const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  station: String,
  arrivalTime: String,
  departureTime: String,
  day: { type: Number, default: 0 }
}, { _id: false });

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  busName: { type: String, required: true },
  operator: { type: String, required: true },
  busType: {
    type: String,
    enum: ['Sleeper', 'Semi-Sleeper', 'Seater', 'AC Sleeper', 'AC Seater', 'Volvo AC'],
    required: true
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  totalSeats: { type: Number, required: true, default: 40 },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  stops: [stopSchema],
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before departure'
  },
  isActive: { type: Boolean, default: true },
  date: { type: Date, required: true }
}, { timestamps: true });

busSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Bus', busSchema);
