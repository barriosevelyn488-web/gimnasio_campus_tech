# Plan de sprints

Plan académico de referencia: 4 sprints, 7 días y 82 puntos de historia. La duración descrita corresponde al plan, no constituye evidencia de las fechas reales de ejecución.

| Sprint | Duración planificada | Historias | SP |
| --- | --- | --- | ---: |
| 1. Base técnica y clientes | 1 día | HU-01, HU-02, HU-03 | 15 |
| 2. Operación y seguimiento | 2 días | HU-04, HU-05, HU-06, HU-07, HU-08 | 31 |
| 3. Nutrición y finanzas | 3 días | HU-09, HU-10, HU-11, HU-12 | 26 |
| 4. Pruebas y entrega | 1 día | HU-13, HU-14 | 10 |
| **Total** | **7 días** | **14 historias** | **82** |

## Sprint 1 — Base técnica y gestión de clientes

**Objetivo:** configurar Node.js/MySQL, establecer capas y patrones, e implementar la gestión inicial de clientes.

| Historia | Descripción | SP |
| --- | --- | ---: |
| HU-01 | Configuración de aplicación y base de datos | 5 |
| HU-02 | Arquitectura orientada a objetos y patrones | 5 |
| HU-03 | Gestión de clientes | 5 |

**Resultado esperado:** proyecto Node.js, conexión MySQL, estructura por capas, uso de OOP y patrones Repository/Factory, operaciones de clientes. La CLI disponible debe describirse según sus operaciones actuales.

## Sprint 2 — Planes, contratos y seguimiento físico

**Objetivo:** implementar planes, asignaciones, ciclo de vida de contratos, progreso y seguimiento.

| Historia | Descripción | SP |
| --- | --- | ---: |
| HU-04 | Gestión de planes de entrenamiento | 5 |
| HU-05 | Asignación y generación de contratos | 8 |
| HU-06 | Ciclo de vida del contrato | 8 |
| HU-07 | Registro del progreso físico | 5 |
| HU-08 | Seguimiento integral del cliente | 5 |

**Resultado esperado:** planes, asignaciones/contratos transaccionales, renovación/finalización/cancelación, historial físico y consulta integral.

## Sprint 3 — Nutrición y finanzas

**Objetivo:** sumar planes nutricionales, comidas y reportes, junto con movimientos y consultas financieras.

| Historia | Descripción | SP |
| --- | --- | ---: |
| HU-09 | Gestión de planes nutricionales | 5 |
| HU-10 | Alimentación y reportes nutricionales | 5 |
| HU-11 | Gestión financiera | 8 |
| HU-12 | Reportes financieros y transacciones | 8 |

**Resultado esperado:** nutrición relacionada con clientes/planes; registro de comidas; ingresos/egresos; filtros, totales y balances financieros.

## Sprint 4 — Pruebas y entrega

**Objetivo:** validar relaciones y operaciones críticas y preparar los materiales finales.

| Historia | Descripción | SP |
| --- | --- | ---: |
| HU-13 | Pruebas e integridad del sistema | 5 |
| HU-14 | Documentación y entrega | 5 |

**Resultado esperado:** pruebas de CRUD/relaciones/transacciones, README y documentación, evidencias Scrum, PDF, Conventional Commits y video demostrativo.

## Dependencias

```text
Base de datos y capas → clientes → planes → asignaciones/contratos
→ seguimiento físico e integral → nutrición → finanzas/reportes
→ validación y documentación de entrega
```

## Evidencia de ejecución

Este archivo registra la planificación prevista. Para acreditar ejecución real, agrega fechas, responsables, tablero o capturas y resultados de cada sprint con datos verificables del equipo; no completes retrospectivamente información supuesta.
