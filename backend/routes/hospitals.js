const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { addPatient } = require("../controllers/hospital/patientController");
const { addHealthCard } = require("../controllers/hospital/patientController");
const Branch = require('../models/Branch');
const RelationshipManager = require('../models/RelationshipManager');

// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get all hospitals
router.get('/', auth, async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ date: -1 });
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Add patient and health card
router.post("/patients", addPatient);
router.post('/health-card', addHealthCard);

// Add new hospital
router.post(
  '/',
  [
    // auth, // Uncomment if authentication is required
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
        user: "660f5f8ae5b8c5f11a2c8d4b" // Replace with req.user.id if authenticated
      });

      const hospital = await newHospital.save();
      res.json(hospital);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
);

// Get hospital by ID
router.get('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hospital ID' });
    }
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update hospital by ID
router.put('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid hospital ID' });
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
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    // Check authorization
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: hospitalFields },
      { new: true }
    );
    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get current hospital profile
router.get('/me', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update current hospital profile
router.put('/me', auth, async (req, res) => {
  try {
    console.log('=== Hospital Profile Update Request ===');
    console.log('User ID:', req.user.id);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // First, verify the user is a hospital user
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'hospital') {
      return res.status(403).json({
        message: "Only hospital users can update hospital profiles"
      });
    }

    const {
      name,
      contactEmail,
      contactPhone,
      address,
      website,
      licenseNumber,
      foundedYear,
      hospitalType,
      bedCount,
      status,
      city,
      state,
      zipCode,
      contactPerson
    } = req.body;

    // Validate input
    if (!name || !contactEmail || !contactPhone || !address || !city || !state || !zipCode) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        message: "Required fields are missing.",
        missingFields: {
          name: !name,
          contactEmail: !contactEmail,
          contactPhone: !contactPhone,
          address: !address,
          city: !city,
          state: !state,
          zipCode: !zipCode
        }
      });
    }

    try {
      // Find or create hospital by user ID
      let hospital = await Hospital.findOne({ user: req.user.id });
      console.log('Existing hospital found:', hospital ? 'Yes' : 'No');

      if (!hospital) {
        console.log('Creating new hospital profile...');
        // Create new hospital profile
        hospital = new Hospital({
          user: req.user.id,
          name,
          contactEmail,
          contactPhone,
          address,
          website,
          licenseNumber,
          foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
          hospitalType,
          bedCount: bedCount ? parseInt(bedCount) : undefined,
          status: status || 'active',
          city,
          state,
          zipCode,
          contactPerson: contactPerson || name
        });
      } else {
        console.log('Updating existing hospital profile...');
        // Update existing hospital profile
        const updateFields = {
          name,
          contactEmail,
          contactPhone,
          address,
          website,
          licenseNumber,
          foundedYear: foundedYear ? parseInt(foundedYear) : hospital.foundedYear,
          hospitalType,
          bedCount: bedCount ? parseInt(bedCount) : hospital.bedCount,
          city,
          state,
          zipCode,
          contactPerson: contactPerson || name
        };
        
        if (status) updateFields.status = status;
        
        // Use findOneAndUpdate to ensure atomic operation
        hospital = await Hospital.findOneAndUpdate(
          { user: req.user.id },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
      }

      if (!hospital) {
        throw new Error('Failed to create or update hospital profile');
      }

      console.log('Hospital saved successfully:', hospital._id);
      console.log('Saved hospital data:', JSON.stringify(hospital.toObject(), null, 2));

      res.status(200).json({
        message: "Profile updated successfully",
        data: hospital
      });
    } catch (saveError) {
      console.error('Error saving hospital:', saveError);
      throw saveError;
    }
  } catch (error) {
    console.error('Error in hospital profile update:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || error.stack
    });
  }
});

// Save branch information
router.post('/branch', auth, async (req, res) => {
  try {
    console.log('=== Branch Information Save Request ===');
    console.log('User ID:', req.user.id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // Get hospital ID for the current user
    const hospital = await Hospital.findOne({ user: req.user.id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const {
      branchName,
      branchManagerName,
      branchManagerEmail,
      branchCode,
      branchContact,
      branchAddress
    } = req.body;

    // Validate required fields
    if (!branchName || !branchManagerName || !branchManagerEmail || !branchCode || !branchContact || !branchAddress) {
      return res.status(400).json({
        message: "Required fields are missing.",
        missingFields: {
          branchName: !branchName,
          branchManagerName: !branchManagerName,
          branchManagerEmail: !branchManagerEmail,
          branchCode: !branchCode,
          branchContact: !branchContact,
          branchAddress: !branchAddress
        }
      });
    }

    // Create or update branch information
    let branch = await Branch.findOne({ hospital: hospital._id });
    if (branch) {
      branch = await Branch.findOneAndUpdate(
        { hospital: hospital._id },
        {
          branchName,
          branchManagerName,
          branchManagerEmail,
          branchCode,
          branchContact,
          branchAddress
        },
        { new: true }
      );
    } else {
      branch = new Branch({
        hospital: hospital._id,
        branchName,
        branchManagerName,
        branchManagerEmail,
        branchCode,
        branchContact,
        branchAddress
      });
      await branch.save();
    }

    res.status(200).json({
      message: "Branch information saved successfully",
      data: branch
    });
  } catch (error) {
    console.error('Error saving branch information:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Save RM information
router.post('/rm', auth, async (req, res) => {
  try {
    console.log('=== RM Information Save Request ===');
    console.log('User ID:', req.user.id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // Get hospital ID for the current user
    const hospital = await Hospital.findOne({ user: req.user.id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const {
      relationshipManager,
      rmContact,
      rmEmail,
      salesManager,
      salesManagerEmail
    } = req.body;

    // Validate required fields
    if (!relationshipManager || !rmContact || !rmEmail || !salesManager || !salesManagerEmail) {
      return res.status(400).json({
        message: "Required fields are missing.",
        missingFields: {
          relationshipManager: !relationshipManager,
          rmContact: !rmContact,
          rmEmail: !rmEmail,
          salesManager: !salesManager,
          salesManagerEmail: !salesManagerEmail
        }
      });
    }

    // Create or update RM information
    let rm = await RelationshipManager.findOne({ hospital: hospital._id });
    if (rm) {
      rm = await RelationshipManager.findOneAndUpdate(
        { hospital: hospital._id },
        {
          relationshipManager,
          rmContact,
          rmEmail,
          salesManager,
          salesManagerEmail
        },
        { new: true }
      );
    } else {
      rm = new RelationshipManager({
        hospital: hospital._id,
        relationshipManager,
        rmContact,
        rmEmail,
        salesManager,
        salesManagerEmail
      });
      await rm.save();
    }

    res.status(200).json({
      message: "RM information saved successfully",
      data: rm
    });
  } catch (error) {
    console.error('Error saving RM information:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Get branch information
router.get('/branch', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const branch = await Branch.findOne({ hospital: hospital._id });
    res.json(branch || {});
  } catch (error) {
    console.error('Error fetching branch information:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Get RM information
router.get('/rm', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const rm = await RelationshipManager.findOne({ hospital: hospital._id });
    res.json(rm || {});
  } catch (error) {
    console.error('Error fetching RM information:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Catch-all for invalid routes
router.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

module.exports = router;