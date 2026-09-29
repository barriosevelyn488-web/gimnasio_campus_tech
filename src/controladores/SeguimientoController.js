import pool from '../config/db.js';

export class SeguimientoController {
  static async registrarSeguimiento(data) {
    const { cliente_id, observacion, fecha } = data;
    const [result] = await pool.query(
      'INSERT INTO SEGUIMIENTO_CLIENTE (cliente_id, observacion, fecha) VALUES (?, ?, ?)',
      [cliente_id, observacion, fecha]
    );
    return result.insertId;
  }

  static async listarSeguimientosCliente(cliente_id) {
    const [rows] = await pool.query(
      'SELECT * FROM SEGUIMIENTO_CLIENTE WHERE cliente_id = ? ORDER BY fecha DESC',
      [cliente_id]
    );
    return rows;
  }
}