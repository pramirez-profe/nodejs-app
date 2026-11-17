'use strict';

const app = require('./app');
const { initDb } = require('./db');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

async function start() {
  // La BD puede tardar en aceptar conexiones: reintenta antes de rendirse
  logger.info('iniciando servidor', { port: Number(PORT) });
  for (let attempt = 1; ; attempt++) {
    try {
      await initDb();
      logger.info('base de datos lista', { attempt });
      break;
    } catch (error) {
      if (attempt >= 10) throw error;
      logger.warn('DB no disponible, reintentando', { attempt, maxAttempts: 10, error: error.message });
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  app.listen(PORT, () => {
    logger.info('servidor iniciado', { port: Number(PORT), dbHost: process.env.DB_HOST || 'localhost' });
  });
}

start().catch((error) => {
  logger.error('el servidor no pudo iniciar', { error: error.message });
  process.exit(1);
});
