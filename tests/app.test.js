'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('app (rutas HTTP)', () => {
  describe('GET /health', () => {
    it('responde 200 con estado UP', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
    });
  });

  describe('POST /api/discount', () => {
    it('responde 200 con el descuento calculado', async () => {
      const res = await request(app)
        .post('/api/discount')
        .send({ amount: 100, tier: 'PREMIUM' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('finalAmount');
    });

    it('responde 400 ante una entrada inválida', async () => {
      const res = await request(app)
        .post('/api/discount')
        .send({ amount: -10, tier: 'PREMIUM' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/validate-order', () => {
    it('responde 200 con el resultado de la validación', async () => {
      const res = await request(app)
        .post('/api/validate-order')
        .send({
          customerEmail: 'cliente@duoc.cl',
          items: [{ sku: 'ABC-1', quantity: 1, price: 100 }]
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('valid');
    });
  });
});
