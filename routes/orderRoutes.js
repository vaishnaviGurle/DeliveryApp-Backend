const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const DeliveryPartner = require('../models/deliveryPartnerModel');
const haversine = require('haversine-distance');

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order({
    source: req.body.source,
    destination: req.body.destination
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark an order as delivered
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = 'delivered';
      await order.save();
      
      const deliveryPartner = await DeliveryPartner.findById(order.deliveryPartner);
      if (deliveryPartner) {
        deliveryPartner.status = 'free';
        await deliveryPartner.save();
      }
      
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
