
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Hospital = require('../models/Hospital');
const User = require('../models/User');

// @route   GET api/hospitals
// @desc    Get all hospitals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ date: -1 });
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/hospitals
// @desc    Add new hospital
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty(),
      check('city', 'City is required').not().isEmpty(),
      check('state', 'State is required').not().isEmpty(),
      check('zipCode', 'Zip Code is required').not().isEmpty(),
      check('contactPerson', 'Contact person is required').not().isEmpty(),
      check('contactEmail', 'Valid contact email is required').isEmail(),
      check('contactPhone', 'Contact phone is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      address,
      city,
      state,
      zipCode,
      contactPerson,
      contactEmail,
      contactPhone,
      status
    } = req.body;

    try {
      const newHospital = new Hospital({
        name,
        address,
        city,
        state,
        zipCode,
        contactPerson,
        contactEmail,
        contactPhone,
        status: status || 'pending',
        user: req.user.id
      });

      const hospital = await newHospital.save();

      res.json(hospital);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/hospitals/:id
// @desc    Get hospital by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/hospitals/:id
// @desc    Update hospital
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    contactPerson,
    contactEmail,
    contactPhone,
    status
  } = req.body;

  // Build hospital object
  const hospitalFields = {};
  if (name) hospitalFields.name = name;
  if (address) hospitalFields.address = address;
  if (city) hospitalFields.city = city;
  if (state) hospitalFields.state = state;
  if (zipCode) hospitalFields.zipCode = zipCode;
  if (contactPerson) hospitalFields.contactPerson = contactPerson;
  if (contactEmail) hospitalFields.contactEmail = contactEmail;
  if (contactPhone) hospitalFields.contactPhone = contactPhone;
  if (status) hospitalFields.status = status;

  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) return res.status(404).json({ msg: 'Hospital not found' });

    // Make sure user is admin or the hospital owner
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: hospitalFields },
      { new: true }
    );

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
