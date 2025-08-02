// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  lastAccessed: { type: Date, default: Date.now },
  deviceName: { type: String, required: true },
  location: {
    type: {
      city: { type: String, default: 'Unknown' },
      region: { type: String, default: 'Unknown' },
      country: { type: String, default: 'Unknown' },
    },
    _id: false, // Prevent MongoDB from adding _id to location subdocument
    required: true,
  },
});

sessionSchema.index({ userId: 1, token: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;