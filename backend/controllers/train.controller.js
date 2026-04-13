const Train = require('../models/Train.model');

// @desc    Search trains
// @route   GET /api/trains/search
exports.searchTrains = async (req, res) => {
  try {
    const { from, to, date, classCode, sort } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ success: false, message: 'from, to, and date are required' });
    }

    // ✅ IST Timezone Fix - UTC offset +05:30
    const searchDate = new Date(date + 'T00:00:00.000+05:30');
    const nextDay = new Date(date + 'T23:59:59.999+05:30');

    let query = {
      $or: [
        { from: { $regex: from, $options: 'i' } },
        { fromCode: { $regex: from, $options: 'i' } }
      ],
      date: { $gte: searchDate, $lte: nextDay }
    };

    let trains = await Train.find(query);

    trains = trains.filter(t =>
      t.to.toLowerCase().includes(to.toLowerCase()) ||
      t.toCode.toLowerCase().includes(to.toLowerCase())
    );

    if (classCode) {
      trains = trains.filter(t =>
        t.classes.some(c => c.classCode === classCode && c.availableSeats > 0)
      );
    }

    if (sort === 'price_asc') {
      trains.sort((a, b) => Math.min(...a.classes.map(c => c.price)) - Math.min(...b.classes.map(c => c.price)));
    } else if (sort === 'departure') {
      trains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    res.json({ success: true, count: trains.length, data: trains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get train by ID
// @route   GET /api/trains/:id
exports.getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
    res.json({ success: true, data: train });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all trains (admin)
// @route   GET /api/trains
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find({});
    res.json({ success: true, count: trains.length, data: trains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create train (admin)
// @route   POST /api/trains
exports.createTrain = async (req, res) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json({ success: true, data: train });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update train (admin)
// @route   PUT /api/trains/:id
exports.updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
    res.json({ success: true, data: train });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete train (admin)
// @route   DELETE /api/trains/:id
exports.deleteTrain = async (req, res) => {
  try {
    await Train.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Train deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};