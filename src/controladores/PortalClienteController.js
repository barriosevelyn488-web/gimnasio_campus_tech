import pool from '../config/db.js';

export class PortalClienteController {
  static async buscarCliente(identificador) {
    const [rows] = await pool.execute(
      'SELECT id_cliente, nombre, apellido, email FROM clientes WHERE id_cliente = ? OR email = ?',
      [Number(identificador) || 0, identificador]
    );
    return rows[0] ?? null;
  }

  static async asignacionActiva(clienteId) {
    const [rows] = await pool.execute(
      `SELECT a.id_asignacion, a.plan_id, p.nombre AS plan, a.detalle_plan_id,
              d.plan_nutricional_id, n.descripcion AS plan_nutricional,
              c.id_contrato, c.fecha_inicio, c.fecha_fin, c.estado AS estado_contrato
       FROM asignacion_plan a
       JOIN plan_entrenamiento p ON p.id_plan = a.plan_id
       LEFT JOIN detalle_plan d ON d.id_detalle_plan = a.detalle_plan_id
       LEFT JOIN plan_nutricional n ON n.id_plan_nutricional = d.plan_nutricional_id
       LEFT JOIN contrato c ON c.asignacion_id = a.id_asignacion
       WHERE a.cliente_id = ? AND a.estado = 'ACTIVA'
       ORDER BY a.fecha_asignacion DESC, a.id_asignacion DESC
       LIMIT 1`,
      [clienteId]
    );
    return rows[0] ?? null;
  }

  static async rutinasActivas(planId) {
    const [rows] = await pool.execute(
      "SELECT id_rutina, nombre, descripcion FROM rutina WHERE plan_id = ? AND estado = 'ACTIVA' ORDER BY nombre",
      [planId]
    );
    return rows;
  }

  static async comidas(planNutricionalId) {
    const [rows] = await pool.execute(
      `SELECT c.fecha, c.dia_semana, c.tipo_comida, c.indicaciones,
              GROUP_CONCAT(CONCAT(dc.alimento, ' ', dc.cantidad + 0, ' ', dc.unidad) ORDER BY dc.id_detalle SEPARATOR ', ') AS alimentos,
              COALESCE(SUM(dc.calorias_estimadas), 0) AS calorias
       FROM comida_nutricional c
       LEFT JOIN detalle_comida dc ON dc.comida_id = c.id_comida
       WHERE c.plan_nutricional_id = ?
       GROUP BY c.id_comida
       ORDER BY c.fecha, c.id_comida`,
      [planNutricionalId]
    );
    return rows;
  }

  static async contratos(clienteId) {
    const [rows] = await pool.execute(
      `SELECT c.id_contrato, p.nombre AS plan, c.monto, c.fecha_inicio, c.fecha_fin, c.estado
       FROM contrato c
       JOIN asignacion_plan a ON a.id_asignacion = c.asignacion_id
       JOIN plan_entrenamiento p ON p.id_plan = a.plan_id
       WHERE a.cliente_id = ?
       ORDER BY c.fecha_inicio DESC`,
      [clienteId]
    );
    return rows;
  }
}
