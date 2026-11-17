'use strict';

const app = require('./app');
const { initDb } = require('./db');

const PORT = process.env.PORT || 3000;

async function start() {
  // La BD puede tardar en aceptar conexiones: reintenta antes de rendirse
  for (let attempt = 1; ; attempt++) {
    try {
      await initDb();
      break;
    } catch (error) {
      if (attempt >= 10) throw error;
      console.error(`DB no disponible (intento ${attempt}/10): ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
