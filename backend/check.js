require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const count = await mongoose.connection.db.collection('buses').countDocuments();
  console.log('Buses in Atlas:', count);
  process.exit();
});