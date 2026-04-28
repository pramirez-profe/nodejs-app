'use strict';

const CUSTOMER_TIERS = Object.freeze({
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  VIP: 'VIP',
});

const TIER_DISCOUNT = Object.freeze({
  STANDARD: 0,
  PREMIUM: 0.05,
  VIP: 0.10,
});

const VOLUME_DISCOUNT_RULES = [
  { min: 1000, discount: 0.15 },
  { min: 500, discount: 0.10 },
  { min: 200, discount: 0.05 },
];

function getVolumeDiscount(amount) {
  for (const rule of VOLUME_DISCOUNT_RULES) {
    if (amount >= rule.min) {
      return rule.discount;
    }
  }
  return 0;
}

function calculateDiscount({ amount, tier, isFirstPurchase = false, couponCode = null }) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new TypeError('amount must be a number');
  }
  if (amount < 0) {
    throw new RangeError('amount cannot be negative');
  }
  if (!Object.values(CUSTOMER_TIERS).includes(tier)) {
    throw new RangeError(`unknown tier: ${tier}`);
  }

  const tierDiscount = TIER_DISCOUNT[tier];
  const volumeDiscount = getVolumeDiscount(amount);
  const firstPurchaseDiscount = isFirstPurchase ? 0.05 : 0;

  let couponDiscount = 0;
  if (couponCode === 'WELCOME10') {
    couponDiscount = 0.10;
  } else if (couponCode === 'SUMMER20') {
    couponDiscount = 0.20;
  }

  const totalDiscount = Math.min(
    tierDiscount + volumeDiscount + firstPurchaseDiscount + couponDiscount,
    0.40,
  );

  const finalAmount = amount * (1 - totalDiscount);

  return {
    originalAmount: amount,
    discountRate: totalDiscount,
    discountAmount: amount - finalAmount,
    finalAmount: Math.round(finalAmount * 100) / 100,
  };
}

module.exports = {
  calculateDiscount,
  CUSTOMER_TIERS,
};
