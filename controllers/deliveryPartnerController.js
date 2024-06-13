const DeliveryPartner = require('../models/DeliveryPartner');

const addDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartner = new DeliveryPartner(req.body);
    await deliveryPartner.save();
    res.status(201).send(deliveryPartner);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.send(partners);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addDeliveryPartner, getDeliveryPartners };
