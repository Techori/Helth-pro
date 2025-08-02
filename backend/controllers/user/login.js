const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");
const UAParser = require('ua-parser-js'); // Import ua-parser-js
const Session = require("../../models/Session"); // Import Session model
const axios = require('axios'); // Import axios for geolocation

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth
 * @access  Public
 */
module.exports = async (req, res) => {
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
     };
   