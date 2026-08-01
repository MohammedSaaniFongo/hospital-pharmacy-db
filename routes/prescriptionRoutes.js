const express = require('express');
const router = express.Router();
const crudFactory = require('./crudFactory');
const Prescription = require('../models/Prescription');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');

// Standard CRUD
router.use('/', crudFactory(Prescription, ['patient', 'doctor', 'items.medicine']));

// Dispense a prescription: checks stock, deducts inventory (oldest batch first), creates a Sale
router.post('/:id/dispense', async (req, res) => {
  const session = await Prescription.startSession();
  session.startTransaction();

  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('items.medicine')
      .session(session);

    if (!prescription) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Prescription not found' });
    }
    if (prescription.status === 'Dispensed') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Prescription already dispensed' });
    }

    const saleItems = [];
    let total = 0;

    for (const item of prescription.items) {
      const batches = await Inventory.find({ medicine: item.medicine._id })
        .sort({ expiryDate: 1 }) // FEFO: first-expiry-first-out
        .session(session);

      const availableQty = batches.reduce((sum, b) => sum + b.quantity, 0);
      if (availableQty < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${item.medicine.name}. Available: ${availableQty}, needed: ${item.quantity}`
        });
      }

      let remaining = item.quantity;
      for (const batch of batches) {
        if (remaining <= 0) break;
        const deduct = Math.min(batch.quantity, remaining);
        batch.quantity -= deduct;
        remaining -= deduct;
        await batch.save({ session });
      }

      const subtotal = item.quantity * item.medicine.pricePerUnit;
      total += subtotal;
      saleItems.push({
        medicine: item.medicine._id,
        quantity: item.quantity,
        unitPrice: item.medicine.pricePerUnit,
        subtotal
      });
    }

    prescription.status = 'Dispensed';
    await prescription.save({ session });

    const sale = await Sale.create(
      [
        {
          prescription: prescription._id,
          patient: prescription.patient,
          items: saleItems,
          total,
          paymentMethod: req.body.paymentMethod || 'Cash',
          staff: req.body.staffId
        }
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ message: 'Prescription dispensed', sale: sale[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
