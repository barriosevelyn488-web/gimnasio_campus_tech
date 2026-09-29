const NIVELES = new Set(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO']);
export class PlanEntrenamiento {
  constructor(data) {
    const duracion = Number(data.duracion_semanas);
    const precio = Number(data.precio);
    const nivel = String(data.nivel ?? '').toUpperCase();
    if (!data.nombre?.trim() || !data.metas_fisicas?.trim()) throw new Error('Nombre y metas físicas son obligatorios.');
    if (!Number.isInteger(duracion) || duracion <= 0) throw new Error('La duración debe ser un entero positivo.');
    if (!NIVELES.has(nivel)) throw new Error('El nivel debe ser PRINCIPIANTE, INTERMEDIO o AVANZADO.');
    if (!Number.isFinite(precio) || precio < 0) throw new Error('El precio debe ser un número igual o mayor que cero.');
    Object.assign(this, { ...data, nombre: data.nombre.trim(), duracion_semanas: duracion, nivel, precio });
  }
  static validar(data) { return new PlanEntrenamiento(data); }
}
