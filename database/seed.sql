USE gimnasio_db;

INSERT IGNORE INTO categoria_finanza (nombre,tipo) VALUES
('Mensualidad','INGRESO'),('Sesión individual','INGRESO'),('Venta de suplementos','INGRESO'),
('Servicios públicos','EGRESO'),('Suplementos','EGRESO'),('Operación y mantenimiento','EGRESO');

INSERT INTO clientes (nombre,apellido,telefono,email) VALUES
('Carlos','Pérez','3001234567','carlos.perez@example.com'),('Ana','Gómez','3009876543','ana.gomez@example.com')
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO plan_entrenamiento (nombre,descripcion,duracion_semanas,metas_fisicas,nivel,precio) VALUES
('Hipertrofia básica','Aumento de masa muscular',8,'Aumentar fuerza y masa muscular','PRINCIPIANTE',450.00),
('Resistencia','Mejora cardiovascular',6,'Mejorar capacidad aeróbica','INTERMEDIO',350.00);
