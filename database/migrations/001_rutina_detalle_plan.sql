-- Migra una base creada con la versión anterior de schema.sql.
-- Ejecutar una sola vez: mysql -u root -p < database/migrations/001_rutina_detalle_plan.sql
USE gimnasio_db;

CREATE TABLE IF NOT EXISTS rutina (
  id_rutina INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT fk_rutina_plan FOREIGN KEY (plan_id) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT,
  UNIQUE KEY uq_rutina_plan_nombre (plan_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalle_plan (
  id_detalle_plan INT AUTO_INCREMENT PRIMARY KEY,
  plan_entrenamiento_id INT NOT NULL,
  plan_nutricional_id INT NOT NULL,
  observaciones TEXT NULL,
  CONSTRAINT fk_detalle_plan_entrenamiento FOREIGN KEY (plan_entrenamiento_id) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_plan_nutricional FOREIGN KEY (plan_nutricional_id) REFERENCES plan_nutricional(id_plan_nutricional) ON DELETE RESTRICT,
  UNIQUE KEY uq_detalle_plan (plan_entrenamiento_id, plan_nutricional_id)
) ENGINE=InnoDB;

ALTER TABLE asignacion_plan
  ADD COLUMN detalle_plan_id INT NULL AFTER plan_id,
  ADD CONSTRAINT fk_asignacion_detalle FOREIGN KEY (detalle_plan_id) REFERENCES detalle_plan(id_detalle_plan) ON DELETE RESTRICT;

ALTER TABLE seguimiento_cliente
  ADD COLUMN rutina_id INT NULL AFTER plan_nutricional_id,
  ADD COLUMN cumplimiento_rutinas TINYINT UNSIGNED NULL AFTER fecha,
  ADD COLUMN cumplimiento_nutricion TINYINT UNSIGNED NULL AFTER cumplimiento_rutinas,
  ADD CONSTRAINT fk_seguimiento_rutina FOREIGN KEY (rutina_id) REFERENCES rutina(id_rutina) ON DELETE SET NULL,
  ADD CONSTRAINT chk_cumplimiento_rutinas CHECK (cumplimiento_rutinas IS NULL OR cumplimiento_rutinas <= 100),
  ADD CONSTRAINT chk_cumplimiento_nutricion CHECK (cumplimiento_nutricion IS NULL OR cumplimiento_nutricion <= 100);
