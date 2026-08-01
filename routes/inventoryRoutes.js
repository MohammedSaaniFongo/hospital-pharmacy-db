const express = require('express');
const router = express.Router();
const crudFactory = require('./crudFactory');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

// Standard CRUD
router.use('/', crudFactory(Inventory, 'medicine'));

// Low stock alert: total quantity per medicine below its reorderLevel
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $group: {
          _id: '$medicine',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicine'
        }
      },
      { $unwind: '$medicine' },
      {
        $match: {
          $expr: { $lt: ['$totalQuantity', '$medicine.reorderLevel'] }
        }
      },
      {
        $project: {
          _id: 0,
          medicineId: '$medicine._id',
          name: '$medicine.name',
          totalQuantity: 1,
          reorderLevel: '$medicine.reorderLevel'
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expiring soon: batches expiring within next 90 days
router.get('/alerts/expiring-soon', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    const batches = await Inventory.find({ expiryDate: { $lte: cutoff } })
      .populate('medicine', 'name unit')
      .sort({ expiryDate: 1 });

    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
