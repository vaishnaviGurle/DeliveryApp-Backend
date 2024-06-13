const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  description: String,
  status: { type: String, default: 'pending' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' }
});

module.exports = mongoose.model('Order', orderSchema);
