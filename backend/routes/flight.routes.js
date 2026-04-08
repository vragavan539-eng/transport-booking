const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById, getAllFlights, createFlight, updateFlight, deleteFlight } = require('../controllers/flight.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/search', searchFlights);
router.get('/', protect, adminOnly, getAllFlights);
router.get('/:id', getFlightById);
router.post('/', protect, adminOnly, createFlight);
router.put('/:id', protect, adminOnly, updateFlight);
router.delete('/:id', protect, adminOnly, deleteFlight);

module.exports = router;
