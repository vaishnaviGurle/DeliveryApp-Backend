// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/orders', orderRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});