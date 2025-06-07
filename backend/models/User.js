const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'hospital', 'admin', 'sales', 'crm', 'agent', 'support'],
    default: 'patient'
  },
  uhid: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        // Only allow UHID if role is patient
        return this.role !== 'patient' ? !v : true;
      },
      message: 'UHID can only be assigned to patients'
    }
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
kycData: {
    panNumber: String,
    aadhaarNumber: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    maritalStatus: String,
    dependents: String,
    verificationId: String,
    verificationMethod: String,
    verifiedAt: Date,
    verificationDetails: {
      aadhaar: {
        idNumber: String,
        gender: String,
        idProofType: String
      },
      pan: {
        idNumber: String
      }
    }
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
    resetPasswordToken: {

    type: String,

    default: null,

  },
    hospitalId: {
    type: String,
    unique: true,
    sparse: true, // Allows null for non-hospital roles
  },

  resetPasswordTokenExpiry: {

    type: Date,

    default: null,

  },

});

// Add pre-save middleware to clear UHID if role is not patient
UserSchema.pre('save', function(next) {
  if (this.role !== 'patient') {
    this.uhid = undefined;
    this.kycStatus = undefined;
    this.kycData = undefined;
  }
  next();
});

module.exports = mongoose.model('user', UserSchema);
