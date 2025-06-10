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

  // Use existing verificationId if provided and valid, otherwise generate a new one
  const refId = verificationId && /^REF_\d+_[a-z0-9]+$/.test(verificationId) 
    ? verificationId 
    : generateVerificationId();

  try {
    // Step 1: Initiate KYC request
    const requestPayload = {
      customer_identifier: email || phone,
      identifier_type: email ? 'email' : 'mobile',
      customer_name: `${firstName} ${lastName}`,
      reference_id: refId,
      documents: [
        { type: 'pan', value: panNumber },
        { type: 'aadhaar', value: aadhaarNumber }
      ],
      template_name: 'DIGILOCKER_AADHAAR_PAN',
      notify_customer: true,
      generate_access_token: true,
      webhook: {
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
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return verifyWithDigio(kycData, retries - 1, backoff * 2);
    }
    console.error('Digio API error:', error.response?.data);
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

    // Find user by kyc_id
    const user = await User.findOne({ 'kycData.verificationId': kyc_id });
    if (!user) {
      return res.status(404).json({ msg: 'User not found for KYC ID' });
    }

    // Compare webhook details with stored kycData
    const currentKycData = user.kycData || {};
    const updates = {};

    // Compare and update fields if different or new
    if (panDetails.id_number && panDetails.id_number !== currentKycData.panNumber) {
      console.log(`Updating PAN: ${currentKycData.panNumber} -> ${panDetails.id_number}`);
      updates['kycData.panNumber'] = panDetails.id_number;
    }
    if (aadhaarDetails.id_number && aadhaarDetails.id_number !== currentKycData.aadhaarNumber) {
      console.log(`Updating Aadhaar: ${currentKycData.aadhaarNumber} -> ${aadhaarDetails.id_number}`);
      updates['kycData.aadhaarNumber'] = aadhaarDetails.id_number;
    }
    if (aadhaarDetails.name) {
      const [webhookFirstName, ...webhookLastNameParts] = aadhaarDetails.name.split(' ');
      const webhookLastName = webhookLastNameParts.join(' ');
      if (webhookFirstName && webhookFirstName !== currentKycData.firstName) {
        console.log(`Updating First Name: ${currentKycData.firstName} -> ${webhookFirstName}`);
        updates['kycData.firstName'] = webhookFirstName;
      }
      if (webhookLastName && webhookLastName !== currentKycData.lastName) {
        console.log(`Updating Last Name: ${currentKycData.lastName} -> ${webhookLastName}`);
        updates['kycData.lastName'] = webhookLastName;
      }
    }
    if (aadhaarDetails.email && aadhaarDetails.email !== currentKycData.email) {
      console.log(`Updating Email: ${currentKycData.email} -> ${aadhaarDetails.email}`);
      updates['kycData.email'] = aadhaarDetails.email;
    }
    if (aadhaarDetails.phone && aadhaarDetails.phone !== currentKycData.phone) {
      console.log(`Updating Phone: ${currentKycData.phone} -> ${aadhaarDetails.phone}`);
      updates['kycData.phone'] = aadhaarDetails.phone;
    }
    if (aadhaarDetails.gender && aadhaarDetails.gender !== currentKycData.gender) {
      console.log(`Updating Gender: ${currentKycData.gender} -> ${aadhaarDetails.gender}`);
      updates['kycData.gender'] = aadhaarDetails.gender;
    }

    // Update verification details and status
    updates.kycStatus = status === 'completed' || status === 'approved' ? 'completed' : 'rejected';
    updates['kycData.verifiedAt'] = new Date();
    updates['kycData.verificationDetails'] = {
      aadhaar: {
        idNumber: aadhaarDetails.id_number,
        gender: aadhaarDetails.gender,
        idProofType: aadhaarDetails.id_proof_type
      },
      pan: panDetails.id_number ? { idNumber: panDetails.id_number } : null
    };

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { 'kycData.verificationId': kyc_id },
        { $set: updates },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found for KYC ID after update' });
      }

      // Emit WebSocket event to notify frontend
      const io = req.app.get('io');
      io.to(updatedUser._id.toString()).emit('kycStatusUpdate', {
        kycStatus: updatedUser.kycStatus,
        uhid: updatedUser.uhid,
        kycData: updatedUser.kycData
      });

      console.log(`KYC data updated for user ${updatedUser._id}`);
    } else {
      console.log(`No KYC data changes for user ${user._id}`);
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