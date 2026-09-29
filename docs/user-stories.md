## HISTORIAS DE USUARIO

Autor: Evelyn Barrios

## HU-01 — Configuración de aplicación y base de datos

**Como** desarrollador

**Quiero** configurar la aplicación Node.js y la conexión a MySQL mediante variables de entorno

**Para** disponer de una base técnica segura y funcional para el sistema.

**Criterios de aceptación:**

- Proyecto Node.js correctamente inicializado.
- Conexión funcional con MySQL.
- Credenciales almacenadas mediante variables de entorno.
- Estructura inicial orientada a objetos.
- Base preparada para utilizar transacciones.
- Manejo de errores de conexión.

**Story Points:** 5

---

## HU-02 — Arquitectura orientada a objetos y patrones

**Como** desarrollador

**Quiero** implementar una arquitectura por capas aplicando OOP, SOLID y patrones de diseño

**Para** mantener el código organizado, reutilizable y mantenible.

**Criterios de aceptación:**

- Se utiliza programación orientada a objetos.
- Se aplican principios SOLID.
- Se implementa Repository.
- Se implementa Factory.
- Las responsabilidades están separadas por capas.
- La interfaz CLI no contiene directamente la lógica de negocio ni las consultas SQL.

**Story Points:** 5

---

## HU-03 — Gestión de clientes

**Como** administrador del gimnasio

**Quiero** crear, consultar, actualizar y eliminar clientes

**Para** mantener actualizada la información de las personas inscritas.

**Criterios de aceptación:**

- Crear clientes.
- Consultar clientes.
- Actualizar clientes.
- Eliminar clientes cuando las reglas de integridad lo permitan.
- Validar campos obligatorios.
- Evitar datos inválidos o duplicados según las reglas definidas.
- Mantener las relaciones mediante restricciones de integridad.

**Story Points:** 5

---

## HU-04 — Gestión de planes de entrenamiento

**Como** administrador del gimnasio

**Quiero** crear y administrar planes de entrenamiento

**Para** ofrecer diferentes opciones según las necesidades de cada cliente.

**Criterios de aceptación:**

- Crear planes.
- Consultar planes.
- Actualizar planes.
- Eliminar planes cuando las reglas de integridad lo permitan.
- Registrar nombre del plan.
- Registrar duración.
- Registrar metas físicas.
- Registrar nivel: principiante, intermedio o avanzado.
- Registrar precio.
- Validar los datos obligatorios.

**Story Points:** 5

---

## HU-05 — Asignación de planes y generación de contratos

**Como** administrador del gimnasio

**Quiero** asociar uno o más planes de entrenamiento a un cliente y generar automáticamente su contrato

**Para** formalizar el servicio contratado.

**Criterios de aceptación:**

- Asociar cliente con plan de entrenamiento.
- Registrar la asignación.
- Generar automáticamente el contrato.
- El contrato contiene cliente, plan, duración, precio, condiciones, fecha de inicio y fecha de finalización.
- La asignación y generación del contrato se realizan dentro de una transacción.
- Si ocurre un error, se ejecuta ROLLBACK.
- Si todo es correcto, se ejecuta COMMIT.
- No quedan registros incompletos cuando una operación falla.

**Story Points:** 8

---

## HU-06 — Gestión del ciclo de vida del contrato

**Como** administrador del gimnasio

**Quiero** renovar, finalizar o cancelar contratos

**Para** mantener actualizado el estado de los servicios contratados.

**Criterios de aceptación:**

- Renovar contratos.
- Finalizar contratos.
- Cancelar contratos.
- Actualizar el estado correspondiente.
- Utilizar transacciones en operaciones críticas.
- Mantener consistencia entre cliente, asignación, plan y registros relacionados.
- Conservar la trazabilidad de una cancelación.
- Ejecutar ROLLBACK cuando una operación falle.

**Story Points:** 8

---

## HU-07 — Registro del progreso físico

**Como** entrenador

**Quiero** registrar semanalmente las mediciones físicas de un cliente

**Para** llevar un historial cronológico de su evolución.

**Criterios de aceptación:**

- Registrar peso.
- Registrar porcentaje de grasa corporal.
- Registrar medidas corporales.
- Registrar fotografías.
- Registrar comentarios.
- Registrar fecha del seguimiento.
- Consultar el historial cronológicamente.
- Eliminar registros respetando la integridad de los datos.

**Story Points:** 5

---

## HU-08 — Seguimiento integral del cliente

**Como** entrenador o administrador

**Quiero** contar con una tabla central de seguimiento que relacione al cliente con sus diferentes procesos

