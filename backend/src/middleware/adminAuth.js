const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(401).json({
        success: false,
        message: 'Phone number required',
      });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Auth failed',
    });
  }
};

module.exports = adminAuth;