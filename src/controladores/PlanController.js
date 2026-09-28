import pool from '../config/db.js';

export default class PlanController {
  static async listar() {
    const [rows] = await pool.query('SELECT * FROM planes_entrenamiento');
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM planes_entrenamiento WHERE id_plan = ?', [id]);
    return rows[0];
  }
}