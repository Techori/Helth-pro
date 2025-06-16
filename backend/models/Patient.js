const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    uhid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other']
    },
    phone: {
      type: String,
      required: true
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
      enum: ["Active", "Inactive", "Not Issued"],
      default: "Not Issued",
    },
    cardBalance: {
      type: Number,
      default: 0,
    },
    lastVisit: {
      type: Date,
      default: null
    },
    faceEmbeddings: {
      type: [Number],
      required: true
    },
    faceImage: {
      type: String, // Base64 encoded image
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
);

// Update the updatedAt timestamp before saving
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);