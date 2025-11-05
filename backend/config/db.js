const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/';

module.exports = async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
};
