import ClienteController from '../controladores/ClienteController.js';
import Cliente from '../models/Cliente.js';
import { validarEnteroPositivo } from '../utils/validators.js';

export default class ClienteService {
  static async registrar(data) {
    const cliente = new Cliente(data);
    const id = await ClienteController.crear(cliente);
    return { ...cliente.toJSON(), id_cliente: id };
  }

  static listarClientes() {
    return ClienteController.listar();
  }

  static async buscarClientePorId(id) {
    const idCliente = validarEnteroPositivo(id, 'El ID del cliente');
    const cliente = await ClienteController.buscarPorId(idCliente);
    if (!cliente) throw new Error(`No existe el cliente ${idCliente}.`);
    return cliente;
  }

  static async actualizarCliente(id, data) {
    const actual = await this.buscarClientePorId(id);
    return (await ClienteController.actualizar(actual.id_cliente, new Cliente(data))) > 0;
  }

  static async eliminarCliente(id) {
    const actual = await this.buscarClientePorId(id);
    return (await ClienteController.eliminar(actual.id_cliente)) > 0;
  }
}
