'use strict';

const { calculateDiscount, CUSTOMER_TIERS } = require('../src/discountCalculator');

describe('calculateDiscount', () => {
  describe('validación de entrada', () => {
    it('lanza TypeError si amount no es número', () => {
      expect(() =>
        calculateDiscount({ amount: 'abc', tier: CUSTOMER_TIERS.STANDARD }),
      ).toThrow(TypeError);
    });

    it('lanza TypeError si amount es NaN', () => {
      expect(() =>
        calculateDiscount({ amount: NaN, tier: CUSTOMER_TIERS.STANDARD }),
      ).toThrow(TypeError);
    });

    it('lanza RangeError si amount es negativo', () => {
      expect(() =>
        calculateDiscount({ amount: -10, tier: CUSTOMER_TIERS.STANDARD }),
      ).toThrow(RangeError);
    });

    it('lanza RangeError si tier es desconocido', () => {
      expect(() =>
        calculateDiscount({ amount: 100, tier: 'GOLD' }),
      ).toThrow(/unknown tier/);
    });
  });

  describe('descuento por tier', () => {
    it('STANDARD sin volumen no tiene descuento', () => {
      const result = calculateDiscount({ amount: 100, tier: CUSTOMER_TIERS.STANDARD });
      expect(result.discountRate).toBe(0);
      expect(result.finalAmount).toBe(100);
    });

    it('PREMIUM aplica 5%', () => {
      const result = calculateDiscount({ amount: 100, tier: CUSTOMER_TIERS.PREMIUM });
      expect(result.discountRate).toBeCloseTo(0.05);
      expect(result.finalAmount).toBe(95);
    });

    it('VIP aplica 10%', () => {
      const result = calculateDiscount({ amount: 100, tier: CUSTOMER_TIERS.VIP });
      expect(result.discountRate).toBeCloseTo(0.10);
      expect(result.finalAmount).toBe(90);
    });
  });

  describe('descuento por volumen', () => {
    it('200 <= amount < 500 → 5%', () => {
      const result = calculateDiscount({ amount: 300, tier: CUSTOMER_TIERS.STANDARD });
      expect(result.discountRate).toBeCloseTo(0.05);
    });

    it('500 <= amount < 1000 → 10%', () => {
      const result = calculateDiscount({ amount: 500, tier: CUSTOMER_TIERS.STANDARD });
      expect(result.discountRate).toBeCloseTo(0.10);
    });

    it('amount >= 1000 → 15%', () => {
      const result = calculateDiscount({ amount: 1500, tier: CUSTOMER_TIERS.STANDARD });
      expect(result.discountRate).toBeCloseTo(0.15);
    });
  });

  describe('combinación de descuentos', () => {
    it('VIP + volumen alto + primera compra acumulan, con tope en 40%', () => {
      const result = calculateDiscount({
        amount: 2000,
        tier: CUSTOMER_TIERS.VIP,
        isFirstPurchase: true,
      });
      // 10% (vip) + 15% (volumen) + 5% (primera) = 30%
      expect(result.discountRate).toBeCloseTo(0.30);
    });

    it('aplica tope de 40% cuando se acumulan muchos descuentos', () => {
      const result = calculateDiscount({
        amount: 2000,
        tier: CUSTOMER_TIERS.VIP,
        isFirstPurchase: true,
        couponCode: 'WELCOME10',
      });
      // 10 + 15 + 5 + 10 = 40%, queda en el tope
      expect(result.discountRate).toBeCloseTo(0.40);
    });

    it('cupón WELCOME10 suma 10%', () => {
      const result = calculateDiscount({
        amount: 100,
        tier: CUSTOMER_TIERS.STANDARD,
        couponCode: 'WELCOME10',
      });
      expect(result.discountRate).toBeCloseTo(0.10);
    });

    // NOTA INTENCIONAL PARA LOS ALUMNOS:
    // El cupón 'SUMMER20' NO está cubierto por ningún test.
    // Al ver el reporte de cobertura, esa rama aparecerá amarilla.
    // Ejercicio: agregar un test que cubra el cupón SUMMER20 y verificar que la cobertura sube.
  });

  it('redondea finalAmount a 2 decimales', () => {
    const result = calculateDiscount({ amount: 99.999, tier: CUSTOMER_TIERS.STANDARD });
    expect(Number.isInteger(result.finalAmount * 100)).toBe(true);
  });
});
