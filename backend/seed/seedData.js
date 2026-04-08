const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Bus = require('../models/Bus.model');
const Train = require('../models/Train.model');
const Flight = require('../models/Flight.model');
const User = require('../models/User.model');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transport_booking');
  console.log('MongoDB connected for seeding');
};

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const buses = [
  { busNumber: 'BUS001', busName: 'Chennai Express', operator: 'TNSTC', busType: 'Volvo AC', from: 'Chennai', to: 'Bangalore', departureTime: '06:00', arrivalTime: '11:30', duration: '5h 30m', totalSeats: 45, availableSeats: 30, price: 650, amenities: ['AC', 'WiFi', 'Charging Point', 'Water Bottle'], rating: 4.5, date: d(1) },
  { busNumber: 'BUS002', busName: 'Coimbatore Night Rider', operator: 'KPN Travels', busType: 'AC Sleeper', from: 'Chennai', to: 'Coimbatore', departureTime: '22:00', arrivalTime: '05:00', duration: '7h', totalSeats: 36, availableSeats: 20, price: 850, amenities: ['AC', 'Sleeper', 'Blanket', 'Charging Point'], rating: 4.3, date: d(1) },
  { busNumber: 'BUS003', busName: 'Madurai Link', operator: 'SRM Travels', busType: 'AC Seater', from: 'Chennai', to: 'Madurai', departureTime: '08:00', arrivalTime: '14:00', duration: '6h', totalSeats: 50, availableSeats: 35, price: 500, amenities: ['AC', 'TV', 'Charging Point'], rating: 4.1, date: d(1) },
  { busNumber: 'BUS004', busName: 'Trichy Swift', operator: 'SETC', busType: 'Seater', from: 'Chennai', to: 'Trichy', departureTime: '10:00', arrivalTime: '15:30', duration: '5h 30m', totalSeats: 50, availableSeats: 40, price: 280, amenities: ['Fan', 'Charging Point'], rating: 3.8, date: d(1) },
  { busNumber: 'BUS005', busName: 'Bangalore Premium', operator: 'Orange Travels', busType: 'Volvo AC', from: 'Chennai', to: 'Bangalore', departureTime: '14:00', arrivalTime: '20:00', duration: '6h', totalSeats: 45, availableSeats: 15, price: 750, amenities: ['AC', 'WiFi', 'USB Charging', 'Snacks'], rating: 4.7, date: d(2) },
  { busNumber: 'BUS006', busName: 'Hyderabad Express', operator: 'VRL Travels', busType: 'AC Sleeper', from: 'Bangalore', to: 'Hyderabad', departureTime: '20:00', arrivalTime: '05:00', duration: '9h', totalSeats: 36, availableSeats: 25, price: 950, amenities: ['AC', 'Sleeper', 'Blanket', 'Pillow'], rating: 4.4, date: d(1) },
  { busNumber: 'BUS007', busName: 'Pune Rider', operator: 'Neeta Travels', busType: 'Volvo AC', from: 'Mumbai', to: 'Pune', departureTime: '07:00', arrivalTime: '11:00', duration: '4h', totalSeats: 45, availableSeats: 28, price: 400, amenities: ['AC', 'WiFi', 'Water'], rating: 4.2, date: d(1) },
  { busNumber: 'BUS008', busName: 'Goa Beach Express', operator: 'Kadamba Transport', busType: 'AC Seater', from: 'Mumbai', to: 'Goa', departureTime: '18:00', arrivalTime: '08:00', duration: '14h', totalSeats: 50, availableSeats: 18, price: 1100, amenities: ['AC', 'Sleeper', 'USB', 'Reading Light'], rating: 4.6, date: d(2) },
];

