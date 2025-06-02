const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    uhid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cardNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined
    },
    cardStatus: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
    cardBalance: {
      type: Number,
      default: 0,
    },
    lastVisit: {
      type: Date,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
