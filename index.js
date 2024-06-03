const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { calculateDistance } = require('./utils'); // Utility function for distance calculation
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/ziggy', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Define schemas and models
const OrderSchema = new mongoose.Schema({
  source: { type: { lat: Number, lon: Number }, required: true },
  destination: { type: { lat: Number, lon: Number }, required: true },
  status: { type: String, enum: ['unassigned', 'assigned', 'delivered'], default: 'unassigned' },
  deliveryExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryExecutive' }
});

const DeliveryExecutiveSchema = new mongoose.Schema({
  currentLocation: { type: { lat: Number, lon: Number }, required: true },
  status: { type: String, enum: ['free', 'busy'], default: 'free' }
});

const Order = mongoose.model('Order', OrderSchema);
const DeliveryExecutive = mongoose.model('DeliveryExecutive', DeliveryExecutiveSchema);

// API Endpoints
app.post('/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).send(newOrder);
});

app.post('/delivery-executives', async (req, res) => {
  const newExecutive = new DeliveryExecutive(req.body);
  await newExecutive.save();
  res.status(201).send(newExecutive);
});

app.patch('/orders/:id/deliver', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send('Order not found');
  order.status = 'delivered';
  order.deliveryExecutive = null;
  await order.save();
  res.send(order);
});

// Cron job to auto-assign orders
cron.schedule('* * * * *', async () => {
  const unassignedOrders = await Order.find({ status: 'unassigned' });
  const freeExecutives = await DeliveryExecutive.find({ status: 'free' });

  unassignedOrders.forEach(async (order) => {
    if (freeExecutives.length > 0) {
      let closestExecutive;
      let shortestDistance = Infinity;

      freeExecutives.forEach((executive) => {
        const distance = calculateDistance(order.source, executive.currentLocation);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestExecutive = executive;
        }
      });

      if (closestExecutive) {
        order.deliveryExecutive = closestExecutive._id;
        order.status = 'assigned';
        closestExecutive.status = 'busy';
        await order.save();
        await closestExecutive.save();
      }
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
