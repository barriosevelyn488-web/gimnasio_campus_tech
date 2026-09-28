-- Seleccionar la base de datos
USE gimnasio_db;

-- 1. Insertar CLIENTES (Independiente)
INSERT INTO CLIENTE (nombre, apellido, correo, telefono) VALUES
('Carlos', 'Pérez', 'carlos.perez@email.com', '3001234567'),
('Ana', 'Gómez', 'ana.gomez@email.com', '3009876543'),
('Luis', 'Rodríguez', 'luis.rodriguez@email.com', '3104567890'),
('María', 'Fernández', 'maria.fernandez@email.com', '3207891234');

-- 2. Insertar PLANES DE ENTRENAMIENTO (Independiente)
INSERT INTO PLAN_ENTRENAMIENTO (nombre, descripcion, duracion_semanas) VALUES
('Hipertrofia Basica', 'Rutina enfocada en el aumento de masa muscular', 8),
('Definicion Muscular', 'Enfocado en la reduccion de tejido adiposo y tonificacion', 6),
('Resistencia Cardiorrespiratoria', 'Mejora de capacidad aeróbica y resistencia', 4);

-- 3. Insertar PLANES NUTRICIONALES (Independiente)
INSERT INTO PLAN_NUTRICIONAL (nombre, objetivo, calorias_diarias) VALUES
('Volumen Limpio', 'Aumento de masa muscular minimizando grasa', 2800),
('Definicion Extrema', 'Déficit calórico controlado para pérdida de peso', 1800),
('Mantenimiento General', 'Balance calórico para estabilidad física', 2200);

-- 4. Insertar RUTINAS (Independiente)
INSERT INTO RUTINA (nombre, tipo, repeticiones) VALUES
('Rutina Pierna Fuerte', 'Fuerza', 12),
('Pecho y Tríceps', 'Hipertrofia', 10),
('Cardio HIIT', 'Resistencia', 20);

-- 5. Insertar COMIDAS NUTRICIONALES (Independiente)
INSERT INTO COMIDA_NUTRICIONAL (nombre_comida, tipo_comida, calorias) VALUES
('Pollo con Arroz y Brócoli', 'Almuerzo', 650),
('Batido de Proteína con Avena', 'Desayuno', 400),
('Ensalada de Atún y Aguacate', 'Cena', 450);

-- 6. Insertar CATEGORIAS FINANCIERAS (Independiente)
INSERT INTO CATEGORIA_FINANZA (nombre, tipo) VALUES
('Membresía Mensual', 'INGRESO'),
('Venta de Suplementos', 'INGRESO'),
('Mantenimiento de Equipos', 'EGRESO'),
('Servicios Públicos', 'EGRESO');

-- 7. Insertar DETALLE_PLAN (Relaciona entrenamiento y nutrición)
INSERT INTO DETALLE_PLAN (plan_entrenamiento_id, plan_nutricional_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- 8. Insertar ASIGNACION_PLAN (Relaciona cliente y plan de entrenamiento)
INSERT INTO ASIGNACION_PLAN (cliente_id, plan_entrenamiento_id, fecha_asignacion) VALUES
(1, 1, '2026-09-01'),
(2, 2, '2026-09-03'),
(3, 3, '2026-09-05'),
(4, 1, '2026-09-10');

-- 9. Insertar CONTRATOS
INSERT INTO CONTRATO (cliente_id, monto, fecha_inicio, fecha_fin, estado) VALUES
(1, 120.00, '2026-09-01', '2026-10-01', 'ACTIVO'),
(2, 120.00, '2026-09-03', '2026-10-03', 'ACTIVO'),
(3, 90.00, '2026-09-05', '2026-10-05', 'ACTIVO'),
(4, 150.00, '2026-09-10', '2026-11-10', 'ACTIVO');

-- 10. Insertar PROGRESO FISICO
INSERT INTO PROGRESO_FISICO (cliente_id, peso, altura, porcentaje_grasa, fecha_registro) VALUES
(1, 78.5, 1.75, 15.2, '2026-09-01'),
(2, 62.0, 1.65, 21.0, '2026-09-03'),
(3, 85.0, 1.80, 18.5, '2026-09-05'),
(4, 55.5, 1.60, 19.8, '2026-09-10');

-- 11. Insertar SEGUIMIENTO CLIENTE
INSERT INTO SEGUIMIENTO_CLIENTE (cliente_id, observacion, fecha) VALUES
(1, 'Buen rendimiento en la primera semana de volumen.', '2026-09-07'),
(2, 'Manifiesta fatiga moderada, se ajustan carbohidratos.', '2026-09-09'),
(3, 'Excelente evolución en la resistencia aeróbica.', '2026-09-12');

-- 12. Insertar FINANZAS
INSERT INTO FINANZA (categoria_id, monto, fecha, descripcion) VALUES
(1, 120.00, '2026-09-01', 'Pago membresía Carlos Pérez'),
(1, 120.00, '2026-09-03', 'Pago membresía Ana Gómez'),
(3, 250.00, '2026-09-04', 'Reparación de poleas en máquina de polea alta');