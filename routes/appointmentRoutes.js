const crudFactory = require('./crudFactory');
const Appointment = require('../models/Appointment');

module.exports = crudFactory(Appointment, ['patient', 'doctor']);
