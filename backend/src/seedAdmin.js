const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const adminPhone = '+233500000000';
    
    let admin = await User.findOne({ phoneNumber: adminPhone });
    
    if (!admin) {
      admin = await User.create({
        phoneNumber: adminPhone,
        name: 'Admin',
        role: 'admin',
        firebaseUID: 'ADMIN_FIREBASE_001',
      });
      console.log('Admin user created');
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated');
    }

    console.log(`Admin login: ${adminPhone}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed Admin Error:', error);
    process.exit(1);
  }
};

seedAdmin();