const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Helper function to validate Aadhaar last digits
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

// Parse date from DD/MM/YYYY to Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
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
  const refId = verificationId && /^REF_\d+_[a-z0-9]+$/.test(verificationId) 
    ? verificationId 
    : generateVerificationId();

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
        group_name: 'Testing',
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
      verificationId: requestResponse.data.id,
      accessToken: requestResponse.data.access_token?.id,
      expiresInDays: requestResponse.data.expire_in_days,
      referenceId: requestResponse.data.reference_id,
      message: 'KYC verification initiated successfully'
    };
  } catch (error) {
    console.error('Digio API error:', error.response?.data);
    throw new Error('Document verification failed with Digio');
  }
};

// Check KYC status using Digio API
const checkKycStatus = async (kycId, retries = 3, backoff = 3000) => {
  const productionUrl = process.env.DIGIO_PRODUCTION_URL || 'https://api.digio.in';
  const clientId = process.env.DIGIO_CLIENT_ID;
  const clientSecret = process.env.DIGIO_CLIENT_SECRET;

  try {
    const response = await axios.post(
      `${productionUrl}/client/kyc/v2/${kycId}/response`,
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Digio status response:', response.data);

    return response.data;
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return checkKycStatus(kycId, retries - 1, backoff * 2);
    }
    console.error('Digio status check error:', error.response?.data);
    throw new Error('Failed to check KYC status');
  }
};

// Update user KYC data with comparison
const updateUserKycData = async (user, kycId, status, details, actions, referenceId, io) => {
  // Validate referenceId before splitting
  if (!referenceId || typeof referenceId !== 'string') {
    console.error(`Invalid or missing referenceId for kycId: ${kycId}, user: ${user._id}`);
    return user; // Skip updates if referenceId is invalid
  }

  const storedAadhaarLastDigits = referenceId.split('_').pop();
  const aadhaarDetails = actions?.[0]?.details?.aadhaar || details?.aadhaar || {};
  const panDetails = actions?.[0]?.details?.pan || details?.pan || {};

  // Validate Aadhaar last digits
  if (aadhaarDetails.id_number) {
    const receivedLastDigits = aadhaarDetails.id_number.slice(-4);
    if (!validateAadhaarLastDigits(storedAadhaarLastDigits, aadhaarDetails.id_number)) {
      console.error(`Aadhaar number verification failed for kycId: ${kycId}`);
      throw new Error('Aadhaar verification failed');
    }
  }

  const updates = {
    'kycData.aadhaarLastDigits': storedAadhaarLastDigits,
    'kycData.aadhaarVerified': true
  };

  // Update address details
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
    if (firstName !== user.kycData?.firstName) {
      console.log(`Updating First Name: ${user.kycData?.firstName} -> ${firstName}`);
      updates['kycData.firstName'] = firstName;
    }
    if (lastName !== user.kycData?.lastName) {
      console.log(`Updating Last Name: ${user.kycData?.lastName} -> ${lastName}`);
      updates['kycData.lastName'] = lastName;
    }
  }

  if (aadhaarDetails.gender && aadhaarDetails.gender !== user.kycData?.gender) {
    console.log(`Updating Gender: ${user.kycData?.gender} -> ${aadhaarDetails.gender}`);
    updates['kycData.gender'] = aadhaarDetails.gender;
  }

  const parsedDob = parseDate(aadhaarDetails.dob);
  if (parsedDob && (!user.kycData?.dateOfBirth || parsedDob.getTime() !== new Date(user.kycData.dateOfBirth).getTime())) {
    console.log(`Updating DOB: ${user.kycData?.dateOfBirth} -> ${parsedDob}`);
    updates['kycData.dateOfBirth'] = parsedDob;
  }

  if (aadhaarDetails.father_name && aadhaarDetails.father_name !== user.kycData?.fatherName) {
    console.log(`Updating Father Name: ${user.kycData?.fatherName} -> ${aadhaarDetails.father_name}`);
    updates['kycData.fatherName'] = aadhaarDetails.father_name;
  }

  if (panDetails.id_number && panDetails.id_number !== user.kycData?.panNumber) {
    console.log(`Updating PAN: ${user.kycData?.panNumber} -> ${panDetails.id_number}`);
    updates['kycData.panNumber'] = panDetails.id_number;
  }

  // Update verification status and details
  updates.kycStatus = status === 'approved' ? 'completed' : 'pending';
  updates['kycData.verifiedAt'] = new Date();
  updates['kycData.verificationDetails'] = {
    aadhaar: {
      lastDigits: storedAadhaarLastDigits,
      gender: aadhaarDetails.gender,
      name: aadhaarDetails.name,
      address: aadhaarDetails.current_address,
      dob: parseDate(aadhaarDetails.dob)
    },
    pan: {
      idNumber: panDetails.id_number,
      name: panDetails.name,
      dob: parseDate(panDetails.dob)
    }
  };

  if (Object.keys(updates).length > 2) { // More than aadhaarLastDigits and aadhaarVerified
    const updatedUser = await User.findOneAndUpdate(
      { 'kycData.verificationId': kycId },
      { $set: updates },
      { new: true }
    );

    if (updatedUser && io) {
      io.to(updatedUser._id.toString()).emit('kycStatusUpdate', {
        kycStatus: updatedUser.kycStatus,
        uhid: updatedUser.uhid,
        kycData: updatedUser.kycData
      });
      console.log(`KYC data updated for user ${updatedUser._id}`);
      return updatedUser;
    }
  } else {
    console.log(`No significant KYC data changes for user ${user._id}`);
  }
  return user;
};

