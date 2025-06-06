const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const signup = require("../controllers/user/signup");

const get = require("../controllers/user/get");
const update = require("../controllers/user/update");
const forgotPassword = require("../controllers/user/forgotPassword");
const verifyResetPassword = require("../controllers/user/verifyResetPassword");

const auth = require('../middleware/auth');

const User = require('../models/User');
router.post(
  "/signup",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  signup
);

router.get("/get", auth, get);
router.put("/update", auth, update);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post(
  "/verify-reset-password",
  [
    check("token", "Reset token is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  verifyResetPassword
);

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('phone', 'Please enter a valid phone number').matches(/^\d{10}$/),
    check('role', 'Role is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, role } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists with this email' });
      }

      // Check if phone number is already registered
      user = await User.findOne({ phone });
      if (user) {
        return res.status(400).json({ msg: 'User already exists with this phone number' });
      }

      // Generate UHID for patients
      let uhid = null;

      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        uhid,
        kycStatus: 'pending',
        dateJoined: new Date(),
        kycData: role === 'patient' ? {
          panNumber: '',
          aadhaarNumber: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          maritalStatus: '',
          dependents: '0'
        } : null
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      // Generate and return JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: '24h'
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              uhid: user.uhid,
              kycStatus: user.kycStatus
            }
          });
        }
      );
    } catch (err) {
      console.error('Signup error:', err.message);
      res.status(500).json({ msg: 'Server error during registration' });
    }
  }
);

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  
  // Build user object
  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  
  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
