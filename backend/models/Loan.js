

const mongoose = require('mongoose');

const EmiPaymentSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  principalAmount: {
    type: Number,
    required: true
  },
  interestAmount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'bank_transfer', 'cash', 'cheque'],
    default: 'online'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
});

const LoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  uhid: {
    type: String,
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  currentStep: {
    type: Number,
    default: 1
  },
  
  // Personal Information
  personalInfo: {
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    phoneNumber: String,
    secondaryPhone: String,
    email: String,
    homeAddress: String,
    city: String,
    state: String,
    zipCode: String,
    nationalId: String,
    maritalStatus: String,
    dependents: String,
    citizenshipStatus: String,
    languagePreference: String
  },

  // Employment and Income Information
  employmentInfo: {
    employerName: String,
    employerAddress: String,
    occupation: String,
    employmentStatus: String,
    startDate: Date,
    monthlyGrossIncome: Number,
    additionalIncome: String,
    unemploymentBenefits: Boolean,
    totalHouseholdIncome: Number,
    householdMembersInfo: String,
    incomeFluctuation: String
  },

  // Medical Information
  medicalInfo: {
    treatmentRequired: String,
    medicalProvider: String,
    treatmentStarted: Boolean,
    estimatedCost: Number,
    insuranceCoverage: Number,
    insuranceProvider: String,
    policyNumber: String,
    healthPlanCovered: Boolean,
    appliedFinancialAssistance: Boolean,
    preExistingConditions: String,
    outstandingMedicalDebt: String
  },

  // Financial Information
  financialInfo: {
    homeOwnership: Boolean,
    monthlyMortgageRent: Number,
    existingLoans: String,
    carLoans: String,
    assets: String,
    coSigners: String,
    bankruptcyHistory: String,
    taxObligations: String,
    creditScoreRange: String,
    recentCreditInquiries: Boolean,
    financialHardship: Boolean,
    governmentAssistance: Boolean,
    collectionsHistory: String
  },

  // Loan Details
  loanDetails: {
    requestedAmount: Number,
    approvedAmount: Number,
    preferredTerm: Number,
    repaymentMethod: String,
    interestRate: Number,
    existingPaymentPlans: String,
    previousLoanApplication: String,
    coApplicantInfo: String,
    primaryIncomeSource: String,
    anticipatedChanges: String,
    familySupport: Boolean,
    debtRestructuring: Boolean,
    repaymentPlan: String,
    priorArrangements: Boolean,
    additionalFinancialInfo: String
  },

  // Documents
  documents: {
    panCard: String,
    aadhaarCard: String,
    incomeProof: String,
    bankStatement: String,
    medicalDocuments: String
  },

  // Witnesses and Location
  verification: {
    witness1Name: String,
    witness1Photo: String,
    witness1Contact: String,
    witness2Name: String,
    witness2Photo: String,
    witness2Contact: String,
    livePhoto: String,
    liveLocation: String,
    homePhoto: String
  },

  // Credit and KYC Status
  creditScore: Number,
  kycStatus: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },

  // Application Status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'additional_docs_needed', 'completed'],
    default: 'draft'
  },
  rejectionReason: String,
  
  // Timestamps
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  submissionDate: Date,
  completionDate: Date,
  
  // Payment and Agreement
  firstPaymentAmount: Number,
  transactionId: String,
  agreementSigned: {
    type: Boolean,
    default: false
  },
  nachMandateSigned: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },

  // Calculated fields
  monthlyPayment: Number,
  remainingBalance: Number,
  maxEligibleAmount: Number,
  
  // EMI Payment Tracking
  nextEmiDate: Date,
  emiPayments: [EmiPaymentSchema]
});

// Generate application number before saving
LoanSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const count = await mongoose.model('loan').countDocuments();
    this.applicationNumber = `ML${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('loan', LoanSchema);

