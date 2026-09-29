import pool from '../config/db.js';

const FROM_MOVIMIENTOS = `
  FROM finanza f
  JOIN categoria_finanza cf ON cf.id_categoria = f.categoria_id
  LEFT JOIN contrato c ON c.id_contrato = f.contrato_id
  LEFT JOIN asignacion_plan a ON a.id_asignacion = c.asignacion_id`;

function construirFiltros({ desde, hasta, cliente_id } = {}) {
  const condiciones = [];
  const args = [];
  if (desde) { condiciones.push('f.fecha >= ?'); args.push(desde); }
  if (hasta) { condiciones.push('f.fecha <= ?'); args.push(hasta); }
  if (cliente_id) { condiciones.push('a.cliente_id = ?'); args.push(cliente_id); }
  return { where: condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '', args };
}

export class FinanzaController {
  static async registrarIngresoContrato(connection, contratoId, monto, fecha, descripcion) {
    const [categorias] = await connection.execute(
      "SELECT id_categoria FROM categoria_finanza WHERE nombre = 'Mensualidad' AND tipo = 'INGRESO'"
    );
    if (!categorias.length) throw new Error('Falta la categoría de ingreso "Mensualidad". Ejecuta database/seed.sql.');
    const [r] = await connection.execute(
      'INSERT INTO finanza (categoria_id, contrato_id, monto, fecha, descripcion) VALUES (?, ?, ?, ?, ?)',
      [categorias[0].id_categoria, contratoId, monto, fecha, descripcion]
    );
    return r.insertId;
  }

  static async registrarMovimiento(d) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [categorias] = await connection.execute('SELECT tipo FROM categoria_finanza WHERE id_categoria = ?', [d.categoria_id]);
      if (!categorias.length) throw new Error('Categoría financiera inexistente.');

      if (d.contrato_id) {
        if (categorias[0].tipo !== 'INGRESO') throw new Error('Solo los ingresos pueden vincularse a un contrato.');
        const [contratos] = await connection.execute('SELECT estado FROM contrato WHERE id_contrato = ? FOR UPDATE', [d.contrato_id]);
        if (!contratos.length) throw new Error('El contrato indicado no existe.');
        if (contratos[0].estado === 'CANCELADO') throw new Error('No se pueden registrar ingresos en un contrato cancelado.');
      }

      const [r] = await connection.execute(
        'INSERT INTO finanza (categoria_id, contrato_id, monto, fecha, descripcion) VALUES (?, ?, ?, ?, ?)',
        [d.categoria_id, d.contrato_id, d.monto, d.fecha, d.descripcion]
      );
      await connection.commit();
      return r.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listarMovimientos(filtros) {
    const { where, args } = construirFiltros(filtros);
    const [rows] = await pool.execute(
      `SELECT f.id_movimiento, cf.nombre AS categoria, cf.tipo, f.monto, f.fecha, f.descripcion, f.contrato_id, a.cliente_id
       ${FROM_MOVIMIENTOS} ${where}
       ORDER BY f.fecha DESC, f.id_movimiento DESC`,
      args
    );
    return rows;
  }

  static async balance(filtros) {
    const { where, args } = construirFiltros(filtros);
    const [rows] = await pool.execute(`SELECT cf.tipo, SUM(f.monto) AS total ${FROM_MOVIMIENTOS} ${where} GROUP BY cf.tipo`, args);
    const totales = { ingresos: 0, egresos: 0 };
    for (const row of rows) totales[row.tipo === 'INGRESO' ? 'ingresos' : 'egresos'] = Number(row.total);
    totales.balance = totales.ingresos - totales.egresos;
    return totales;
  }

  static async listarCategorias() {
    const [rows] = await pool.query('SELECT id_categoria, nombre, tipo FROM categoria_finanza ORDER BY tipo, nombre');
    return rows;
  }
}
