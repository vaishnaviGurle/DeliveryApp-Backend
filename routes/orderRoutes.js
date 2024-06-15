// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { source, destination } = req.body;
  try {
    const newOrder = new Order({
      source,
      destination,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: 'Error creating order' });
  }
});



// Update order status
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    let updateData = { status };

    // Check if assigning order to a delivery partner
    if (status === 'assigned' && assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' });
  }
});



module.exports = router;