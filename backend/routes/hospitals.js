
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Loan = require('../models/Loan');

// @route   GET api/hospitals
// @desc    Get all hospitals (admin) or user's hospital (hospital user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let hospitals;
    if (req.user.role === 'admin') {
      hospitals = await Hospital.find().populate('user', 'firstName lastName email').sort({ date: -1 });
    } else if (req.user.role === 'hospital') {
      hospitals = await Hospital.find({ user: req.user.id }).sort({ date: -1 });
    } else {
      hospitals = await Hospital.find({ status: 'active' }).sort({ date: -1 });
    }
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/hospitals
// @desc    Register new hospital
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
      specialties,
      services,
      hospitalType,
      bedCount,
      registrationNumber,
      website
    } = req.body;

    try {
      // Check if hospital already exists
      let existingHospital = await Hospital.findOne({ 
        $or: [
          { contactEmail },
          { registrationNumber: registrationNumber || '' }
        ]
      });

      if (existingHospital) {
        return res.status(400).json({ 
          msg: 'Hospital with this email or registration number already exists' 
        });
      }

      const newHospital = new Hospital({
        name,
        address,
        city,
        state,
        zipCode,
        contactPerson,
        contactEmail,
        contactPhone,
        specialties: specialties || [],
        services: services || [],
        hospitalType: hospitalType || 'private',
        bedCount: bedCount || 0,
        registrationNumber,
        website,
        status: 'pending',
        user: req.user.id
      });

      const hospital = await newHospital.save();
      await hospital.populate('user', 'firstName lastName email');

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
    const hospital = await Hospital.findById(req.params.id).populate('user', 'firstName lastName email');

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
    specialties,
    services,
    hospitalType,
    bedCount,
    registrationNumber,
    website,
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
  if (specialties) hospitalFields.specialties = specialties;
  if (services) hospitalFields.services = services;
  if (hospitalType) hospitalFields.hospitalType = hospitalType;
  if (bedCount !== undefined) hospitalFields.bedCount = bedCount;
  if (registrationNumber) hospitalFields.registrationNumber = registrationNumber;
  if (website) hospitalFields.website = website;
  if (status && req.user.role === 'admin') hospitalFields.status = status;

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
    ).populate('user', 'firstName lastName email');

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/hospitals/:id/patients
// @desc    Get patients for a hospital
// @access  Private
router.get('/:id/patients', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Get patients who have loans with this hospital
    const loans = await Loan.find({ 
      'loanDetails.hospitalName': hospital.name 
    }).populate('user', 'firstName lastName email phone uhid kycData');

    const patients = loans.map(loan => ({
      id: loan.user._id,
      uhid: loan.user.uhid,
      name: `${loan.user.firstName} ${loan.user.lastName}`,
      email: loan.user.email,
      phone: loan.user.phone,
      loanId: loan._id,
      applicationNumber: loan.applicationNumber,
      loanAmount: loan.loanDetails.approvedAmount || loan.loanDetails.requestedAmount,
      status: loan.status,
      kycStatus: loan.user.kycStatus || 'pending',
      lastVisit: loan.submissionDate || loan.applicationDate
    }));

    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/hospitals/:id/analytics
// @desc    Get hospital analytics
// @access  Private
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Get analytics data
    const loans = await Loan.find({ 'loanDetails.hospitalName': hospital.name });
    
    const totalLoans = loans.length;
    const approvedLoans = loans.filter(loan => loan.status === 'approved' || loan.status === 'completed').length;
    const pendingLoans = loans.filter(loan => loan.status === 'submitted' || loan.status === 'under_review').length;
    const rejectedLoans = loans.filter(loan => loan.status === 'rejected').length;
    
    const totalAmount = loans.reduce((sum, loan) => {
      return sum + (loan.loanDetails.approvedAmount || loan.loanDetails.requestedAmount || 0);
    }, 0);
    
    const disbursedAmount = loans
      .filter(loan => loan.status === 'approved' || loan.status === 'completed')
      .reduce((sum, loan) => sum + (loan.loanDetails.approvedAmount || 0), 0);

    const analytics = {
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalAmount,
      disbursedAmount,
      approvalRate: totalLoans > 0 ? ((approvedLoans / totalLoans) * 100).toFixed(1) : 0
    };

    res.json(analytics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/hospitals/:id/status
// @desc    Update hospital status (admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { status } = req.body;
    
    if (!['active', 'pending', 'inactive'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
