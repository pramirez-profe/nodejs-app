'use strict';

const MAX_ITEMS_PER_ORDER = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateOrder(order) {
  const errors = [];

  if (!order || typeof order !== 'object') {
    return { valid: false, errors: ['order must be an object'] };
  }

  if (!order.customerEmail) {
    errors.push('customerEmail is required');
  } else if (!EMAIL_REGEX.test(order.customerEmail)) {
    errors.push('customerEmail is invalid');
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    errors.push('items must be a non-empty array');
  } else if (order.items.length > MAX_ITEMS_PER_ORDER) {
    errors.push(`items cannot exceed ${MAX_ITEMS_PER_ORDER}`);
  } else {
    order.items.forEach((item, index) => {
      if (!item.sku) {
        errors.push(`items[${index}].sku is required`);
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`items[${index}].quantity must be a positive number`);
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        errors.push(`items[${index}].price must be a non-negative number`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateOrder, MAX_ITEMS_PER_ORDER };
