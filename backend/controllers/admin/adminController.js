const Hospital = require('../../models/Hospital');
const User = require('../../models/User');
const Loan = require('../../models/Loan');
const HealthCard = require('../../models/HealthCard');
const Patient = require('../../models/Patient');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const FeeStructure = require('../../models/FeeStructure');
const SalesTarget = require('../../models/SalesTarget');
const Staff = require('../../models/Staff'); // Import the Staff model

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

    // Find the loan by loanId (treated as applicationNumber)
    const loan = await Loan.findOne({ applicationNumber: loanId });

    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found.' });
    }

    // Set default values if fields are missing
    if (!loan.interestRate) {
      loan.interestRate = 13; // Default interest rate
    }
    if (!loan.termMonths) {
      loan.termMonths = 12; // Default term in months
    }
    if (!loan.amount) {
      loan.amount = amount; // Use provided amount
    }

    // Update the loan status to approved
    loan.status = 'approved';
    loan.notes = notes; // Update notes if provided

    await loan.save();

    res.status(200).json({ msg: 'Loan status has been updated to approved successfully.' });
  } catch (err) {
    console.error('Error processing loan quick action:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.quickActionUsercreation = async (req, res) => {
  try {
    const { name, email, notes } = req.body;
    const userRole = req.body.role || 'patient'; // Set default role to 'patient' if not provided
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

exports.quickActionHealthCard = async (req, res) => {
  try {
    const { cardType, patientId, notes } = req.body;

    // Validate required fields
    if (!cardType || !patientId) {
      return res.status(400).json({ msg: 'Card type and patient ID are required.' });
    }

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found.' });
    }

    // Set default values for missing fields
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setFullYear(defaultExpiryDate.getFullYear() + 1); // Default expiry date is one year from now

    // Generate a 10-digit random number for the card number
    const randomTenDigitNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const defaultCardNumber = `HC${randomTenDigitNumber}`; // Generate a card number like HC9262534613

    // Create the health card
    const healthCard = new HealthCard({
      cardType,
      patientId,
      notes,
      expiryDate: defaultExpiryDate,
      cardNumber: defaultCardNumber,
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

    // Generate UHID for patients
    let uhid = null;
    if (userRole === 'patient') {
      uhid = await generateUniqueUHID();
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create the user object
    const userData = {
      firstName: name.split(' ')[0] || 'User',
      lastName: name.split(' ').slice(1).join(' ') || 'Name',
      email,
      password: hashedPassword,
      role: userRole,
      phone: '0000000000',
      notes,
    };

    // Add UHID field only if user is a patient
    if (uhid) {
      userData.uhid = uhid;
    }

    const newUser = new User(userData);

    console.log('Attempting to save user:', newUser);

    const savedUser = await newUser.save();

    console.log('User saved successfully:', savedUser);

    // Prepare response data
    const responseData = {
      msg: 'User account has been created successfully.',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        uhid: savedUser.uhid || null, // Include UHID in response
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
      // Check if the duplicate key error is for UHID
      if (err.keyPattern && err.keyPattern.uhid) {
        return res.status(400).json({ msg: 'UHID generation failed. Please try again.' });
      }
      return res.status(400).json({ msg: 'Email already in use.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Function to generate unique UHID
async function generateUniqueUHID() {
  let uhid;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate 6-digit random number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    uhid = `UHID${randomNumber}`;
    
    // Check if this UHID already exists
    const existingUser = await User.findOne({ uhid: uhid });
    
    if (!existingUser) {
      isUnique = true;
    }
    
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique UHID after multiple attempts');
  }

  return uhid;
}


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


exports.updatePlatformFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { fee, description } = req.body;

    // Validate required fields
    if (fee == null || !description) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Fee and description are required.' });
    }

    // Validate fee
    if (isNaN(fee) || fee < 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'Fee must be a valid non-negative number.' });
    }

    // Find and update fee structure
    const updatedFeeStructure = await FeeStructure.findByIdAndUpdate(
      id,
      { fee, description, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedFeeStructure) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ msg: 'Fee structure not found.' });
    }

    // Log response
    const responseData = {
      msg: 'Fee structure updated successfully.',
      feeStructure: {
        _id: updatedFeeStructure._id,
        category: updatedFeeStructure.category,
        fee: updatedFeeStructure.fee,
        type: updatedFeeStructure.type,
        description: updatedFeeStructure.description,
        lastUpdated: updatedFeeStructure.lastUpdated.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '/'),
      },
    };
    console.log('updatePlatformFee: Response:', JSON.stringify(responseData, null, 2));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error updating platform fee:', err.message);
    res.setHeader('Content-Type', 'application/json');
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid fee structure ID.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ msg: 'First name and email are required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ msg: 'User not found.' });
    }

    const responseData = {
      msg: 'User updated successfully.',
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status || 'Active',
        lastLogin: updatedUser.lastLogin
          ? updatedUser.lastLogin.toLocaleString('en-GB')
          : 'Never',
        registeredOn: updatedUser.createdAt
          ? updatedUser.createdAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).replace(/\//g, '/')
          : 'Unknown',
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.setHeader('Content-Type', 'application/json');
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already exists.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contactPerson, phone, email, services } = req.body;

    // Validate required fields
    if (!name || !location || !contactPerson || !phone || !email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Find and update hospital
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update fields
    hospital.name = name.trim();
    hospital.location = location.trim();
    hospital.contactPerson = contactPerson.trim();
    hospital.phone = phone.trim();
    hospital.email = email.trim();
    hospital.services = services.map((service) => service.trim());

    // Save updated hospital
    await hospital.save();

    res.status(200).json({
      message: 'Hospital updated successfully',
      hospital: {
        _id: hospital._id,
        name: hospital.name,
        location: hospital.location,
        contactPerson: hospital.contactPerson,
        phone: hospital.phone,
        email: hospital.email,
        services: hospital.services,
        registrationDate: hospital.registrationDate,
        status: hospital.status,
        totalPatients: hospital.totalPatients,
        totalTransactions: hospital.totalTransactions,
        currentBalance: hospital.currentBalance,
      },
    });
  } catch (error) {
    console.error('Error updating hospital:', error);
    res.status(500).json({ message: 'Server error while updating hospital' });
  }
};


exports.addStaff = async (req, res) => {
  try {
    const { name, email, phone, hospitalId, role, department } = req.body;

    // Validate required fields
    if (!name || !email || !hospitalId || !role) {
      return res.status(400).json({ message: 'Name, email, hospital ID, and role are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if staff email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff with this email already exists' });
    }

    // Create new staff
    const newStaff = new Staff({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      hospital: hospitalId,
      role: role.trim(),
      department: department?.trim(),
      joinDate: new Date(),
      status: 'Active'
    });

    await newStaff.save();

    // Add staff reference to hospital
    // hospital.staff.push(newStaff._id);
    // await hospital.save();

    res.status(201).json({
      message: 'Staff added successfully',
      staff: {
        _id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        department: newStaff.department,
        hospital: {
          _id: hospital._id,
          name: hospital.name
        }
      }
    });

  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Server error while adding staff' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    console.log('Fetching users...');
    const users = await User.find().sort({ createdAt: -1 });
    console.log(`Found ${users.length} users`);
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status || 'Active',
      lastLogin: user.lastLogin ? user.lastLogin.toLocaleString('en-GB') : 'Never',
      registeredOn: user.createdAt 
        ? user.createdAt.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).replace(/\//g, '/')
        : 'Unknown'
    }));

    console.log('Sending response with users:', formattedUsers);
    res.status(200).json({
      success: true,
      users: formattedUsers
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error',
      error: err.message 
    });
  }
};

exports.getFeeStructures = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      feeStructures: feeStructures.map(fee => ({
        _id: fee._id,
        category: fee.category,
        fee: fee.fee,
        type: fee.type,
        description: fee.description,
        lastUpdated: fee.lastUpdated.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '/'),
      }))
    });
  } catch (err) {
    console.error('Error fetching fee structures:', err.message);
    res.status(500).json({ msg: 'Server error' });

  }
};
