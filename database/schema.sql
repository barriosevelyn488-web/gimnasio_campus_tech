CREATE DATABASE IF NOT EXISTS gimnasio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE gimnasio_db;

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150) NOT NULL UNIQUE,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plan_entrenamiento (
  id_plan INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  duracion_semanas SMALLINT UNSIGNED NOT NULL,
  metas_fisicas TEXT NOT NULL,
  nivel ENUM('PRINCIPIANTE','INTERMEDIO','AVANZADO') NOT NULL,
  precio DECIMAL(10,2) UNSIGNED NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (duracion_semanas > 0), CHECK (precio >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rutina (
  id_rutina INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT fk_rutina_plan FOREIGN KEY (plan_id) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT,
  UNIQUE KEY uq_rutina_plan_nombre (plan_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plan_nutricional (
  id_plan_nutricional INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  plan_entrenamiento_id INT NOT NULL,
  descripcion TEXT NOT NULL,
  calorias_estimadas INT UNSIGNED NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('ACTIVO','FINALIZADO','CANCELADO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT fk_nutricion_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
  CONSTRAINT fk_nutricion_entrenamiento FOREIGN KEY (plan_entrenamiento_id) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT,
  CHECK (fecha_fin >= fecha_inicio), CHECK (calorias_estimadas > 0),
  INDEX idx_nutricion_cliente (cliente_id, estado)
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

CREATE TABLE IF NOT EXISTS asignacion_plan (
  id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  plan_id INT NOT NULL,
  detalle_plan_id INT NULL,
  fecha_asignacion DATE NOT NULL,
  estado ENUM('ACTIVA','FINALIZADA','CANCELADA') NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT fk_asignacion_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
  CONSTRAINT fk_asignacion_plan FOREIGN KEY (plan_id) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT,
  CONSTRAINT fk_asignacion_detalle FOREIGN KEY (detalle_plan_id) REFERENCES detalle_plan(id_detalle_plan) ON DELETE RESTRICT,
  INDEX idx_asignacion_cliente (cliente_id, fecha_asignacion)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contrato (
  id_contrato INT AUTO_INCREMENT PRIMARY KEY,
  asignacion_id INT NOT NULL UNIQUE,
  monto DECIMAL(10,2) UNSIGNED NOT NULL,
  condiciones TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('ACTIVO','FINALIZADO','CANCELADO','RENOVADO') NOT NULL DEFAULT 'ACTIVO',
  cancelacion_motivo TEXT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contrato_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignacion_plan(id_asignacion) ON DELETE RESTRICT,
  CHECK (monto >= 0), CHECK (fecha_fin >= fecha_inicio),
  INDEX idx_contrato_estado_fechas (estado, fecha_inicio, fecha_fin)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progreso_fisico (
  id_progreso INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  peso DECIMAL(6,2) NOT NULL,
  porcentaje_grasa DECIMAL(5,2),
  comentarios TEXT NULL,
  fecha_registro DATE NOT NULL,
  CONSTRAINT fk_progreso_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
  CHECK (peso > 0), CHECK (porcentaje_grasa IS NULL OR porcentaje_grasa BETWEEN 0 AND 100),
  INDEX idx_progreso_cliente_fecha (cliente_id, fecha_registro)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medida_corporal (
  id_medida INT AUTO_INCREMENT PRIMARY KEY,
  progreso_id INT NOT NULL,
  tipo VARCHAR(60) NOT NULL,
  valor DECIMAL(7,2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  CONSTRAINT fk_medida_progreso FOREIGN KEY (progreso_id) REFERENCES progreso_fisico(id_progreso) ON DELETE CASCADE,
  CHECK (valor > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS foto_progreso (
  id_foto INT AUTO_INCREMENT PRIMARY KEY,
  progreso_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  CONSTRAINT fk_foto_progreso FOREIGN KEY (progreso_id) REFERENCES progreso_fisico(id_progreso) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comida_nutricional (
  id_comida INT AUTO_INCREMENT PRIMARY KEY,
  plan_nutricional_id INT NOT NULL,
  fecha DATE NOT NULL,
  dia_semana ENUM('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO') NOT NULL,
  tipo_comida VARCHAR(60) NOT NULL,
  indicaciones TEXT NULL,
  CONSTRAINT fk_comida_plan FOREIGN KEY (plan_nutricional_id) REFERENCES plan_nutricional(id_plan_nutricional) ON DELETE CASCADE,
  INDEX idx_comida_plan_fecha (plan_nutricional_id, fecha)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalle_comida (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  comida_id INT NOT NULL,
  alimento VARCHAR(120) NOT NULL,
  cantidad DECIMAL(10,2) UNSIGNED NOT NULL,
  unidad VARCHAR(30) NOT NULL,
  calorias_estimadas INT UNSIGNED NOT NULL,
  CONSTRAINT fk_detalle_comida FOREIGN KEY (comida_id) REFERENCES comida_nutricional(id_comida) ON DELETE CASCADE,
  CHECK (cantidad > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categoria_finanza (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  tipo ENUM('INGRESO','EGRESO') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS finanza (
  id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  contrato_id INT NULL,
  monto DECIMAL(10,2) UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_finanza_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_finanza(id_categoria) ON DELETE RESTRICT,
  CONSTRAINT fk_finanza_contrato FOREIGN KEY (contrato_id) REFERENCES contrato(id_contrato) ON DELETE RESTRICT,
  CHECK (monto > 0), INDEX idx_finanza_fecha (fecha), INDEX idx_finanza_contrato (contrato_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS seguimiento_cliente (
  id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  asignacion_id INT NULL,
  progreso_id INT NULL,
  plan_nutricional_id INT NULL,
  rutina_id INT NULL,
  fecha DATE NOT NULL,
  cumplimiento_rutinas TINYINT UNSIGNED NULL,
  cumplimiento_nutricion TINYINT UNSIGNED NULL,
  observaciones TEXT NOT NULL,
  registrado_por ENUM('ENTRENADOR','CLIENTE') NOT NULL DEFAULT 'ENTRENADOR',
  CONSTRAINT fk_seguimiento_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
  CONSTRAINT fk_seguimiento_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignacion_plan(id_asignacion) ON DELETE SET NULL,
  CONSTRAINT fk_seguimiento_progreso FOREIGN KEY (progreso_id) REFERENCES progreso_fisico(id_progreso) ON DELETE SET NULL,
  CONSTRAINT fk_seguimiento_nutricion FOREIGN KEY (plan_nutricional_id) REFERENCES plan_nutricional(id_plan_nutricional) ON DELETE SET NULL,
  CONSTRAINT fk_seguimiento_rutina FOREIGN KEY (rutina_id) REFERENCES rutina(id_rutina) ON DELETE SET NULL,
  CHECK (cumplimiento_rutinas IS NULL OR cumplimiento_rutinas <= 100),
  CHECK (cumplimiento_nutricion IS NULL OR cumplimiento_nutricion <= 100),
  INDEX idx_seguimiento_cliente_fecha (cliente_id, fecha)
) ENGINE=InnoDB;
