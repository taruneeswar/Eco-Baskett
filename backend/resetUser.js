require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

// Configuration - Change these values as needed
const TEST_USER = {
  email: process.argv[2] || 'test@example.com',
  password: process.argv[3] || 'password123',
  name: 'Test User',
  phone: '1234567890',
  address: '123 Test Street, Test City'
};

if (!process.argv[2]) {
  console.log('\n💡 Usage: node resetUser.js <email> <password>');
  console.log('   Example: node resetUser.js tarun@gmail.com mypassword\n');
  console.log('Using default test user...\n');
}

(async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas\n');

    // Check if user exists
    let user = await User.findOne({ email: TEST_USER.email });

    if (user) {
      console.log(`✅ User found: ${user.email}`);
      console.log('Updating password...');
      
      user.password = TEST_USER.password;
      user.name = TEST_USER.name;
      user.phone = TEST_USER.phone;
      user.address = TEST_USER.address;
      await user.save();
      
      console.log('✅ Password updated successfully!\n');
    } else {
      console.log('User not found. Creating new user...');
      
      user = await User.create({
        email: TEST_USER.email,
        password: TEST_USER.password,
        name: TEST_USER.name,
        phone: TEST_USER.phone,
        address: TEST_USER.address
      });
      
      console.log('✅ User created successfully!\n');
    }

    console.log('=================================');
    console.log('Use these credentials to sign in:');
    console.log('=================================');
    console.log('Email:', TEST_USER.email);
    console.log('Password:', TEST_USER.password);
    console.log('=================================\n');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
