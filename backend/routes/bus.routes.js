const express = require('express');
const router = express.Router();
const { searchBuses, getBusById, getAllBuses, createBus, updateBus, deleteBus } = require('../controllers/bus.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/search', searchBuses);
router.get('/', protect, adminOnly, getAllBuses);
router.get('/:id', getBusById);
router.post('/', protect, adminOnly, createBus);
router.put('/:id', protect, adminOnly, updateBus);
router.delete('/:id', protect, adminOnly, deleteBus);

module.exports = router;
