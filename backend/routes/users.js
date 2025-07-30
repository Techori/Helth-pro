const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const signup = require("../controllers/user/signup");
const userController = require("../controllers/user/get");
const updateController = require("../controllers/user/update");

const forgotPassword = require("../controllers/user/forgotPassword");
const verifyResetPassword = require("../controllers/user/verifyResetPassword");

const auth = require('../middleware/auth');

const User = require('../models/User');
const FaceData = require('../models/FaceData');
const Session = require('../models/Session');
const mongoose = require('mongoose');

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

router.get("/get", auth, userController.getUser);
router.post("/verify-password", auth, userController.verifyPassword);
router.put("/update", auth, updateController.updateUser);
router.put("/update-password", auth, updateController.updatePassword);

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

// Profile avatar upload
router.post('/upload-avatar', auth, async (req, res) => {
  try {
    const { avatarData } = req.body;
    
    if (!avatarData) {
      return res.status(400).json({ msg: 'Avatar data is required' });
    }
    //check if avatar is same as existing avatar
    const user = await User.findById(req.user.id);
    if (user.avatar === avatarData) {
      return res.status(400).json({ msg: 'Avatar is already set to this image' });
    }
    
    // In a real implementation, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll use a mock implementation that stores base64 data
    const imageUrl = avatarData; // This would be the cloud storage URL in production
    
    await User.findByIdAndUpdate(req.user.id, {
      avatar: imageUrl
    });
    
    res.json({ imageUrl, success: true });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ msg: 'Server error during avatar upload' });
  }
});

// 2FA setup endpoint
router.post('/2fa/setup', auth, async (req, res) => {
  try {
    // Generate a mock secret (in production, use speakeasy or similar)
    const secret = 'JBSWY3DPEHPK3PXP' + Math.random().toString(36).substring(7).toUpperCase();
    
    // Create mock QR code data (in production, use qrcode library)
    const qrCodeData = `otpauth://totp/HealthApp:${req.user.email}?secret=${secret}&issuer=HealthApp`;
    
    // Generate mock QR code image (base64)
    const mockQRCode = generateMockQRCode(qrCodeData);
    
    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 8; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    
    // Update user with 2FA data
    await User.findByIdAndUpdate(req.user.id, {
      'twoFactorAuth.secret': secret,
      'twoFactorAuth.backupCodes': backupCodes
    });
    
    res.json({
      success: true,
      secret,
      qrCode: mockQRCode,
      backupCodes
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ msg: 'Server error during 2FA setup' });
  }
});

// Enable 2FA endpoint
router.post('/2fa/enable', auth, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ msg: 'Verification token is required' });
    }
    
    // In production, verify the token using speakeasy.verify()
    // For now, we'll accept any 6-digit number as valid
    if (!/^\d{6}$/.test(token)) {
      return res.status(400).json({ msg: 'Invalid verification token format' });
    }
    
    await User.findByIdAndUpdate(req.user.id, {
      'twoFactorAuth.enabled': true
    });
    
    res.json({ success: true, msg: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ msg: 'Server error enabling 2FA' });
  }
});

// Disable 2FA endpoint
router.post('/2fa/disable', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ msg: 'Password is required to disable 2FA' });
    }
    
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }
    
    await User.findByIdAndUpdate(req.user.id, {
      'twoFactorAuth.enabled': false,
      'twoFactorAuth.secret': null,
      'twoFactorAuth.backupCodes': []
    });
    
    res.json({ success: true, msg: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ msg: 'Server error disabling 2FA' });
  }
});

// @route   GET api/sessions
// @desc    Get active sessions
// @access  Private
router.get('/sessions', auth, async (req, res) => {
 try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true,
    }).select('token createdAt expiresAt isActive lastAccessed deviceName location');

    if (!sessions.length) {
      return res.status(404).json({ message: 'No active sessions found' });
    }

    res.json({
      message: 'Sessions retrieved successfully',
      sessions: sessions.map(session => ({
        _id: session._id,
        token: session.token,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        lastAccessed: session.lastAccessed,
        deviceName: session.deviceName,
        location: session.location, // Include location
      })),
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({ msg: 'Server error fetching sessions' });
  }
});

