import { DetallePlanController } from '../controladores/DetallePlanController.js';
import { validarEnteroPositivo } from '../utils/validators.js';

export class DetallePlanService {
  static obtenerPaquetes() {
    return DetallePlanController.listar();
  }

  static crearPaquete(d) {
    return DetallePlanController.registrar({
      plan_nutricional_id: validarEnteroPositivo(d.plan_nutricional_id, 'Plan nutricional'),
      observaciones: d.observaciones?.trim() || null
    });
  }

  static actualizarObservaciones(id, observaciones) {
    return DetallePlanController.actualizarObservaciones(validarEnteroPositivo(id, 'Paquete'), observaciones?.trim() || null);
  }

  static eliminarPaquete(id) {
    return DetallePlanController.eliminar(validarEnteroPositivo(id, 'Paquete'));
  }
}
