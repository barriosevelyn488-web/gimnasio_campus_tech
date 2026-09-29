import pool from '../config/db.js';

export class RutinaController {
  static async listar(planId = null) {
    const [rows] = await pool.execute(
      `SELECT r.id_rutina, r.plan_id, p.nombre AS plan, r.nombre, r.descripcion, r.estado
       FROM rutina r
       JOIN plan_entrenamiento p ON p.id_plan = r.plan_id
       ${planId ? 'WHERE r.plan_id = ?' : ''}
       ORDER BY p.nombre, r.nombre`,
      planId ? [planId] : []
    );
    return rows;
  }

  static async registrar(d) {
    const [planes] = await pool.execute('SELECT activo FROM plan_entrenamiento WHERE id_plan = ?', [d.plan_id]);
    if (!planes.length || !planes[0].activo) throw new Error('El plan no existe o está inactivo.');
    const [r] = await pool.execute(
      'INSERT INTO rutina (plan_id, nombre, descripcion) VALUES (?, ?, ?)',
      [d.plan_id, d.nombre, d.descripcion]
    );
    return r.insertId;
  }

  static async actualizar(id, d) {
    const [r] = await pool.execute(
      'UPDATE rutina SET nombre = ?, descripcion = ?, estado = ? WHERE id_rutina = ?',
      [d.nombre, d.descripcion, d.estado, id]
    );
    return r.affectedRows;
  }

  static async desactivar(id) {
    const [r] = await pool.execute("UPDATE rutina SET estado = 'INACTIVA' WHERE id_rutina = ? AND estado = 'ACTIVA'", [id]);
    return r.affectedRows;
  }
}
