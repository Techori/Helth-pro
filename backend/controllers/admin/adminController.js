const Hospital = require('../../models/Hospital');
const User = require('../../models/User');
const Loan = require('../../models/Loan');
const HealthCard = require('../../models/HealthCard');
const Patient = require('../../models/Patient');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const FeeStructure = require('../../models/FeeStructure');
const SalesTarget = require('../../models/SalesTarget');

const { v4: uuidv4 } = require('uuid'); // Import UUID for unique email generation



const generateHospitalId = async () => {
  let hospitalId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5; // Prevent excessive loops

  while (!isUnique && attempts < maxAttempts) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    hospitalId = `HOSP${randomNumber}`;
    console.log('generateHospitalId: Trying hospitalId:', hospitalId);
    const existingHospital = await Hospital.findOne({ hospitalId });
    const existingUser = await User.findOne({ hospitalId });
    if (!existingHospital && !existingUser) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique hospital ID after maximum attempts.');
  }

  return hospitalId;
};

exports.quickActionHospital = async (req, res) => {
  try {
    console.log('quickActionHospital: Request body:', req.body);
    const { name, location, notes } = req.body;
    

    // Validate required fields
    if (!name || !location) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Hospital name and location are required.' });
    }

    // Generate a unique email for the hospital user
    const email = `hospital_${uuidv4()}@example.com`;
    console.log('quickActionHospital: Generated email:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Email already in use.' });
    }

    // Generate a unique hospitalId
    const hospitalId = await generateHospitalId();
    console.log('quickActionHospital: Final hospitalId:', hospitalId);

    // Create a user for the hospital
    const hospitalUser = new User({
      firstName: name.split(' ')[0] || 'Hospital',
      lastName: name.split(' ').slice(1).join(' ') || 'Admin',
      email,
      phone: '0000000000', // Placeholder
      password: await bcrypt.hash('defaultpassword', 10), // Default password
      role: 'hospital',
      notes,
      hospitalId, // Assign the generated hospitalId
    });

    const savedUser = await hospitalUser.save();
    console.log('quickActionHospital: Saved user ID:', savedUser._id);

    // Create the hospital with the same hospitalId
    const hospital = new Hospital({
      user: savedUser._id,
      name,
      email: savedUser.email,
      phone: savedUser.phone,
      contactEmail: savedUser.email, // Set contactEmail to match email
      address: location,
      status: 'pending',
      notes,
      hospitalId, // Assign the generated hospitalId
    });

    const savedHospital = await hospital.save();
    console.log('quickActionHospital: Saved hospital ID:', savedHospital._id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ msg: 'Hospital registration request has been processed successfully.' });
  } catch (err) {
    console.error('Error processing hospital quick action:', err.message);
    res.setHeader('Content-Type', 'application/json');
    if (err.code === 11000) {
      const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'unknown field';
      return res.status(400).json({ msg: `Duplicate key error for ${field}.` });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update other functions to use req.userInfo for role checks
exports.quickActionLoan = async (req, res) => {
  try {
    const { loanId, amount, notes } = req.body;

    // Validate required fields
    if (!loanId || !amount) {
      return res.status(400).json({ msg: 'Loan ID and amount are required.' });
    }

    // Create the loan
    const loan = new Loan({
      loanId,
      amount,
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



exports.quickActionHealthCard = async (req, res) => {
  try {
    const { cardType, patientId, notes } = req.body;

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
      notes,
    });

    await healthCard.save();

    res.status(200).json({ msg: 'Health card has been created successfully.' });
  } catch (err) {
    console.error('Error processing health card quick action:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.quickActionUser = async (req, res) => {
  try {
    const { name, email, role: userRole, notes } = req.body;

    // Validate required fields
    if (!name || !email || !userRole) {
      return res.status(400).json({ msg: 'Name, email, and role are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    // Validate role against User model enum
    const validRoles = ['patient', 'hospital', 'admin', 'sales', 'crm', 'agent', 'support', 'hospital staff', 'hospital admin'];
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ msg: 'Invalid role.' });
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create the user
    const newUser = new User({
      firstName: name.split(' ')[0] || 'User',
      lastName: name.split(' ').slice(1).join(' ') || 'Name',
      email,
      password: hashedPassword,
      role: userRole,
      phone: '0000000000',
      notes,
    });

    const savedUser = await newUser.save();

    // Log response
    const responseData = {
      msg: 'User account has been created successfully.',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        registeredOn: savedUser.date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '/'),
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error processing user quick action:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already in use.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.addPlatformFee = async (req, res) => {
  try {
    const { category, fee, type, description } = req.body;

    // Validate required fields
    if (!category || fee == null || !type || !description) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Category, fee, type, and description are required.' });
    }

    // Validate fee
    if (isNaN(fee) || fee < 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Fee must be a valid non-negative number.' });
    }

    // Validate type
    const validTypes = ['One-time', 'Percentage', 'Annual'];
    if (!validTypes.includes(type)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Invalid fee type.' });
    }

    // Create fee structure
    const newFeeStructure = new FeeStructure({
      category,
      fee,
      type,
      description,
      lastUpdated: new Date(),
    });

    const savedFeeStructure = await newFeeStructure.save();

    // Log response
    const responseData = {
      msg: 'Fee structure added successfully.',
      feeStructure: {
        _id: savedFeeStructure._id,
        category: savedFeeStructure.category,
        fee: savedFeeStructure.fee,
        type: savedFeeStructure.type,
        description: savedFeeStructure.description,
        lastUpdated: savedFeeStructure.lastUpdated.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '/'),
      },
    };
    console.log('addPlatformFee: Response:', JSON.stringify(responseData, null, 2));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error adding platform fee:', err.message);
    res.setHeader('Content-Type', 'application/json');
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Category already exists.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.addSalesTarget = async (req, res) => {
  try {
    console.log('addSalesTarget: Request body:', req.body);
    // const adminId = req.user; // User ID from middleware (string)
    // console.log('addSalesTarget: adminId:', adminId);

    // // Validate admin role
    // const user = await User.findById(adminId).select('role');
    // console.log('addSalesTarget: Fetched user:', user);
    // if (!user) {
    //   res.setHeader('Content-Type', 'application/json');
    //   return res.status(401).json({ msg: 'User not found' });
    // }
    // if (user.role !== 'admin') {
    //   res.setHeader('Content-Type', 'application/json');
    //   return res.status(403).json({ msg: 'Not authorized. Admin access required.' });
    // }

    const { hospital, department, targetAmount, period, status } = req.body;

    // Validate required fields
    if (!hospital || !department || targetAmount == null || !period || !status) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Hospital, department, target amount, period, and status are required.' });
    }

    // Validate targetAmount
    if (isNaN(targetAmount) || targetAmount <= 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Target amount must be a positive number.' });
    }

    // Validate status
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Invalid status.' });
    }

    // Create sales target
    const newSalesTarget = new SalesTarget({
      hospital,
      department,
      targetAmount,
      period,
      status,
      currentAmount: 0,
      progress: 0,
      lastUpdated: new Date(),
    });

    const savedSalesTarget = await newSalesTarget.save();

    // Log response
    const responseData = {
      msg: 'Sales target added successfully.',
      salesTarget: {
        _id: savedSalesTarget._id,
        hospital: savedSalesTarget.hospital,
        department: savedSalesTarget.department,
        targetAmount: savedSalesTarget.targetAmount,
        currentAmount: savedSalesTarget.currentAmount,
        period: savedSalesTarget.period,
        status: savedSalesTarget.status,
        progress: savedSalesTarget.progress,
        lastUpdated: savedSalesTarget.lastUpdated.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '/'),
      },
    };
    console.log('addSalesTarget: Response:', JSON.stringify(responseData, null, 2));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error adding sales target:', err.message);
    res.setHeader('Content-Type', 'application/json');
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate sales target entry.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};