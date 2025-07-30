
// routes/auth.js or wherever your auth routes are defined
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Session = require('../models/Session'); // Import Session model
const UAParser = require('ua-parser-js'); // Import ua-parser-js
const axios = require('axios');

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    console.log('Login attempt for:', req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match for:', email);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      console.log('User authenticated:', email, 'with role:', user.role);

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
        },
      };

      // Generate JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      console.log('user twoFactorAuth:', user.twoFactorAuth);
      console.log('user requiresTwoFA:', user.requiresTwoFA);
      // Check if 2FA is enabled
      if (user.requiresTwoFA && user.twoFactorAuth.enabled) {
        // Return user data and token but don't save session yet
        return res.json({
          token,
          twoFAEnabled: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
          },
        });
      }

      // Parse User-Agent to get device name
      const parser = new UAParser();
      const ua = req.headers['user-agent'];
      const result = parser.setUA(ua).getResult();
      const deviceName = result.device.model
        ? `${result.device.vendor || ''} ${result.device.model} (${result.os.name} ${result.os.version})`
        : `${result.browser.name} on ${result.os.name}`; // Fallback for browsers

      // Get location from IP (use ip-api.com)
      let location = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
      try {
        const ip = req.body.ipAddress || req.connection.remoteAddress;
        console.log('Client IP:', ip);
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        console.log('Geolocation response:', geoResponse.data);
        if (geoResponse.data.status === 'success') {
          location = {
            city: geoResponse.data.city || 'Unknown',
            region: geoResponse.data.regionName || 'Unknown',
            country: geoResponse.data.country || 'Unknown',
          };
        }
      } catch (geoError) {
        console.error('Geolocation error:', geoError.message);
      } 
      
     // Save session metadata to MongoDB
      await Session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        deviceName,
        location,
      });

      console.log('Token generated successfully for:', email);
      res.json({
        token,
        twoFAEnabled: false,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Getting authenticated user, id:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('User found:', user.email);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Add Twilio verification routes
router.post('/start-verification', async (req, res) => {
  const { to, channel = 'sms', locale = 'en' } = req.body;
  
  if (!to || to.trim() === '') {
    return res.status(400).json({
      success: false,
      error: "Missing 'to' parameter; please provide a phone number."
    });
  }
  
  try {
    // For demo purposes, we'll simulate Twilio response
    // In production, you would use actual Twilio client
    console.log(`Sending verification to ${to} via ${channel}`);
    
    // Simulate successful verification start
    res.json({
      success: true,
      message: `Verification sent to ${to}`
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to send verification'
    });
  }
});

router.post('/check-verification', async (req, res) => {
  const { to, code } = req.body;
  
  if (!to || !code) {
    return res.status(400).json({
      success: false,
      message: 'Missing parameter.'
    });
  }
  
  try {
    // For demo purposes, accept specific codes
    const validCodes = ['123456', '000000', '111111'];
    
    if (validCodes.includes(code)) {
      console.log('Login attempt for:', req.body.email);
             const errors = validationResult(req);
             if (!errors.isEmpty()) {
               console.log('Validation errors:', errors.array());
               return res.status(400).json({ msg: errors.array()[0].msg });
             }
         
             const { email} = req.body;
               let user = await User.findOne({ email });
               if (!user) {
                 console.log('User not found:', email);
                 return res.status(400).json({ msg: 'Invalid Credentials' });
               }
               console.log('User authenticated:', email, 'with role:', user.role);
         
               const payload = {
                 user: {
                   id: user.id,
                   role: user.role,
                   email: user.email,
                 },
               };
         
               // Generate JWT
               const token = req.body.token ;


      // Parse User-Agent to get device name
               const parser = new UAParser();
               const ua = req.headers['user-agent'];
               const result = parser.setUA(ua).getResult();
               const deviceName = result.device.model
                 ? `${result.device.vendor || ''} ${result.device.model} (${result.os.name} ${result.os.version})`
                 : `${result.browser.name} on ${result.os.name}`; // Fallback for browsers
         
               // Get location from IP (use ip-api.com)
               let location = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
               try {
                 const ip = req.body.ipAddress || req.connection.remoteAddress;
                 console.log('Client IP:', ip);
                 const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
                 console.log('Geolocation response:', geoResponse.data);
                 if (geoResponse.data.status === 'success') {
                   location = {
                     city: geoResponse.data.city || 'Unknown',
                     region: geoResponse.data.regionName || 'Unknown',
                     country: geoResponse.data.country || 'Unknown',
                   };
                 }
               } catch (geoError) {
                 console.error('Geolocation error:', geoError.message);
               } 
               
              // Save session metadata to MongoDB
               await Session.create({
                 userId: user.id,
                 token,
                 expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                 deviceName,
                 location,
               });
         res.json({
          success: true,
           message: 'Verification success.'
         });
    } else {
      res.status(400).json({
        success: false,
        message: 'Incorrect token.'
      });
    }
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Verification failed'
    });
  }
});

module.exports = router;
