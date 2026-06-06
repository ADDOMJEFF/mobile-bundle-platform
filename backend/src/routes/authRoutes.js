const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getMe, registerRetailer, getShopBySlug } = require('../controllers/authController');

// POST /api/auth/send-otp
router.post('/send-otp', sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// POST /api/auth/register-retailer
router.post('/register-retailer', registerRetailer);

// GET /api/auth/shop/:slug
router.get('/shop/:slug', getShopBySlug);

// GET /api/auth/me?phoneNumber=+233XXXXXXXXX
router.get('/me', getMe);

module.exports = router;