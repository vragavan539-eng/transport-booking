const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus.model');
const Train = require('../models/Train.model');
const Flight = require('../models/Flight.model');

router.get('/run', async (req, res) => {
  try {
    // உங்கள் seedData.js-ல இருக்கற busTemplates, trainTemplates, flightTemplates copy பண்ணு
    const { busTemplates, trainTemplates, flightTemplates } = require('../seed/seedData');
    
    await Bus.deleteMany({});
    await Train.deleteMany({});
    await Flight.deleteMany({});

    const d = (i) => { const dt = new Date(); dt.setDate(dt.getDate() + i); return dt; };
    
    const buses = [];
    for (let i = 0; i <= 30; i++) busTemplates.forEach(t => buses.push({...t, busNumber:`${t.busNumber}-D${i}`, date:d(i)}));
    await Bus.insertMany(buses);

    const trains = [];
    for (let i = 0; i <= 30; i++) trainTemplates.forEach(t => trains.push({...t, trainNumber:`${t.trainNumber}-D${i}`, date:d(i)}));
    await Train.insertMany(trains);

    const flights = [];
    for (let i = 0; i <= 30; i++) flightTemplates.forEach(t => flights.push({...t, flightNumber:`${t.flightNumber}-D${i}`, date:d(i)}));
    await Flight.insertMany(flights);

    res.json({ success: true, buses: buses.length, trains: trains.length, flights: flights.length });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;