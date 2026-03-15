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

// ✅ CORS setup — allow localhost and local network on any dev port
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedExact = ['https://ecobaskett.netlify.app'];
      const allowedPattern = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
        /^https:\/\/[a-z0-9-]+--ecobaskett\.netlify\.app$/,
      ];

      if (allowedExact.includes(origin) || allowedPattern.some((p) => p.test(origin))) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Basic route for testing
app.get('/', (req, res) => {
  res.send('Eco Basket API');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Eco Basket API is running',
    endpoints: ['/api/products', '/api/auth', '/api/cart', '/api/payment'],
  });
});

// Backward-compatible routes for clients still calling without /api prefix.
app.get('/products', (req, res) => {
  res.redirect(307, '/api/products');
});

app.get('/products/:id', (req, res) => {
  res.redirect(307, `/api/products/${req.params.id}`);
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
