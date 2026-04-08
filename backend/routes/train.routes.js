const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById, getAllTrains, createTrain, updateTrain, deleteTrain } = require('../controllers/train.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/search', searchTrains);
router.get('/', protect, adminOnly, getAllTrains);
router.get('/:id', getTrainById);
router.post('/', protect, adminOnly, createTrain);
router.put('/:id', protect, adminOnly, updateTrain);
router.delete('/:id', protect, adminOnly, deleteTrain);

module.exports = router;
