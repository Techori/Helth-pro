
const mongoose = require('mongoose');

const HealthCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  uhid: {
    type: String,
    ref: 'user'
  },
  availableCredit: {
    type: Number,
    required: true,
    default: 0
  },
  usedCredit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending', 'suspended', 'rejected'],
    default: 'pending'
  },
  cardType: {
    type: String,
    enum: ['basic', 'premium', 'ricare_discount'],
    default: 'basic'
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  monthlyLimit: {
    type: Number
  },
  requestedCreditLimit: {
    type: Number
  },
  medicalHistory: {
    type: String
  },
  monthlyIncome: {
    type: Number
  },
  employmentStatus: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('healthCard', HealthCardSchema);
