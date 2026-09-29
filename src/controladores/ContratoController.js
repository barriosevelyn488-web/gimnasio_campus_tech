import pool from '../config/db.js';
import { FinanzaController } from './FinanzaController.js';

export class ContratoController {
  static async cambiarEstado(id, estado, motivo = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute('SELECT asignacion_id, estado FROM contrato WHERE id_contrato = ? FOR UPDATE', [id]);
      if (!rows.length) throw new Error('Contrato no encontrado.');
      if (rows[0].estado !== 'ACTIVO') throw new Error('Solo se puede modificar un contrato activo.');

      await connection.execute('UPDATE contrato SET estado = ?, cancelacion_motivo = ? WHERE id_contrato = ?', [estado, motivo, id]);
      await connection.execute('UPDATE asignacion_plan SET estado = ? WHERE id_asignacion = ?', [
        estado === 'CANCELADO' ? 'CANCELADA' : 'FINALIZADA',
        rows[0].asignacion_id
      ]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async renovar(id, fechaInicio, fechaFin, monto, condiciones, registrarPago = false) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute(
        `SELECT c.asignacion_id, c.estado, a.cliente_id, a.plan_id, a.detalle_plan_id, p.activo
         FROM contrato c
         JOIN asignacion_plan a ON a.id_asignacion = c.asignacion_id
         JOIN plan_entrenamiento p ON p.id_plan = a.plan_id
         WHERE c.id_contrato = ? FOR UPDATE`,
        [id]
      );
      if (!rows.length || rows[0].estado !== 'ACTIVO') throw new Error('Se requiere un contrato activo para renovarlo.');
      if (!rows[0].activo) throw new Error('El plan del contrato está inactivo; asigna un plan vigente.');
      const actual = rows[0];

      const [asignacion] = await connection.execute(
        'INSERT INTO asignacion_plan (cliente_id, plan_id, detalle_plan_id, fecha_asignacion) VALUES (?, ?, ?, ?)',
        [actual.cliente_id, actual.plan_id, actual.detalle_plan_id, fechaInicio]
      );
      const [contrato] = await connection.execute(
        'INSERT INTO contrato (asignacion_id, monto, condiciones, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
        [asignacion.insertId, monto, condiciones, fechaInicio, fechaFin]
      );
      if (registrarPago && Number(monto) > 0) {
        await FinanzaController.registrarIngresoContrato(connection, contrato.insertId, monto, fechaInicio, `Pago de renovación, contrato ${contrato.insertId}`);
      }
      await connection.execute("UPDATE contrato SET estado = 'RENOVADO' WHERE id_contrato = ?", [id]);
      await connection.execute("UPDATE asignacion_plan SET estado = 'FINALIZADA' WHERE id_asignacion = ?", [actual.asignacion_id]);

      await connection.commit();
      return contrato.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
