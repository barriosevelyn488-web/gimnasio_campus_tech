import { ContratoController } from '../controladores/ContratoController.js';
import { validarEnteroPositivo, validarMonto, validarRangoFechas } from '../utils/validators.js';

export class ContratoService {
  static finalizar(id) {
    return ContratoController.cambiarEstado(validarEnteroPositivo(id, 'Contrato'), 'FINALIZADO');
  }

  static cancelar(id, motivo) {
    if (!motivo?.trim()) throw new Error('Indica el motivo de cancelación.');
    return ContratoController.cambiarEstado(validarEnteroPositivo(id, 'Contrato'), 'CANCELADO', motivo.trim());
  }

  static renovar(id, d) {
    const monto = validarMonto(d.monto, true);
    const { desde, hasta } = validarRangoFechas(d.fecha_inicio, d.fecha_fin, 'El periodo de renovación');
    return ContratoController.renovar(validarEnteroPositivo(id, 'Contrato'), desde, hasta, monto, d.condiciones?.trim() || 'Renovación de contrato', Boolean(d.registrar_pago));
  }
}
