const Bundle = require('../models/Bundle');

// @desc    Get all bundles
// @route   GET /api/bundles
const getBundles = async (req, res) => {
  try {
    const { network, type } = req.query;
    
    let query = { isActive: true };
    
    if (network) {
      query.network = network;
    }
    
    if (type) {
      query.type = type;
    }

    const bundles = await Bundle.find(query).sort({ amount: 1 });

    res.json({
      success: true,
      count: bundles.length,
      bundles,
    });
  } catch (error) {
    console.error('Get Bundles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bundles',
    });
  }
};

// @desc    Get single bundle
// @route   GET /api/bundles/:id
const getBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);

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
    console.error('Get Bundle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bundle',
    });
  }
};

// @desc    Create bundle (Admin only)
// @route   POST /api/bundles
const createBundle = async (req, res) => {
  try {
    const bundle = await Bundle.create(req.body);

    res.status(201).json({
      success: true,
      bundle,
    });
  } catch (error) {
    console.error('Create Bundle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bundle',
    });
  }
};

module.exports = {
  getBundles,
  getBundle,
  createBundle,
};