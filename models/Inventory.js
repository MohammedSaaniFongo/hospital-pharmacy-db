const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    batchNo: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    location: { type: String, default: 'Main Store' }
  },
  { timestamps: true }
);

// Prevent duplicate batch entries for the same medicine
inventorySchema.index({ medicine: 1, batchNo: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