**Para** consultar su evolución de manera integral y no únicamente su progreso físico.

**Criterios de aceptación:**

- Registrar un seguimiento asociado a un cliente.
- Registrar fecha del seguimiento.
- Relacionar el seguimiento con una asignación de plan cuando corresponda.
- Relacionar un registro de progreso físico cuando corresponda.
- Relacionar un plan nutricional cuando corresponda.
- Utilizar claves foráneas para las relaciones.
- Permitir relaciones opcionales cuando no correspondan.
- Registrar observaciones.
- Consultar los seguimientos cronológicamente.
- Centralizar la trazabilidad sin duplicar la información de las demás entidades.

**Story Points:** 5

---

## HU-09 — Gestión de planes nutricionales

**Como** entrenador

**Quiero** crear planes nutricionales asociados a un cliente y a su plan de entrenamiento

**Para** complementar el seguimiento del cliente con una planificación alimentaria.

**Criterios de aceptación:**

- Crear un plan nutricional.
- Asociarlo con un cliente.
- Asociarlo con un plan de entrenamiento.
- Registrar descripción.
- Registrar calorías estimadas.
- Registrar fecha de inicio.
- Registrar fecha de finalización.
- Registrar estado.
- Consultar y actualizar planes nutricionales.

**Story Points:** 5

---

## HU-10 — Registro de alimentación y reportes nutricionales

**Como** entrenador

**Quiero** registrar los alimentos por día dentro del plan nutricional y generar un reporte semanal

**Para** dar seguimiento a la planificación alimentaria del cliente.

**Criterios de aceptación:**

- Registrar comidas dentro de un plan nutricional.
- Registrar día de la semana.
- Registrar tipo de comida.
- Registrar alimentos.
- Registrar cantidad y unidad.
- Registrar calorías estimadas.
- Registrar indicaciones u observaciones.
- Generar reporte nutricional semanal.

**Story Points:** 5

---

## HU-11 — Gestión financiera

**Como** administrador del gimnasio

**Quiero** registrar ingresos y egresos

**Para** llevar control de los movimientos económicos del negocio.

**Criterios de aceptación:**

- Registrar ingresos por cuotas mensuales.
- Registrar ingresos por sesiones individuales.
- Registrar egresos.
- Registrar gastos por servicios, suplementos y operación.
- Registrar categoría.
- Registrar monto.
- Registrar descripción.
- Registrar fecha.
- Los ingresos relacionados con un cliente pueden vincularse mediante su contrato.
- Los gastos generales pueden registrarse sin contrato.
- Validar los montos.

**Story Points:** 8

---

## HU-12 — Reportes financieros y transacciones

**Como** administrador del gimnasio

**Quiero** consultar balances financieros por fecha y cliente

**Para** conocer los movimientos económicos y el balance del negocio.

**Criterios de aceptación:**

- Consultar movimientos por rango de fechas.
- Consultar movimientos relacionados con un cliente.
- Calcular total de ingresos.
- Calcular total de egresos.
- Calcular balance.
- Utilizar `SUM` y `GROUP BY` cuando corresponda.
- Utilizar transacciones en operaciones financieras críticas.
- Ejecutar COMMIT en operaciones exitosas.
- Ejecutar ROLLBACK cuando ocurran errores.

**Story Points:** 8

---

## HU-13 — Pruebas e integridad del sistema

**Como** desarrollador

**Quiero** probar las operaciones principales y relaciones de la base de datos

**Para** asegurar que el sistema funcione correctamente y mantenga la integridad de la información.

**Criterios de aceptación:**

- Probar operaciones CRUD.
- Probar relaciones entre entidades.
- Probar restricciones de integridad.
- Probar transacciones.
- Verificar COMMIT.
- Verificar ROLLBACK.
- Probar operaciones críticas.
- Verificar que los errores no dejen información inconsistente.

**Story Points:** 5

---

## HU-14 — Documentación y entrega

**Como** equipo de desarrollo

**Quiero** documentar el proyecto y preparar las evidencias de entrega

**Para** demostrar el funcionamiento, arquitectura y proceso de desarrollo.

**Criterios de aceptación:**

- README completo.
- Instrucciones de instalación y ejecución.
- Documentación de la estructura del proyecto.
- Documentación de decisiones técnicas.
- Evidencia del proceso Scrum.
- PDF solicitado.
- Uso de Conventional Commits.
- Video demostrativo.
- Video con explicación de principios, patrones y funcionamiento de la aplicación.

**Story Points:** 5