
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Patient = require('../models/Patient'); // ADD THIS
const { addPatient } = require("../controllers/hospital/patientController");
const { addHealthCard } = require("../controllers/hospital/patientController");

const {getPaymentUser} = require("../controllers/hospital/getPaymentUser")
router.get('/get-user',auth, getPaymentUser);



router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ date: -1 });
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post("/patients", addPatient);
router.post('/health-card', addHealthCard);
// @route   POST api/hospitals
// @desc    Add new hospital
// @access  Private
router.post(
  '/',
  [
    //auth,
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
        user: "660f5f8ae5b8c5f11a2c8d4b" // req.user.id
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


// Update hospital profile
// Update hospital profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address, website, licenseNumber, foundedYear, type, bedCount } = req.body;

    // Validate input
    if (!name || !email || !phone || !address || !licenseNumber) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Find and update the hospital profile
    const updatedHospital = await Hospital.findOneAndUpdate(
      { email }, // Assuming email is unique and used to identify the hospital
      { name, phone, address, website, licenseNumber, foundedYear, type, bedCount },
      { new: true, runValidators: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    res.status(200).json({ message: "Profile updated successfully", data: updatedHospital });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
