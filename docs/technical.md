# Documentación técnica

## Componentes y flujo

El proyecto es un CLI Node.js con módulos ES (`package.json` declara `type: module`). `src/index.js` inicia `MainMenu`; `MenuFactory` devuelve el menú elegido. Los menús llaman a servicios, que validan entradas y delegan en controladores. Los controladores ejecutan SQL parametrizado mediante `mysql2/promise`; `src/config/db.js` crea un pool y carga variables desde `.env`.

```text
Usuario → commands → services → controladores → MySQL
                         ↘ utils
Factory → selección del menú
Models → representación de entidades
```

```mermaid
flowchart TD
  U[Usuario] --> C[Commands CLI]
  C --> S[Services]
  S --> CT[Controladores]
  CT --> R[Repositories cuando aplica]
  R --> DB[(MySQL)]
  CT --> DB
  S -. validacion y formato .-> UT[Utils]
  F[MenuFactory] --> C
  M[Models] -. entidades .-> S
```

Los controladores contienen consultas y coordinación de persistencia. `ClienteRepository` y `BaseRepository` muestran el patrón Repository para el CRUD de clientes. `MenuFactory` implementa una Factory sencilla para seleccionar menús. Los modelos encapsulan datos de dominio. SOLID y OOP se emplean de manera pragmática: no todos los módulos dependen de interfaces ni todas las consultas usan Repository.

## Persistencia e integridad

### Correspondencia con el diagrama ER entregado

El esquema usa `clientes`, `plan_entrenamiento`, `rutina`, `plan_nutricional`, `detalle_plan`, `asignacion_plan`, `contrato`, `comida_nutricional`, `detalle_comida`, `progreso_fisico`, `medida_corporal`, `foto_progreso`, `seguimiento_cliente`, `categoria_finanza` y `finanza`. `rutina` pertenece a un plan de entrenamiento. `detalle_plan` es el paquete que une un plan de entrenamiento con un plan nutricional; `asignacion_plan.detalle_plan_id` lo vincula de forma opcional y la renovación lo conserva. `seguimiento_cliente` registra `rutina_id`, `cumplimiento_rutinas`, `cumplimiento_nutricion` (0-100) y `registrado_por` (`ENTRENADOR` o `CLIENTE`).

Flujo por roles: el menú inicial pide el rol. El entrenador administra clientes, planes, rutinas, planes nutricionales, paquetes, asignaciones, contratos, progreso, bitácora y finanzas. Al asignar o renovar, si el cliente pagó, la misma transacción crea asignación, contrato e ingreso `Mensualidad` en `finanza`; si algo falla se hace ROLLBACK. El cliente ingresa con su ID o correo, consulta su plan activo (rutinas y comidas), sus contratos, pagos y progreso, y registra su cumplimiento diario, que queda en la bitácora con `registrado_por = 'CLIENTE'`. Los alimentos se almacenan como texto en `detalle_comida`, no en una tabla `alimento`.

Para la entrega, actualiza el diagrama ER desde `database/schema.sql` y presenta ese archivo como fuente de verdad. El diagrama de arquitectura conceptual puede acompañar el proyecto si refleja el flujo de capas documentado arriba.

El esquema se crea con `database/schema.sql` en MySQL 8. Las claves foráneas protegen las relaciones. Clientes, contratos y movimientos usan restricciones de borrado; detalles pertenecientes a comidas/progreso se eliminan en cascada y las referencias opcionales de seguimiento pasan a `NULL` al desaparecer su entidad relacionada. Consulta `database/normalization.md` para el resumen 1FN, 2FN y 3FN.

Las credenciales se leen en `src/config/db.js`. La conexión no se abre hasta que un controlador solicita una consulta; `npm run db:check` verifica conectividad. La aplicación falla al importar la configuración si falta `DB_HOST`, `DB_USER` o `DB_NAME`.

## Operaciones transaccionales

- La asignación de un plan y la creación de su contrato se confirman o revierten juntas.
- Cambios de estado y renovaciones de contrato usan transacción.
- El registro del progreso y sus medidas/fotos se guarda como una sola unidad.
- Una comida y sus detalles de alimentos se guardan como una sola unidad.
- El registro financiero valida la categoría y guarda el movimiento dentro de una transacción.

En caso de error, los controladores ejecutan `ROLLBACK`, propagan el error y liberan la conexión. El pool se cierra al terminar `db:check`.

## Verificación

`npm run db:check` ejecuta una consulta `SELECT 1` para comprobar conectividad; no prueba las funcionalidades del sistema. Las operaciones deben probarse manualmente desde la CLI con registros válidos de la base.

## Alcance funcional comprobado en el código

Los menús ofrecen CRUD de clientes y planes de entrenamiento, actualización de planes nutricionales, ciclo de contratos, progreso, seguimiento, comidas e informes financieros y nutricionales. La eliminación de planes de entrenamiento es lógica para preservar contratos históricos. El módulo financiero registra y lista movimientos y consulta balances; el reporte nutricional recibe rango de fechas, que puede abarcar una semana. La capa de finanzas permite asociar un contrato cuando aplica.

Para cambios de esquema, actualiza `database/schema.sql` y revisa las restricciones antes de aplicarlos sobre una base existente. `CREATE TABLE IF NOT EXISTS` crea tablas faltantes, pero no migra una tabla ya creada. Para una base creada con la versión anterior, ejecuta una sola vez y en orden `database/migrations/001_rutina_detalle_plan.sql` y `database/migrations/002_seguimiento_registrado_por.sql`.
