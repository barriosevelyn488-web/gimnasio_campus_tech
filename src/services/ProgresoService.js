import { ProgresoController } from '../CONTROLADORES/ProgresoController.js';

export class ProgresoService {
  static async crearProgreso(data) {
    if (!data.cliente_id || !data.peso || !data.fecha_registro) {
      throw new Error('Cliente, peso y fecha de registro son obligatorios.');
    }
    return await ProgresoController.registrarProgreso(data);
  }

  static async obtenerProgresoCliente(cliente_id) {
    if (!cliente_id) throw new Error('El ID del cliente es obligatorio.');
    return await ProgresoController.listarProgresoPorCliente(cliente_id);
  }
}