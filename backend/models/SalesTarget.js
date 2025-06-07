
const mongoose = require("mongoose");

const SalesTargetSchema = new mongoose.Schema({
  hospital: {
    type: String,
    required: [true, "Hospital is required"],
    trim: true,
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, "Target amount is required"],
    min: [0, "Target amount cannot be negative"],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, "Current amount cannot be negative"],
  },
  period: {
    type: String,
    required: [true, "Period is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, "Progress cannot be negative"],
    max: [100, "Progress cannot exceed 100"],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//     required: [true, "Updated by user is required"],
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SalesTarget", SalesTargetSchema);
