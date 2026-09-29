import { SeguimientoController } from '../CONTROLADORES/SeguimientoController.js';

export class SeguimientoService {
  static async crearSeguimiento(data) {
    if (!data.cliente_id || !data.observacion || !data.fecha) {
      throw new Error('Cliente, observación y fecha son obligatorios.');
    }
    return await SeguimientoController.registrarSeguimiento(data);
  }

  static async obtenerSeguimientos(cliente_id) {
    if (!cliente_id) throw new Error('El ID del cliente es obligatorio.');
    return await SeguimientoController.listarSeguimientosCliente(cliente_id);
  }
}