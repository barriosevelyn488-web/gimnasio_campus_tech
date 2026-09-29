import ClienteRepository from '../repositories/ClienteRepository.js';
export default class ClienteController {
 static crear(c) { return ClienteRepository.crear(c); }
 static listar() { return ClienteRepository.listar(); }
 static buscarPorId(id) { return ClienteRepository.buscarPorId(id); }
 static actualizar(id,c) { return ClienteRepository.actualizar(id,c); }
 static eliminar(id) { return ClienteRepository.eliminar(id); }
}
