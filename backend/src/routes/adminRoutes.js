const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getUsers,
  getAllTransactions,
  updateBundle,
  deleteBundle,
  getStats,
} = require('../controllers/adminController');

// All routes require admin auth
router.get('/users', adminAuth, getUsers);
router.get('/transactions', adminAuth, getAllTransactions);
router.put('/bundles/:id', adminAuth, updateBundle);
router.delete('/bundles/:id', adminAuth, deleteBundle);
router.get('/stats', adminAuth, getStats);

module.exports = router;