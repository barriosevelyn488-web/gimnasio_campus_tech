import pool from '../config/db.js';
import { FinanzaController } from './FinanzaController.js';

export class AsignacionController {
  static async registrarAsignacionYContrato(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let planId = data.plan_id;
      if (data.detalle_plan_id) {
        const [paquetes] = await connection.execute(
          `SELECT d.plan_entrenamiento_id, n.cliente_id
           FROM detalle_plan d
           JOIN plan_nutricional n ON n.id_plan_nutricional = d.plan_nutricional_id
           WHERE d.id_detalle_plan = ?`,
          [data.detalle_plan_id]
        );
        if (!paquetes.length) throw new Error('El paquete indicado no existe.');
        if (paquetes[0].cliente_id !== data.cliente_id) throw new Error('El paquete pertenece a otro cliente.');
        if (planId && planId !== paquetes[0].plan_entrenamiento_id) throw new Error('El plan no coincide con el del paquete.');
        planId = paquetes[0].plan_entrenamiento_id;
      }

      const [planes] = await connection.execute(
        'SELECT precio, duracion_semanas FROM plan_entrenamiento WHERE id_plan = ? AND activo = TRUE FOR UPDATE',
        [planId]
      );
      if (!planes.length) throw new Error('El plan no existe o está inactivo.');
      const plan = planes[0];

      const [asignacion] = await connection.execute(
        'INSERT INTO asignacion_plan (cliente_id, plan_id, detalle_plan_id, fecha_asignacion) VALUES (?, ?, ?, ?)',
        [data.cliente_id, planId, data.detalle_plan_id, data.fecha_asignacion]
      );

      const monto = data.monto ?? plan.precio;
      const fechaFin = data.fecha_fin || sumarSemanas(data.fecha_inicio, plan.duracion_semanas);
      const [contrato] = await connection.execute(
        'INSERT INTO contrato (asignacion_id, monto, condiciones, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
        [asignacion.insertId, monto, data.condiciones || 'Contrato de servicio de entrenamiento', data.fecha_inicio, fechaFin]
      );

      const idMovimiento = data.registrar_pago && Number(monto) > 0
        ? await FinanzaController.registrarIngresoContrato(connection, contrato.insertId, monto, data.fecha_asignacion, `Pago de contrato ${contrato.insertId}`)
        : null;

      await connection.commit();
      return { id_asignacion: asignacion.insertId, id_contrato: contrato.insertId, id_movimiento: idMovimiento, fecha_fin: fechaFin, monto };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listarContratos() {
    const [rows] = await pool.query(`
      SELECT c.id_contrato, a.id_asignacion, cl.id_cliente, CONCAT(cl.nombre, ' ', cl.apellido) AS cliente, p.nombre AS plan, a.detalle_plan_id AS paquete,
             c.monto, c.condiciones, c.fecha_inicio, c.fecha_fin, c.estado
      FROM contrato c
      JOIN asignacion_plan a ON a.id_asignacion = c.asignacion_id
      JOIN clientes cl ON cl.id_cliente = a.cliente_id
      JOIN plan_entrenamiento p ON p.id_plan = a.plan_id
      ORDER BY c.fecha_inicio DESC`);
    return rows;
  }
}

function sumarSemanas(fecha, semanas) {
  const d = new Date(`${fecha}T12:00:00`);
  d.setDate(d.getDate() + Number(semanas) * 7);
  return d.toISOString().slice(0, 10);
}
