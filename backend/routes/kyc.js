const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Generate UHID
const generateUHID = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `UH${timestamp.slice(-8)}${random}`;
};

// Digio API integration
const verifyWithDigio = async (kycData) => {
  const { panNumber, aadhaarNumber, email, phone, firstName, lastName } = kycData;
  const baseUrl = process.env.DIGIO_BASE_URL || 'https://ext.digio.in/444';
  const clientId = process.env.DIGIO_CLIENT_ID;
  const clientSecret = process.env.DIGIO_CLIENT_SECRET;

  // Input validation
  if (!email && !phone) {
    throw new Error('Either email or phone is required for Digio KYC');
  }
  if (!panNumber || !aadhaarNumber) {
    throw new Error('PAN and Aadhaar numbers are required');
  }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
    throw new Error('Invalid PAN number format');
  }
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    throw new Error('Invalid Aadhaar number format');
  }
  if (!firstName || !lastName) {
    throw new Error('First name and last name are required for Digio KYC');
  }

  try {
    // Step 1: Initiate KYC request
    const requestPayload = {
      customer_identifier: email || phone,
      identifier_type: email ? 'email' : 'mobile',
      customer_name: `${firstName} ${lastName}`,
      reference_id: `REF_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      documents: [
        { type: 'pan', value: panNumber },
        { type: 'aadhaar', value: aadhaarNumber }
      ],
      template_name: 'DIGILOCKER_INTEGRATION',
      notify_customer: true,
      generate_access_token: true,
      webhook: {
        url: process.env.WEBHOOK_URL,
        headers: { 'Content-Type': 'application/json' }
      }
    };

    console.log('Digio Request Payload:', JSON.stringify(requestPayload, null, 2));

    const requestResponse = await axios.post(
      `${baseUrl}/client/kyc/v2/request/with_template`,
      requestPayload,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const kycId = requestResponse.data.id;
    const accessToken = requestResponse.data.access_token?.id;
    const expiresInDays = requestResponse.data.expire_in_days;

    // Step 2: Poll for KYC status (simplified; in production, use webhook)
    let statusResponse;
    let attempts = 0;
    const maxAttempts = 10;
    const pollInterval = 3000; // 3 seconds

    while (attempts < maxAttempts) {
      statusResponse = await axios.post(
        `${baseUrl}/client/kyc/v2/${kycId}/response`,
        {},
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const status = statusResponse.data.status;
      if (status === 'completed' || status === 'approved') {
        // Step 3: Download KYC documents if needed
        const downloadResponse = await axios.get(
          `${baseUrl}/client/kyc/v2/media/${statusResponse.data.details?.aadhaar?.file_id || 'default_file_id'}`,
          {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            responseType: 'arraybuffer'
          }
        );

        // Extract verification details
        const aadhaarDetails = statusResponse.data.details?.aadhaar || {};
        const panDetails = statusResponse.data.details?.pan || {};

        return {
          success: true,
          verificationId: kycId,
          accessToken: accessToken,
          expiresInDays: expiresInDays,
          panVerified: !!panDetails.id_number,
          aadhaarVerified: !!aadhaarDetails.id_number,
          addressVerified: aadhaarDetails.id_proof_type === 'ID_AND_ADDRESS_PROOF',
          phoneVerified: true,
          emailVerified: true,
          verificationDetails: {
            aadhaar: {
              idNumber: aadhaarDetails.id_number,
              gender: aadhaarDetails.gender,
              idProofType: aadhaarDetails.id_proof_type
            },
            pan: panDetails.id_number ? { idNumber: panDetails.id_number } : null
          }
        };
      } else if (status === 'failed' || status === 'rejected') {
        throw new Error('KYC verification failed with Digio');
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new Error('KYC verification timeout');
  } catch (error) {
    console.error('Digio API error:', JSON.stringify(error.response?.data, null, 2));
    throw new Error('Document verification failed with Digio');
  }
};

// Webhook handler for Digio status updates
router.post('/webhooks/digio', async (req, res) => {
  try {
    const { kyc_id, status, details } = req.body;

    if (!kyc_id || !status) {
      return res.status(400).json({ msg: 'Invalid webhook payload' });
    }

    // Extract verification details
    const aadhaarDetails = details?.aadhaar || {};
    const panDetails = details?.pan || {};

    // Update user KYC status based on webhook
    const user = await User.findOneAndUpdate(
      { 'kycData.verificationId': kyc_id },
      {
        $set: {
          kycStatus: status === 'completed' || status === 'approved' ? 'completed' : 'failed',
          'kycData.verifiedAt': new Date(),
          'kycData.verificationDetails': {
            aadhaar: {
              idNumber: aadhaarDetails.id_number,
              gender: aadhaarDetails.gender,
              idProofType: aadhaarDetails.id_proof_type
            },
            pan: panDetails.id_number ? { idNumber: panDetails.id_number } : null
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found for KYC ID' });
    }

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
      lastName
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify with Digio
    let digioResult;
    try {
      digioResult = await verifyWithDigio({ panNumber, aadhaarNumber, email, phone, firstName, lastName });
    } catch (error) {
      return res.status(400).json({
        msg: 'KYC verification failed with Digio API',
        error: error.message
      });
    }

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
      verificationId: digioResult.verificationId,
      verificationMethod: 'digio',
      verificationDetails: digioResult.verificationDetails
    };

    await user.save();

    res.json({
      message: 'KYC verification initiated. Status will be updated upon completion.',
      uhid: user.uhid,
      verificationId: digioResult.verificationId,
      accessToken: digioResult.accessToken,
      expiresInDays: digioResult.expiresInDays
    });
  } catch (err) {
    console.error('KYC completion error:', err.message);
    res.status(500).send('Server Error');
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