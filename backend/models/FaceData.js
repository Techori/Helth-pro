const mongoose = require("mongoose");

const FaceDataSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  faceImage: {
    type: String,
    required: true,
  },
  descriptor: {
    type: [Number],
    required: true,
  },
  isNominee: {
    type: Boolean,
    default: false,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("faceData", FaceDataSchema);
