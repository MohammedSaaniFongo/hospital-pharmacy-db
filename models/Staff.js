const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['Doctor', 'Nurse', 'Pharmacist', 'Admin', 'LabTechnician'],
      required: true
    },
    department: { type: String, required: true },
    licenseNumber: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, unique: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
