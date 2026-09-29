import pool from '../config/db.js';
export class NutricionController {
  static async registrarPlanNutricional(d) { const [r] = await pool.execute('INSERT INTO plan_nutricional (cliente_id,plan_entrenamiento_id,descripcion,calorias_estimadas,fecha_inicio,fecha_fin,estado) VALUES (?,?,?,?,?,?,?)',[d.cliente_id,d.plan_entrenamiento_id,d.descripcion,d.calorias_estimadas,d.fecha_inicio,d.fecha_fin,d.estado || 'ACTIVO']); return r.insertId; }
  static async listarPlanesNutricionales() {
    const [r] = await pool.query(`SELECT n.*,CONCAT(c.nombre,' ',c.apellido) AS cliente,p.nombre AS plan_entrenamiento FROM plan_nutricional n JOIN clientes c ON c.id_cliente=n.cliente_id JOIN plan_entrenamiento p ON p.id_plan=n.plan_entrenamiento_id ORDER BY n.fecha_inicio DESC`);
    return r;
  }
  static async registrarComida(d) { const connection = await pool.getConnection(); try { await connection.beginTransaction(); const [r] = await connection.execute('INSERT INTO comida_nutricional (plan_nutricional_id,fecha,dia_semana,tipo_comida,indicaciones) VALUES (?,?,?,?,?)',[d.plan_nutricional_id,d.fecha,d.dia_semana,d.tipo_comida,d.indicaciones || null]); for (const item of d.alimentos) await connection.execute('INSERT INTO detalle_comida (comida_id,alimento,cantidad,unidad,calorias_estimadas) VALUES (?,?,?,?,?)',[r.insertId,item.alimento,item.cantidad,item.unidad,item.calorias_estimadas]); await connection.commit(); return r.insertId; } catch(e) { await connection.rollback(); throw e; } finally { connection.release(); } }
  static async reporteSemanal(id, inicio, fin) { const [r] = await pool.execute('SELECT c.fecha,c.dia_semana,c.tipo_comida,d.alimento,d.cantidad,d.unidad,d.calorias_estimadas FROM comida_nutricional c JOIN detalle_comida d ON d.comida_id=c.id_comida JOIN plan_nutricional n ON n.id_plan_nutricional=c.plan_nutricional_id WHERE n.id_plan_nutricional=? AND c.fecha BETWEEN ? AND ? ORDER BY c.fecha,c.id_comida,d.id_detalle',[id,inicio,fin]); return r; }
}
