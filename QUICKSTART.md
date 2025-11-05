# 🚀 Quick Start Guide

## ✅ Current Status (All Working!)

- ✅ Backend API running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ MongoDB Atlas connected (25 products, 12 users)
- ✅ All endpoints working

## 🌐 Access the Application

**Open in your browser:** http://localhost:5173

## 🔑 Test Login Credentials

### Primary Account
- **Email:** `tarun@gmail.com`
- **Password:** `tarun123`

### Alternative Account
- **Email:** `test@example.com`
- **Password:** `password123`

## 🛠️ If Servers Stop Working

### Restart Both Servers

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\tarun\Music\MSD project\backend"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\tarun\Music\MSD project\frontend"
npm run dev
```

## 🧪 Test Features

1. **Sign In** → Use credentials above
2. **Browse Products** → 25 products available
3. **Add to Cart** → Click "Add to cart" on any product
4. **View Cart** → Click "Cart" in navigation
5. **Checkout** → Click "Proceed to Checkout"
6. **Payment (Test Mode)** → Fill details, click "Pay"
7. **View Orders** → Click "Orders" in navigation

## 📝 Create New Account

1. Go to http://localhost:5173/signup
2. Fill in the form (use any email/password)
3. Click "Sign Up"

## 🔄 Reset Password for Existing User

```powershell
cd backend
node resetUser.js <email> <new-password>
```

Example:
```powershell
node resetUser.js myemail@gmail.com mypassword
```

## 🐛 Troubleshooting

### Products Not Loading?
1. Check backend is running: http://localhost:5000/api/products
2. Check browser console for errors (F12)
3. Make sure frontend .env has: `VITE_API_URL=http://localhost:5000/api`

### Sign In Not Working?
1. Use credentials: `tarun@gmail.com` / `tarun123`
2. Or create new account via Sign Up
3. Or reset password: `node resetUser.js email@example.com newpass`

### Payment Not Working?
- Payment is in TEST MODE (no real Razorpay keys)
- It will automatically simulate payment after 2 seconds
- Order will be saved to database

## 📁 Project Structure

```
MSD project/
├── backend/           # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
├── frontend/         # React/Vite app
│   ├── src/
│   │   ├── pages/    # React pages
│   │   ├── components/
│   │   └── state/    # AuthContext
│   └── .env.development
└── WARP.md          # Development guide
```

## 🔍 Useful Commands

### Check Server Status
```powershell
# Check if backend is running
curl http://localhost:5000

# Check if frontend is running
curl http://localhost:5173

# Check products endpoint
curl http://localhost:5000/api/products
```

### Database Commands
```powershell
cd backend

# Count products
node -e "require('dotenv').config(); require('./config/db')().then(() => require('./models/Product').countDocuments()).then(console.log).then(() => process.exit())"

# Count users
node -e "require('dotenv').config(); require('./config/db')().then(() => require('./models/User').countDocuments()).then(console.log).then(() => process.exit())"

# Seed products
npm run seed
```

## 💡 Next Steps

1. ✅ Test the full flow (sign in → add to cart → checkout → payment)
2. ✅ View your orders in the Orders page
3. ⚠️ To enable real payments: Get Razorpay API keys and update .env files
4. 🚀 Deploy to production when ready

## 📞 Need Help?

Check these files:
- `TEST_CREDENTIALS.md` - All login credentials
- `PAYMENT_SETUP.md` - Razorpay integration guide
- `WARP.md` - Complete development guide
