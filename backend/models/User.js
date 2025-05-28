const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patient", "hospital", "admin", "sales", "crm", "agent", "support"],
    default: "patient",
  },
  avatar: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  uhid: {
    type: String,
    unique: true,
    sparse: true, // Allows null for non-patient roles
  },
});

module.exports = mongoose.model("user", UserSchema);
