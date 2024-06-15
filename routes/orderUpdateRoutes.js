const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Assuming you have a model for Order

// Route to handle updating an order by ID
router.put('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body; // Assuming you send the updated status in the request body

    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send the updated order back in the response
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

module.exports = router;
