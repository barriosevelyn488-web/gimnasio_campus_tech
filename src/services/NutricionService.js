import { NutricionController } from '../CONTROLADORES/NutricionController.js';

export class NutricionService {
  static async crearPlan(data) {
    if (!data.nombre || !data.calorias_diarias) {
      throw new Error('El nombre y las calorías diarias son obligatorios.');
    }
    return await NutricionController.registrarPlanNutricional(data);
  }

  static async obtenerPlanes() {
    return await NutricionController.listarPlanesNutricionales();
  }
}