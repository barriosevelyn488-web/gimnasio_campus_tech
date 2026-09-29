# Gimnasio CLI — Sistema de gestión

Aplicación CLI en Node.js para clientes, planes de entrenamiento, contratos, progreso físico, nutrición y finanzas. La persistencia es MySQL; MySQL Workbench permite ejecutar los scripts y administrar el servidor.

## Requisitos e instalación
- Node.js 20+ y npm; MySQL 8.0+ con InnoDB. Workbench es opcional.
- Ejecuta `database/schema.sql` en Workbench y, si quieres, `database/seed.sql`.
- Copia `.env.example` como `.env` y configura credenciales. No subas `.env`.
- Ejecuta `npm install`, `npm run db:check` y luego `npm start`. `npm test` ejecuta las pruebas Node.

## Funciones
CRUD de clientes y planes; asignación con contrato automático; renovación/finalización/cancelación trazable; progreso cronológico con varias medidas y fotos; plan nutricional con comidas y alimentos y reporte por rango; ingresos/egresos con filtros por fechas/cliente y balance SQL SUM/GROUP BY; seguimiento integral con relaciones opcionales. Operaciones con varias escrituras usan transacciones.

## Arquitectura, SOLID y patrones
`commands` gestiona CLI; `services` valida y coordina; `controladores` atiende casos de uso; `repositories` encapsula SQL; `models` representa entidades; `config` gestiona pool; `utils` comparte validadores/formato. Los comandos no contienen SQL y los servicios no conocen consultas.

Responsabilidad única se refleja en la separación por capas. Servicios usan interfaces de métodos del controlador para reducir acoplamiento. `MenuFactory` selecciona el menú (Factory). `ClienteRepository` concentra CRUD SQL con `BaseRepository` (Repository). La aplicación de SOLID es pragmática y parcial; no se afirma una abstracción formal para cada principio.

## MySQL y normalización
`database/schema.sql` es la fuente de verdad. Detalles en `database/normalization.md` y `database/normalizacion_gimnasio.xlsx`.

## Estructura
- `src/commands`: CLI; `src/services`: reglas; `src/controladores` y `src/repositories`: persistencia; `src/models`: entidades; `src/config`: MySQL; `src/utils` y `src/factories`: apoyo y Factory.
- `database`: esquema, seed y normalización; `docs`: backlog, historias y planificación; `tests`: pruebas.

## Entrega académica
Completar roles, fechas, herramienta de seguimiento y evidencias Scrum reales; adjuntar el PDF solicitado y el enlace al video de máximo 7 minutos cuando estén disponibles. No se inventan datos del equipo ni enlaces.
