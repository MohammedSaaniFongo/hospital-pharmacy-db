const mongoose = require('mongoose');

const prescriptionItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    dosage: { type: String, required: true }, // e.g. "1 tablet twice daily"
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    items: [prescriptionItemSchema],
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Dispensed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
