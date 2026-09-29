# Normalización de la base de datos

La fuente de verdad es `schema.sql`; el libro [normalizacion_gimnasio.xlsx](normalizacion_gimnasio.xlsx) presenta el diccionario, claves, relaciones y análisis de formas normales.

## Primera forma normal (1FN)
Cada celda almacena un valor. Las medidas y fotografías son filas de `medida_corporal` y `foto_progreso`; los alimentos son filas de `detalle_comida`. No hay listas separadas por comas ni arreglos JSON en campos relacionales.

## Segunda forma normal (2FN)
Las entidades usan claves primarias simples. Las tablas de relación identifican sus registros y los atributos describen la fila completa; no hay atributos dependientes de una parte de una clave compuesta.

## Tercera forma normal (3FN)
Los atributos no clave describen solo la entidad de su PK. Tipo/nombre de categoría se guarda en `categoria_finanza`; cliente y plan del contrato se obtienen por `asignacion_plan`; alimentos, medidas y fotos dependen de sus entidades propietarias. El monto acordado se conserva como dato histórico del contrato aunque cambie el precio del plan.

## Integridad
FKs usan RESTRICT para preservar clientes, contratos, planes y movimientos. Detalles de comida, mediciones y fotos usan CASCADE desde sus propietarios. Asociaciones opcionales en seguimiento usan SET NULL. La creación de asignación/contrato es transaccional.

Si se aplica a una base preexistente, respalda y migra datos primero: `CREATE TABLE IF NOT EXISTS` no cambia columnas antiguas.
