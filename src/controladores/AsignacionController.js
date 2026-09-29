import pool from '../config/db.js';
export class AsignacionController {
  static async registrarAsignacionYContrato(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [a] = await connection.execute('INSERT INTO asignacion_plan (cliente_id,plan_id,fecha_asignacion) VALUES (?,?,?)',[data.cliente_id,data.plan_id,data.fecha_asignacion]);
      const [p] = await connection.execute('SELECT precio,duracion_semanas FROM plan_entrenamiento WHERE id_plan=? AND activo=TRUE FOR UPDATE',[data.plan_id]);
      if (!p.length) throw new Error('El plan no existe o está inactivo.');
      const monto = data.monto === undefined || data.monto === '' ? p[0].precio : Number(data.monto);
      const fechaFin = data.fecha_fin || sumarSemanas(data.fecha_inicio, p[0].duracion_semanas);
      await connection.execute('INSERT INTO contrato (asignacion_id,monto,condiciones,fecha_inicio,fecha_fin) VALUES (?,?,?,?,?)',[a.insertId,monto,data.condiciones || 'Contrato de servicio de entrenamiento',data.fecha_inicio,fechaFin]);
      await connection.commit();
      return { id_asignacion: a.insertId };
    } catch (error) { await connection.rollback(); throw error; }
    finally { connection.release(); }
  }
  static async listarContratos() {
    const [r] = await pool.query(`SELECT c.id_contrato,cl.id_cliente,CONCAT(cl.nombre,' ',cl.apellido) cliente,p.nombre plan,c.monto,c.condiciones,c.fecha_inicio,c.fecha_fin,c.estado FROM contrato c JOIN asignacion_plan a ON a.id_asignacion=c.asignacion_id JOIN clientes cl ON cl.id_cliente=a.cliente_id JOIN plan_entrenamiento p ON p.id_plan=a.plan_id ORDER BY c.fecha_inicio DESC`); return r;
  }
}
function sumarSemanas(fecha, semanas) { const d = new Date(`${fecha}T12:00:00`); if (Number.isNaN(d.valueOf())) throw new Error('Fecha de inicio no válida.'); d.setDate(d.getDate() + Number(semanas) * 7); return d.toISOString().slice(0,10); }
