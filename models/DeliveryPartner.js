const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['free', 'busy'], default: 'free' },
  location: {
    latitude: Number,
    longitude: Number
  }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
