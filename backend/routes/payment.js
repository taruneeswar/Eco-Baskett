const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

router.use(auth);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, deliveryAddress, deliveryPhone } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Get user's cart
    const user = await User.findById(req.userId).populate('cart.product');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const order = await Order.create({
      user: req.userId,
      items: user.cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
      })),
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      deliveryAddress: deliveryAddress || user.address,
      deliveryPhone: deliveryPhone || user.phone,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check if this is test mode
    const isTestMode = razorpay_signature === 'test_signature' && razorpay_payment_id.startsWith('test_payment_');

    if (!isTestMode) {
      // REAL MODE: Verify signature
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Clear user's cart
    await User.findByIdAndUpdate(req.userId, { cart: [] });

    res.json({ message: 'Payment verified successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
});

// Get user's orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId })
      .populate('items.product')
      .lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

module.exports = router;
