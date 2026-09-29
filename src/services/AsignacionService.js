import { AsignacionController } from '../CONTROLADORES/AsignacionController.js';

export class AsignacionService {
  static async crearAsignacionConContrato(data) {
    if (!data.cliente_id || !data.plan_entrenamiento_id || !data.monto) {
      throw new Error('Cliente, plan y monto del contrato son obligatorios.');
    }
    return await AsignacionController.registrarAsignacionYContrato(data);
  }

  static async obtenerContratos() {
    return await AsignacionController.listarContratos();
  }
}