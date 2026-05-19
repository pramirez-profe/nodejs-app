'use strict';

const express = require('express');
const { calculateDiscount, validateOrder } = require('./index');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Application is running and healthy'
  });
});

app.post('/api/discount', (req, res) => {
  try {
    const { amount, tier, isFirstPurchase, couponCode } = req.body;
    const result = calculateDiscount({ amount, tier, isFirstPurchase, couponCode });
    res.json(result);
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/validate-order', (req, res) => {
  // express.json() might parse empty body to {}, so we pass req.body directly to validateOrder
  const result = validateOrder(req.body);
  res.json(result);
});

module.exports = app;
