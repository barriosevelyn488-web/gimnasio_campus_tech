import pool from '../config/db.js';

export class DetallePlanController {
  static async listar() {
    const [rows] = await pool.query(`
      SELECT d.id_detalle_plan, CONCAT(c.nombre, ' ', c.apellido) AS cliente,
             p.id_plan, p.nombre AS plan_entrenamiento,
             n.id_plan_nutricional, n.descripcion AS plan_nutricional, d.observaciones
      FROM detalle_plan d
      JOIN plan_entrenamiento p ON p.id_plan = d.plan_entrenamiento_id
      JOIN plan_nutricional n ON n.id_plan_nutricional = d.plan_nutricional_id
      JOIN clientes c ON c.id_cliente = n.cliente_id
      ORDER BY d.id_detalle_plan`);
    return rows;
  }

  static async registrar(d) {
    const [planes] = await pool.execute(
      `SELECT n.plan_entrenamiento_id, n.estado, p.activo
       FROM plan_nutricional n
       JOIN plan_entrenamiento p ON p.id_plan = n.plan_entrenamiento_id
       WHERE n.id_plan_nutricional = ?`,
      [d.plan_nutricional_id]
    );
    if (!planes.length) throw new Error('El plan nutricional no existe.');
    if (planes[0].estado !== 'ACTIVO' || !planes[0].activo) throw new Error('El plan nutricional y su plan de entrenamiento deben estar activos.');

    const [r] = await pool.execute(
      'INSERT INTO detalle_plan (plan_entrenamiento_id, plan_nutricional_id, observaciones) VALUES (?, ?, ?)',
      [planes[0].plan_entrenamiento_id, d.plan_nutricional_id, d.observaciones]
    );
    return r.insertId;
  }

  static async actualizarObservaciones(id, observaciones) {
    const [r] = await pool.execute('UPDATE detalle_plan SET observaciones = ? WHERE id_detalle_plan = ?', [observaciones, id]);
    return r.affectedRows;
  }

  static async eliminar(id) {
    const [r] = await pool.execute('DELETE FROM detalle_plan WHERE id_detalle_plan = ?', [id]);
    return r.affectedRows;
  }
}
