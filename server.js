const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const deliveryPartnerRoutes = require('./routes/deliveryPartnersRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://vaishnavigurle10:2PuP5P02m8Z4iRFi@cluster0.y5aagge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error(err));
