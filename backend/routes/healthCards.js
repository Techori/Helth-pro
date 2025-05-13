
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const HealthCard = require('../models/HealthCard');

// @route   GET api/health-cards
// @desc    Get all health cards for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const healthCards = await HealthCard.find({ user: req.user.id }).sort({ date: -1 });
    res.json(healthCards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health-cards
// @desc    Create a health card
// @access  Private (admin only)
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

    const { cardNumber, userId, availableCredit, expiryDate } = req.body;

    try {
      const newHealthCard = new HealthCard({
        cardNumber,
        user: userId,
        availableCredit: availableCredit || 25000,
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
