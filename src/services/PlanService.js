import { PlanController } from '../controladores/PlanController.js';
import { PlanEntrenamiento } from '../models/PlanEntrenamiento.js';
import { validarEnteroPositivo } from '../utils/validators.js';
export class PlanService {
  static obtenerPlanes() { return PlanController.listarPlanes(); }
  static crearPlan(data) { return PlanController.registrarPlan(PlanEntrenamiento.validar(data)); }
  static actualizarPlan(id,data) { return PlanController.actualizarPlan(validarEnteroPositivo(id,'Plan'),PlanEntrenamiento.validar(data)); }
  static eliminarPlan(id) { return PlanController.eliminarPlan(validarEnteroPositivo(id,'Plan')); }
}
