const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings } = require('../controllers/booking.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.get('/', adminOnly, getAllBookings);

module.exports = router;
