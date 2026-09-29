import { FinanzaController } from '../controladores/FinanzaController.js';
import { validarEnteroPositivo, validarMonto } from '../utils/validators.js';
export class FinanzaService {
  static crearMovimiento(d) { if(!d.fecha||!d.descripcion?.trim()) throw new Error('Fecha y descripción son obligatorias.'); return FinanzaController.registrarMovimiento({ ...d,categoria_id:validarEnteroPositivo(d.categoria_id,'Categoría'),contrato_id:d.contrato_id?validarEnteroPositivo(d.contrato_id,'Contrato'):null,monto:validarMonto(d.monto) }); }
  static obtenerMovimientos(filtros) { return FinanzaController.listarMovimientos(filtros); }
  static obtenerBalance(filtros) { return FinanzaController.balance(filtros); }
}
