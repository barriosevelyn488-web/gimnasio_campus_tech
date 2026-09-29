import pool from '../config/db.js';

export class ContratoController {
  static async registrarContrato(data) {
    const { cliente_id, fecha_emision, valor_total, estado } = data;
    const [result] = await pool.query(
      'INSERT INTO CONTRATO (cliente_id, fecha_emision, valor_total, estado) VALUES (?, ?, ?, ?)',
      [cliente_id, fecha_emision, valor_total, estado || 'ACTIVO']
    );
    return result.insertId;
  }

  static async listarContratos() {
    const [rows] = await pool.query('SELECT * FROM CONTRATO');
    return rows;
  }
}