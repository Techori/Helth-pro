const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    uhid: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
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
  contact: {
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
  { timestamps: true },

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
});

// Update the updatedAt timestamp before saving
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
