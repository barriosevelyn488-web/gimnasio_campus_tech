import pool from '../config/db.js';
export class ContratoController {
  static async cambiarEstado(id, estado, motivo = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute('SELECT asignacion_id,estado FROM contrato WHERE id_contrato=? FOR UPDATE',[id]);
      if (!rows.length) throw new Error('Contrato no encontrado.');
      if (rows[0].estado !== 'ACTIVO') throw new Error('Solo se puede modificar un contrato activo.');
      await connection.execute('UPDATE contrato SET estado=?,cancelacion_motivo=? WHERE id_contrato=?',[estado,motivo,id]);
      await connection.execute('UPDATE asignacion_plan SET estado=? WHERE id_asignacion=?',[estado === 'CANCELADO' ? 'CANCELADA' : 'FINALIZADA',rows[0].asignacion_id]);
      await connection.commit(); return true;
    } catch (e) { await connection.rollback(); throw e; } finally { connection.release(); }
  }
  static async renovar(id, fechaInicio, fechaFin, monto, condiciones) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute('SELECT a.cliente_id,a.plan_id,c.estado FROM contrato c JOIN asignacion_plan a ON a.id_asignacion=c.asignacion_id WHERE c.id_contrato=? FOR UPDATE',[id]);
      if (!rows.length || rows[0].estado !== 'ACTIVO') throw new Error('Se requiere un contrato activo para renovarlo.');
      const [a] = await connection.execute('INSERT INTO asignacion_plan (cliente_id,plan_id,fecha_asignacion) VALUES (?,?,?)',[rows[0].cliente_id,rows[0].plan_id,fechaInicio]);
      const [result] = await connection.execute('INSERT INTO contrato (asignacion_id,monto,condiciones,fecha_inicio,fecha_fin) VALUES (?,?,?,?,?)',[a.insertId,monto,condiciones,fechaInicio,fechaFin]);
      await connection.execute("UPDATE contrato SET estado='RENOVADO' WHERE id_contrato=?",[id]);
      await connection.execute("UPDATE asignacion_plan SET estado='FINALIZADA' WHERE id_asignacion=(SELECT asignacion_id FROM contrato WHERE id_contrato=?)",[id]);
      await connection.commit(); return result.insertId;
    } catch(e) { await connection.rollback(); throw e; } finally { connection.release(); }
  }
}
