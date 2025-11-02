require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://ecobaskett.netlify.app/' // 🔁 replace with your actual Netlify URL
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Eco Basket API');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
