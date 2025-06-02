const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    initialPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'staff', 'doctor', 'nurse'], // Example roles
    },
    department: {
      type: String,
      required: true,
      enum: ['billing', 'surgery', 'cardiology', 'emergency'], // Example departments
    },
    // Add other fields as necessary
  });

  module.exports = mongoose.model('HospitalUser', userSchema);