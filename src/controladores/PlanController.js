import pool from '../config/db.js';
export class PlanController {
  static async listarPlanes() { const [r] = await pool.query('SELECT * FROM plan_entrenamiento WHERE activo=TRUE ORDER BY nombre'); return r; }
  static async registrarPlan(p) { const [r] = await pool.execute('INSERT INTO plan_entrenamiento (nombre,descripcion,duracion_semanas,metas_fisicas,nivel,precio) VALUES (?,?,?,?,?,?)',[p.nombre,p.descripcion ?? null,p.duracion_semanas,p.metas_fisicas,p.nivel,p.precio]); return r.insertId; }
  static async actualizarPlan(id,p) { const [r] = await pool.execute('UPDATE plan_entrenamiento SET nombre=?,descripcion=?,duracion_semanas=?,metas_fisicas=?,nivel=?,precio=? WHERE id_plan=?',[p.nombre,p.descripcion ?? null,p.duracion_semanas,p.metas_fisicas,p.nivel,p.precio,id]); return r.affectedRows; }
  static async eliminarPlan(id) { const [r] = await pool.execute('UPDATE plan_entrenamiento SET activo=FALSE WHERE id_plan=?',[id]); return r.affectedRows; }
}
