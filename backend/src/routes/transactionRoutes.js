const express = require('express');
const router = express.Router();
const { purchaseBundle, paymentCallback, getUserTransactions, getRetailerTransactions } = require('../controllers/transactionController');

// POST /api/transactions/purchase
router.post('/purchase', purchaseBundle);

// POST /api/transactions/callback
router.post('/callback', paymentCallback);

// GET /api/transactions
router.get('/', getUserTransactions);

// GET /api/transactions/retailer
router.get('/retailer', getRetailerTransactions);

module.exports = router;