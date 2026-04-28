'use strict';

const { validateOrder } = require('../src/orderValidator');

const validOrder = () => ({
  customerEmail: 'cliente@duoc.cl',
  items: [
    { sku: 'ABC-1', quantity: 2, price: 100 },
    { sku: 'ABC-2', quantity: 1, price: 50 },
  ],
});

describe('validateOrder', () => {
  it('acepta una orden válida', () => {
    const result = validateOrder(validOrder());
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('rechaza si el argumento no es objeto', () => {
    expect(validateOrder(null).valid).toBe(false);
    expect(validateOrder('texto').valid).toBe(false);
    expect(validateOrder(undefined).valid).toBe(false);
  });

  describe('customerEmail', () => {
    it('lo exige', () => {
      const order = validOrder();
      delete order.customerEmail;
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('customerEmail is required');
    });

    it('valida formato', () => {
      const order = validOrder();
      order.customerEmail = 'no-es-un-email';
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('customerEmail is invalid');
    });
  });

  describe('items', () => {
    it('rechaza si no es array', () => {
      const order = validOrder();
      order.items = 'no-es-array';
      expect(validateOrder(order).valid).toBe(false);
    });

    it('rechaza si está vacío', () => {
      const order = validOrder();
      order.items = [];
      expect(validateOrder(order).valid).toBe(false);
    });

    it('rechaza si excede el máximo permitido', () => {
      const order = validOrder();
      order.items = Array.from({ length: 51 }, (_, i) => ({
        sku: `S-${i}`,
        quantity: 1,
        price: 10,
      }));
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/cannot exceed/);
    });

    it('exige sku en cada item', () => {
      const order = validOrder();
      order.items[0].sku = '';
      expect(validateOrder(order).errors).toContain('items[0].sku is required');
    });

    it('exige quantity positiva', () => {
      const order = validOrder();
      order.items[0].quantity = 0;
      expect(validateOrder(order).errors[0]).toMatch(/quantity/);
    });

    it('exige price no negativo', () => {
      const order = validOrder();
      order.items[1].price = -5;
      expect(validateOrder(order).errors[0]).toMatch(/price/);
    });

    it('reporta múltiples errores en distintos items', () => {
      const order = validOrder();
      order.items[0].sku = '';
      order.items[1].quantity = -1;
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
