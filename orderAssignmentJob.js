const Order = require('../models/orderModel');
const DeliveryPartner = require('../models/deliveryPartnerModel');
const haversine = require('haversine-distance');

const assignOrders = async () => {
  try {
    const orders = await Order.find({ status: 'unassigned' });
    const partners = await DeliveryPartner.find({ status: 'free' });

    for (let order of orders) {
      let closestPartner = null;
      let shortestDistance = Infinity;

      for (let partner of partners) {
        const distance = haversine(
          { lat: order.source.latitude, lng: order.source.longitude },
          { lat: partner.location.latitude, lng: partner.location.longitude }
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestPartner = partner;
        }
      }

      if (closestPartner) {
        order.deliveryPartner = closestPartner._id;
        order.status = 'assigned';
        await order.save();

        closestPartner.status = 'busy';
        await closestPartner.save();

        partners.splice(partners.indexOf(closestPartner), 1);
      }
    }
  } catch (error) {
    console.error('Error in assigning orders:', error);
  }
};

module.exports = {
  start: () => {
    setInterval(assignOrders, 60000); // Run the job every 1 minute
  }
};
