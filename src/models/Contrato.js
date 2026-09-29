export class Contrato {
  static validar(data) {
    const monto = Number(data.monto);
    if (!Number.isFinite(monto) || monto < 0) throw new Error('El monto debe ser válido y no negativo.');
    if (!data.fecha_inicio || !data.fecha_fin || data.fecha_fin < data.fecha_inicio) throw new Error('Las fechas del contrato no son válidas.');
    if (!data.condiciones?.trim()) throw new Error('Las condiciones del contrato son obligatorias.');
    return { ...data, monto };
  }
}
