const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { processHealthCardPayment } = require('../services/payment');

// @route   GET api/transactions/all
// @desc    Get all transactions (admin only)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to view all transactions' });
    }

    const transactions = await Transaction.find()
      .populate('user', 'firstName lastName email uhid')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/user/:userId
// @desc    Get all transactions for a specific user (by card number)
// @access  Private (admin or hospital only)
router.get('/user/:userId', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
    return res.status(401).json({ msg: 'Not authorized to view these transactions' });
  }

  try {
    const transactions = await Transaction.find({ cardNumber: req.params.userId })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/history
// @desc    Get all transactions for transaction history (admin/hospital only)
// @access  Private (admin or hospital only)
router.get('/history', auth, async (req, res) => {
  // Only admins and hospitals can view all transactions
  if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
    return res.status(401).json({ msg: 'Not authorized to view transaction history' });
  }

  try {
    const transactions = await Transaction.find({})
      .populate('user', 'email firstName lastName')
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/:id
// @desc    Get transaction by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    // Check if the user owns this transaction or is an admin/hospital
    if (
      transaction.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'hospital'
    ) {
      return res.status(401).json({ msg: 'Not authorized to access this transaction' });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transactions
// @desc    Create a transaction
// @access  Private (hospital or admin)
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['payment', 'refund', 'charge']),
      check('description', 'Description is required').not().isEmpty(),
      check('userId', 'User ID (Card Number) is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, type, description, userId, hospital } = req.body;

    try {
      // Find patient by cardNumber or _id and update balance atomically
      let patient;
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        patient = await Patient.findOneAndUpdate(
          { _id: userId },
          { $inc: { cardBalance: -amount } },
          { new: true }
        );
      }
      if (!patient) {
        patient = await Patient.findOneAndUpdate(
          { cardNumber: userId },
          { $inc: { cardBalance: -amount } },
          { new: true }
        );
      }
      
      if (!patient) {
        console.error('Patient not found for userId:', userId);
        return res.status(404).json({ msg: 'Patient not found' });
      }

      // Check if patient has enough balance (after the update)
      if (patient.cardBalance < 0) {
        await Patient.findByIdAndUpdate(
          patient._id,
          { $inc: { cardBalance: amount } }
        );
        return res.status(400).json({ msg: 'Insufficient card balance' });
      }

      // Create and save transaction
      const newTransaction = new Transaction({
        user: patient._id,
        cardNumber: patient.cardNumber,
        amount,
        type,
        description,
        hospital: hospital || 'Unknown',
        status: 'completed'
      });

      const transaction = await newTransaction.save();

      res.json({
        transaction,
        updatedCardBalance: patient.cardBalance
      });
    } catch (err) {
      console.error('Transaction error:', err);
      res.status(500).send('Server Error');
    }
  }
);


// @route   POST api/transactions/health-card-payment
// @desc    Process payment using health card for processing fees
// @access  Private
router.post(
  '/health-card-payment',
  [
    auth,
    [
      check('healthCardId', 'Health card ID is required').isMongoId(),
      check('amount', 'Amount is required and must be positive').isFloat({ min: 1 }),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { healthCardId, amount, description } = req.body;

    try {
      const paymentResult = await processHealthCardPayment({
        userId: req.user.id,
        healthCardId,
        amount,
        description
      });

      res.json({
        message: 'Payment successful',
        transactionId: paymentResult.transactionId,
        newAvailableCredit: paymentResult.newAvailableCredit,
        newUsedCredit: paymentResult.newUsedCredit,
        amount: paymentResult.amount
      });
    } catch (err) {
      console.error('Payment error:', err.message);
      res.status(400).json({ msg: err.message });
    }
  }
);

module.exports = router;