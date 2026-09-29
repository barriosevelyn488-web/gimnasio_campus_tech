import { validarEmail, validarNoVacio } from '../utils/validators.js';

export default class Cliente {
  constructor({ id_cliente, nombre, apellido, telefono = null, email, fecha_registro }) {
    if (!validarNoVacio(nombre) || !validarNoVacio(apellido)) throw new Error('Nombre y apellido son obligatorios.');
    if (!validarEmail(email)) throw new Error('El correo electrónico no tiene un formato válido.');
    this.id_cliente = id_cliente;
    this.nombre = nombre.trim();
    this.apellido = apellido.trim();
    this.telefono = telefono?.trim() || null;
    this.email = email.trim().toLowerCase();
    this.fecha_registro = fecha_registro ?? new Date();
  }
  toJSON() { return { id_cliente: this.id_cliente, nombre: this.nombre, apellido: this.apellido, telefono: this.telefono, email: this.email, fecha_registro: this.fecha_registro }; }
}
