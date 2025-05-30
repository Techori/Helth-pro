const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

// @route   GET api/support/tickets
// @desc    Get all support tickets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .sort({ createdAt: -1 })
      .populate('user', ['firstName', 'lastName', 'email']);
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/support/tickets
// @desc    Create a support ticket
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('subject', 'Subject is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTicket = new SupportTicket({
        subject: req.body.subject,
        category: req.body.category,
        priority: req.body.priority || 'Medium',
        description: req.body.description,
        user: req.user.id,
        patientId: req.body.patientId,
        transactionId: req.body.transactionId
      });

      const ticket = await newTicket.save();
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router; 