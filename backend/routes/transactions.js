const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
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
      check('userId', 'User ID (Card Number) is required').not().isEmpty(),
      check('hospitalId', 'Hospital ID is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, type, description, userId, hospitalId } = req.body;

    try {
      // Find and update hospital's balance
      const hospital = await Hospital.findByIdAndUpdate(
        hospitalId,
        { 
          $inc: { 
            currentBalance: amount,
            totalTransactions: 1
          } 
        },
        { new: true }
      );

      if (!hospital) {
        return res.status(404).json({ msg: 'Hospital not found' });
      }

      console.log(`Hospital ${hospital.name} balance updated:`, {
        previousBalance: hospital.currentBalance - amount,
        transactionAmount: amount,
        newBalance: hospital.currentBalance
      });

      // Find patient by cardNumber and update balance atomically
      let patient;
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        // Try by _id first if it looks like an ObjectId
        patient = await Patient.findOneAndUpdate(
          { _id: userId },
          { $inc: { cardBalance: -amount } },
          { new: true }
        );
      }
      if (!patient) {
        // If not found by _id or if userId wasn't an ObjectId, try by cardNumber
        patient = await Patient.findOneAndUpdate(
          { cardNumber: userId },
          { $inc: { cardBalance: -amount } },
          { new: true }
        );
      }
      
      if (!patient) {
        // If patient not found, revert hospital balance update
        await Hospital.findByIdAndUpdate(
          hospitalId,
          { 
            $inc: { 
              currentBalance: -amount,
              totalTransactions: -1
            } 
          }
        );
        console.error('Patient not found for userId:', userId);
        return res.status(404).json({ msg: 'Patient not found' });
      }

      // Check if patient has enough balance (after the update)
      if (patient.cardBalance < 0) {
        // Revert both patient and hospital balance changes if insufficient
        await Promise.all([
          Patient.findByIdAndUpdate(
            patient._id,
            { $inc: { cardBalance: amount } }
          ),
          Hospital.findByIdAndUpdate(
            hospitalId,
            { 
              $inc: { 
                currentBalance: -amount,
                totalTransactions: -1
              } 
            }
          )
        ]);
        return res.status(400).json({ msg: 'Insufficient card balance' });
      }

      // Create and save transaction
      const newTransaction = new Transaction({
        user: patient._id,
        cardNumber: patient.cardNumber,
        amount,
        type,
        description,
        hospitalId,
        status: 'completed'
      });

      const transaction = await newTransaction.save();

      res.json({
        transaction,
        updatedCardBalance: patient.cardBalance,
        updatedHospitalBalance: hospital.currentBalance
      });
    } catch (err) {
      console.error('Transaction error:', err);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/transactions/user/:userId
// @desc    Get all transactions for a specific user (by card number)
// @access  Private (admin or hospital only)
router.get('/user/:userId', auth, async (req, res) => {
  // Only admins and hospitals can view other users' transactions
  if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
    return res.status(401).json({ msg: 'Not authorized to view these transactions' });
  }

  try {
    // Find transactions by cardNumber (userId is actually the card number)
    const transactions = await Transaction.find({ cardNumber: req.params.userId })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
