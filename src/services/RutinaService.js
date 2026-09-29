import { RutinaController } from '../controladores/RutinaController.js';
import { validarEnteroOpcional, validarEnteroPositivo } from '../utils/validators.js';

const ESTADOS = ['ACTIVA', 'INACTIVA'];

export class RutinaService {
  static validar(d) {
    if (!d.nombre?.trim()) throw new Error('El nombre de la rutina es obligatorio.');
    return { nombre: d.nombre.trim(), descripcion: d.descripcion?.trim() || null };
  }

  static obtenerRutinas(planId) {
    return RutinaController.listar(validarEnteroOpcional(planId, 'Plan'));
  }

  static crearRutina(d) {
    return RutinaController.registrar({ plan_id: validarEnteroPositivo(d.plan_id, 'Plan'), ...RutinaService.validar(d) });
  }

  static actualizarRutina(id, d) {
    const estado = d.estado ?? 'ACTIVA';
    if (!ESTADOS.includes(estado)) throw new Error('El estado debe ser ACTIVA o INACTIVA.');
    return RutinaController.actualizar(validarEnteroPositivo(id, 'Rutina'), { ...RutinaService.validar(d), estado });
  }

  static desactivarRutina(id) {
    return RutinaController.desactivar(validarEnteroPositivo(id, 'Rutina'));
  }
}
