const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
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
      check('userEmail', 'User Email is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    console.log('Transaction POST request received');
    console.log('User making request:', req.user);
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, type, description, userId, userEmail } = req.body;

    try {
      // First, check if the user making the request is a hospital user
      const requestingUser = await User.findById(req.user.id);
      if (!requestingUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      console.log('Requesting user:', requestingUser.email, 'Role:', requestingUser.role);
      console.log('Provided userEmail:', userEmail);
      
      // If the user is a hospital user, use their email to find the hospital
      let hospital;
      if (requestingUser.role === 'hospital') {
        console.log('Looking for hospital with email:', requestingUser.email);
        hospital = await Hospital.findOne({ email: requestingUser.email });
      } else {
        // For admin users, use the provided userEmail
        console.log('Looking for hospital with email:', userEmail);
        hospital = await Hospital.findOne({ email: userEmail });
      }
      
      if (!hospital) {
        console.log('Hospital not found');
        return res.status(404).json({ msg: 'Hospital not found for this email' });
      }
      
      console.log('Hospital found:', hospital.name);
      console.log('Hospital ID:', hospital._id, 'Type:', typeof hospital._id);

      // Update hospital's balance
      const updatedHospital = await Hospital.findByIdAndUpdate(
        hospital._id,
        { 
          $inc: { 
            currentBalance: amount,
            totalTransactions: 1
          } 
        },
        { new: true }
      );

      console.log(`Hospital ${updatedHospital.name} balance updated:`, {
        previousBalance: updatedHospital.currentBalance - amount,
        transactionAmount: amount,
        newBalance: updatedHospital.currentBalance
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
          hospital._id,
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
            hospital._id,
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
      const transactionData = {
        user: patient._id,
        cardNumber: patient.cardNumber,
        amount,
        type,
        description,
        hospital: hospital._id, // This is now a string ID
        email: userEmail,
        status: 'completed'
      };
      
      console.log('Creating transaction with data:', transactionData);
      
      const newTransaction = new Transaction(transactionData);

      const transaction = await newTransaction.save();

      res.json({
        transaction,
        updatedCardBalance: patient.cardBalance,
        updatedHospitalBalance: updatedHospital.currentBalance
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