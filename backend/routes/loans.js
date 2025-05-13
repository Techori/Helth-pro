
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Loan = require('../models/Loan');

// @route   GET api/loans
// @desc    Get all loans for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ applicationDate: -1 });
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/loans
// @desc    Apply for a loan
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('termMonths', 'Term in months is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, termMonths } = req.body;

    try {
      // Calculate interest rate (simplified for demo)
      const interestRate = 12; // 12% interest rate
      
      const newLoan = new Loan({
        amount,
        termMonths,
        interestRate,
        user: req.user.id,
      });

      const loan = await newLoan.save();

      res.json(loan);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/loans/:id/approve
// @desc    Approve a loan application (admin only)
// @access  Private
router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to approve loans' });
    }

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    if (loan.status === 'approved') {
      return res.status(400).json({ msg: 'Loan already approved' });
    }

    // Calculate monthly payment
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    const monthlyPayment = 
      (loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loan.termMonths)) / 
      (Math.pow(1 + monthlyInterestRate, loan.termMonths) - 1);

    loan.status = 'approved';
    loan.approvalDate = Date.now();
    loan.monthlyPayment = monthlyPayment;
    loan.remainingBalance = loan.amount;

    await loan.save();

    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
