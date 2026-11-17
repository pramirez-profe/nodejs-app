'use strict';

const mockPool = { query: jest.fn(), execute: jest.fn() };
jest.mock('mysql2/promise', () => ({ createPool: jest.fn(() => mockPool) }));

const mysql = require('mysql2/promise');
const db = require('../src/db');

describe('db', () => {
  test('getPool reutiliza el pool', () => {
    expect(db.getPool()).toBe(db.getPool());
    expect(mysql.createPool).toHaveBeenCalledTimes(1);
  });

  test('initDb crea la tabla', async () => {
    mockPool.query.mockResolvedValue([]);
    await db.initDb();
    expect(mockPool.query.mock.calls[0][0]).toMatch(/CREATE TABLE IF NOT EXISTS alumnos/);
  });

  test('addAlumno inserta y devuelve el registro', async () => {
    const row = { id: 7, nombre: 'Ana', created_at: new Date() };
    mockPool.execute.mockResolvedValueOnce([{ insertId: 7 }]).mockResolvedValueOnce([[row]]);
    await expect(db.addAlumno('Ana')).resolves.toEqual(row);
    expect(mockPool.execute.mock.calls[0][1]).toEqual(['Ana']);
  });

  test('listAlumnos ordena del más reciente al más antiguo', async () => {
    mockPool.query.mockResolvedValue([[{ id: 1 }]]);
    await expect(db.listAlumnos()).resolves.toEqual([{ id: 1 }]);
    expect(mockPool.query.mock.calls[0][0]).toMatch(/ORDER BY created_at DESC/);
  });
});
