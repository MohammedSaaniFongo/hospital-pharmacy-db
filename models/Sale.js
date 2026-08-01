const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }, // optional, null for walk-in
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    items: [saleItemSchema],
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'MoMo', 'Card', 'Insurance'],
      default: 'Cash'
    },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
