const crudFactory = require('./crudFactory');
const Medicine = require('../models/Medicine');

module.exports = crudFactory(Medicine);
