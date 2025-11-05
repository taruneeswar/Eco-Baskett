require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // ✅ you forgot to import this
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');

const app = express();

// ✅ CORS setup — allow localhost and local network
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.137.221:5173', // Local network access
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/, // Any local network IP
      'https://ecobaskett.netlify.app',
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Basic route for testing
app.get('/', (req, res) => {
  res.send('Eco Basket API');
});

// ✅ Database test route
app.get('/test-db', async (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected
  res.json({ connected: state === 1 });
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ PORT fallback fixed
const PORT = process.env.PORT || 5000;

// ✅ Connect to DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  });
