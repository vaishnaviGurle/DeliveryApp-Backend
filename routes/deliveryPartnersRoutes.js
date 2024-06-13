const express = require('express');
const router = express.Router();
const { addDeliveryPartner, getDeliveryPartners } = require('../controllers/deliveryPartnerController');

router.post('/add', addDeliveryPartner);
router.get('/', getDeliveryPartners);

module.exports = router;
