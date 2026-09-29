-- Datos de ejemplo para la demo.

USE gimnasio_db;

-- 1. Categorías financieras
INSERT IGNORE INTO categoria_finanza (id_categoria, nombre, tipo) VALUES
(1, 'Mensualidad',               'INGRESO'),
(2, 'Sesión individual',         'INGRESO'),
(3, 'Venta de suplementos',      'INGRESO'),
(4, 'Servicios públicos',        'EGRESO'),
(5, 'Suplementos',               'EGRESO'),
(6, 'Operación y mantenimiento', 'EGRESO');

-- 2. Clientes
INSERT IGNORE INTO clientes (id_cliente, nombre, apellido, telefono, email) VALUES
(1, 'Carlos', 'Pérez', '3001234567', 'carlos.perez@example.com'),
(2, 'Ana',    'Gómez', '3009876543', 'ana.gomez@example.com');

-- 3. Planes de entrenamiento
INSERT IGNORE INTO plan_entrenamiento (id_plan, nombre, descripcion, duracion_semanas, metas_fisicas, nivel, precio) VALUES
(1, 'Hipertrofia básica', 'Aumento de masa muscular', 8, 'Aumentar fuerza y masa muscular', 'PRINCIPIANTE', 450.00),
(2, 'Resistencia',        'Mejora cardiovascular',    6, 'Mejorar capacidad aeróbica',      'INTERMEDIO',   350.00);

-- 4. Rutinas de cada plan (plan_id 1 = Hipertrofia, plan_id 2 = Resistencia)
INSERT IGNORE INTO rutina (id_rutina, plan_id, nombre, descripcion) VALUES
(1, 1, 'Día A - Tren superior', 'Press banca, remo, press militar'),
(2, 1, 'Día B - Tren inferior', 'Sentadilla, peso muerto, zancadas'),
(3, 2, 'Cardio continuo',       '40 min de trote a ritmo moderado'),
(4, 2, 'Intervalos HIIT',       '10 series de 1 min intenso y 1 min suave');
