
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Generate UHID
const generateUHID = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `UH${timestamp.slice(-8)}${random}`;
};

// @route   POST api/kyc/complete
// @desc    Complete KYC and generate UHID
// @access  Private
router.post('/complete', [
  auth,
  [
    check('panNumber', 'PAN number is required').not().isEmpty(),
    check('aadhaarNumber', 'Aadhaar number is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      panNumber,
      aadhaarNumber,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      maritalStatus,
      dependents
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate UHID if not exists
    if (!user.uhid || user.uhid === null) {
      user.uhid = generateUHID();
    }

    // Update KYC data
    user.kycStatus = 'completed';
    user.kycData = {
      panNumber,
      aadhaarNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      city,
      state,
      zipCode,
      maritalStatus,
      dependents
    };

    await user.save();

    res.json({
      message: 'KYC completed successfully',
      uhid: user.uhid,
      kycStatus: user.kycStatus
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/kyc/status
// @desc    Get KYC status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      kycStatus: user.kycStatus,
      uhid: user.uhid,
      kycData: user.kycData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
