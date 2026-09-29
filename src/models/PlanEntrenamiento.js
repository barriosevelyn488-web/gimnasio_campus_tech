export class PlanEntrenamiento {
    constructor(id, nombre, descripcion, duracion_semanas) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.duracion_semanas = duracion_semanas;
    }
  
    static validar(data) {
      if (!data.nombre || !data.duracion_semanas) {
        throw new Error('El nombre y la duración en semanas son obligatorios.');
      }
    }
  }