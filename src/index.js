'use strict';

const { calculateDiscount, CUSTOMER_TIERS } = require('./discountCalculator');
const { validateOrder } = require('./orderValidator');

module.exports = { calculateDiscount, validateOrder, CUSTOMER_TIERS };
