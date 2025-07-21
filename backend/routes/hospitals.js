const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { addPatient } = require("../controllers/hospital/patientController");
const { addHealthCard } = require("../controllers/hospital/patientController");
const { updateHospitalProfile } = require("../controllers/hospital/hospitalController");
const Loan = require('../models/Loan');

// @route   PUT api/hospitals/profile
// @desc    Update hospital profile
// @access  Private
router.put('/profile', auth, updateHospitalProfile);

router.get('/patients', auth, async (req, res) => {
  try {
    console.log('Fetching patients for hospital user:', req.user.id);
    
    const patients = await Patient.find().sort({ createdAt: -1 });
    console.log(`Found ${patients.length} patients`);
    
    res.json({
      success: true,
      patients: patients.map(patient => ({
        id: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        cardNumber: patient.cardNumber || 'Not Issued',
        cardStatus: patient.cardStatus || 'Not Issued',
        cardBalance: patient.cardBalance || 0,
        lastVisit: patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'
      }))
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error',
      error: err.message
    });
  }
});

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
      hospitals = await Hospital.find({ status: 'Active' }).sort({ date: -1 });
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
      check('location', 'Location is required').not().isEmpty(),
      check('contactPerson', 'Contact person is required').not().isEmpty(),
      check('email', 'Valid email is required').isEmail(),
      check('phone', 'Phone is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      location,
      contactPerson,
      email,
      phone,
      services
    } = req.body;

    try {
      // Check if hospital already exists
      let existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return res.status(400).json({ 
          msg: 'Hospital with this email already exists' 
        });
      }

      // Verify user exists
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ 
          msg: 'Invalid user ID' 
        });
      }

      // Generate unique hospitalId (_id)
      let hospitalId;
      let idExists = true;
      
      if(user.hospitalId){
        while (idExists) {
         hospitalId=user.hospitalId;
        idExists = await Hospital.exists({ _id: hospitalId });
      }
      }
      else{
      while (idExists) {
        hospitalId = `H${Math.floor(10000 + Math.random() * 90000)}`;
        idExists = await Hospital.exists({ _id: hospitalId });
      }}

      const newHospital = new Hospital({
        _id: hospitalId,
        name,
        location,
        contactPerson,
        email,
        phone,
        services: services || [],
        user: req.user.id,
        status: 'Pending'
      });
      //set hospital ID in user profile
      user.hospitalId = hospitalId;
      await user.save();

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
      return res.status(404).json({ msg: 'Hospital was not found 1' });
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
    location,
    contactPerson,
    email,
    phone,
    services,
    status
  } = req.body;

  // Build hospital object
  const hospitalFields = {};
  if (name) hospitalFields.name = name;
  if (location) hospitalFields.location = location;
  if (contactPerson) hospitalFields.contactPerson = contactPerson;
  if (email) hospitalFields.email = email;
  if (phone) hospitalFields.phone = phone;
  if (services) hospitalFields.services = services;
  if (status && req.user.role === 'admin') hospitalFields.status = status;

  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) return res.status(404).json({ msg: 'Hospital was not found 2' });

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

// Update hospital profile
// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { name, email, phone, address, website, licenseNumber, foundedYear, type, bedCount } = req.body;

//     // Validate input
//     if (!name || !email || !phone || !address || !licenseNumber) {
//       return res.status(400).json({ message: "Required fields are missing." });
//     }

//     // Find and update the hospital profile
//     const updatedHospital = await Hospital.findOneAndUpdate(
//       { email }, // Assuming email is unique and used to identify the hospital
//       { name, phone, address, website, licenseNumber, foundedYear, type, bedCount },
//       { new: true, runValidators: true }
//     );

//     if (!updatedHospital) {
//       return res.status(404).json({ message: "Hospital not found." });
//     }

//     res.status(200).json({ message: "Profile updated successfully", data: updatedHospital });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });



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
    const loans = await Loan.find({ 'medicalInfo.medicalProvider': hospital.name });

    console.log(`Found ${loans.length} loans for hospital ${hospital.name}`);
    
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

      // Get bed count from hospital return integer from service string which includes bedcount or related info
    const bedCount = hospital.services.reduce((count, service) => {
      const match = service.match(/(\d+)\s*bed/i);
      if (match) {
        return count + parseInt(match[1], 10);
      }
      return count;
    }, 0);

    //check if services includes hospital type like private,general,government or related include it
    const hospitalType = hospital.services.find(service =>
      ['private', 'general', 'government', 'trust'].includes(service.toLowerCase())
    ) || 'General';

    console.log(`Hospital Type: ${hospitalType}`);
    const analytics = {
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalAmount,
      disbursedAmount,
      approvalRate: totalLoans > 0 ? ((approvedLoans / totalLoans) * 100).toFixed(1) : 0,
      bedCount: bedCount,
      hospitalType: hospitalType.charAt(0).toUpperCase() + hospitalType.slice(1)
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
    
    if (!['Active', 'Pending', 'Rejected'].includes(status)) {
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

router.post('/patients', auth, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      cardNumber
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        msg: "Name and phone are required."
      });
    }

    // Generate a unique patientId with retries if already exists
    let patientId;
    let patientExists = true;
    while (patientExists) {
      patientId = `P${Math.floor(10000 + Math.random() * 90000)}`;
      patientExists = await Patient.exists({ patientId });
    }

    // Similarly for UHID
    let uhid;
    let uhidExists = true;
    while (uhidExists) {
      uhid = `UHID${Math.floor(100000 + Math.random() * 900000)}`;
      uhidExists = await Patient.exists({ uhid });
    }

    const newPatient = new Patient({
      patientId,
      uhid,
      name,
      age,
      gender,
      phone,
      email,
      cardNumber: cardNumber || undefined,
      cardStatus: cardNumber ? "Active" : "Not Issued",
      cardBalance: 0,
      lastVisit: new Date()
    });

    await newPatient.save();

    res.status(201).json({
      success: true,
      patient: {
        id: newPatient.patientId,
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        phone: newPatient.phone,
        email: newPatient.email,
        cardNumber: newPatient.cardNumber || 'Not Issued',
        cardStatus: newPatient.cardStatus,
        cardBalance: newPatient.cardBalance,
        lastVisit: newPatient.lastVisit ? new Date(newPatient.lastVisit).toLocaleDateString() : 'Never'
      }
    });
  } catch (error) {
    console.error('Error adding patient:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Duplicate field",
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
