const Flight = require('../models/Flight.model');

exports.searchFlights = async (req, res) => {
  try {
    const { from, to, date, classCode, stops, airline, sort } = req.query;
    if (!from || !to || !date) {
      return res.status(400).json({ success: false, message: 'from, to, and date are required' });
    }

    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let query = {
      $or: [
        { from: { $regex: from, $options: 'i' } },
        { fromCode: { $regex: from, $options: 'i' } }
      ],
      date: { $gte: searchDate, $lt: nextDay },
      isActive: true
    };

    if (airline) query.airline = { $regex: airline, $options: 'i' };
    if (stops !== undefined) query.stops = Number(stops);

    let flights = await Flight.find(query);
    flights = flights.filter(f =>
      f.to.toLowerCase().includes(to.toLowerCase()) ||
      f.toCode.toLowerCase().includes(to.toLowerCase())
    );

    if (classCode) {
      flights = flights.filter(f =>
        f.cabinClasses.some(c => c.classCode === classCode && c.availableSeats > 0)
      );
    }

    if (sort === 'price_asc') {
      flights.sort((a, b) => Math.min(...a.cabinClasses.map(c => c.price)) - Math.min(...b.cabinClasses.map(c => c.price)));
    } else if (sort === 'departure') {
      flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sort === 'duration') {
      flights.sort((a, b) => a.duration.localeCompare(b.duration));
    }

    res.json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
