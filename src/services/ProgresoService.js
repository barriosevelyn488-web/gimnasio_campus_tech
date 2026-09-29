import { ProgresoController } from '../controladores/ProgresoController.js';
import { validarEnteroPositivo, validarFecha, validarNoVacio, parsearJsonOpcional } from '../utils/validators.js';

export class ProgresoService {
  static crearProgreso(d) {
    const peso = Number(d.peso);
    if (!Number.isFinite(peso) || peso <= 0) throw new Error('El peso debe ser mayor que cero.');

    let porcentajeGrasa = null;
    if (validarNoVacio(d.porcentaje_grasa)) {
      porcentajeGrasa = Number(d.porcentaje_grasa);
      if (!Number.isFinite(porcentajeGrasa) || porcentajeGrasa < 0 || porcentajeGrasa > 100) {
        throw new Error('El porcentaje de grasa debe estar entre 0 y 100.');
      }
    }

    const medidas = parsearJsonOpcional(d.medidas, 'Medidas');
    for (const m of medidas) {
      if (!m.tipo || !m.unidad || !Number.isFinite(Number(m.valor)) || Number(m.valor) <= 0) {
        throw new Error('Cada medida requiere tipo, valor positivo y unidad.');
      }
    }

    const fotos = parsearJsonOpcional(d.fotos, 'Fotos');
    if (fotos.some((url) => typeof url !== 'string' || !url.trim())) throw new Error('Cada foto debe ser una URL en texto.');

    return ProgresoController.registrarProgreso({
      cliente_id: validarEnteroPositivo(d.cliente_id, 'Cliente'),
      peso,
      porcentaje_grasa: porcentajeGrasa,
      comentarios: d.comentarios?.trim() || null,
      fecha_registro: validarFecha(d.fecha_registro),
      medidas,
      fotos
    });
  }

  static obtenerProgresoCliente(id) {
    return ProgresoController.listarProgresoPorCliente(validarEnteroPositivo(id, 'Cliente'));
  }

  static eliminar(id) {
    return ProgresoController.eliminar(validarEnteroPositivo(id, 'Progreso'));
  }
}
