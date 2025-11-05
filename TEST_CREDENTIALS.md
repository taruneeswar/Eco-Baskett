# Test Credentials

## Working Sign-In Credentials

### Account 1 (Primary)
- **Email:** `tarun@gmail.com`
- **Password:** `tarun123`
- **Name:** Test User

### Account 2 (Alternative)
- **Email:** `test@example.com`
- **Password:** `password123`
- **Name:** Test User

## Other Existing Users in Database
These users exist but passwords were NOT reset:
- testuser@gmail.com
- s@gmail.com (Srikar)
- pranathi@gmail.com
- aaa@gmail.com

## How to Reset Password for Any User

Use the `resetUser.js` script:

```bash
cd backend
node resetUser.js <email> <password>
```

**Examples:**
```bash
# Reset password for existing user
node resetUser.js pranathi@gmail.com mynewpassword

# Create new user (if email doesn't exist)
node resetUser.js newuser@gmail.com password123
```

## Sign Up New Users

You can also create new users through the frontend:
1. Go to http://localhost:5173/signup
2. Fill in the form
3. Sign up with any email/password combination

## Application URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Database:** MongoDB Atlas (Connected)

## Testing Payment

Payment is currently in **TEST MODE** (no real Razorpay keys configured):
- Add items to cart
- Proceed to checkout
- Fill delivery details
- Click "Pay" → Will simulate payment automatically
- Order will be created and saved to database

## Current Status

✅ MongoDB Atlas connected
✅ Products loaded (25 items)
✅ Sign-in working
✅ Sign-up working
✅ Cart functionality working
✅ Payment test mode working
✅ Order history working
