# Razorpay Payment Integration Setup

## Overview
This project now includes Razorpay payment gateway integration for processing orders.

## Backend Setup

### 1. Get Razorpay Credentials
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Generate **Test Keys** (for development) or use **Live Keys** (for production)
5. You'll get:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

### 2. Configure Backend Environment
Edit `backend/.env` and add your Razorpay credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=devsecret
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### 3. Restart Backend Server
```bash
cd backend
npm run dev
```

## Frontend Setup

### 1. Configure Frontend Environment
Edit `frontend/.env.development` and add your Razorpay **Key ID** (NOT the secret):

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

**Important:** Only add the Key ID to the frontend, NEVER add the Key Secret!

### 2. Restart Frontend Server
```bash
cd frontend
npm run dev
```

## Testing the Payment Flow

### Test Mode (Recommended for Development)
When using Razorpay Test Keys, you can test payments without real transactions:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Other Test Methods:**
- UPI: `success@razorpay`
- Netbanking: Select any bank and use the test credentials provided
- Wallet: Select any wallet

### Payment Flow
1. Add items to cart
2. Go to Cart page
3. Click "Proceed to Checkout"
4. Fill in delivery address and phone number
5. Click "Pay ₹XXX" button
6. Razorpay payment modal will open
7. Select payment method and complete (use test credentials in test mode)
8. On success, you'll be redirected to Orders page
9. Cart will be cleared automatically

## API Endpoints

### Payment Endpoints (Authenticated)
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment signature
- `GET /api/payment/orders` - Get user's order history
- `GET /api/payment/orders/:id` - Get specific order details

## Database Schema

### Order Model
```javascript
{
  user: ObjectId,           // User reference
  items: [                  // Order items snapshot
    {
      product: ObjectId,    // Product reference
      name: String,         // Product name at time of order
      price: Number,        // Price at time of order
      qty: Number           // Quantity ordered
    }
  ],
  totalAmount: Number,      // Total order amount
  paymentStatus: String,    // 'pending', 'completed', 'failed'
  razorpayOrderId: String,  // Razorpay order ID
  razorpayPaymentId: String,// Razorpay payment ID (after success)
  razorpaySignature: String,// Payment signature (for verification)
  deliveryAddress: String,  // Delivery address
  deliveryPhone: String,    // Delivery phone
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Payment Signature Verification**: Backend verifies Razorpay signature using HMAC-SHA256
2. **Authentication Required**: All payment endpoints require JWT authentication
3. **Cart Validation**: Backend validates cart is not empty before creating order
4. **Secure Credentials**: Key Secret is only stored on backend, never exposed to frontend
5. **Order-User Binding**: Users can only access their own orders

## Production Deployment

### Before Going Live:
1. Replace Test Keys with Live Keys in both backend `.env` and frontend `.env`
2. Test thoroughly with small real amounts
3. Set up Razorpay Webhooks for payment confirmations (optional but recommended)
4. Configure proper error handling and logging
5. Review Razorpay's [integration checklist](https://razorpay.com/docs/payments/payments/checklist/)

## Troubleshooting

### Payment Modal Not Opening
- Check if `VITE_RAZORPAY_KEY_ID` is set in frontend `.env`
- Verify Razorpay script loads (check browser console)
- Ensure frontend is restarted after environment changes

### Payment Verification Failed
- Verify `RAZORPAY_KEY_SECRET` is correct in backend `.env`
- Check backend logs for signature mismatch errors
- Ensure backend is using the same key pair (ID + Secret)

### Orders Not Saving
- Check MongoDB connection
- Verify cart is not empty before checkout
- Check backend logs for errors

## Support Resources
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)
