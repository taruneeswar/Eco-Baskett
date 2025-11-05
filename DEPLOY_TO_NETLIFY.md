# Deploy Frontend to Netlify - Connect with Render Backend

## 🎯 Your URLs
- **Frontend (Netlify):** https://ecobaskett.netlify.app/
- **Backend (Render):** https://eco-basket-backend.onrender.com

## ✅ What I've Done

1. ✅ Created `.env.production` with Render backend URL
2. ✅ Verified CORS allows Netlify domain
3. ✅ Both sites are live and responding

## 🚀 Deploy Updated Frontend to Netlify

### Option 1: Git Push (Recommended)

If connected to GitHub:

```bash
git add .
git commit -m "Update production env to use Render backend"
git push origin main
```

Netlify will **auto-deploy** in 1-2 minutes.

### Option 2: Manual Deploy via Netlify CLI

```bash
cd frontend
npm run build
netlify deploy --prod
```

### Option 3: Drag & Drop in Netlify Dashboard

1. Build locally:
   ```bash
   cd frontend
   npm run build
   ```

2. Go to: https://app.netlify.com
3. Open your site
4. Go to **Deploys** tab
5. Drag the `dist` folder to deploy

## 🔧 Set Environment Variables in Netlify Dashboard

**Important:** Netlify needs the env vars set in dashboard:

1. Go to: https://app.netlify.com
2. Open your site **"ecobaskett"**
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add:
   ```
   Key: VITE_API_URL
   Value: https://eco-basket-backend.onrender.com/api
   ```
6. Add another:
   ```
   Key: VITE_RAZORPAY_KEY_ID
   Value: your_razorpay_key_id_here
   ```
7. Click **Save**
8. Go to **Deploys** → **Trigger deploy** → **Deploy site**

## ✅ After Deployment

Visit: **https://ecobaskett.netlify.app/**

Products should load from Render backend!

## 🔍 Verify Backend is Working

Test Render backend directly:

```bash
# Check if backend is up
curl https://eco-basket-backend.onrender.com

# Should return: "Eco Basket API"

# Check products
curl https://eco-basket-backend.onrender.com/api/products

# Should return JSON array of products
```

## ⚠️ Common Issues

### Issue 1: "Cannot GET /api"

**Problem:** Backend routes not working

**Fix:**
- Check Render backend logs
- Ensure MongoDB Atlas is connected (not paused)
- Render backend might be sleeping (free tier) - first request wakes it

### Issue 2: CORS Error

**Problem:** Netlify domain blocked

**Fix:**
- Backend `server.js` already has `https://ecobaskett.netlify.app` in CORS
- If still blocked, redeploy backend to Render

### Issue 3: Products Not Loading

**Problem:** Backend database empty or disconnected

**Fix:**
1. Check Render backend logs for MongoDB connection errors
2. Ensure MongoDB Atlas cluster is running (not paused)
3. Seed data to Atlas:
   ```bash
   cd backend
   node migrateToAtlas.js
   ```

### Issue 4: Render Backend Sleeping

**Problem:** First request takes 30+ seconds

**This is normal for Render free tier:**
- Backend "sleeps" after 15 minutes of inactivity
- First request wakes it up (takes ~30 seconds)
- Subsequent requests are fast

**Solution:** Upgrade to paid Render plan, or accept the delay

## 🧪 Test Production Setup Locally

Before deploying, test production build locally:

```bash
cd frontend
npm run build
npm run preview
```

Open: http://localhost:4173

Should connect to Render backend and load products.

## 📝 Files Changed

- ✅ `frontend/.env.production` - Created (Render backend URL)
- ✅ `backend/server.js` - Already has Netlify in CORS

## 🎯 Quick Deploy Command

```bash
cd "C:\Users\tarun\Music\MSD project\frontend"
git add .
git commit -m "Connect Netlify to Render backend"
git push origin main
```

Netlify will auto-deploy!

## ✅ Expected Result

After deployment:
1. Visit: https://ecobaskett.netlify.app/
2. Products load from Render backend
3. Sign in works
4. Cart works
5. All features functional

## 🔑 Production Test Credentials

Make sure these exist in your Atlas database:
- tarun@gmail.com / tarun123
- test@test.com / password
- admin@admin.com / admin123

Run migration on backend if needed:
```bash
cd backend
node migrateToAtlas.js
```
