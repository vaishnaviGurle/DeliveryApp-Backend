const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const assignmentJob = require('./orderAssignmentJob'); // Import the cron job

const deliveryPartnerRoutes = require('./routes/deliveryPartnersRoutes');
const orderRoutes = require('./routes/ordersRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/orders', orderRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://vaishnavigurle10:2PuP5P02m8Z4iRFi@cluster0.y5aagge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
