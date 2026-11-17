'use strict';

const express = require('express');
const { calculateDiscount, validateOrder } = require('./index');
const db = require('./db');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Application is running and healthy',
    version: process.env.VERSION || 'dev'
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

app.post('/api/alumnos', async (req, res) => {
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
  if (!nombre || nombre.length > 100) {
    return res.status(400).json({ error: 'nombre es requerido (string de 1 a 100 caracteres)' });
  }
  try {
    const alumno = await db.addAlumno(nombre);
    res.status(201).json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/alumnos', async (req, res) => {
  try {
    const alumnos = await db.listAlumnos();
    res.json({ version: process.env.VERSION || 'dev', alumnos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
