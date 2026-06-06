const Transaction = require('../models/Transaction');
const Bundle = require('../models/Bundle');
const User = require('../models/User');

// @desc    Initiate purchase
// @route   POST /api/transactions/purchase
const purchaseBundle = async (req, res) => {
  try {
    const { phoneNumber, bundleId, recipientPhone, paymentMethod, retailerId } = req.body;

    // Clean and format phone number
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '+233' + cleanPhone.substring(1);
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: cleanPhone });

    if (!user) {
      user = await User.create({
        phoneNumber: cleanPhone,
        name: 'Customer',
        firebaseUID: `FIREBASE_${Date.now()}`,
        role: 'customer',
      });
    }

    // Find bundle
    const bundle = await Bundle.findById(bundleId);
    if (!bundle || !bundle.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found or inactive',
      });
    }

    // Calculate commission
    let commission = 0;
    let retailer = null;

    if (retailerId) {
      retailer = await User.findById(retailerId);
      if (retailer && retailer.role === 'retailer') {
        commission = (bundle.amount * bundle.commissionRate) / 100;
      }
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      bundle: bundle._id,
      retailer: retailer ? retailer._id : null,
      recipientPhone: recipientPhone || cleanPhone,
      amount: bundle.amount,
      commission,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'delivered',
      hubtelTransactionId: `HUBTEL_${Date.now()}`,
    });

    // Update retailer earnings
    if (retailer && commission > 0) {
      await User.findByIdAndUpdate(retailer._id, {
        $inc: { 'retailerDetails.totalEarnings': commission },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Purchase successful!',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        commission: transaction.commission,
        paymentStatus: transaction.paymentStatus,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error('Purchase Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process purchase',
    });
  }
};

// @desc    Payment callback from Hubtel
// @route   POST /api/transactions/callback
const paymentCallback = async (req, res) => {
  try {
    const { clientReference, status, transactionId } = req.body;

    const transaction = await Transaction.findById(clientReference);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (status === 'Success' || status === 'Completed') {
      transaction.paymentStatus = 'completed';
      transaction.status = 'processing';
      transaction.hubtelTransactionId = transactionId;

      if (transaction.retailer) {
        await User.findByIdAndUpdate(transaction.retailer, {
          $inc: { 'retailerDetails.totalEarnings': transaction.commission },
        });
      }
    } else {
      transaction.paymentStatus = 'failed';
      transaction.status = 'failed';
    }

    await transaction.save();

    res.json({
      success: true,
      message: 'Callback processed',
      status: transaction.paymentStatus,
    });
  } catch (error) {
    console.error('Callback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Callback processing failed',
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
const getUserTransactions = async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const transactions = await Transaction.find({ user: user._id })
      .populate('bundle', 'name network type amount')
      .populate('retailer', 'name phoneNumber')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

// @desc    Get retailer transactions
// @route   GET /api/transactions/retailer
const getRetailerTransactions = async (req, res) => {
  try {
    const { retailerId } = req.query;

    const transactions = await Transaction.find({ retailer: retailerId })
      .populate('bundle', 'name network type amount')
      .populate('user', 'name phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error('Retailer Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

module.exports = {
  purchaseBundle,
  paymentCallback,
  getUserTransactions,
  getRetailerTransactions,
};