// @route   DELETE api/sessions/:sessionId
// @desc    Revoke a session
// @access  Private
router.delete('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    //convert sessionId to ObjectId if necessary in case it's a string in backend
    if (!sessionId) {
      console.error('Session ID is required for revocation');
      return res.status(400).json({ msg: 'Session ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      console.error('Invalid Session ID format:', sessionId);
      return res.status(400).json({ msg: 'Invalid Session ID format' });
    }
    //

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId: req.user.id },
      { isActive: false, lastAccessed: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ msg: 'Session not found or not authorized' });
    }

    console.log(`Revoked session: ${sessionId} for user: ${req.user.id}`);
    res.json({ success: true, msg: 'Session revoked successfully' });
  } catch (error) {
    console.error('Session revoke error:', error);
    res.status(500).json({ msg: 'Server error revoking session' });
  }
});

//get users face-auth status
router.get('/face-auth/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Check if face auth is enabled
    const faceData = await FaceData.findOne({ emailId: user.email });
    const registered = !!faceData;
    if (!registered) {
      return res.json({ registered: false, isNominee: false });
    }
    const isNominee = faceData.isNominee || false;
    res.json({ registered: true, isNominee });

  } catch (error) {
    console.error('Face auth status fetch error:', error);
    res.status(500).json({ msg: 'Server error fetching face auth status' });
  }
});

// Save notification preferences
router.put('/notification-preferences', auth, async (req, res) => {
  try {
    const { emiReminders, appointmentReminders, balanceAlerts, promotionalOffers } = req.body;
    
    await User.findByIdAndUpdate(req.user.id, {
      notificationPreferences: {
        emiReminders: emiReminders !== undefined ? emiReminders : true,
        appointmentReminders: appointmentReminders !== undefined ? appointmentReminders : true,
        balanceAlerts: balanceAlerts !== undefined ? balanceAlerts : true,
        promotionalOffers: promotionalOffers !== undefined ? promotionalOffers : false
      }
    });
    
    res.json({ success: true, msg: 'Notification preferences updated' });
  } catch (error) {
    console.error('Notification preferences update error:', error);
    res.status(500).json({ msg: 'Server error updating preferences' });
  }
});

// Helper function to generate mock QR code
function generateMockQRCode(data) {
  // This is a simplified mock QR code generator
  // In production, use the 'qrcode' npm package
  const canvas = Buffer.alloc(200 * 200 * 4); // Mock canvas
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

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
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    preferredHospital,
    emergencyContact
  } = req.body;
  
  // Build user object
  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  if (phone) userFields.phone = phone;
  if (preferredHospital) userFields.preferredHospital = preferredHospital;
  if (emergencyContact) userFields.emergencyContact = emergencyContact;
  
  // Update KYC data
  if (address) {
    userFields.kycData = {};
    if (address) userFields.kycData.address = address;
  }
  
  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if email is being changed and verify it's not already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }
    
    // Check if phone is being changed and verify it's not already in use
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ msg: 'Phone number already in use' });
      }
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
// Add 2FA toggle route
router.post('/2fa-toggle', auth, async (req, res) => {
  const { enabled } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update 2FA settings
    user.twoFactorAuth = {
      enabled: enabled,
      secret: user.twoFactorAuth?.secret || null,
      backupCodes: user.twoFactorAuth?.backupCodes || []
    };

    user.requiresTwoFA = enabled; // Update requiresTwoFA field
    user.tempToken = null; // Clear tempToken if disabling 2FA
    
    
    await user.save();
    
    res.json({
      success: true,
      message: enabled ? '2FA enabled successfully' : '2FA disabled successfully'
    });
  } catch (error) {
    console.error('2FA toggle error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
