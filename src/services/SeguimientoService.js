import { SeguimientoController } from '../controladores/SeguimientoController.js';
import { validarEnteroPositivo } from '../utils/validators.js';
export class SeguimientoService {
  static crearSeguimiento(d) { if (!(d.observaciones || d.observacion)?.trim() || !d.fecha) throw new Error('Observación y fecha son obligatorias.'); return SeguimientoController.registrarSeguimiento({ ...d,cliente_id:validarEnteroPositivo(d.cliente_id,'Cliente') }); }
  static obtenerSeguimientos(id) { return SeguimientoController.listarSeguimientosCliente(validarEnteroPositivo(id,'Cliente')); }
}
