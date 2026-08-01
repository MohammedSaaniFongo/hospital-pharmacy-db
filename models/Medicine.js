const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    category: { type: String, required: true },
    manufacturer: { type: String },
    unit: { type: String, required: true }, // e.g. tablet, syrup, injection
    pricePerUnit: { type: Number, required: true, min: 0 }, // GH₵
    reorderLevel: { type: Number, default: 20 },
    requiresPrescription: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
