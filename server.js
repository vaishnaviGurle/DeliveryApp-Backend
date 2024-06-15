const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const deliveryPartnerRoutes = require('./routes/deliveryPartnersRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderAssignmentJob = require('./orderAssignmentJob');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    orderAssignmentJob.start(); // Start the order assignment job
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Import and use the route for orders
const orderUpdateRoutes = require('./routes/orderUpdateRoutes');
app.use('/api/order-updates', orderUpdateRoutes);

// Use the existing routes for delivery partners and orders
app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/orders', orderRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
