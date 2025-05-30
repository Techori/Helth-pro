
const mongoose = require('mongoose');

const HealthCardSchema = new mongoose.Schema({
  patientId: {
  type: String,
  required: true
},
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'user',
  //   required: true
  // },
  availableCredit: {
    type: Number,
    required: true,
    default: 25000
  },
  usedCredit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending'
  },
  cardType: {
    type: String,
    enum: ['silver', 'gold', 'platinum','basic'],
    default: 'silver'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('healthCard', HealthCardSchema);
