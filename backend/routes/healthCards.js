const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const HealthCard = require('../models/HealthCard');
const User = require('../models/User');

const MEDICARE_INTERNAL_SECRET = process.env.MEDICARE_INTERNAL_SECRET;

// Middleware for internal secret validation (for server-to-server communication)
const internalAuth = (req, res, next) => {
  const secret = req.header('X-Internal-Secret');
  if (!secret || secret !== MEDICARE_INTERNAL_SECRET) {
    console.warn('Unauthorized access attempt to internal route: Invalid X-Internal-Secret');
    return res.status(403).json({ msg: 'Forbidden: Invalid internal secret' });
  }
  next();
};


router.post('/internal/payment-update', [
  internalAuth, // Use the internal secret middleware
  [
    check('correlationId', 'Correlation ID is required').not().isEmpty(),
    check('payomatixId', 'Payomatix Transaction ID is required').not().isEmpty(),
    check('status', 'Payment status is required').isIn(['success', 'failed', 'declined', 'pending']), // Adjust statuses as per Payomatix
    check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
    check('currency', 'Currency is required').isLength({ min: 3, max: 3 }),
    check('userId', 'User ID is required').not().isEmpty(), // Ensure userId is present
    check('cardId', 'Card ID is required').not().isEmpty()   // Ensure cardId is present
  ]
], async (req, res) => {
  console.log('--- RECEIVED /internal/payment-update ---');
  console.log('Payload from Payomatix Proxy:', JSON.stringify(req.body, null, 2));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors for /internal/payment-update:', errors.array());
    return res.status(400).json({ success: false, message: 'Invalid payload received', errors: errors.array() });
  }

  const {
    correlationId,
    payomatixId,
    status,
    amount,
    currency,
    userId, // Expected from proxy
    cardId  // Expected from proxy
  } = req.body;

  try {
    // 1. Find the HealthCard for the specified user and cardId
    // This adds an extra layer of security and ensures the card belongs to the user
    const healthCard = await HealthCard.findOne({ _id: cardId, user: userId });

    if (!healthCard) {
      console.error(`Health card not found for ID: ${cardId} and User: ${userId}`);
      return res.status(404).json({ success: false, message: 'Health card not found for this user.' });
    }

    // 2. Prevent double processing (idempotency) - CRITICAL for webhooks
    // You'd typically store webhook IDs or correlation IDs in a separate log/transaction collection
    // to prevent processing the same webhook multiple times if Payomatix retries.
    // For now, we'll assume a simple check against status, but a dedicated 'PaymentTransaction'
    // model would be better for full idempotency.
    // Example: Check if a transaction with this payomatixId and 'success' status already exists.
    // If (await PaymentTransaction.exists({ payomatixId, status: 'success' })) { ... }
    if (status === 'success' && healthCard.availableCredit >= healthCard.approvedCreditLimit) {
        console.warn(`Card ${cardId} for user ${userId} is already at max credit or higher. Skipping top-up for status 'success'.`);
        return res.status(200).json({ success: true, message: 'Health card already at maximum credit or higher, no update needed.' });
    }


    // 3. Process based on payment status
    if (status === 'success') {
      const newAvailableCredit = healthCard.availableCredit + amount;

      // Ensure we don't exceed the approvedCreditLimit
      if (newAvailableCredit > healthCard.approvedCreditLimit) {
        console.warn(`Attempted to top-up card ${cardId} beyond approved limit. Limiting to max.`);
        healthCard.availableCredit = healthCard.approvedCreditLimit; // Cap at max
      } else {
        healthCard.availableCredit = newAvailableCredit;
      }
      
      await healthCard.save();
      console.log(`Health card ${cardId} (user: ${userId}) topped up successfully. New available credit: ${healthCard.availableCredit}`);
      return res.status(200).json({ success: true, message: 'Health card updated successfully.', newAvailableCredit: healthCard.availableCredit });

    } else if (status === 'failed' || status === 'declined') {
      console.warn(`Payment for card ${cardId} (user: ${userId}) failed/declined. No credit update.`);
      // You might log this as a failed transaction in a dedicated PaymentTransaction model
      return res.status(200).json({ success: true, message: 'Payment failed/declined, no health card update.' });
    } else {
      console.log(`Payment for card ${cardId} (user: ${userId}) has status: ${status}. No action taken for this status.`);
      return res.status(200).json({ success: true, message: `Payment status ${status} received, no specific update action.` });
    }

  } catch (err) {
    console.error('Error in /internal/payment-update route:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid User or Card ID format.' });
    }
    res.status(500).json({ success: false, message: 'Internal server error processing payment update.' });
  }
});


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
    check('cardType', 'Card type is required').isIn(['health_paylater', 'health_emi', 'health_50_50', 'ri_medicare_discount']),
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
    
    // Set credit limits and features based on card type
    let maxCreditLimit = 25000;
    let discountPercentage = 0;
    let monthlyLimit = null;
    let interestRate = null;
    let zeroInterestMonths = null;
    let dailyCashBenefit = null;

    switch (cardType) {
      case 'health_paylater':
        maxCreditLimit = 25000;
        zeroInterestMonths = 3; // 0% interest for first 3 months
        break;
      case 'health_emi':
        maxCreditLimit = 100000;
        interestRate = 15; // Default ROI 12-18%, set to midpoint
        break;
      case 'health_50_50':
        maxCreditLimit = 50000;
        break;
      case 'ri_medicare_discount':
        maxCreditLimit = 50000;
        discountPercentage = 15; // 10-15% discount, set to max
        monthlyLimit = 50000;
        dailyCashBenefit = 3000; // Up to ₹3,000/day
        break;
    }

    // Validate requested credit limit
    const approvedCreditLimit = Math.min(requestedCreditLimit, maxCreditLimit);

    const newHealthCard = new HealthCard({
      cardNumber,
      patientId: user.id,
      user: req.user.id,
      uhid: user.uhid,
      availableCredit: 0, // Will be activated after admin approval
      usedCredit: 0,
      status: 'pending', // Requires admin approval
      cardType,
      discountPercentage,
      monthlyLimit,
      requestedCreditLimit: approvedCreditLimit,
      approvedCreditLimit,
      medicalHistory,
      monthlyIncome,
      employmentStatus,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      interestRate,
      zeroInterestMonths,
      dailyCashBenefit
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

// @route   POST api/health-cards/:id/pay
// @desc    Pay health card credit
// @access  Private
router.post('/:id/pay', [
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
      return res.status(400).json({ msg: 'Health card must be active to make payments' });
    }

    if (amount > healthCard.usedCredit) {
      return res.status(400).json({ msg: 'Payment amount cannot exceed used credit' });
    }

    // Simulate payment processing
    const transactionId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Update health card balances
    healthCard.usedCredit -= amount;
    healthCard.availableCredit += amount;
    await healthCard.save();

    res.json({
      message: 'Payment successful',
      transactionId,
      newUsedCredit: healthCard.usedCredit,
      newAvailableCredit: healthCard.availableCredit,
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

      let maxCreditLimit = 25000;
      let discountPercentage = 0;
      let monthlyLimit = null;
      let interestRate = null;
      let zeroInterestMonths = null;
      let dailyCashBenefit = null;

      switch (cardType) {
        case 'health_paylater':
          maxCreditLimit = 25000;
          zeroInterestMonths = 3;
          break;
        case 'health_emi':
          maxCreditLimit = 100000;
          interestRate = 15; // Default ROI 12-18%
          break;
        case 'health_50_50':
          maxCreditLimit = 50000;
          break;
        case 'ri_medicare_discount':
          maxCreditLimit = 50000;
          discountPercentage = 15;
          monthlyLimit = 50000;
          dailyCashBenefit = 3000;
          break;
      }

      const newHealthCard = new HealthCard({
        cardNumber,
        user: userId,
        uhid: user.uhid,
        availableCredit: availableCredit || maxCreditLimit,
        cardType: cardType || 'basic',
        status: 'active',
        expiryDate,
        discountPercentage,
        monthlyLimit,
        interestRate,
        zeroInterestMonths,
        dailyCashBenefit
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