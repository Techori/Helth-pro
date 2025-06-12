const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Hospital Manager', 'Finance Staff', 'Front Desk Staff', 'Relationship Manager', 'Billing Staff']
  },
  hospital: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Administration', 'Finance', 'Reception', 'Marketing']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
staffSchema.index({ email: 1 });
staffSchema.index({ hospital: 1 });
staffSchema.index({ role: 1 });
staffSchema.index({ status: 1 });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff; 