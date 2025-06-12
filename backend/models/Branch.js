const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital',
    required: true
  },
  branchName: {
    type: String,
    required: true
  },
  branchManagerName: {
    type: String,
    required: true
  },
  branchManagerEmail: {
    type: String,
    required: true
  },
  branchCode: {
    type: String,
    required: true,
    unique: true
  },
  branchContact: {
    type: String,
    required: true
  },
  branchAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('branch', BranchSchema); 