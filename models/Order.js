// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  source: {
    latitude: String,
    longitude: String,
  },
  destination: {
    latitude: String,
    longitude: String,
  },
  status: {
    type: String,
    default: 'unassigned',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    default: null,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;