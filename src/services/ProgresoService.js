import { ProgresoController } from '../controladores/ProgresoController.js';
import { validarEnteroPositivo } from '../utils/validators.js';
export class ProgresoService {
  static async crearProgreso(d) { const peso=Number(d.peso); if (!Number.isFinite(peso)||peso<=0) throw new Error('El peso debe ser mayor que cero.'); if (d.porcentaje_grasa!=='' && d.porcentaje_grasa!=null && (Number(d.porcentaje_grasa)<0||Number(d.porcentaje_grasa)>100)) throw new Error('El porcentaje de grasa debe estar entre 0 y 100.'); if (!d.fecha_registro) throw new Error('La fecha es obligatoria.');
    for (const m of (typeof d.medidas==='string' ? JSON.parse(d.medidas) : d.medidas ?? [])) if(!m.tipo||!m.unidad||!Number.isFinite(Number(m.valor))||Number(m.valor)<=0) throw new Error('Cada medida requiere tipo, valor positivo y unidad.'); return ProgresoController.registrarProgreso({ ...d,cliente_id:validarEnteroPositivo(d.cliente_id,'Cliente'),peso,porcentaje_grasa:d.porcentaje_grasa === '' ? null : d.porcentaje_grasa,medidas:d.medidas ? (typeof d.medidas === 'string' ? JSON.parse(d.medidas) : d.medidas) : [],fotos:d.fotos ? (typeof d.fotos === 'string' ? JSON.parse(d.fotos) : d.fotos) : [] }); }
  static obtenerProgresoCliente(id) { return ProgresoController.listarProgresoPorCliente(validarEnteroPositivo(id,'Cliente')); }
  static eliminar(id) { return ProgresoController.eliminar(validarEnteroPositivo(id,'Progreso')); }
}
