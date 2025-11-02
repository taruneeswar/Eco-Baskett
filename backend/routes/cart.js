const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

router.use(auth);

router.get('/', async (req, res) => {
  const user = await User.findById(req.userId).populate('cart.product').lean();
  res.json(user?.cart || []);
});

router.post('/add', async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const existing = user.cart.find((ci) => ci.product.toString() === productId);
  if (existing) existing.qty += qty;
  else user.cart.push({ product: productId, qty });

  await user.save();
  const populated = await User.findById(req.userId).populate('cart.product').lean();
  res.json(populated.cart);
});

router.put('/:productId', async (req, res) => {
  const { qty } = req.body;
  const { productId } = req.params;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const item = user.cart.find((ci) => ci.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  item.qty = qty;
  await user.save();
  const populated = await User.findById(req.userId).populate('cart.product').lean();
  res.json(populated.cart);
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.cart = user.cart.filter((ci) => ci.product.toString() !== productId);
  await user.save();
  const populated = await User.findById(req.userId).populate('cart.product').lean();
  res.json(populated.cart);
});

module.exports = router;
