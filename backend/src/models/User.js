const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['customer', 'retailer', 'admin'],
    default: 'customer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  retailerDetails: {
    shopName: String,
    commissionRate: {
      type: Number,
      default: 5,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    subPortalUrl: String,
  },
  firebaseUID: {
    type: String,
    unique: true,
    sparse: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);