const express = require('express');
const router = express.Router();
const { createOrder, completeOrder, getOrders } = require('../controllers/orderController');

router.post('/create', createOrder);
router.post('/complete/:id', completeOrder);
router.get('/', getOrders);

module.exports = router;
