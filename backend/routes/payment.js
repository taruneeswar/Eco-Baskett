const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

router.use(auth);

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const isRazorpayConfigured = Boolean(
  razorpayKeyId
  && razorpayKeySecret
  && razorpayKeyId !== 'your_razorpay_key_id_here'
  && razorpayKeySecret !== 'your_razorpay_key_secret_here'
);

// Initialize Razorpay only when keys are configured.
const razorpay = isRazorpayConfigured
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, deliveryAddress, deliveryPhone, buyNowItem } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let orderItems = [];
    let fromCart = true;

    if (buyNowItem?.productId) {
      const product = await Product.findById(buyNowItem.productId).lean();
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const qty = Math.max(1, Number(buyNowItem.qty) || 1);
      orderItems = [{
        product: product._id,
        name: product.name,
        price: product.price,
        qty,
      }];
      fromCart = false;
    } else {
      if (user.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      orderItems = user.cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
      }));
    }

    const calculatedAmount = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (Math.abs(calculatedAmount - Number(amount)) > 0.01) {
      return res.status(400).json({ message: 'Amount mismatch. Please refresh your cart and try again.' });
    }

    let razorpayOrder;

    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(calculatedAmount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      };

      razorpayOrder = await razorpay.orders.create(options);
    } else {
      // Test mode: create a pseudo-order id so frontend QR flow can continue.
      razorpayOrder = {
        id: `test_order_${Date.now()}`,
        amount: Math.round(calculatedAmount * 100),
        currency: 'INR',
      };
    }

    // Create order in database
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount: calculatedAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: 'online',
      deliveryAddress: deliveryAddress || user.address,
      deliveryPhone: deliveryPhone || user.phone,
      orderSource: fromCart ? 'cart' : 'buy-now',
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
      if (!isRazorpayConfigured) {
        return res.status(400).json({ message: 'Razorpay is not configured for real payment verification' });
      }

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

    // Clear user's cart only for cart-based orders
    if (order?.orderSource !== 'buy-now') {
      await User.findByIdAndUpdate(req.userId, { cart: [] });
    }

    res.json({ message: 'Payment verified successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
});

// Create Cash on Delivery order
router.post('/create-cod-order', async (req, res) => {
  try {
    const { deliveryAddress, deliveryPhone, buyNowItem } = req.body;

    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ message: 'Delivery address and phone are required' });
    }

    const user = await User.findById(req.userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let orderItems = [];
    let totalAmount = 0;
    let fromCart = true;

    if (buyNowItem?.productId) {
      const product = await Product.findById(buyNowItem.productId).lean();
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const qty = Math.max(1, Number(buyNowItem.qty) || 1);
      orderItems = [{
        product: product._id,
        name: product.name,
        price: product.price,
        qty,
      }];
      totalAmount = product.price * qty;
      fromCart = false;
    } else {
      if (user.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      orderItems = user.cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
      }));
      totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    // Create COD order in database
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      paymentMethod: 'cod',
      paymentStatus: 'pending', // COD payment is pending until delivery
      deliveryAddress,
      deliveryPhone,
      orderSource: fromCart ? 'cart' : 'buy-now',
    });

    if (fromCart) {
      await User.findByIdAndUpdate(req.userId, { cart: [] });
    }

    res.json({
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create COD order', error: err.message });
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
