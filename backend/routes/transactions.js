
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Transaction = require('../models/Transaction');
const User = require('../models/User');

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
      check('userId', 'User ID is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
      return res.status(401).json({ msg: 'Not authorized to create transactions' });
    }

    const { amount, type, description, userId, hospital } = req.body;

    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const newTransaction = new Transaction({
        user: userId,
        amount,
        type,
        description,
        hospital: hospital || 'Unknown',
        status: 'completed' // Auto-complete for demo purposes
      });

      const transaction = await newTransaction.save();

      // Update user health card balance or loan status in a real application
      // This would be handled by separate user profile/card/loan services

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/transactions/user/:userId
// @desc    Get all transactions for a specific user
// @access  Private (admin or hospital only)
router.get('/user/:userId', auth, async (req, res) => {
  // Only admins and hospitals can view other users' transactions
  if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
    return res.status(401).json({ msg: 'Not authorized to view these transactions' });
  }

  try {
    const transactions = await Transaction.find({ user: req.params.userId })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
