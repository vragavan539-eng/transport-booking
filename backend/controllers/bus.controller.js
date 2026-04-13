const Bus = require('../models/Bus.model');

// @desc    Search buses
// @route   GET /api/buses/search
exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date, busType, minPrice, maxPrice, sort } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ success: false, message: 'from, to, and date are required' });
    }

    // ✅ IST Timezone Fix - UTC offset +05:30
    const searchDate = new Date(date + 'T00:00:00.000+05:30');
    const nextDay = new Date(date + 'T23:59:59.999+05:30');

    let query = {
      from: { $regex: from, $options: 'i' },
      to: { $regex: to, $options: 'i' },
      date: { $gte: searchDate, $lte: nextDay },
      availableSeats: { $gt: 0 }
    };

    if (busType) query.busType = busType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'departure') sortOption = { departureTime: 1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const buses = await Bus.find(query).sort(sortOption);
    res.json({ success: true, count: buses.length, data: buses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get bus by ID
// @route   GET /api/buses/:id
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, data: bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all buses (admin)
// @route   GET /api/buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json({ success: true, count: buses.length, data: buses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create bus (admin)
// @route   POST /api/buses
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update bus (admin)
// @route   PUT /api/buses/:id
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, data: bus });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete bus (admin)
// @route   DELETE /api/buses/:id
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};