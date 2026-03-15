const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.ATLAS_URI;
  const dbName = process.env.MONGODB_DB_NAME || process.env.ATLAS_DB_NAME || 'ecobasket';

  if (!MONGODB_URI) {
    throw new Error('Mongo URI is not defined. Set MONGODB_URI (or ATLAS_URI).');
  }

  await mongoose.connect(MONGODB_URI, {
    dbName,
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected (${mongoose.connection.host}/${dbName})`);
};