// Webhook handler for Digio status updates
router.post('/webhooks/digio', async (req, res) => {
  try {
    const { id, status, actions, reference_id } = req.body;
    if (!id || !status) {
      return res.status(400).json({ msg: 'Invalid webhook payload' });
    }

    const user = await User.findOne({ 'kycData.verificationId': id });
    if (!user) {
      return res.status(404).json({ msg: 'User not found for KYC ID' });
    }

    await updateUserKycData(user, id, status, null, actions, reference_id, req.app.get('io'));

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ msg: 'Webhook processing failed' });
  }
});

// @route   POST api/kyc/verify-digio
// @desc    Verify KYC with Digio API (for standalone use)
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

    // Check if user has a pending verification
    if (user.kycStatus === 'pending' && user.kycData?.verificationId) {
      return res.status(400).json({
        msg: 'A KYC verification is already pending. Please wait for completion.',
        verificationId: user.kycData.verificationId
      });
    }

    // Initiate Digio verification
    const digioResult = await verifyWithDigio({
      panNumber,
      aadhaarNumber,
      email,
      phone,
      firstName,
      lastName,
      verificationId
    });

    // Generate UHID if not already present
    if (!user.uhid) {
      user.uhid = generateUHID();
    }

    // Update user KYC data
    user.kycStatus = 'pending';
    user.kycData = {
      panNumber,
      aadhaarLastDigits: aadhaarNumber.slice(-4), // Store only last 4 digits
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

    // If status is pending and verificationId exists, check Digio API
    if (user.kycStatus === 'pending' && user.kycData?.verificationId) {
      if (!user.kycData.referenceId) {
        console.warn(`Missing referenceId for user ${user._id}, skipping Digio status check`);
        return res.json({
          kycStatus: user.kycStatus,
          uhid: user.uhid,
          kycData: user.kycData
        });
      }

      try {
        const digioStatus = await checkKycStatus(user.kycData.verificationId);
        const updatedUser = await updateUserKycData(
          user,
          user.kycData.verificationId,
          digioStatus.status,
          digioStatus,
          digioStatus.actions,
          user.kycData.referenceId,
          req.app.get('io')
        );
        return res.json({
          kycStatus: updatedUser.kycStatus,
          uhid: updatedUser.uhid,
          kycData: updatedUser.kycData
        });
      } catch (error) {
        console.error(`Failed to check Digio status for user ${user._id}:`, error.message);
        // Return current user data if API call fails
      }
    }

    res.json({
      kycStatus: user.kycStatus,
      uhid: user.uhid,
      kycData: user.kycData
    });
  } catch (err) {
    console.error('Status route error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;