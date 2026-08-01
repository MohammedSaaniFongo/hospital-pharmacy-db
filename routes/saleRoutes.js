const express = require('express');
const router = express.Router();
const crudFactory = require('./crudFactory');
const Sale = require('../models/Sale');

router.use('/', crudFactory(Sale, ['patient', 'staff', 'items.medicine']));

// Daily revenue report
router.get('/reports/daily', async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalRevenue: { $sum: '$total' },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top-selling medicines
router.get('/reports/top-medicines', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const result = await Sale.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.medicine',
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: limit },
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
        $project: {
          _id: 0,
          name: '$medicine.name',
          totalQuantitySold: 1,
          totalRevenue: 1
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
