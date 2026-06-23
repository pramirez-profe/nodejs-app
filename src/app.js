'use strict';

const express = require('express');
const pinoHttp = require('pino-http');
const { calculateDiscount, validateOrder } = require('./index');
const logger = require('./logger');

const app = express();

// Registra cada peticion HTTP como una linea JSON en stdout.
app.use(pinoHttp({
  logger,
  // Mensaje y nivel segun el resultado de la respuesta.
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} - ${err.message}`
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Application is running and healthy',
    build: '2'
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
