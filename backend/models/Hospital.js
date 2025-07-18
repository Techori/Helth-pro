
const mongoose = require('mongoose');



// Drop problematic indexes if they exist
mongoose.connection.on('connected', async () => {
  try {
    // Get all indexes
    const indexes = await mongoose.connection.db.collection('hospitals').indexes();
    const indexNames = indexes.map(index => index.name);

    // Only try to drop indexes that exist
    const indexesToDrop = ['contactEmail_1', 'hospitalId_1'].filter(name => indexNames.includes(name));
    
    if (indexesToDrop.length > 0) {
      await Promise.all(
        indexesToDrop.map(name => 
          mongoose.connection.db.collection('hospitals').dropIndex(name)
        )
      );
      console.log('Successfully dropped indexes:', indexesToDrop);
    }
  } catch (err) {
    // Only log unexpected errors
    if (err.code !== 26 && err.code !== 27) {
      console.error('Error managing indexes:', err);
    }
  }
});

const hospitalSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  services: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Active', 'Rejected'],
    default: 'Pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});

// Add only necessary indexes
hospitalSchema.index({ email: 1 }, { unique: true });
hospitalSchema.index({ status: 1 });
hospitalSchema.index({ name: 1 });
hospitalSchema.index({ user: 1 });

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;