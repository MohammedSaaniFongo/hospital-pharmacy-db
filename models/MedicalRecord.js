const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: true },
    notes: { type: String },
    vitals: {
      bloodPressure: String,
      temperature: Number,
      pulse: Number,
      weight: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
