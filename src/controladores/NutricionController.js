import pool from '../config/db.js';

export class NutricionController {
  static async registrarPlanNutricional(data) {
    const { nombre, objetivo, calorias_diarias } = data;
    const [result] = await pool.query(
      'INSERT INTO PLAN_NUTRICIONAL (nombre, objetivo, calorias_diarias) VALUES (?, ?, ?)',
      [nombre, objetivo, calorias_diarias]
    );
    return result.insertId;
  }

  static async listarPlanesNutricionales() {
    const [rows] = await pool.query('SELECT * FROM PLAN_NUTRICIONAL');
    return rows;
  }
}