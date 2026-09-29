import { PlanController } from '../controladores/PlanController.js';
import { PlanEntrenamiento } from '../models/PlanEntrenamiento.js';
export class PlanService {
  static obtenerPlanes() { return PlanController.listarPlanes(); }
  static crearPlan(data) { return PlanController.registrarPlan(PlanEntrenamiento.validar(data)); }
  static actualizarPlan(id,data) { return PlanController.actualizarPlan(Number(id),PlanEntrenamiento.validar(data)); }
  static eliminarPlan(id) { return PlanController.eliminarPlan(Number(id)); }
}
