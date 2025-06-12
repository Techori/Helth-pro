const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Add this helper function at the top
const validateAadhaarLastDigits = (storedLastDigits, fullAadhaar) => {
  if (!storedLastDigits || !fullAadhaar) return false;
  return fullAadhaar.slice(-4) === storedLastDigits;
};

// Generate UHID
const generateUHID = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `UH${timestamp.slice(-8)}${random}`;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // Convert DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
};

// Generate a new verification ID
const generateVerificationId = () => {
  return `REF_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Digio API integration with exponential backoff
const verifyWithDigio = async (kycData, retries = 3, backoff = 3000) => {
  const { panNumber, aadhaarNumber, email, phone, firstName, lastName, verificationId } = kycData;
  const productionUrl = process.env.DIGIO_PRODUCTION_URL || 'https://api.digio.in';
  const clientId = process.env.DIGIO_CLIENT_ID;
  const clientSecret = process.env.DIGIO_CLIENT_SECRET;

  // Input validation
  if (!email && !phone) throw new Error('Either email or phone is required');
  if (!panNumber || !aadhaarNumber) throw new Error('PAN and Aadhaar numbers are required');
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) throw new Error('Invalid PAN number format');
  if (!/^\d{12}$/.test(aadhaarNumber)) throw new Error('Invalid Aadhaar number format');
  if (!firstName || !lastName) throw new Error('First name and last name are required');

  // Store only last 4 digits in the reference
  const aadhaarLastDigits = aadhaarNumber.slice(-4);
  const refId = generateVerificationId();

  try {
    // Step 1: Initiate KYC request
    const requestPayload = {
      customer_identifier: email || phone,
      identifier_type: email ? 'email' : 'mobile',
      customer_name: `${firstName} ${lastName}`,
      reference_id: `${refId}_${aadhaarLastDigits}`, // Append last 4 digits to reference
      documents: [
        { type: 'pan', value: panNumber },
        { type: 'aadhaar', value: aadhaarNumber }
      ],
      template_name: 'DIGILOCKER_AADHAAR_PAN',
      notify_customer: true,
      generate_access_token: true,
      webhook: {
        group_name:'Testing',
        url: process.env.WEBHOOK_URL,
        headers: { 'Content-Type': 'application/json' }
      }
    };

    const requestResponse = await axios.post(
      `${productionUrl}/client/kyc/v2/request/with_template`,
      requestPayload,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      verificationId: requestResponse.data.id, // Digio's kyc_id
      accessToken: requestResponse.data.access_token?.id,
      expiresInDays: requestResponse.data.expire_in_days,
      referenceId: refId // Return the used reference_id for tracking
    };
  } catch (error) {
    console.error('Digio API error:', error.response?.data);
    throw new Error('Document verification failed with Digio');
  }
};

// Webhook handler for Digio status updates
router.post('/webhooks/digio', async (req, res) => {
  try {
    const { id, status, actions, reference_id } = req.body;
    
    // Extract stored last 4 digits from reference_id
    const storedAadhaarLastDigits = reference_id.split('_').pop();
    
    // Extract verification details
    const aadhaarDetails = actions?.[0]?.details?.aadhaar || {};
    const panDetails = actions?.[0]?.details?.pan || {};

    // Validate Aadhaar last 4 digits
    if (aadhaarDetails.id_number) {
      const receivedLastDigits = aadhaarDetails.id_number.slice(-4);
      if (receivedLastDigits !== storedAadhaarLastDigits) {
        console.error('Aadhaar number verification failed');
        return res.status(400).json({ msg: 'Aadhaar verification failed' });
      }
    }

    const updates = {
      // Do not store full Aadhaar number
      'kycData.aadhaarLastDigits': storedAadhaarLastDigits,
      'kycData.aadhaarVerified': true
    };

    if (aadhaarDetails.current_address_details) {
      updates['kycData.address'] = aadhaarDetails.current_address;
      updates['kycData.city'] = aadhaarDetails.current_address_details.district_or_city;
      updates['kycData.state'] = aadhaarDetails.current_address_details.state;
      updates['kycData.zipCode'] = aadhaarDetails.current_address_details.pincode;
    }

    // Update other details
    if (aadhaarDetails.name) {
      const [firstName, ...lastNameParts] = aadhaarDetails.name.split(' ');
      const lastName = lastNameParts.join(' ');
      updates['kycData.firstName'] = firstName;
      updates['kycData.lastName'] = lastName;
    }
    
    updates['kycData.gender'] = aadhaarDetails.gender;
    // Parse the date before saving
    updates['kycData.dateOfBirth'] = parseDate(aadhaarDetails.dob);
    updates['kycData.fatherName'] = aadhaarDetails.father_name;

    // Update verification status
    updates.kycStatus = status === 'approved' ? 'completed' : 'rejected';
    updates['kycData.verifiedAt'] = new Date();
    updates['kycData.verificationDetails'] = {
      aadhaar: {
        lastDigits: storedAadhaarLastDigits,
        gender: aadhaarDetails.gender,
        name: aadhaarDetails.name,
        address: aadhaarDetails.current_address,
        dob: parseDate(aadhaarDetails.dob) // Parse date here too
      },
      pan: {
        idNumber: panDetails.id_number,
        name: panDetails.name,
        dob: parseDate(panDetails.dob) // Parse PAN DOB as well
      }
    };

    // Apply updates
    const updatedUser = await User.findOneAndUpdate(
      { 'kycData.verificationId': id },
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found after update' });
    }

    // Emit WebSocket event
    const io = req.app.get('io');
    io.to(updatedUser._id.toString()).emit('kycStatusUpdate', {
      kycStatus: updatedUser.kycStatus,
      uhid: updatedUser.uhid,
      kycData: updatedUser.kycData
    });

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ msg: 'Webhook processing failed' });
  }
});

// @route   POST api/kyc/verify-digio
// @desc    Verify KYC with Digio API
// @access  Private
router.post('/verify-digio', auth, async (req, res) => {
  try {
    const kycData = req.body;
    console.log('Starting Digio verification for user:', req.user.id);

    const digioResult = await verifyWithDigio(kycData);

    res.json({
      success: true,
      verificationId: digioResult.verificationId,
      accessToken: digioResult.accessToken,
      expiresInDays: digioResult.expiresInDays,
      referenceId: digioResult.referenceId,
      message: 'KYC verification initiated with Digio'
    });
  } catch (error) {
    console.error('Digio verification failed:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'KYC verification failed'
    });
  }
});

// @route   POST api/kyc/complete
// @desc    Complete KYC and generate UHID
// @access  Private
router.post('/complete', [
  auth,
  [
    check('panNumber', 'PAN number is required').not().isEmpty(),
    check('aadhaarNumber', 'Aadhaar number is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      panNumber,
      aadhaarNumber,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      maritalStatus,
      dependents,
      email,
      phone,
      firstName,
      lastName,
      verificationId
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify with Digio, passing verificationId if provided
    const digioResult = await verifyWithDigio({
      panNumber,
      aadhaarNumber,
      email,
      phone,
      firstName,
      lastName,
      verificationId
    });

    // Generate UHID if not exists
    if (!user.uhid) {
      user.uhid = generateUHID();
    }

    // Update KYC data
    user.kycStatus = 'pending';
    user.kycData = {
      panNumber,
      aadhaarNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      city,
      state,
      zipCode,
      maritalStatus,
      dependents,
      email,
      phone,
      firstName,
      lastName,
      verificationId: digioResult.verificationId,
      verificationMethod: 'digio',
      referenceId: digioResult.referenceId
    };

    await user.save();

    res.json({
      message: 'KYC verification initiated. Status will be updated via webhook.',
      uhid: user.uhid,
      verificationId: digioResult.verificationId,
      accessToken: digioResult.accessToken,
      expiresInDays: digioResult.expiresInDays,
      referenceId: digioResult.referenceId
    });
    } catch (error) {
      console.error('KYC completion failed:', error.message);
      res.status(500).json({ msg: 'KYC completion failed', error: error.message });
    }
  });
  
// @route   GET api/kyc/status
// @desc    Get KYC status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      kycStatus: user.kycStatus,
      uhid: user.uhid,
      kycData: user.kycData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
  module.exports = router;