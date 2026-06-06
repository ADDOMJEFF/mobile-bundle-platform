const express = require('express');
const router = express.Router();
const { getBundles, getBundle, createBundle } = require('../controllers/bundleController');

// GET /api/bundles
router.get('/', getBundles);

// GET /api/bundles/:id
router.get('/:id', getBundle);

// POST /api/bundles
router.post('/', createBundle);

module.exports = router;