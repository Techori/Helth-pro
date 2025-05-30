const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  specialties: {
    type: [String],
    default: []
  },
  services: {
    type: [String],
    default: []
  },
  hospitalType: {
    type: String,
    enum: ['Government', 'Private', 'Trust', 'Clinic', 'Multispeciality'], // updated based on form
    default: 'Private'
  },
  bedCount: {
    type: Number,
    default: 0
  },
  registrationNumber: { // keep this but also allow `licenseNumber`
    type: String
  },
  licenseNumber: { // added field for license input
    type: String
  },
  accreditations: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  logo: {
    type: String
  },
  website: {
    type: String
  },
  foundedYear: { // new field from form
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('hospital', HospitalSchema);
