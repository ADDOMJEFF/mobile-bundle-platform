const User = require('../models/User');
const admin = require('../config/firebase');

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Clean the phone number
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    
    // Validate Ghana phone number
    const ghanaRegex = /^(?:\+233|0)[25][0-9]{8}$/;
    if (!ghanaRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ghana phone number. Format: 0501234567 or +233501234567',
      });
    }

    // Format phone number
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '+233' + cleanPhone.substring(1);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: formattedPhone,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

// @desc    Verify OTP and login/register user
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, firebaseUID, name } = req.body;

    // Clean and format phone number
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '+233' + cleanPhone.substring(1);
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: formattedPhone });

    if (!user) {
      user = await User.create({
        phoneNumber: formattedPhone,
        name: name || 'Customer',
        firebaseUID: firebaseUID || `FIREBASE_${Date.now()}`,
        role: 'customer',
      });
    } else {
      if (!user.firebaseUID) {
        user.firebaseUID = firebaseUID || `FIREBASE_${Date.now()}`;
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        walletBalance: user.walletBalance,
        retailerDetails: user.retailerDetails,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        walletBalance: user.walletBalance,
        retailerDetails: user.retailerDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};

// @desc    Register as retailer
// @route   POST /api/auth/register-retailer
const registerRetailer = async (req, res) => {
  try {
    const { phoneNumber, name, shopName, location } = req.body;

    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+233' + phoneNumber.substring(1);
    }

    let user = await User.findOne({ phoneNumber: formattedPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please login first.',
      });
    }

    const subPortalSlug = shopName.toLowerCase().replace(/\s+/g, '-');
    const subPortalUrl = `${process.env.FRONTEND_URL}/shop/${subPortalSlug}-${user._id.toString().slice(-6)}`;

    user.role = 'retailer';
    user.name = name;
    user.retailerDetails = {
      shopName,
      location,
      commissionRate: 5,
      totalEarnings: 0,
      subPortalUrl,
    };

    await user.save();

    res.json({
      success: true,
      message: 'Retailer registration successful',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        retailerDetails: user.retailerDetails,
      },
    });
  } catch (error) {
    console.error('Retailer Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

// @desc    Get shop details by slug
// @route   GET /api/auth/shop/:slug
const getShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const user = await User.findOne({
      role: 'retailer',
      'retailerDetails.subPortalUrl': { $regex: slug, $options: 'i' },
    }).select('-firebaseUID');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.json({
      success: true,
      retailer: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        retailerDetails: user.retailerDetails,
      },
    });
  } catch (error) {
    console.error('Get Shop Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop',
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getMe,
  registerRetailer,
  getShopBySlug,
};