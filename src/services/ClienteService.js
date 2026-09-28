import ClienteController from '../CONTROLADORES/ClienteController.js';
import Cliente from '../models/Cliente.js';

export default class ClienteService {
  static async registrarCliente(datosCliente) {
    // Aplicar lógica de negocio y validación mediante el modelo
    const nuevoCliente = new Cliente(datosCliente);
    
    // Delegar persistencia al controlador/repositorio
    const id = await ClienteController.crear(nuevoCliente);
    return { id_cliente: id, ...nuevoCliente.toJSON() };
  }

  static async obtenerClientes() {
    return await ClienteController.listar();
  }

  static async obtenerClientePorId(id) {
    const cliente = await ClienteController.buscarPorId(id);
    if (!cliente) {
      throw new Error(`El cliente con ID ${id} no existe.`);
    }
    return cliente;
  }
}