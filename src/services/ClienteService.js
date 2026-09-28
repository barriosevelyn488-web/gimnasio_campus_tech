import ClienteController from '../controladores/ClienteController.js';
import Cliente from '../models/Cliente.js';

export default class ClienteService {
  static async registrar(datosCliente) {
    const cliente = new Cliente(datosCliente);
    const id = await ClienteController.crear(cliente);
    return { id_cliente: id, ...cliente.toJSON() };
  }

  static async listarClientes() {
    return await ClienteController.listar();
  }

  static async buscarClientePorId(id) {
    const cliente = await ClienteController.buscarPorId(id);
    if (!cliente) {
      throw new Error(`No se encontró ningún cliente con el ID ${id}.`);
    }
    return cliente;
  }

  static async actualizarCliente(id, datosCliente) {
    await this.buscarClientePorId(id);
    const clienteActualizado = new Cliente(datosCliente);
    const affectedRows = await ClienteController.actualizar(id, clienteActualizado);
    return affectedRows > 0;
  }

  static async eliminarCliente(id) {
    await this.buscarClientePorId(id);
    const affectedRows = await ClienteController.eliminar(id);
    return affectedRows > 0;
  }
}