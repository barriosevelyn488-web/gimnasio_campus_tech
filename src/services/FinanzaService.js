import { FinanzaController } from '../CONTROLADORES/FinanzaController.js';

export class FinanzaService {
  static async crearMovimiento(data) {
    if (!data.categoria_id || !data.monto || !data.fecha) {
      throw new Error('Categoría, monto y fecha son obligatorios.');
    }
    return await FinanzaController.registrarMovimiento(data);
  }

  static async obtenerMovimientos() {
    return await FinanzaController.listarMovimientos();
  }
}