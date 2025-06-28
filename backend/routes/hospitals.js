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
// @desc    Get hospital by ID or email
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Hospital GET request received for:', req.params.id);
    console.log('User making request:', req.user);
    
    const { id } = req.params;
    let hospital;

    // Check if the id is an email (contains @) or a hospital ID
    if (id.includes('@')) {
      console.log('Searching by email:', id);
      // Search by email
      hospital = await Hospital.findOne({ email: id });
      console.log('Hospital found by email:', hospital ? 'Yes' : 'No');
    } else {
      console.log('Searching by hospital ID:', id);
      // Search by hospital ID
      hospital = await Hospital.findById(id);
      console.log('Hospital found by ID:', hospital ? 'Yes' : 'No');
    }

    if (!hospital) {
      console.log('Hospital not found');
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    console.log('Returning hospital data:', {
      id: hospital._id,
      name: hospital.name,
      email: hospital.email,
      currentBalance: hospital.currentBalance
    });

    res.json(hospital);
  } catch (err) {
    console.error('Error in hospital GET route:', err);
    console.error('Error stack:', err.stack);
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

    if (!hospital) return res.status(404).json({ msg: 'Hospital  was not found 2' });

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
