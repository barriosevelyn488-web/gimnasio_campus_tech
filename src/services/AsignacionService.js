import { AsignacionController } from '../controladores/AsignacionController.js';
import { validarEnteroOpcional, validarEnteroPositivo, validarFecha, validarMonto, validarNoVacio } from '../utils/validators.js';

export class AsignacionService {
  static crearAsignacionConContrato(d) {
    const fechaInicio = validarFecha(d.fecha_inicio, 'La fecha de inicio');
    const fechaAsignacion = validarNoVacio(d.fecha_asignacion) ? validarFecha(d.fecha_asignacion, 'La fecha de asignación') : fechaInicio;
    const fechaFin = validarNoVacio(d.fecha_fin) ? validarFecha(d.fecha_fin, 'La fecha de fin') : null;
    if (fechaFin && fechaFin < fechaInicio) throw new Error('La fecha de fin no puede ser anterior a la de inicio.');
    if (!validarNoVacio(d.plan_id ?? d.plan_entrenamiento_id) && !validarNoVacio(d.detalle_plan_id)) {
      throw new Error('Indica el ID del plan o el ID del paquete.');
    }

    return AsignacionController.registrarAsignacionYContrato({
      cliente_id: validarEnteroPositivo(d.cliente_id, 'Cliente'),
      plan_id: validarEnteroOpcional(d.plan_id ?? d.plan_entrenamiento_id, 'Plan'),
      detalle_plan_id: validarEnteroOpcional(d.detalle_plan_id, 'Paquete'),
      fecha_asignacion: fechaAsignacion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      monto: validarNoVacio(d.monto) ? validarMonto(d.monto, true) : undefined,
      condiciones: d.condiciones?.trim() || null,
      registrar_pago: Boolean(d.registrar_pago)
    });
  }

  static obtenerContratos() {
    return AsignacionController.listarContratos();
  }
}
