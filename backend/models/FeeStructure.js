
const mongoose = require("mongoose");

const FeeStructureSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    unique: true, // Ensure unique categories
  },
  fee: {
    type: Number,
    required: [true, "Fee amount is required"],
    min: [0, "Fee cannot be negative"],
  },
  type: {
    type: String,
    enum: ["One-time", "Percentage", "Annual"],
    required: [true, "Fee type is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
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

module.exports = mongoose.model("FeeStructure", FeeStructureSchema);
