'use strict';

jest.mock('../src/db');

const http = require('http');
const app = require('../src/app');
const db = require('../src/db');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const data = body === undefined ? undefined : JSON.stringify(body);
      const req = http.request(
        { port: server.address().port, path, method, headers: { 'Content-Type': 'application/json' } },
        (res) => {
          let raw = '';
          res.on('data', (c) => (raw += c));
          res.on('end', () => {
            server.close();
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          });
        }
      );
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  });
}

describe('API alumnos', () => {
  const originalVersion = process.env.VERSION;
  afterEach(() => {
    if (originalVersion === undefined) delete process.env.VERSION;
    else process.env.VERSION = originalVersion;
  });

  test('POST guarda el alumno', async () => {
    const alumno = { id: 1, nombre: 'Ana', created_at: '2026-01-01T00:00:00.000Z' };
    db.addAlumno.mockResolvedValue(alumno);
    const res = await request('POST', '/api/alumnos', { nombre: '  Ana ' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(alumno);
    expect(db.addAlumno).toHaveBeenCalledWith('Ana');
  });

  test.each([[{}], [{ nombre: '   ' }], [{ nombre: 5 }], [{ nombre: 'x'.repeat(101) }]])(
    'POST rechaza nombre inválido %j', async (body) => {
      const res = await request('POST', '/api/alumnos', body);
      expect(res.status).toBe(400);
      expect(db.addAlumno).not.toHaveBeenCalled();
    }
  );

  test('POST devuelve 500 si falla la BD', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.addAlumno.mockRejectedValue(new Error('boom'));
    const res = await request('POST', '/api/alumnos', { nombre: 'Ana' });
    expect(res.status).toBe(500);
  });

  test('GET devuelve el listado', async () => {
    const rows = [{ id: 2, nombre: 'Luis' }, { id: 1, nombre: 'Ana' }];
    db.listAlumnos.mockResolvedValue(rows);
    process.env.VERSION = 'v2';
    const res = await request('GET', '/api/alumnos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version: 'v2', alumnos: rows });
  });

  test('GET devuelve 500 si falla la BD', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.listAlumnos.mockRejectedValue(new Error('boom'));
    const res = await request('GET', '/api/alumnos');
    expect(res.status).toBe(500);
  });
});
