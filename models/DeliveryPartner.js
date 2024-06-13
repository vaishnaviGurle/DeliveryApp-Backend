const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  status: { type: String, default: 'free' }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
