const crudFactory = require('./crudFactory');
const MedicalRecord = require('../models/MedicalRecord');

module.exports = crudFactory(MedicalRecord, ['patient', 'doctor']);
