
const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  termMonths: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  monthlyPayment: {
    type: Number
  },
  remainingBalance: {
    type: Number
  }
});

module.exports = mongoose.model('loan', LoanSchema);
