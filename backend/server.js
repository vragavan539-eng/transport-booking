const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/buses', require('./routes/bus.routes'));
app.use('/api/trains', require('./routes/train.routes'));
app.use('/api/flights', require('./routes/flight.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Transport Booking API Running' });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});