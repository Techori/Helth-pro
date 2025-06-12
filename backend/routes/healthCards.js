
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const HealthCard = require('../models/HealthCard');
const User = require('../models/User');

// @route   GET api/health-cards
// @desc    Get all health cards for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const healthCards = await HealthCard.find({ user: req.user.id }).sort({ issueDate: -1 });
    res.json(healthCards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/health-cards/admin/all
// @desc    Get all health cards for admin
// @access  Private (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const healthCards = await HealthCard.find({})
      .populate('user', 'firstName lastName email')
      .sort({ issueDate: -1 });
    
    res.json(healthCards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health-cards/apply
// @desc    Apply for a health card
// @access  Private
router.post('/apply', [
  auth,
  [
    check('cardType', 'Card type is required').isIn(['basic', 'premium', 'ricare_discount']),
    check('requestedCreditLimit', 'Requested credit limit is required').isNumeric(),
    check('monthlyIncome', 'Monthly income is required').isNumeric(),
    check('employmentStatus', 'Employment status is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user's KYC is completed
    const user = await User.findById(req.user.id);
    if (!user || user.kycStatus !== 'completed') {
      return res.status(400).json({ msg: 'KYC verification must be completed before applying for a health card' });
    }

    const { cardType, requestedCreditLimit, medicalHistory, monthlyIncome, employmentStatus } = req.body;

    // Generate card number
    const cardNumber = `HC${Date.now().toString().slice(-10)}`;
    
    // Set credit limits based on card type
    let maxCreditLimit = 25000; // basic
    let discountPercentage = 0;
    let monthlyLimit = null;

    if (cardType === 'premium') {
      maxCreditLimit = 100000;
    } else if (cardType === 'ricare_discount') {
      maxCreditLimit = 50000;
      discountPercentage = 15;
      monthlyLimit = 50000;
    }

    // Validate requested credit limit
    const approvedCreditLimit = Math.min(requestedCreditLimit, maxCreditLimit);

    const newHealthCard = new HealthCard({
      cardNumber,
      user: req.user.id,
      uhid: user.uhid,
      availableCredit: 0, // Will be activated after admin approval
      usedCredit: 0,
      status: 'pending', // Requires admin approval
      cardType,
      discountPercentage: cardType === 'ricare_discount' ? discountPercentage : undefined,
      monthlyLimit: cardType === 'ricare_discount' ? monthlyLimit : undefined,
      requestedCreditLimit: approvedCreditLimit,
      medicalHistory,
      monthlyIncome,
      employmentStatus,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    });

    const healthCard = await newHealthCard.save();
    res.json(healthCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/health-cards/:id/approve
// @desc    Approve health card application (admin only)
// @access  Private
router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const healthCard = await HealthCard.findById(req.params.id);
    if (!healthCard) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    const { approvedCreditLimit } = req.body;

    healthCard.status = 'active';
    healthCard.availableCredit = approvedCreditLimit || healthCard.requestedCreditLimit || 25000;
    healthCard.issueDate = new Date();

    await healthCard.save();

    res.json({
      message: 'Health card approved successfully',
      healthCard
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/health-cards/:id/reject
// @desc    Reject health card application (admin only)
// @access  Private
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const healthCard = await HealthCard.findById(req.params.id);
    if (!healthCard) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    const { rejectionReason } = req.body;

    healthCard.status = 'rejected';
    healthCard.rejectionReason = rejectionReason;

    await healthCard.save();

    res.json({
      message: 'Health card rejected successfully',
      healthCard
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health-cards/:id/topup
// @desc    Top up health card balance
// @access  Private
router.post('/:id/topup', [
  auth,
  [
    check('amount', 'Amount is required and must be positive').isFloat({ min: 1 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, paymentMethod } = req.body;

    const healthCard = await HealthCard.findById(req.params.id);
    if (!healthCard) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    // Check if user owns the health card
    if (healthCard.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (healthCard.status !== 'active') {
      return res.status(400).json({ msg: 'Health card must be active to top up' });
    }

    // Simulate payment processing
    const transactionId = `TOP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Update health card balance
    healthCard.availableCredit += amount;
    await healthCard.save();

    res.json({
      message: 'Top-up successful',
      transactionId,
      newBalance: healthCard.availableCredit,
      amount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health-cards
// @desc    Create a health card (admin only)
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('cardNumber', 'Card number is required').not().isEmpty(),
      check('userId', 'User ID is required').not().isEmpty(),
      check('expiryDate', 'Expiry date is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to create health cards' });
    }

    const { cardNumber, userId, availableCredit, expiryDate, cardType } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const newHealthCard = new HealthCard({
        cardNumber,
        user: userId,
        uhid: user.uhid,
        availableCredit: availableCredit || 25000,
        cardType: cardType || 'basic',
        status: 'active',
        expiryDate
      });

      const healthCard = await newHealthCard.save();
      res.json(healthCard);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/health-cards/:id
// @desc    Get health card by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const healthCard = await HealthCard.findById(req.params.id);

    if (!healthCard) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    // Make sure user owns health card or is admin
    if (healthCard.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(healthCard);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Health card not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
