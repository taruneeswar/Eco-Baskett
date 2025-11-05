require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const TEST_USERS = [
  {
    email: 'test@test.com',
    password: 'password',
    name: 'Test User',
    phone: '1234567890',
    address: 'Test Address, Test City'
  },
  {
    email: 'admin@admin.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '9876543210',
    address: 'Admin Address, Admin City'
  },
  {
    email: 'tarun@gmail.com',
    password: 'tarun123',
    name: 'Tarun',
    phone: '1111111111',
    address: 'Tarun Address, Tarun City'
  }
];

(async () => {
  try {
    await connectDB();
    console.log('\n✅ Connected to database\n');
    console.log('Creating/Updating test users...\n');

    for (const testUser of TEST_USERS) {
      let user = await User.findOne({ email: testUser.email });
      
      if (user) {
        console.log(`📝 User exists: ${testUser.email}`);
        console.log('   Updating password...');
        user.password = testUser.password;
        user.name = testUser.name;
        user.phone = testUser.phone;
        user.address = testUser.address;
        await user.save();
        console.log('   ✅ Updated\n');
      } else {
        console.log(`➕ Creating new user: ${testUser.email}`);
        user = await User.create(testUser);
        console.log('   ✅ Created\n');
      }
    }

    console.log('========================================');
    console.log('TEST USERS READY:');
    console.log('========================================\n');
    
    TEST_USERS.forEach(u => {
      console.log(`Email: ${u.email}`);
      console.log(`Password: ${u.password}`);
      console.log('---');
    });

    console.log('\n✅ All test users are ready!');
    console.log('\nTest sign-in in your browser:');
    console.log('1. Go to http://localhost:5173/signin');
    console.log('2. Use any of the emails above');
    console.log('3. Use the corresponding password\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
