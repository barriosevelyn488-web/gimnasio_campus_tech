import { SeguimientoController } from '../controladores/SeguimientoController.js';
import { validarEnteroOpcional, validarEnteroPositivo, validarFecha, validarPorcentajeOpcional } from '../utils/validators.js';

const ROLES = ['ENTRENADOR', 'CLIENTE'];

export class SeguimientoService {
  static crearSeguimiento(d) {
    const registradoPor = d.registrado_por ?? 'ENTRENADOR';
    if (!ROLES.includes(registradoPor)) throw new Error('registrado_por debe ser ENTRENADOR o CLIENTE.');
    const observaciones = (d.observaciones ?? d.observacion)?.trim();
    if (!observaciones) throw new Error('La observación es obligatoria.');
    return SeguimientoController.registrarSeguimiento({
      cliente_id: validarEnteroPositivo(d.cliente_id, 'Cliente'),
      asignacion_id: validarEnteroOpcional(d.asignacion_id, 'Asignación'),
      progreso_id: validarEnteroOpcional(d.progreso_id, 'Progreso'),
      plan_nutricional_id: validarEnteroOpcional(d.plan_nutricional_id, 'Plan nutricional'),
      rutina_id: validarEnteroOpcional(d.rutina_id, 'Rutina'),
      fecha: validarFecha(d.fecha),
      cumplimiento_rutinas: validarPorcentajeOpcional(d.cumplimiento_rutinas, 'El cumplimiento de rutinas'),
      cumplimiento_nutricion: validarPorcentajeOpcional(d.cumplimiento_nutricion, 'El cumplimiento nutricional'),
      observaciones,
      registrado_por: registradoPor
    });
  }

  static obtenerSeguimientos(id) {
    return SeguimientoController.listarSeguimientosCliente(validarEnteroPositivo(id, 'Cliente'));
  }
}
