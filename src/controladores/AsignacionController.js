import pool from '../config/db.js';

export class AsignacionController {
  static async registrarAsignacionYContrato(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { cliente_id, plan_entrenamiento_id, fecha_asignacion, monto, fecha_inicio, fecha_fin } = data;

      // 1. Insertar Asignación de Plan
      const [resultAsignacion] = await connection.query(
        'INSERT INTO ASIGNACION_PLAN (cliente_id, plan_entrenamiento_id, fecha_asignacion) VALUES (?, ?, ?)',
        [cliente_id, plan_entrenamiento_id, fecha_asignacion]
      );

      // 2. Insertar Contrato automáticamente
      await connection.query(
        'INSERT INTO CONTRATO (cliente_id, monto, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
        [cliente_id, monto, fecha_inicio, fecha_fin, 'ACTIVO']
      );

      await connection.commit();
      connection.release();
      return resultAsignacion.insertId;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw new Error(`Error en transacción (Rollback ejecutado): ${error.message}`);
    }
  }

  static async listarContratos() {
    const [rows] = await pool.query(`
      SELECT c.id, cl.nombre AS cliente, c.monto, c.fecha_inicio, c.fecha_fin, c.estado 
      FROM CONTRATO c 
      JOIN CLIENTE cl ON c.cliente_id = cl.id
    `);
    return rows;
  }
}