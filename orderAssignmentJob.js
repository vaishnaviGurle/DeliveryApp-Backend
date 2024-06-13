const cron = require('node-cron');
const Order = require('./models/Order');
const DeliveryPartner = require('./models/DeliveryPartner');

// Define your cron job
const assignmentJob = cron.schedule('* * * * *', async () => {
  try {
    const orders = await Order.find({ status: 'pending' }).populate('deliveryPartner');
    const freeExecutives = await DeliveryPartner.find({ status: 'free' });

    // Logic to assign orders to free delivery executives
    // Example: Assign each pending order to a free executive
    orders.forEach(async (order) => {
      if (freeExecutives.length > 0) {
        const randomIndex = Math.floor(Math.random() * freeExecutives.length);
        const selectedExecutive = freeExecutives[randomIndex];
        order.deliveryPartner = selectedExecutive._id;
        order.status = 'assigned';
        selectedExecutive.status = 'busy';

        await order.save();
        await selectedExecutive.save();

        console.log(`Order ${order._id} assigned to ${selectedExecutive.name}`);
      }
    });
  } catch (error) {
    console.error('Error in assignment job:', error);
  }
});

assignmentJob.start();

module.exports = assignmentJob;
