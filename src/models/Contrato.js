export class Contrato {
    constructor(id, cliente_id, fecha_emision, valor_total, estado) {
      this.id = id;
      this.cliente_id = cliente_id;
      this.fecha_emision = fecha_emision;
      this.valor_total = valor_total;
      this.estado = estado;
    }
  }