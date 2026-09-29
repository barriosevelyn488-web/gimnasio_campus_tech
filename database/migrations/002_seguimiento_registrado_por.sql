-- Migra una base que ya tiene aplicada 001_rutina_detalle_plan.sql.
-- Ejecutar una sola vez: mysql -u root -p < database/migrations/002_seguimiento_registrado_por.sql
USE gimnasio_db;

ALTER TABLE seguimiento_cliente
  ADD COLUMN registrado_por ENUM('ENTRENADOR','CLIENTE') NOT NULL DEFAULT 'ENTRENADOR' AFTER observaciones;
