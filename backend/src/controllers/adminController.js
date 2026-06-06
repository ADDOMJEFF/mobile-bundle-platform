const User = require('../models/User');
const Bundle = require('../models/Bundle');
const Transaction = require('../models/Transaction');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-firebaseUID')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name phoneNumber')
      .populate('bundle', 'name network type amount')
      .populate('retailer', 'name phoneNumber')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

// @desc    Update bundle
// @route   PUT /api/admin/bundles/:id
const updateBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found',
      });
    }

    res.json({
      success: true,
      bundle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bundle',
    });
  }
};

// @desc    Delete bundle
// @route   DELETE /api/admin/bundles/:id
const deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndDelete(req.params.id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found',
      });
    }

    res.json({
      success: true,
      message: 'Bundle deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete bundle',
    });
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRetailers = await User.countDocuments({ role: 'retailer' });
    const totalBundles = await Bundle.countDocuments({ isActive: true });
    const totalTransactions = await Transaction.countDocuments();
    
    const revenue = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const commissions = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$commission' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRetailers,
        totalBundles,
        totalTransactions,
        totalRevenue: revenue[0]?.total || 0,
        totalCommissions: commissions[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
};

module.exports = {
  getUsers,
  getAllTransactions,
  updateBundle,
  deleteBundle,
  getStats,
};