const schedule = require('node-schedule');
const Order = require('./models/Order');
const DeliveryExecutive = require('./models/DeliveryPartner');

const assignmentJob = schedule.scheduleJob('* * * * *', async () => {
  try {
    // Fetch unassigned orders
    const unassignedOrders = await Order.find({ status: 'unassigned' }).exec();

    // Fetch free delivery executives
    const freeExecutives = await DeliveryExecutive.find({ status: 'free' }).exec();

    if (freeExecutives.length === 0) {
      console.log('No free executives available. Skipping order assignment.');
      return;
    }

    // Assign orders to free executives based on proximity
    for (const order of unassignedOrders) {
      let minDistance = Number.MAX_VALUE;
      let assignedExecutive = null;

      for (const executive of freeExecutives) {
        const distance = calculateDistance(order.source.latitude, order.source.longitude, executive.location.latitude, executive.location.longitude);
        
        if (distance < minDistance) {
          minDistance = distance;
          assignedExecutive = executive;
        }
      }

      if (assignedExecutive) {
        // Update order status and assigned executive
        await Order.findByIdAndUpdate(order._id, { status: 'assigned', assignedTo: assignedExecutive._id }).exec();

        // Mark the assigned executive as busy
        await DeliveryExecutive.findByIdAndUpdate(assignedExecutive._id, { status: 'busy' }).exec();
      }
    }

    console.log('Order assignment job executed successfully.');
  } catch (error) {
    console.error('Error in order assignment job:', error);
  }
});

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Earth's radius in kilometers
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const latDiffRad = toRadians(lat2 - lat1);
  const lonDiffRad = toRadians(lon2 - lon1);

  const a = Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(lonDiffRad / 2) * Math.sin(lonDiffRad / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // Distance in kilometers

  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = assignmentJob;
