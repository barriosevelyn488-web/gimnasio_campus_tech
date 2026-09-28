import pool from '../config/db.js';

export default class ClienteController {
  static async crear(cliente) {
    const query = 'INSERT INTO clientes (nombre, apellido, telefono, email, fecha_registro) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [
      cliente.nombre,
      cliente.apellido,
      cliente.telefono,
      cliente.email,
      cliente.fecha_registro
    ]);
    return result.insertId;
  }

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM clientes');
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return rows[0];
  }

  static async actualizar(id, cliente) {
    const query = 'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id_cliente = ?';
    const [result] = await pool.query(query, [
      cliente.nombre,
      cliente.apellido,
      cliente.telefono,
      cliente.email,
      id
    ]);
    return result.affectedRows;
  }

  static async eliminar(id) {
    const query = 'DELETE FROM clientes WHERE id_cliente = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}