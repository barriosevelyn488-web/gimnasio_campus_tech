USE gimnasio_db;

INSERT IGNORE INTO categoria_finanza (nombre,tipo) VALUES
('Mensualidad','INGRESO'),('Sesión individual','INGRESO'),('Venta de suplementos','INGRESO'),
('Servicios públicos','EGRESO'),('Suplementos','EGRESO'),('Operación y mantenimiento','EGRESO');

INSERT INTO clientes (nombre,apellido,telefono,email) VALUES
('Carlos','Pérez','3001234567','carlos.perez@example.com'),('Ana','Gómez','3009876543','ana.gomez@example.com')
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO plan_entrenamiento (nombre,descripcion,duracion_semanas,metas_fisicas,nivel,precio)
SELECT * FROM (
  SELECT 'Hipertrofia básica' AS nombre,'Aumento de masa muscular' AS descripcion,8 AS duracion_semanas,'Aumentar fuerza y masa muscular' AS metas_fisicas,'PRINCIPIANTE' AS nivel,450.00 AS precio
  UNION ALL
  SELECT 'Resistencia','Mejora cardiovascular',6,'Mejorar capacidad aeróbica','INTERMEDIO',350.00
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM plan_entrenamiento p WHERE p.nombre = nuevos.nombre);

INSERT IGNORE INTO rutina (plan_id,nombre,descripcion)
SELECT p.id_plan, r.nombre, r.descripcion
FROM plan_entrenamiento p
JOIN (
  SELECT 'Hipertrofia básica' AS plan,'Día A - Tren superior' AS nombre,'Press banca, remo, press militar' AS descripcion
  UNION ALL SELECT 'Hipertrofia básica','Día B - Tren inferior','Sentadilla, peso muerto, zancadas'
  UNION ALL SELECT 'Resistencia','Cardio continuo','40 min de trote a ritmo moderado'
  UNION ALL SELECT 'Resistencia','Intervalos HIIT','10 series de 1 min intenso y 1 min suave'
) AS r ON r.plan = p.nombre;
