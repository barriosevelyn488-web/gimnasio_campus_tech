import pool from '../config/db.js';

export class FinanzaController {
  static async registrarMovimiento(data) {
    const { categoria_id, monto, fecha, descripcion } = data;
    const [result] = await pool.query(
      'INSERT INTO FINANZA (categoria_id, monto, fecha, descripcion) VALUES (?, ?, ?, ?)',
      [categoria_id, monto, fecha, descripcion]
    );
    return result.insertId;
  }

  static async listarMovimientos() {
    const [rows] = await pool.query(`
      SELECT f.id, cf.nombre AS categoria, cf.tipo, f.monto, f.fecha, f.descripcion 
      FROM FINANZA f 
      JOIN CATEGORIA_FINANZA cf ON f.categoria_id = cf.id
      ORDER BY f.fecha DESC
    `);
    return rows;
  }
}