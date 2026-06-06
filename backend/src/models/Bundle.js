const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  network: {
    type: String,
    required: true,
    enum: ['MTN', 'Vodafone', 'AirtelTigo'],
  },
  type: {
    type: String,
    required: true,
    enum: ['data', 'voice', 'combo'],
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  dataVolume: {
    type: String,
  },
  validity: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  commissionRate: {
    type: Number,
    default: 3,
  },
  hubtelItemCode: {
    type: String,
    sparse: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bundle', bundleSchema);