require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Patient = require('./models/Patient');
const Staff = require('./models/Staff');
const Medicine = require('./models/Medicine');
const Inventory = require('./models/Inventory');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Patient.deleteMany({}),
    Staff.deleteMany({}),
    Medicine.deleteMany({}),
    Inventory.deleteMany({})
  ]);

  console.log('Inserting sample staff...');
  const staff = await Staff.insertMany([
    {
      firstName: 'Kwame',
      lastName: 'Boateng',
      role: 'Doctor',
      department: 'General Medicine',
      licenseNumber: 'GH-MED-1023',
      phone: '0244000001',
      email: 'k.boateng@hospital.gh'
    },
    {
      firstName: 'Ama',
      lastName: 'Serwaa',
      role: 'Pharmacist',
      department: 'Pharmacy',
      licenseNumber: 'GH-PHM-2044',
      phone: '0244000002',
      email: 'a.serwaa@hospital.gh'
    }
  ]);

  console.log('Inserting sample patients...');
  const patients = await Patient.insertMany([
    {
      firstName: 'Yaw',
      lastName: 'Mensah',
      dateOfBirth: new Date('1998-03-14'),
      gender: 'Male',
      phone: '0201234567',
      bloodGroup: 'O+',
      allergies: ['Penicillin']
    },
    {
      firstName: 'Efua',
      lastName: 'Owusu',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'Female',
      phone: '0209876543',
      bloodGroup: 'A+'
    }
  ]);

  console.log('Inserting sample medicines...');
  const medicines = await Medicine.insertMany([
    {
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      manufacturer: 'Ernest Chemists',
      unit: 'tablet',
      pricePerUnit: 0.5,
      reorderLevel: 100,
      requiresPrescription: false
    },
    {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      manufacturer: 'Danadams Pharma',
      unit: 'capsule',
      pricePerUnit: 1.2,
      reorderLevel: 50,
      requiresPrescription: true
    }
  ]);

  console.log('Inserting sample inventory batches...');
  await Inventory.insertMany([
    {
      medicine: medicines[0]._id,
      batchNo: 'PCM-2026-01',
      quantity: 500,
      expiryDate: new Date('2027-06-30'),
      location: 'Main Store'
    },
    {
      medicine: medicines[1]._id,
      batchNo: 'AMX-2026-03',
      quantity: 40,
      expiryDate: new Date('2026-12-31'),
      location: 'Main Store'
    }
  ]);

  console.log('Seed complete.');
  console.log(`Staff: ${staff.length}, Patients: ${patients.length}, Medicines: ${medicines.length}`);
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
