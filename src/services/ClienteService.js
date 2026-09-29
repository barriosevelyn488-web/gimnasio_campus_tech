import ClienteController from '../controladores/ClienteController.js';
import Cliente from '../models/Cliente.js';
export default class ClienteService {
  static async registrar(data) { const c = new Cliente(data); const id = await ClienteController.crear(c); return { ...c.toJSON(), id_cliente:id }; }
  static listarClientes() { return ClienteController.listar(); }
  static async buscarClientePorId(id) { const c = await ClienteController.buscarPorId(Number(id)); if (!c) throw new Error(`No existe el cliente ${id}.`); return c; }
  static async actualizarCliente(id,data) { await this.buscarClientePorId(id); return (await ClienteController.actualizar(Number(id),new Cliente(data))) > 0; }
  static async eliminarCliente(id) { await this.buscarClientePorId(id); return (await ClienteController.eliminar(Number(id))) > 0; }
}
