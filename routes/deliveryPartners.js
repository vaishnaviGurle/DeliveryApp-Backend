// routes/deliveryPartners.js
const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');

// Create a new delivery partner
router.post('/', async (req, res) => {
  try {
    const deliveryPartner = new DeliveryPartner(req.body);
    await deliveryPartner.save();
    res.status(201).json(deliveryPartner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create delivery partner' });
  }
});

// Get all delivery partners
router.get('/', async (req, res) => {
  try {
    const deliveryPartners = await DeliveryPartner.find();
    res.json(deliveryPartners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve delivery partners' });
  }
});

// Update delivery partner location
router.put('/:id/location', async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { currentLocation: req.body.currentLocation },
      { new: true }
    );
    res.json(deliveryPartner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery partner location' });
  }
});

module.exports = router;