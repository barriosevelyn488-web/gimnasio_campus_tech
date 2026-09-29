import { FinanzaController } from '../controladores/FinanzaController.js';
import { validarEnteroOpcional, validarEnteroPositivo, validarFecha, validarMonto, validarNoVacio } from '../utils/validators.js';

export class FinanzaService {
  static crearMovimiento(d) {
    if (!d.descripcion?.trim()) throw new Error('La descripción es obligatoria.');
    return FinanzaController.registrarMovimiento({
      categoria_id: validarEnteroPositivo(d.categoria_id, 'Categoría'),
      contrato_id: validarEnteroOpcional(d.contrato_id, 'Contrato'),
      monto: validarMonto(d.monto),
      fecha: validarFecha(d.fecha),
      descripcion: d.descripcion.trim()
    });
  }

  static obtenerMovimientos(filtros = {}) {
    return FinanzaController.listarMovimientos(FinanzaService.validarFiltros(filtros));
  }

  static obtenerBalance(filtros = {}) {
    return FinanzaController.balance(FinanzaService.validarFiltros(filtros));
  }

  static obtenerCategorias() {
    return FinanzaController.listarCategorias();
  }

  static validarFiltros({ desde, hasta, cliente_id } = {}) {
    const filtros = {
      desde: validarNoVacio(desde) ? validarFecha(desde, 'Desde') : null,
      hasta: validarNoVacio(hasta) ? validarFecha(hasta, 'Hasta') : null,
      cliente_id: validarEnteroOpcional(cliente_id, 'Cliente')
    };
    if (filtros.desde && filtros.hasta && filtros.hasta < filtros.desde) throw new Error('"Hasta" no puede ser anterior a "Desde".');
    return filtros;
  }
}
