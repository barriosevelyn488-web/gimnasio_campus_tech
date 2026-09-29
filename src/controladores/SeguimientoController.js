import pool from '../config/db.js';

export class SeguimientoController {
  static async registrarSeguimiento(d) {
    const [r] = await pool.execute(
      `INSERT INTO seguimiento_cliente
         (cliente_id, asignacion_id, progreso_id, plan_nutricional_id, rutina_id, fecha, cumplimiento_rutinas, cumplimiento_nutricion, observaciones, registrado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.cliente_id, d.asignacion_id, d.progreso_id, d.plan_nutricional_id, d.rutina_id, d.fecha, d.cumplimiento_rutinas, d.cumplimiento_nutricion, d.observaciones, d.registrado_por]
    );
    return r.insertId;
  }

  static async listarSeguimientosCliente(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, p.peso, p.porcentaje_grasa, n.descripcion AS plan_nutricional, r.nombre AS rutina
       FROM seguimiento_cliente s
       LEFT JOIN progreso_fisico p ON p.id_progreso = s.progreso_id
       LEFT JOIN plan_nutricional n ON n.id_plan_nutricional = s.plan_nutricional_id
       LEFT JOIN rutina r ON r.id_rutina = s.rutina_id
       WHERE s.cliente_id = ?
       ORDER BY s.fecha, s.id_seguimiento`,
      [id]
    );
    return rows;
  }
}
