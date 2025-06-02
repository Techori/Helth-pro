
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');

// Credit score criteria for loan eligibility
const getCreditScoreCriteria = (creditScore) => {
  if (creditScore >= 750) {
    return { maxAmount: 500000, interestRate: 10.5 };
  } else if (creditScore >= 700) {
    return { maxAmount: 300000, interestRate: 12.0 };
  } else if (creditScore >= 650) {
    return { maxAmount: 150000, interestRate: 14.0 };
  } else if (creditScore >= 600) {
    return { maxAmount: 75000, interestRate: 16.0 };
  } else {
    return { maxAmount: 0, interestRate: 0 };
  }
};

// Add this helper function at the top with other helpers
const checkAndUpdateKycStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.kycStatus !== 'completed') {
    throw new Error('KYC verification must be completed before applying for a loan');
  }
  
  return {
    uhid: user.uhid,
    kycData: user.kycData,
    kycStatus: user.kycStatus
  };
};

// @route   GET api/loans
// @desc    Get all loans for a user or all loans for admin
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let loans;
    if (req.user.role === 'admin') {
      // Admin can see all loans
      loans = await Loan.find().populate('user', 'firstName lastName email uhid').sort({ applicationDate: -1 });
    } else {
      // Regular users see only their loans
      loans = await Loan.find({ user: req.user.id }).sort({ applicationDate: -1 });
    }
    res.json(loans || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/loans/by-uhid/:uhid
// @desc    Get loans by UHID
// @access  Private
router.get('/by-uhid/:uhid', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ uhid: req.params.uhid }).sort({ applicationDate: -1 });
    res.json(loans || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/loans/draft
// @desc    Create or update draft loan application
// @access  Private
router.post('/draft', auth, async (req, res) => {
  try {
    // Check KYC status first
    const kycInfo = await checkAndUpdateKycStatus(req.user.id);
    
    const { step, data } = req.body;

    // Find existing draft or create new one
    let loan = await Loan.findOne({ 
      user: req.user.id, 
      status: 'draft' 
    });

    if (!loan) {
      // Create new draft loan with temporary application number
      const count = await Loan.countDocuments();
      const tempApplicationNumber = `ML${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
      
      loan = new Loan({
        user: req.user.id,
        uhid: kycInfo.uhid,
        applicationNumber: tempApplicationNumber,
        currentStep: step || 1,
        kycStatus: kycInfo.kycStatus,
        status: 'draft'
      });
    }

    // Update loan data based on what's provided in data
    if (data.personalInfo) {
      loan.personalInfo = { ...loan.personalInfo, ...data.personalInfo };
    }
    if (data.employmentInfo) {
      loan.employmentInfo = { ...loan.employmentInfo, ...data.employmentInfo };
    }
    if (data.medicalInfo) {
      loan.medicalInfo = { ...loan.medicalInfo, ...data.medicalInfo };
    }
    if (data.loanDetails) {
      loan.loanDetails = { ...loan.loanDetails, ...data.loanDetails };
    }
    if (data.documents) {
      loan.documents = { ...loan.documents, ...data.documents };
    }

    // Update step and other fields
    loan.currentStep = Math.max(loan.currentStep || 1, step || 1);
    
    if (data.transactionId) loan.transactionId = data.transactionId;
    if (data.agreementSigned !== undefined) loan.agreementSigned = data.agreementSigned;
    if (data.nachMandateSigned !== undefined) loan.nachMandateSigned = data.nachMandateSigned;
    if (data.termsAccepted !== undefined) loan.termsAccepted = data.termsAccepted;

    await loan.save();

    res.json(loan);
  } catch (err) {
    console.error('Loan draft error:', err.message);
    res.status(400).json({ msg: err.message });
  }
});

// @route   POST api/loans/submit
// @desc    Submit complete loan application
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    // Check KYC status first
    const kycInfo = await checkAndUpdateKycStatus(req.user.id);
    
    const {
      personalInfo,
      employmentInfo,
      medicalInfo,
      financialInfo,
      loanDetails,
      documents,
      verification,
      transactionId,
      agreementSigned,
      nachMandateSigned,
      termsAccepted
    } = req.body;

    // Find existing draft or create new loan
    let loan = await Loan.findOne({ 
      user: req.user.id, 
      status: 'draft' 
    });

    if (!loan) {
      loan = new Loan({
        user: req.user.id,
        uhid: kycInfo.uhid,
        kycStatus: kycInfo.kycStatus
      });
    }

    // Update all loan data
    loan.personalInfo = personalInfo;
    loan.employmentInfo = employmentInfo;
    loan.medicalInfo = medicalInfo;
    loan.financialInfo = financialInfo;
    loan.loanDetails = loanDetails;
    loan.documents = documents;
    loan.verification = verification;
    loan.transactionId = transactionId;
    loan.agreementSigned = agreementSigned;
    loan.nachMandateSigned = nachMandateSigned;
    loan.termsAccepted = termsAccepted;
    loan.status = 'submitted';
    loan.submissionDate = new Date();

    // Calculate monthly payment if approved amount exists
    if (loan.loanDetails.approvedAmount && loan.loanDetails.preferredTerm && loan.loanDetails.interestRate) {
      const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
      const numPayments = loan.loanDetails.preferredTerm;
      loan.monthlyPayment = 
        (loan.loanDetails.approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      loan.remainingBalance = loan.loanDetails.approvedAmount;
    }

    await loan.save();
    res.json({
      message: 'Loan application submitted successfully',
      applicationNumber: loan.applicationNumber,
      loan
    });
  } catch (err) {
    console.error('Loan submission error:', err.message);
    res.status(400).json({ msg: err.message });
  }
});

// @route   PUT api/loans/:id/status
// @desc    Update loan status (admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { status, rejectionReason, approvedAmount, interestRate, term } = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    loan.status = status;
    
    if (status === 'approved') {
      loan.approvalDate = new Date();
      if (approvedAmount) loan.loanDetails.approvedAmount = approvedAmount;
      if (interestRate) loan.loanDetails.interestRate = interestRate;
      if (term) loan.loanDetails.preferredTerm = term;
      
      // Calculate monthly payment
      const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
      const numPayments = loan.loanDetails.preferredTerm;
      loan.monthlyPayment = 
        (loan.loanDetails.approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      loan.remainingBalance = loan.loanDetails.approvedAmount;
    } else if (status === 'rejected') {
      loan.rejectionReason = rejectionReason;
    }

    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/loans/credit-score/:panNumber
// @desc    Get credit score by PAN number (mock)
// @access  Private
router.get('/credit-score/:panNumber', auth, async (req, res) => {
  try {
    // Mock credit score based on PAN number
    const panNumber = req.params.panNumber;
    const mockScore = 650 + Math.floor(Math.random() * 150); // Random score between 650-800
    
    const criteria = getCreditScoreCriteria(mockScore);
    
    res.json({
      creditScore: mockScore,
      maxEligibleAmount: criteria.maxAmount,
      interestRate: criteria.interestRate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/loans/draft/current
// @desc    Get current draft loan for user
// @access  Private
router.get('/draft/current', auth, async (req, res) => {
  try {
    const loan = await Loan.findOne({ 
      user: req.user.id, 
      status: 'draft'
    });
    
    res.json({ loan });
  } catch (err) {
    console.error('Error fetching draft loan:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
