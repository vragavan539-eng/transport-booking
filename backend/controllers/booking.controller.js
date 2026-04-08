const Booking = require('../models/Booking.model');
const Bus = require('../models/Bus.model');
const Train = require('../models/Train.model');
const Flight = require('../models/Flight.model');

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const {
      transportType, transportId, passengers, classType,
      from, to, journeyDate, departureTime, arrivalTime,
      baseFare, taxes, convenienceFee, paymentMethod,
      contactEmail, contactPhone
    } = req.body;

    const totalFare = baseFare + (taxes || 0) + (convenienceFee || 0);

    // Update seat availability
    const seatsBooked = passengers.length;
    if (transportType === 'Bus') {
      await Bus.findByIdAndUpdate(transportId, { $inc: { availableSeats: -seatsBooked } });
    } else if (transportType === 'Train') {
      await Train.findOneAndUpdate(
        { _id: transportId, 'classes.classCode': classType },
        { $inc: { 'classes.$.availableSeats': -seatsBooked } }
      );
    } else if (transportType === 'Flight') {
      await Flight.findOneAndUpdate(
        { _id: transportId, 'cabinClasses.classCode': classType },
        { $inc: { 'cabinClasses.$.availableSeats': -seatsBooked } }
      );
    }

    const booking = await Booking.create({
      user: req.user._id,
      transportType,
      transportId,
      passengers,
      classType,
      from,
      to,
      journeyDate,
      departureTime,
      arrivalTime,
      baseFare,
      taxes: taxes || 0,
      convenienceFee: convenienceFee || 0,
      totalFare,
      paymentMethod,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone
    });

    await booking.populate('user', 'name email phone');

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'name email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    }

    const seatsToRelease = booking.passengers.length;
    if (booking.transportType === 'Bus') {
      await Bus.findByIdAndUpdate(booking.transportId, { $inc: { availableSeats: seatsToRelease } });
    } else if (booking.transportType === 'Train') {
      await Train.findOneAndUpdate(
        { _id: booking.transportId, 'classes.classCode': booking.classType },
        { $inc: { 'classes.$.availableSeats': seatsToRelease } }
      );
    } else if (booking.transportType === 'Flight') {
      await Flight.findOneAndUpdate(
        { _id: booking.transportId, 'cabinClasses.classCode': booking.classType },
        { $inc: { 'cabinClasses.$.availableSeats': seatsToRelease } }
      );
    }

    const refundAmount = booking.totalFare * 0.85;
    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    booking.refundAmount = refundAmount;
    booking.cancellationReason = req.body.reason || 'User cancelled';
    await booking.save();

    res.json({ success: true, data: booking, message: `Refund of ₹${refundAmount.toFixed(2)} will be processed` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
