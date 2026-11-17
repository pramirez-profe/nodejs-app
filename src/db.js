'use strict';

const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'node',
      password: process.env.DB_PASSWORD || 'node',
      database: process.env.DB_NAME || 'nodejs-app',
      connectionLimit: 5,
    });
  }
  return pool;
}

async function initDb() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS alumnos (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_alumnos_created_at (created_at)
    )
  `);
}

async function addAlumno(nombre) {
  const [result] = await getPool().execute(
    'INSERT INTO alumnos (nombre) VALUES (?)',
    [nombre]
  );
  const [rows] = await getPool().execute(
    'SELECT id, nombre, created_at FROM alumnos WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
}

async function listAlumnos() {
  const [rows] = await getPool().query(
    'SELECT id, nombre, created_at FROM alumnos ORDER BY created_at DESC, id DESC'
  );
  return rows;
}

module.exports = { getPool, initDb, addAlumno, listAlumnos };
