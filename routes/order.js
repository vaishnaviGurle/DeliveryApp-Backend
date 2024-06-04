// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const assignmentAlgorithm = require('../utils/assignmentAlgorithm');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Assign an order to a delivery partner
router.put('/:id/assign', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      const deliveryPartner = await assignmentAlgorithm.assignOrder(order);
      if (deliveryPartner) {
        order.assignedTo = deliveryPartner._id;
        order.status = 'assigned';
        await order.save();
        res.json(order);
      } else {
        res.status(404).json({ error: 'No available delivery partners' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign order' });
    }
  });

// Mark an order as delivered
router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'delivered' },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark order as delivered' });
  }
});

module.exports = router;