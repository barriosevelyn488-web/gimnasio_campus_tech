import pool from '../config/db.js';
export class SeguimientoController {
  static async registrarSeguimiento(d) { const [r] = await pool.execute('INSERT INTO seguimiento_cliente (cliente_id,asignacion_id,progreso_id,plan_nutricional_id,fecha,observaciones) VALUES (?,?,?,?,?,?)',[d.cliente_id,d.asignacion_id || null,d.progreso_id || null,d.plan_nutricional_id || null,d.fecha,d.observaciones || d.observacion]); return r.insertId; }
  static async listarSeguimientosCliente(id) { const [r] = await pool.execute('SELECT s.*,p.peso,p.porcentaje_grasa,n.descripcion plan_nutricional FROM seguimiento_cliente s LEFT JOIN progreso_fisico p ON p.id_progreso=s.progreso_id LEFT JOIN plan_nutricional n ON n.id_plan_nutricional=s.plan_nutricional_id WHERE s.cliente_id=? ORDER BY s.fecha,s.id_seguimiento',[id]); return r; }
}
