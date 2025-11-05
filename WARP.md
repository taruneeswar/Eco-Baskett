# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Eco Basket is a full-stack e-commerce application for organic/eco-friendly products. It consists of a Node.js/Express backend with MongoDB and a React/Vite frontend with Tailwind CSS.

## Architecture

### Backend (Node.js/Express/MongoDB)
- **Entry Point**: `backend/server.js` - Express server with CORS configured for localhost:5173 and Netlify deployment
- **Database**: MongoDB connection via Mongoose (config in `backend/config/db.js`)
- **Authentication**: JWT-based auth with Bearer tokens (middleware in `backend/middleware/auth.js`)
- **Models**:
  - `User` - Contains embedded cart array with product references and quantities; password hashing via bcrypt pre-save hook
  - `Product` - Basic product schema with name, description, price, image, category
- **Routes**:
  - `/api/auth` - signup, signin, /me endpoint
  - `/api/products` - product CRUD operations
  - `/api/cart` - cart management (add, update, delete items)

### Frontend (React/Vite/Tailwind)
- **Entry Point**: `frontend/src/main.jsx` - React app wrapped with BrowserRouter, AuthProvider, and Toaster
- **Routing**: React Router with PrivateRoute wrapper for protected routes (e.g., cart)
- **State Management**: 
  - AuthContext (`frontend/src/state/AuthContext.jsx`) - manages JWT token and user data in localStorage
  - No global state library; cart data fetched from backend per request
- **API Client**: Axios instance (`frontend/src/utils/api.js`) configured with baseURL from `VITE_API_URL` env var
- **Pages**: Home (product listing), SignIn, SignUp, Cart (protected)
- **Components**: Header (navigation), ProductCard
- **Styling**: Tailwind CSS with custom `eco` color palette (green, dark, light)

### Key Architectural Decisions
- **Embedded Cart**: Cart items stored directly in User document (not separate collection) for simpler queries
- **Auth Flow**: Token stored in localStorage, included as Bearer token in Authorization header
- **CORS**: Backend explicitly allows localhost:5173 and production Netlify URL with credentials
- **Image Hosting**: Product images use external URLs (Unsplash, other CDNs)

## Development Commands

### Backend
```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Start with nodemon (auto-reload)
npm start                      # Production start
npm run seed                   # Seed products from seed/seedProducts.js
```

### Frontend
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start Vite dev server (port 5173)
npm run build                  # Production build
npm run preview                # Preview production build
```

### Environment Setup

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecobasket
JWT_SECRET=your-secret-here
```

**Frontend** (`frontend/.env.development`):
```
VITE_API_URL=http://localhost:5000/api
```
(Production uses Render backend URL as default fallback)

### Database Setup
1. Ensure MongoDB is running locally or use a cloud instance
2. Copy `backend/.env.example` to `backend/.env` and configure `MONGODB_URI`
3. Run `npm run seed` from backend directory to populate initial products

## Testing

No formal test framework is currently configured. To test:
- Backend: Use `/test-db` endpoint to verify MongoDB connection
- Frontend: Manual testing in browser
- API: Test endpoints using curl, Postman, or similar tools

## Working with Authentication

- Protected routes use `auth` middleware which verifies JWT and attaches `req.userId`
- Frontend stores token in localStorage and includes it as `Authorization: Bearer <token>` header
- Token expires in 7 days (configured in auth routes)
- All cart operations require authentication

## Working with the Cart

- Cart is embedded in User document, not a separate collection
- Cart operations always re-populate product details after mutation
- Adding same product increases quantity rather than creating duplicate entries
- Cart items reference Product by ObjectId with `ref: 'Product'`
