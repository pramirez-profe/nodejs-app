'use strict';

const express = require('express');
const { calculateDiscount, validateOrder } = require('./index');
const db = require('./db');
const logger = require('./logger');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Application is running and healthy',
    version: process.env.VERSION || 'v1'
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
    logger.warn('alumno rechazado: nombre invalido', { method: 'POST', path: '/api/alumnos', status: 400 });
    return res.status(400).json({ error: 'nombre es requerido (string de 1 a 100 caracteres)' });
  }
  try {
    const alumno = await db.addAlumno(nombre);
    logger.info('alumno creado', { method: 'POST', path: '/api/alumnos', status: 201, alumnoId: alumno.id });
    res.status(201).json(alumno);
  } catch (error) {
    logger.error('error al crear alumno', { method: 'POST', path: '/api/alumnos', status: 500, error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/alumnos', async (req, res) => {
  try {
    const alumnos = await db.listAlumnos();
    logger.info('alumnos listados', { method: 'GET', path: '/api/alumnos', status: 200, total: alumnos.length });
    res.json({ version: process.env.VERSION || 'v1', alumnos });
  } catch (error) {
    logger.error('error al listar alumnos', { method: 'GET', path: '/api/alumnos', status: 500, error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
