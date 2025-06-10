const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  documentType: {
    type: String,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('FileMetadata', fileMetadataSchema);