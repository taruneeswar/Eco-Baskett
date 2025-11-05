# MongoDB Atlas Connection Error - Solutions

## Current Error
```
❌ Failed to connect to database: Error: querySrv ECONNREFUSED
_mongodb._tcp.ecobasket.dsz6boh.mongodb.net
```

## Problem
The MongoDB Atlas cluster hostname cannot be resolved. This means:
- The cluster might have been paused/deleted in MongoDB Atlas
- The connection string is outdated
- Network/DNS issue

## Solution 1: Get New Connection String from MongoDB Atlas (Recommended)

### Steps:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in with your account
3. Click on your cluster (ecobasket)
4. Click "Connect" button
5. Choose "Connect your application"
6. Copy the NEW connection string
7. Replace `<password>` with your actual password
8. Update `backend/.env`:

```env
MONGODB_URI=<paste-your-new-connection-string-here>
```

### Example of correct format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecobasket?retryWrites=true&w=majority
```

## Solution 2: Check if Cluster is Paused

MongoDB Atlas FREE tier clusters auto-pause after inactivity:

1. Go to MongoDB Atlas Dashboard
2. Check if cluster shows "Paused" status
3. Click "Resume" button
4. Wait 1-2 minutes for cluster to start
5. Restart your backend server

## Solution 3: Use Local MongoDB (Temporary)

If you can't access MongoDB Atlas right now, use local MongoDB:

### Install MongoDB Locally:
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB service should start automatically

### Update .env:
```env
PORT=5000
MONGODB_URI=mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/ecobasket?retryWrites=true&w=majority&appName=ecobasket
JWT_SECRET=devsecret
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Restart backend:
```powershell
cd backend
npm run dev
```

### Re-seed products:
```powershell
npm run seed
```

## Solution 4: Check Network/Firewall

### Windows Firewall:
1. Open Windows Security
2. Go to Firewall & network protection
3. Click "Allow an app through firewall"
4. Make sure Node.js is allowed

### DNS Flush:
```powershell
ipconfig /flushdns
```

Then restart backend server.

## Solution 5: Create New Cluster (If cluster was deleted)

1. Go to MongoDB Atlas
2. Click "Build a Database"
3. Choose FREE tier (M0)
4. Select region closest to you
5. Name cluster: ecobasket
6. Click "Create"
7. Create database user (username/password)
8. Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)
9. Get connection string
10. Update `backend/.env`

## Quick Test

After fixing, test connection:

```powershell
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.log('❌ Failed:', err.message); process.exit(1); });"
```

## Verify Backend Starts

```powershell
cd backend
npm run dev
```

You should see:
```
MongoDB connected
🚀 Server running on port 5000
```

## Need Help?

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Verify your cluster exists in MongoDB Atlas dashboard
3. Make sure you're using the correct connection string
4. Check if cluster is in the same region
5. Verify IP whitelist includes your IP (or 0.0.0.0/0)

## Working Connection String Format

For MongoDB Atlas (SRV):
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

For Local MongoDB:
```
mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/
```

Replace `USERNAME`, `PASSWORD`, `CLUSTER`, and `DATABASE` with your actual values.
