// routes/deliveryPartnersRoutes.js
const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');

// GET all delivery partners
router.get('/', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new delivery partner
router.post('/', async (req, res) => {
  const partner = new DeliveryPartner({
    name: req.body.name,
    status: req.body.status,
    age: req.body.age,
    location: req.body.location
  });

  try {
    const newPartner = await partner.save();
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an existing delivery partner
router.put('/:id', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    partner.name = req.body.name;
    partner.status = req.body.status;
    partner.age = req.body.age;
    partner.location = req.body.location;

    const updatedPartner = await partner.save();
    res.json(updatedPartner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE delete a delivery partner
router.delete('/:id', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    await partner.remove();
    res.json({ message: 'Delivery partner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
