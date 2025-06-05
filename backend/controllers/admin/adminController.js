const Hospital = require('../../models/Hospital');
const User = require('../../models/User');
const Loan = require('../../models/Loan');
const HealthCard = require('../../models/HealthCard');
const Patient = require('../../models/Patient');
const bcrypt = require('bcryptjs');

exports.quickActionHospital = async (req, res) => {
  try {
    const adminId = req.user;
    const { role } = req.userInfo;
    const { name, location, notes } = req.body;

    // Validate admin role
    if (role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized. Admin access required.' });
    }

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({ msg: 'Hospital name and location are required.' });
    }

    // Validate email format for hospital user
    const email = `hospital_${Date.now()}@example.com`;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    // Create a user for the hospital
    const hospitalUser = new User({
      firstName: name.split(' ')[0] || 'Hospital',
      lastName: name.split(' ').slice(1).join(' ') || 'Admin',
      email,
      phone: '0000000000', // Placeholder
      password: await bcrypt.hash('defaultpassword', 10), // Default password
      role: 'hospital',
      notes,
    });

    await hospitalUser.save();

    // Create the hospital
    const hospital = new Hospital({
      user: hospitalUser._id,
      name,
      email: hospitalUser.email,
      phone: hospitalUser.phone,
      address: location,
      status: 'pending',
      notes,
    });

    await hospital.save();

    res.status(200).json({ msg: 'Hospital registration request has been processed successfully.' });
  } catch (err) {
    console.error('Error processing hospital quick action:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already in use.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update other functions to use req.userInfo for role checks
exports.quickActionLoan = async (req, res) => {
  try {
    const adminId = req.user;
    const { role } = req.userInfo;
    const { loanId, amount, notes } = req.body;

    // Validate admin role
    if (role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized. Admin access required.' });
    }

    // Validate required fields
    if (!loanId || !amount) {
      return res.status(400).json({ msg: 'Loan ID and amount are required.' });
    }

    // Create the loan
    const loan = new Loan({
      loanId,
      amount,
      admin: adminId,
      notes,
      status: 'approved',
    });

    await loan.save();

    res.status(200).json({ msg: 'Loan has been approved successfully.' });
  } catch (err) {
    console.error('Error processing loan quick action:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Loan ID already exists.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.quickActionUser = async (req, res) => {
  try {
    const adminId = req.user;
    const { role } = req.userInfo;
    const { name, email, notes } = req.body;

    // Validate admin role
    if (role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized. Admin access required.' });
    }

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ msg: 'Name and email are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    // Create the user
    const user = new User({
      firstName: name.split(' ')[0] || 'User',
      lastName: name.split(' ').slice(1).join(' ') || 'Name',
      email,
      phone: '0000000000', // Placeholder
      password: await bcrypt.hash('defaultpassword', 10), // Default password
      role: 'patient', // Default role, can be adjusted
      notes,
    });

    await user.save();

    res.status(200).json({ msg: 'User account has been created successfully.' });
  } catch (err) {
    console.error('Error processing user quick action:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already in use.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.quickActionHealthCard = async (req, res) => {
  try {
    const adminId = req.user;
    const { role } = req.userInfo;
    const { cardType, patientId, notes } = req.body;

    // Validate admin role
    if (role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized. Admin access required.' });
    }

    // Validate required fields
    if (!cardType || !patientId) {
      return res.status(400).json({ msg: 'Card type and patient ID are required.' });
    }

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found.' });
    }

    // Create the health card
    const healthCard = new HealthCard({
      cardType,
      patient: patientId,
      admin: adminId,
      notes,
    });

    await healthCard.save();

    res.status(200).json({ msg: 'Health card has been created successfully.' });
  } catch (err) {
    console.error('Error processing health card quick action:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};