const trains = [
  {
    trainNumber: '12671', trainName: 'Nilagiri Express', from: 'Chennai', fromCode: 'MAS', to: 'Coimbatore', toCode: 'CBE',
    departureTime: '21:10', arrivalTime: '06:45', duration: '9h 35m', trainType: 'Express',
    classes: [
      { className: 'Sleeper Class', classCode: 'SL', totalSeats: 500, availableSeats: 120, price: 320 },
      { className: '3rd AC', classCode: '3A', totalSeats: 200, availableSeats: 60, price: 850 },
      { className: '2nd AC', classCode: '2A', totalSeats: 100, availableSeats: 30, price: 1200 },
      { className: '1st AC', classCode: '1A', totalSeats: 24, availableSeats: 8, price: 2200 }
    ],
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], rating: 4.2, date: d(1)
  },
  {
    trainNumber: '12007', trainName: 'Chennai Shatabdi', from: 'Chennai', fromCode: 'MAS', to: 'Bangalore', toCode: 'SBC',
    departureTime: '06:00', arrivalTime: '11:00', duration: '5h', trainType: 'Shatabdi',
    classes: [
      { className: 'Chair Car', classCode: 'CC', totalSeats: 400, availableSeats: 80, price: 650 },
      { className: 'Executive Chair', classCode: 'EC', totalSeats: 60, availableSeats: 20, price: 1250 }
    ],
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], rating: 4.6, date: d(1)
  },
  {
    trainNumber: '22691', trainName: 'Rajdhani Express', from: 'Bangalore', fromCode: 'SBC', to: 'Delhi', toCode: 'NDLS',
    departureTime: '20:15', arrivalTime: '05:30', duration: '33h 15m', trainType: 'Rajdhani',
    classes: [
      { className: '3rd AC', classCode: '3A', totalSeats: 300, availableSeats: 75, price: 2200 },
      { className: '2nd AC', classCode: '2A', totalSeats: 150, availableSeats: 40, price: 3100 },
      { className: '1st AC', classCode: '1A', totalSeats: 36, availableSeats: 10, price: 5200 }
    ],
    runningDays: ['Mon', 'Wed', 'Fri', 'Sun'], rating: 4.7, date: d(1)
  },
  {
    trainNumber: '20901', trainName: 'Vande Bharat Express', from: 'Chennai', fromCode: 'MAS', to: 'Mysore', toCode: 'MYS',
    departureTime: '05:50', arrivalTime: '12:40', duration: '6h 50m', trainType: 'Vande Bharat',
    classes: [
      { className: 'Chair Car', classCode: 'CC', totalSeats: 450, availableSeats: 110, price: 1050 },
      { className: 'Executive Chair', classCode: 'EC', totalSeats: 52, availableSeats: 15, price: 2050 }
    ],
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], rating: 4.8, date: d(1)
  },
  {
    trainNumber: '12027', trainName: 'Chennai Mail', from: 'Mumbai', fromCode: 'CSTM', to: 'Chennai', toCode: 'MAS',
    departureTime: '11:40', arrivalTime: '17:20', duration: '29h 40m', trainType: 'Express',
    classes: [
      { className: 'Sleeper Class', classCode: 'SL', totalSeats: 600, availableSeats: 200, price: 580 },
      { className: '3rd AC', classCode: '3A', totalSeats: 250, availableSeats: 90, price: 1550 },
      { className: '2nd AC', classCode: '2A', totalSeats: 120, availableSeats: 35, price: 2200 }
    ],
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], rating: 4.0, date: d(2)
  }
];

