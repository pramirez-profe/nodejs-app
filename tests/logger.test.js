'use strict';

const logger = require('../src/logger');

describe('logger', () => {
  test('info escribe JSON en stdout', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('hola', { total: 2 });
    const entry = JSON.parse(spy.mock.calls[0][0]);
    expect(entry).toMatchObject({ level: 'info', message: 'hola', total: 2 });
    expect(entry.timestamp).toEqual(expect.any(String));
    expect(entry.version).toEqual(expect.any(String));
  });

  test('warn escribe JSON en stdout', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.warn('cuidado');
    expect(JSON.parse(spy.mock.calls[0][0])).toMatchObject({ level: 'warn', message: 'cuidado' });
  });

  test('error escribe JSON en stderr', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('falló', { error: 'boom' });
    expect(JSON.parse(spy.mock.calls[0][0])).toMatchObject({ level: 'error', message: 'falló', error: 'boom' });
  });
});
