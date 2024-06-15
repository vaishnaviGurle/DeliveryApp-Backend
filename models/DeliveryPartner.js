// models/DeliveryPartner.js
const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['free', 'busy'], default: 'free' },
  age: Number, // Added age field
  location: {
    latitude: Number,
    longitude: Number
  }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
