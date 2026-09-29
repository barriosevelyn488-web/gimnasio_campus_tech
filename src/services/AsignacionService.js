import { AsignacionController } from '../controladores/AsignacionController.js';
import { validarEnteroPositivo, validarMonto } from '../utils/validators.js';
export class AsignacionService {
  static crearAsignacionConContrato(d) { return AsignacionController.registrarAsignacionYContrato({ ...d, cliente_id:validarEnteroPositivo(d.cliente_id,'Cliente'), plan_id:validarEnteroPositivo(d.plan_id ?? d.plan_entrenamiento_id,'Plan'), monto:d.monto === '' || d.monto === undefined ? undefined : validarMonto(d.monto,true) }); }
  static obtenerContratos() { return AsignacionController.listarContratos(); }
}
