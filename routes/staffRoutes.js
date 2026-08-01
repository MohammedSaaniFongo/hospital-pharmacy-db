const crudFactory = require('./crudFactory');
const Staff = require('../models/Staff');

module.exports = crudFactory(Staff);