const flights = [
  {
    flightNumber: 'AI202', airline: 'Air India', airlineCode: 'AI', from: 'Chennai', fromCode: 'MAA', to: 'Delhi', toCode: 'DEL',
    departureTime: '06:15', arrivalTime: '09:00', duration: '2h 45m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 150, availableSeats: 60, price: 4500, baggage: '25kg', cabinBaggage: '7kg', meal: true, refundable: false },
      { className: 'Business', classCode: 'Business', totalSeats: 30, availableSeats: 10, price: 14000, baggage: '35kg', cabinBaggage: '10kg', meal: true, refundable: true }
    ],
    aircraft: 'Airbus A320', rating: 4.2, date: d(1)
  },
  {
    flightNumber: 'IN605', airline: 'IndiGo', airlineCode: '6E', from: 'Chennai', fromCode: 'MAA', to: 'Delhi', toCode: 'DEL',
    departureTime: '08:30', arrivalTime: '11:15', duration: '2h 45m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 180, availableSeats: 90, price: 3800, baggage: '20kg', cabinBaggage: '7kg', meal: false, refundable: false }
    ],
    aircraft: 'Airbus A320neo', rating: 4.0, date: d(1)
  },
  {
    flightNumber: 'SG415', airline: 'SpiceJet', airlineCode: 'SG', from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM',
    departureTime: '11:00', arrivalTime: '13:20', duration: '2h 20m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 180, availableSeats: 70, price: 3200, baggage: '20kg', cabinBaggage: '7kg', meal: false, refundable: false },
      { className: 'Business', classCode: 'Business', totalSeats: 12, availableSeats: 5, price: 9800, baggage: '30kg', cabinBaggage: '10kg', meal: true, refundable: true }
    ],
    aircraft: 'Boeing 737-800', rating: 3.9, date: d(1)
  },
  {
    flightNumber: 'UK818', airline: 'Vistara', airlineCode: 'UK', from: 'Mumbai', fromCode: 'BOM', to: 'Bangalore', toCode: 'BLR',
    departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 140, availableSeats: 55, price: 3500, baggage: '20kg', cabinBaggage: '7kg', meal: true, refundable: false },
      { className: 'Business', classCode: 'Business', totalSeats: 16, availableSeats: 6, price: 12500, baggage: '35kg', cabinBaggage: '10kg', meal: true, refundable: true },
      { className: 'First', classCode: 'First', totalSeats: 4, availableSeats: 2, price: 28000, baggage: '40kg', cabinBaggage: '10kg', meal: true, refundable: true }
    ],
    aircraft: 'Airbus A321', rating: 4.7, date: d(1)
  },
  {
    flightNumber: 'AI440', airline: 'Air India', airlineCode: 'AI', from: 'Delhi', fromCode: 'DEL', to: 'Bangalore', toCode: 'BLR',
    departureTime: '07:00', arrivalTime: '09:30', duration: '2h 30m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 150, availableSeats: 80, price: 4200, baggage: '25kg', cabinBaggage: '7kg', meal: true, refundable: false },
      { className: 'Business', classCode: 'Business', totalSeats: 24, availableSeats: 8, price: 13500, baggage: '35kg', cabinBaggage: '10kg', meal: true, refundable: true }
    ],
    aircraft: 'Boeing 787', rating: 4.4, date: d(2)
  },
  {
    flightNumber: 'IN219', airline: 'IndiGo', airlineCode: '6E', from: 'Bangalore', fromCode: 'BLR', to: 'Hyderabad', toCode: 'HYD',
    departureTime: '16:45', arrivalTime: '17:55', duration: '1h 10m', stops: 0,
    cabinClasses: [
      { className: 'Economy', classCode: 'Economy', totalSeats: 180, availableSeats: 100, price: 2200, baggage: '20kg', cabinBaggage: '7kg', meal: false, refundable: false }
    ],
    aircraft: 'Airbus A320', rating: 4.1, date: d(1)
  }
];

const seed = async () => {
  try {
    await connectDB();
    await Bus.deleteMany({});
    await Train.deleteMany({});
    await Flight.deleteMany({});
    console.log('Cleared existing data');

    await Bus.insertMany(buses);
    console.log(`✅ ${buses.length} buses seeded`);

    await Train.insertMany(trains);
    console.log(`✅ ${trains.length} trains seeded`);

    await Flight.insertMany(flights);
    console.log(`✅ ${flights.length} flights seeded`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@transport.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@transport.com', password: 'admin123', role: 'admin' });
      console.log('✅ Admin user created: admin@transport.com / admin123');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
