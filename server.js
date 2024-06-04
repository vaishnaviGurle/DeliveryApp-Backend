const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let orders = [];
let deliveryPartners = [
  { id: 1, status: 'available', location: { lat: 0, lon: 0 } },
  { id: 2, status: 'available', location: { lat: 0, lon: 0 } },
];

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const order = { ...req.body, status: 'unassigned', id: orders.length + 1 };
  orders.push(order);
  res.status(201).json(order);
  autoAssignOrder(order);
});

app.get('/delivery-partners', (req, res) => {
  res.json(deliveryPartners);
});

app.post('/orders/:id/deliver', (req, res) => {
  const { id } = req.params;
  orders = orders.map(order => order.id === parseInt(id) ? { ...order, status: 'delivered' } : order);
  res.status(200).send();
});

const autoAssignOrder = (order) => {
  setTimeout(() => {
    const availablePartner = deliveryPartners.find(partner => partner.status === 'available');
    if (availablePartner) {
      availablePartner.status = 'busy';
      orders = orders.map(o => o.id === order.id ? { ...o, status: 'assigned', deliveryPartnerId: availablePartner.id } : o);
    }
  }, 60000); // 1 minute delay for auto-assign
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
