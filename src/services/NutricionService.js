import { NutricionController } from '../controladores/NutricionController.js';
import { diaSemanaDeFecha, validarEnteroPositivo, validarFecha, validarNoVacio, validarRangoFechas } from '../utils/validators.js';

const ESTADOS = ['ACTIVO', 'FINALIZADO', 'CANCELADO'];
const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

export class NutricionService {
  static validarPlan(d) {
    if (!d.descripcion?.trim()) throw new Error('La descripción es obligatoria.');
    const { desde, hasta } = validarRangoFechas(d.fecha_inicio, d.fecha_fin, 'El periodo del plan');
    const estado = d.estado ?? 'ACTIVO';
    if (!ESTADOS.includes(estado)) throw new Error('Estado nutricional no válido.');
    return {
      cliente_id: validarEnteroPositivo(d.cliente_id, 'Cliente'),
      plan_entrenamiento_id: validarEnteroPositivo(d.plan_entrenamiento_id, 'Plan de entrenamiento'),
      descripcion: d.descripcion.trim(),
      calorias_estimadas: validarEnteroPositivo(d.calorias_estimadas, 'Calorías'),
      fecha_inicio: desde,
      fecha_fin: hasta,
      estado
    };
  }

  static crearPlan(d) {
    return NutricionController.registrarPlanNutricional(NutricionService.validarPlan(d));
  }

  static obtenerPlanes() {
    return NutricionController.listarPlanesNutricionales();
  }

  static actualizarPlan(id, d) {
    return NutricionController.actualizarPlanNutricional(validarEnteroPositivo(id, 'Plan nutricional'), NutricionService.validarPlan(d));
  }

  static registrarComida(d) {
    const fecha = validarFecha(d.fecha);
    const diaSemana = validarNoVacio(d.dia_semana)
      ? String(d.dia_semana).trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : diaSemanaDeFecha(fecha);
    if (!DIAS.includes(diaSemana)) throw new Error(`El día debe ser uno de: ${DIAS.join(', ')}.`);
    if (!d.tipo_comida?.trim()) throw new Error('El tipo de comida es obligatorio.');
    if (!Array.isArray(d.alimentos) || !d.alimentos.length) throw new Error('Registra al menos un alimento.');

    const alimentos = d.alimentos.map((a) => {
      const cantidad = Number(a.cantidad);
      const calorias = Number(a.calorias_estimadas);
      if (!a.alimento?.trim() || !a.unidad?.trim() || !(cantidad > 0) || !Number.isInteger(calorias) || calorias < 0) {
        throw new Error('Revisa alimento, cantidad, unidad y calorías.');
      }
      return { alimento: a.alimento.trim(), cantidad, unidad: a.unidad.trim(), calorias_estimadas: calorias };
    });

    return NutricionController.registrarComida({
      plan_nutricional_id: validarEnteroPositivo(d.plan_nutricional_id, 'Plan nutricional'),
      fecha,
      dia_semana: diaSemana,
      tipo_comida: d.tipo_comida.trim(),
      indicaciones: d.indicaciones?.trim() || null,
      alimentos
    });
  }

  static reporteSemanal(id, inicio, fin) {
    const { desde, hasta } = validarRangoFechas(inicio, fin, 'El rango semanal');
    return NutricionController.reporteSemanal(validarEnteroPositivo(id, 'Plan nutricional'), desde, hasta);
  }
}
