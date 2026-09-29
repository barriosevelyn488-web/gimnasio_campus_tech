import pool from '../config/db.js';
export class FinanzaController {
  static async registrarMovimiento(d) { const connection = await pool.getConnection(); try { await connection.beginTransaction(); const [c] = await connection.execute('SELECT tipo FROM categoria_finanza WHERE id_categoria=? FOR UPDATE',[d.categoria_id]); if (!c.length) throw new Error('Categoría financiera inexistente.'); if (c[0].tipo === 'INGRESO' && !d.contrato_id && d.requiere_contrato) throw new Error('El ingreso requiere contrato.'); const [r] = await connection.execute('INSERT INTO finanza (categoria_id,contrato_id,monto,fecha,descripcion) VALUES (?,?,?,?,?)',[d.categoria_id,d.contrato_id || null,d.monto,d.fecha,d.descripcion]); await connection.commit(); return r.insertId; } catch(e) { await connection.rollback(); throw e; } finally { connection.release(); } }
  static async listarMovimientos({ desde, hasta, cliente_id } = {}) { const where = []; const args = []; if (desde) { where.push('f.fecha>=?'); args.push(desde); } if (hasta) { where.push('f.fecha<=?'); args.push(hasta); } if (cliente_id) { where.push('a.cliente_id=?'); args.push(cliente_id); } const [r] = await pool.execute(`SELECT f.id_movimiento,cf.nombre categoria,cf.tipo,f.monto,f.fecha,f.descripcion,f.contrato_id,a.cliente_id FROM finanza f JOIN categoria_finanza cf ON cf.id_categoria=f.categoria_id LEFT JOIN contrato c ON c.id_contrato=f.contrato_id LEFT JOIN asignacion_plan a ON a.id_asignacion=c.asignacion_id ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY f.fecha DESC,f.id_movimiento DESC`,args); return r; }
  static async balance({ desde, hasta, cliente_id } = {}) {
    const conditions = []; const args = [];
    if (desde) { conditions.push('f.fecha>=?'); args.push(desde); }
    if (hasta) { conditions.push('f.fecha<=?'); args.push(hasta); }
    if (cliente_id) { conditions.push('a.cliente_id=?'); args.push(cliente_id); }
    const [rows] = await pool.execute(`SELECT cf.tipo,SUM(f.monto) AS total FROM finanza f JOIN categoria_finanza cf ON cf.id_categoria=f.categoria_id LEFT JOIN contrato c ON c.id_contrato=f.contrato_id LEFT JOIN asignacion_plan a ON a.id_asignacion=c.asignacion_id ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} GROUP BY cf.tipo`,args);
    const totals = { ingresos:0, egresos:0 };
    for (const row of rows) totals[row.tipo === 'INGRESO' ? 'ingresos' : 'egresos'] = Number(row.total);
    totals.balance = totals.ingresos - totals.egresos;
    return totals;
  }
}
