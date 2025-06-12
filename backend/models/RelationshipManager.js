const mongoose = require('mongoose');

const RelationshipManagerSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital',
    required: true
  },
  relationshipManager: {
    type: String,
    required: true
  },
  rmContact: {
    type: String,
    required: true
  },
  rmEmail: {
    type: String,
    required: true
  },
  salesManager: {
    type: String,
    required: true
  },
  salesManagerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('relationshipManager', RelationshipManagerSchema); 