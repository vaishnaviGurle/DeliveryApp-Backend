// utils/assignmentAlgorithm.js
const haversine = require('haversine-distance');
const DeliveryPartner = require('../models/DeliveryPartner');

// Function to assign an order to the nearest available delivery partner
async function assignOrder(order) {
  try {
    // Find all available delivery partners
    const availablePartners = await DeliveryPartner.find({ status: 'free' });

    if (availablePartners.length === 0) {
      return null; // No available delivery partners
    }

    // Calculate the distance between the order's source and each delivery partner's current location
    const partnersWithDistance = availablePartners.map(partner => {
      const distance = haversine(order.source.coordinates, partner.currentLocation.coordinates);
      return { partner, distance };
    });

    // Sort the delivery partners based on the distance in ascending order
    partnersWithDistance.sort((a, b) => a.distance - b.distance);

    // Select the nearest delivery partner
    const nearestPartner = partnersWithDistance[0].partner;

    // Update the delivery partner's status to 'busy'
    nearestPartner.status = 'busy';
    await nearestPartner.save();

    return nearestPartner;
  } catch (error) {
    console.error('Failed to assign order:', error);
    return null;
  }
}

module.exports = {
  assignOrder,
};