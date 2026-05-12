'use strict';

/**
 * Configuración de Jest con cobertura (Istanbul).
 *
 * Reportes:
 *  - text / text-summary: salida en consola del CI.
 *  - lcov: para Codecov, SonarQube y la mayoría de IDEs.
 *  - html: reporte navegable en coverage/lcov-report/index.html.
 *  - cobertura: XML estándar (Azure DevOps, GitLab, SonarQube).
 *  - json-summary: para badges y comentarios en PRs.
 */
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.js',
    '!src/index.js',
    '!**/node_modules/**',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'cobertura',
    'json-summary',
  ],

  // Quality gate: si baja de estos umbrales, jest falla con exit code != 0
  // y por lo tanto el pipeline de CI también falla.
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/discountCalculator.js': {
      branches: 75,
      lines: 90,
    },
  },

  testMatch: ['<rootDir>/tests/*.test.js'],

  verbose: true,
  clearMocks: true,
};
