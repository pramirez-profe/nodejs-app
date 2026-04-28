# NodeJs App

Proyecto de apoyo para la clase de DevOps sobre cobertura de código y CI/CD.

## Requisitos

- Node.js 20+ (ver `engines` en `package.json`).

## Cómo correrlo

```bash
npm ci             # instalación reproducible (usa package-lock.json)
npm test           # corre Jest + cobertura + quality gate
npm run coverage:open   # abre el reporte HTML
```

## Estructura

```
src/
  discountCalculator.js   # lógica de descuentos con varias ramas
  orderValidator.js       # validador de órdenes
  index.js                # entrypoint (excluido de cobertura)
tests/
  discountCalculator.test.js
  orderValidator.test.js
jest.config.js            # configuración de cobertura + umbrales
.github/workflows/ci.yml  # pipeline CI
```

## Ejercicio

1. Ejecutar `npm test` y abrir `coverage/lcov-report/index.html`.
2. Encuentrar la rama del cupón `SUMMER20` en `discountCalculator.js`. Está **intencionalmente sin cubrir**.
3. En una nueva rama, agregar un test que la cubra y verificar que la cobertura de branches sube.
4. Bajar un umbral en `jest.config.js` (ej. branches: 99) y confirmar que el build falla con exit code != 0. Esto demuestra el quality gate.
5. Publicar PR con las mejoras sugeridas

## Reportes generados

Después de `npm test` se crea `coverage/` con:

- `lcov.info` — formato LCOV para Codecov / SonarQube.
- `cobertura-coverage.xml` — formato Cobertura para Azure DevOps / GitLab.
- `coverage-summary.json` — resumen JSON para badges y comentarios.
- `lcov-report/index.html` — reporte navegable.

