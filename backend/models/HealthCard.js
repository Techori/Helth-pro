const mongoose = require('mongoose');

const healthCardSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  uhid: { type: String },
  availableCredit: { type: Number, default: 0 },
  usedCredit: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  cardType: { 
    type: String, 
    enum: ['health_paylater', 'health_emi', 'health_50_50', 'ri_medicare_discount'], 
    required: true 
  },
  discountPercentage: { type: Number, default: 0 }, // Applicable for ri_medicare_discount
  monthlyLimit: { type: Number }, // Applicable for ri_medicare_discount
  requestedCreditLimit: { type: Number, required: true },
  approvedCreditLimit: { type: Number },
  medicalHistory: { type: String },
  monthlyIncome: { type: Number, required: true },
  employmentStatus: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  issueDate: { type: Date },
  rejectionReason: { type: String },
  interestRate: { type: Number }, // Applicable for health_emi
  zeroInterestMonths: { type: Number }, // Applicable for health_paylater
  dailyCashBenefit: { type: Number }, // Applicable for ri_medicare_discount
});

module.exports = mongoose.model('HealthCard', healthCardSchema);