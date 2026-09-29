import { ContratoController } from '../controladores/ContratoController.js';
import { validarEnteroPositivo, validarMonto } from '../utils/validators.js';
export class ContratoService {
  static finalizar(id) { return ContratoController.cambiarEstado(validarEnteroPositivo(id,'Contrato'),'FINALIZADO'); }
  static cancelar(id,motivo) { if (!motivo?.trim()) throw new Error('Indica el motivo de cancelación.'); return ContratoController.cambiarEstado(validarEnteroPositivo(id,'Contrato'),'CANCELADO',motivo.trim()); }
  static renovar(id,d) { const monto=validarMonto(d.monto,true); if (!d.fecha_inicio || !d.fecha_fin || d.fecha_fin < d.fecha_inicio) throw new Error('Fechas de renovación inválidas.'); return ContratoController.renovar(validarEnteroPositivo(id,'Contrato'),d.fecha_inicio,d.fecha_fin,monto,d.condiciones || 'Renovación de contrato'); }
}
