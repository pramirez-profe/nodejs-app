'use strict';

// Logs en JSON, una línea por evento, a stdout/stderr (formato ideal para CloudWatch Logs Insights).
function write(level, message, fields = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    version: process.env.VERSION || 'v1',
    ...fields,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

const info = (message, fields) => write('info', message, fields);
const warn = (message, fields) => write('warn', message, fields);
const error = (message, fields) => write('error', message, fields);

module.exports = { info, warn, error };
