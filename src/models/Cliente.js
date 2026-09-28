export default class Cliente {
    constructor({ id_cliente, nombre, apellido, telefono, email, fecha_registro }) {
      this.id_cliente = id_cliente;
      this.nombre = this.validarTexto(nombre, "El nombre del cliente no puede estar vacío.");
      this.apellido = this.validarTexto(apellido, "El apellido del cliente no puede estar vacío.");
      this.telefono = telefono;
      this.email = email;
      this.fecha_registro = fecha_registro || new Date();
    }
  
    validarTexto(valor, mensajeError) {
      if (!valor || valor.trim() === "") {
        throw new Error(mensajeError);
      }
      return valor.trim();
    }
  
    toJSON() {
      return {
        id_cliente: this.id_cliente,
        nombre: this.nombre,
        apellido: this.apellido,
        telefono: this.telefono,
        email: this.email,
        fecha_registro: this.fecha_registro
      };
    }
  }