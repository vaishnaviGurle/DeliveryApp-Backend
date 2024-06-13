const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    order.status = 'completed';
    if (order.deliveryPartner) {
      const deliveryPartner = await DeliveryPartner.findById(order.deliveryPartner);
      deliveryPartner.status = 'free';
      await deliveryPartner.save();
    }
    await order.save();
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('deliveryPartner');
    res.send(orders);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { createOrder, completeOrder, getOrders };
