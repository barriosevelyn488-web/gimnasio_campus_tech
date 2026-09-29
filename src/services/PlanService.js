import { PlanController } from '../CONTROLADORES/PlanController.js';
import { PlanEntrenamiento } from '../models/PlanEntrenamiento.js';

export class PlanService {
  static async obtenerPlanes() {
    try {
      return await PlanController.listarPlanes();
    } catch (error) {
      throw new Error(`Error en servicio al listar planes: ${error.message}`);
    }
  }

  static async crearPlan(data) {
    PlanEntrenamiento.validar(data);
    try {
      return await PlanController.registrarPlan(data);
    } catch (error) {
      throw new Error(`Error en servicio al registrar plan: ${error.message}`);
    }
  }
}