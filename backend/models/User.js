
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
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Validate phone number format (10 digits)
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["patient", "hospital", "admin", "sales", "crm", "agent", "support", "hospital staff", "hospital admin"],
    default: "patient"
  },
  uhid: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        // Allow null for patients, disallow for non-patients
        if (this.role !== 'patient') {
          return !v;
        }
        return true; // Allow null or valid UHID for patients
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
    referenceId: String,
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
    default: null
  },
  hospitalId: {
    type: String,
    unique: true,
    sparse: true // Allows null for non-hospital roles
  },
  notes: {
    type: String,
    default: ''
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null
  },
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: {
      type: String,
      default: null
    },
    backupCodes: [{
      type: String
    }]
  },
  requiresTwoFA: {
    type: Boolean,
    default: false // Indicates if the user requires two-factor authentication
  },
  tempToken: {
    type: String,
    default: null // Temporary token for actions like email verification, password reset, etc
  },
  notificationPreferences: {
    emiReminders: {
      type: Boolean,
      default: true
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    balanceAlerts: {
      type: Boolean,
      default: true
    },
    promotionalOffers: {
      type: Boolean,
      default: false
    }
  },
  preferredHospital: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  }
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
