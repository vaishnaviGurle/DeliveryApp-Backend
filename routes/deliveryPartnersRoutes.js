const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/deliveryPartnerModel');

router.get('/', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
