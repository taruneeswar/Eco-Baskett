# MongoDB Atlas Setup & CORS Fix

## 🎯 Issues Fixed

1. **CORS Error** - Frontend accessing from `192.168.137.221:5173` blocked
2. **MongoDB Atlas** - Switched from local MongoDB to Atlas cloud

## ✅ What I Changed

### 1. Backend `.env` File
```env
MONGODB_URI=mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/ecobasket?retryWrites=true&w=majority
```

### 2. Backend CORS Configuration (`server.js`)
Added your local network IP and regex pattern to allow any local network access:
```javascript
origin: [
  'http://localhost:5173',
  'http://192.168.137.221:5173',  // Your specific IP
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/,  // Any 192.168.x.x
  'https://ecobaskett.netlify.app',
]
```

## 🚀 Setup Steps

### Step 1: Verify MongoDB Atlas Cluster
Before migrating, check your Atlas cluster:

1. Go to https://cloud.mongodb.com
2. Sign in with your account
3. Check if cluster is **running** (not paused)
4. Click **Network Access** → Verify your IP is whitelisted
   - Better: Add `0.0.0.0/0` to allow all IPs (for development)

### Step 2: Migrate Data to Atlas

Run the migration script:
```powershell
cd backend
node migrateToAtlas.js
```

This will:
- Connect to MongoDB Atlas
- Clear any existing data
- Add 25 products
- Create 3 test users

### Step 3: Restart Backend Server

**IMPORTANT:** You MUST restart the backend for changes to take effect:

```powershell
# In backend terminal
# Press Ctrl+C to stop
npm run dev
```

Wait for:
```
MongoDB connected
🚀 Server running on port 5000
```

### Step 4: Test the Connection

Open browser to:
```
http://localhost:5000/test-db
```

Should show:
```json
{"connected": true}
```

### Step 5: Test Frontend

1. Open: `http://192.168.137.221:5173`
2. Products should now load without CORS error
3. Try signing in with: `tarun@gmail.com` / `tarun123`

## 🔐 Test Credentials

After migration, these credentials will work:

```
Email: tarun@gmail.com
Password: tarun123

Email: test@test.com
Password: password

Email: admin@admin.com
Password: admin123
```

## 🔍 Troubleshooting

### Migration Fails - "Failed to connect"

**Check Atlas Cluster Status:**
1. Go to MongoDB Atlas dashboard
2. If cluster shows "Paused" → Click "Resume"
3. Wait 1-2 minutes for cluster to start

**Check Network Access:**
1. In Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
3. Or add your specific IP address

**Check Credentials:**
1. In Atlas → Database Access
2. Verify user `taruneeswar` exists
3. Password is `tarun123`
4. User has "Read and write to any database" permission

### CORS Error Still Appears

**If you see CORS error:**
1. Make sure backend server was **restarted** after CORS changes
2. Check the error - what origin is blocked?
3. Add that origin to `server.js` CORS array

**Current allowed origins:**
- `http://localhost:5173`
- `http://192.168.137.221:5173`
- Any `http://192.168.x.x:5173`
- `https://ecobaskett.netlify.app`

### Products Not Loading

**Check backend logs:**
```powershell
# In backend terminal, you should see:
MongoDB connected
```

**If you see connection errors:**
- Cluster might be paused (check Atlas)
- IP not whitelisted (add 0.0.0.0/0)
- Wrong credentials (check username/password)

**Test the API directly:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/products -UseBasicParsing
```

Should return list of products.

## 📊 MongoDB Compass

To view your Atlas database in Compass:

1. Open MongoDB Compass
2. Click "New Connection"
3. Paste connection string:
   ```
   mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/
   ```
4. Click "Connect"
5. Select database: `ecobasket`
6. You'll see collections: `products`, `users`, `orders`

## 🎯 Quick Reference

**Atlas Dashboard:** https://cloud.mongodb.com  
**Connection String:** `mongodb+srv://taruneeswar:tarun123@ecobasket.dsz6boh.mongodb.net/ecobasket`  
**Database Name:** `ecobasket`  
**Collections:** `products`, `users`, `orders`

## ⚡ Quick Migration Command

```powershell
cd "C:\Users\tarun\Music\MSD project\backend"
node migrateToAtlas.js
```

Then restart backend!
