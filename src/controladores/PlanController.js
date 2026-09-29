import pool from '../config/db.js';

export class PlanController {
  static async listarPlanes() {
    const [rows] = await pool.query('SELECT * FROM PLAN_ENTRENAMIENTO');
    return rows;
  }

  static async registrarPlan(plan) {
    const { nombre, descripcion, duracion_semanas } = plan;
    const [result] = await pool.query(
      'INSERT INTO PLAN_ENTRENAMIENTO (nombre, descripcion, duracion_semanas) VALUES (?, ?, ?)',
      [nombre, descripcion, duracion_semanas]
    );
    return result.insertId;
  }
}