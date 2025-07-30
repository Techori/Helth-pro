const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const HealthCard = require('../models/HealthCard');

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

// Helper function to check and update KYC status
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

// Helper function to check health card status
const checkHealthCardStatus = async (userId) => {
  const healthCards = await HealthCard.find({ user: userId, status: 'active' });
  if (!healthCards || healthCards.length === 0) {
    throw new Error('You must have an active health card to apply for a loan');
  }
  return healthCards[0];
};

// Helper function to generate a unique temporary application number
const generateUniqueTempApplicationNumber = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const tempApplicationNumber = `ML${year}${timestamp}${randomNum}`;

    const existingLoan = await Loan.findOne({ applicationNumber: tempApplicationNumber });
    if (!existingLoan) {
      return tempApplicationNumber;
    }

    attempt++;
  }

  throw new Error('Unable to generate a unique application number after multiple attempts');
};

// Helper function to calculate the 2nd of the next month
const getNextEmiDate = () => {
  let currentDate = new Date();
  let nextMonth = currentDate.getMonth() + 1;
  let nextYear = currentDate.getFullYear();

  if (nextMonth === 12) {
    nextMonth = 0;
    nextYear += 1;
  }

  return new Date(nextYear, nextMonth, 2);
};

// @route   GET api/loans
// @desc    Get all loans for a user or all loans for admin
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let loans;
    if (req.user.role === 'admin') {
      loans = await Loan.find().populate('user', 'firstName lastName email uhid').sort({ applicationDate: -1 });
    } else {
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
    const kycInfo = await checkAndUpdateKycStatus(req.user.id);
    await checkHealthCardStatus(req.user.id);
    
    const { step, data } = req.body;

    let loan = await Loan.findOne({ user: req.user.id, status: 'draft' });

    if (!loan) {
      const tempApplicationNumber = await generateUniqueTempApplicationNumber();
      loan = new Loan({
        user: req.user.id,
        uhid: kycInfo.uhid,
        applicationNumber: tempApplicationNumber,
        currentStep: step || 1,
        kycStatus: kycInfo.kycStatus,
        status: 'draft'
      });
    }

    if (data.personalInfo) loan.personalInfo = { ...loan.personalInfo, ...data.personalInfo };
    if (data.employmentInfo) loan.employmentInfo = { ...loan.employmentInfo, ...data.employmentInfo };
    if (data.medicalInfo) loan.medicalInfo = { ...loan.medicalInfo, ...data.medicalInfo };
    if (data.loanDetails) loan.loanDetails = { ...loan.loanDetails, ...data.loanDetails };
    if (data.documents) loan.documents = { ...loan.documents, ...data.documents };

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
    const kycInfo = await checkAndUpdateKycStatus(req.user.id);
    await checkHealthCardStatus(req.user.id);
    
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

    let loan = await Loan.findOne({ user: req.user.id, status: 'draft' });

    if (!loan) {
      loan = new Loan({
        user: req.user.id,
        uhid: kycInfo.uhid,
        kycStatus: kycInfo.kycStatus
      });
    }

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

    if (loan.loanDetails.approvedAmount && loan.loanDetails.preferredTerm && loan.loanDetails.interestRate) {
      const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
      const numPayments = loan.loanDetails.preferredTerm;
      loan.monthlyPayment = (loan.loanDetails.approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
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
      
      const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
      const numPayments = loan.loanDetails.preferredTerm;
      loan.monthlyPayment = (loan.loanDetails.approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      loan.remainingBalance = loan.loanDetails.approvedAmount;
      
      loan.nextEmiDate = getNextEmiDate();
      loan.emiPayments = [];
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

// @route   POST api/loans/:id/pay-emi
// @desc    Process EMI payment
// @access  Private
router.post('/:id/pay-emi', auth, async (req, res) => {
  try {
    const { amount, paymentMethod = 'online' } = req.body;
    
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    if (req.user.role !== 'admin' && loan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ msg: 'Loan must be approved to make payments' });
    }

    if (loan.remainingBalance <= 0) {
      return res.status(400).json({ msg: 'Loan is already fully paid' });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: 'Payment amount must be greater than zero' });
    }

    const transactionId = `EMI${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
    const interestPayment = Math.min(loan.remainingBalance * monthlyRate, amount);
    const principalPayment = Math.min(amount - interestPayment, loan.remainingBalance);

    const paymentDate = new Date();
    const nextEmiDueDate = new Date(loan.nextEmiDate);

    // Determine which EMI this payment applies to
    const appliesToMonth = paymentDate < nextEmiDueDate ? nextEmiDueDate : getNextEmiDate();
    const emiPayment = {
      paymentDate: paymentDate,
      amount: amount,
      principalAmount: principalPayment,
      interestAmount: interestPayment,
      transactionId: transactionId,
      paymentMethod: paymentMethod,
      status: 'completed',
      appliesToMonth: appliesToMonth.toISOString() // Record the month this payment applies to
    };

    loan.emiPayments = loan.emiPayments || [];
    loan.emiPayments.push(emiPayment);
    loan.remainingBalance = Math.max(0, loan.remainingBalance - principalPayment);

    if (loan.remainingBalance > 0) {
      loan.nextEmiDate = getNextEmiDate();
    } else {
      loan.nextEmiDate = null;
      loan.status = 'completed';
      loan.completionDate = new Date();
    }

    await loan.save();

    res.json({
      message: 'EMI payment processed successfully',
      transactionId,
      remainingBalance: loan.remainingBalance,
      nextEmiDate: loan.nextEmiDate,
      emiPayment
    });
  } catch (err) {
    console.error('EMI payment error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/loans/:id/emi-schedule
// @desc    Get EMI payment schedule
// @access  Private
router.get('/:id/emi-schedule', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).lean();
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    if (req.user.role !== 'admin' && loan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (loan.status !== 'approved' && loan.status !== 'completed') {
      return res.status(400).json({ msg: 'EMI schedule not available for this loan status' });
    }

    const schedule = [];
    const monthlyPayment = loan.monthlyPayment;
    const monthlyRate = loan.loanDetails.interestRate / 100 / 12;
    let balance = loan.loanDetails.approvedAmount;
    const startDate = loan.approvalDate || new Date();

    for (let i = 1; i <= loan.loanDetails.preferredTerm; i++) {
      const interestAmount = balance * monthlyRate;
      const principalAmount = Math.min(monthlyPayment - interestAmount, balance);
      balance = Math.max(0, balance - principalAmount);

      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i - 1);
      dueDate.setDate(2);

      // Match payment to the current EMI based on appliesToMonth
      const paidEmi = loan.emiPayments?.find(payment => {
        const paymentDueDate = new Date(payment.nextEmiDate);
        return paymentDueDate.toDateString() === dueDate.toDateString() && payment.amount >= monthlyPayment;
      });

      const status = paidEmi
        ? 'paid'
        : (dueDate < new Date() && !paidEmi ? 'overdue' : 'pending');

      schedule.push({
        emiNumber: i,
        dueDate: dueDate.toISOString(),
        emiAmount: monthlyPayment,
        principalAmount: principalAmount,
        interestAmount: interestAmount,
        balanceAfterPayment: balance,
        status: status,
        paidDate: paidEmi?.paymentDate ? new Date(paidEmi.paymentDate).toISOString() : null,
        transactionId: paidEmi?.transactionId || null
      });

      if (balance <= 0) break;
    }

    const nextPendingEmi = schedule.find(emi => emi.status === 'pending');
    const nextEmiDate = nextPendingEmi ? nextPendingEmi.dueDate : null;

    res.json({
      loanId: loan._id,
      applicationNumber: loan.applicationNumber,
      totalAmount: loan.loanDetails.approvedAmount,
      monthlyPayment: monthlyPayment,
      remainingBalance: loan.remainingBalance,
      nextEmiDate: nextEmiDate || loan.nextEmiDate,
      schedule: schedule,
      status: loan.status
    });
  } catch (err) {
    console.error('EMI schedule error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/loans/credit-score/:panNumber
// @desc    Get credit score by PAN number (mock)
// @access  Private
router.get('/credit-score/:panNumber', auth, async (req, res) => {
  try {
    const panNumber = req.params.panNumber;
    const mockScore = 650 + Math.floor(Math.random() * 150);
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
    const loan = await Loan.findOne({ user: req.user.id, status: 'draft' });
    res.json({ loan });
  } catch (err) {
    console.error('Error fetching draft loan:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/loans/:id/disburse-to-health-card
// @desc    Disburse approved loan amount to health card
// @access  Private
router.post('/:id/disburse-to-health-card', [
  auth,
  [check('healthCardId', 'Health card ID is required').not().isEmpty()]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { healthCardId } = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    if (req.user.role !== 'admin' && loan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ msg: 'Loan must be approved before disbursement' });
    }

    if (loan.disbursedToHealthCard) {
      return res.status(400).json({ msg: 'Loan amount already disbursed to health card' });
    }

    const healthCard = await HealthCard.findById(healthCardId);
    if (!healthCard) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    if (healthCard.user.toString() !== loan.user.toString()) {
      return res.status(400).json({ msg: 'Health card does not belong to loan applicant' });
    }

    if (healthCard.status !== 'active') {
      return res.status(400).json({ msg: 'Health card must be active for disbursement' });
    }

    const disbursementAmount = loan.loanDetails.approvedAmount;
    healthCard.availableCredit += disbursementAmount;
    
    loan.disbursedToHealthCard = true;
    loan.healthCardId = healthCardId;
    loan.status = 'disbursed';
    
    await healthCard.save();
    await loan.save();

    const transactionId = `DISB${Date.now()}${Math.floor(Math.random() * 1000)}`;

    res.json({
      message: 'Loan amount successfully disbursed to health card',
      transactionId,
      disbursementAmount,
      healthCardNewBalance: healthCard.availableCredit,
      loan
    });
  } catch (err) {
    console.error('Loan disbursement error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;