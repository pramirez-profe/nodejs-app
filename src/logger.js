'use strict';

const pino = require('pino');

// El nivel se controla con la variable de entorno LOG_LEVEL (por defecto 'info').
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label })
  }
});

module.exports = logger;
