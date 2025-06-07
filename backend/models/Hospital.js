
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: [true, 'Hospital ID is required'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  contactPerson: {
    type: String,
  },
  contactEmail: {
    type: String,
    // Remove unique constraint; set to email in controller
  },
  contactPhone: {
    type: String,
  },
  specialties: {
    type: [String],
    default: [],
  },
  services: {
    type: [String],
    default: [],
  },
  hospitalType: {
    type: String,
    enum: ['Government', 'Private', 'Trust', 'Clinic', 'Multispeciality'],
    default: 'Private',
  },
  bedCount: {
    type: Number,
    default: 0,
  },
  registrationNumber: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  accreditations: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending',
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
  },
  foundedYear: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('hospital', HospitalSchema);
