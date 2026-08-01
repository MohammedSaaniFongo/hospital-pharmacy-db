const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'NoShow'],
      default: 'Scheduled'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
