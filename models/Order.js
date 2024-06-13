const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  source: {
    latitude: Number,
    longitude: Number
  },
  destination: {
    latitude: Number,
    longitude: Number
  },
  status: { type: String, enum: ['unassigned', 'assigned', 'delivered'], default: 'unassigned' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null }
});

module.exports = mongoose.model('Order', orderSchema);
