
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Transaction = require('../models/Transaction');

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
      const newTransaction = new Transaction({
        amount,
        type,
        description,
        user: userId,
        hospital: hospital || 'Unknown',
        status: 'completed' // Auto-complete for demo purposes
      });

      const transaction = await newTransaction.save();

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
