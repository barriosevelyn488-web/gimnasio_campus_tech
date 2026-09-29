import pool from '../config/db.js';

export class ProgresoController {
  static async registrarProgreso(data) {
    const { cliente_id, peso, altura, porcentaje_grasa, fecha_registro } = data;
    const [result] = await pool.query(
      'INSERT INTO PROGRESO_FISICO (cliente_id, peso, altura, porcentaje_grasa, fecha_registro) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, peso, altura, porcentaje_grasa, fecha_registro]
    );
    return result.insertId;
  }

  static async listarProgresoPorCliente(cliente_id) {
    const [rows] = await pool.query(
      'SELECT * FROM PROGRESO_FISICO WHERE cliente_id = ? ORDER BY fecha_registro DESC',
      [cliente_id]
    );
    return rows;
  }
}