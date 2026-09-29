import pool from '../config/db.js';
export class ProgresoController {
  static async registrarProgreso(d) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [r] = await connection.execute('INSERT INTO progreso_fisico (cliente_id,peso,porcentaje_grasa,comentarios,fecha_registro) VALUES (?,?,?,?,?)',[d.cliente_id,d.peso,d.porcentaje_grasa,d.comentarios || null,d.fecha_registro]);
      for (const m of d.medidas ?? []) await connection.execute('INSERT INTO medida_corporal (progreso_id,tipo,valor,unidad) VALUES (?,?,?,?)',[r.insertId,m.tipo,m.valor,m.unidad]);
      for (const url of d.fotos ?? []) await connection.execute('INSERT INTO foto_progreso (progreso_id,url) VALUES (?,?)',[r.insertId,url]);
      await connection.commit(); return r.insertId;
    } catch(e) { await connection.rollback(); throw e; } finally { connection.release(); }
  }
  static async listarProgresoPorCliente(id) {
    const [rows] = await pool.execute('SELECT * FROM progreso_fisico WHERE cliente_id=? ORDER BY fecha_registro,id_progreso',[id]);
    for (const row of rows) {
      const [medidas] = await pool.execute('SELECT tipo,valor,unidad FROM medida_corporal WHERE progreso_id=? ORDER BY id_medida',[row.id_progreso]);
      const [fotos] = await pool.execute('SELECT url FROM foto_progreso WHERE progreso_id=? ORDER BY id_foto',[row.id_progreso]);
      row.medidas = medidas; row.fotos = fotos.map(x=>x.url);
    }
    return rows;
  }
  static async eliminar(id) { const [r] = await pool.execute('DELETE FROM progreso_fisico WHERE id_progreso=?',[id]); return r.affectedRows; }
}
