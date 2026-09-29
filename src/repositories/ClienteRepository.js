import BaseRepository from './BaseRepository.js';
/** Repository: mapea Cliente a la tabla clientes. */
export default class ClienteRepository extends BaseRepository {
 static async crear(c) { return (await this.execute('INSERT INTO clientes (nombre,apellido,telefono,email) VALUES (?,?,?,?)',[c.nombre,c.apellido,c.telefono,c.email])).insertId; }
 static listar() { return this.query('SELECT * FROM clientes ORDER BY apellido,nombre'); }
 static async buscarPorId(id) { return (await this.query('SELECT * FROM clientes WHERE id_cliente=?',[id]))[0] ?? null; }
 static async actualizar(id,c) { return (await this.execute('UPDATE clientes SET nombre=?,apellido=?,telefono=?,email=? WHERE id_cliente=?',[c.nombre,c.apellido,c.telefono,c.email,id])).affectedRows; }
 static async eliminar(id) { return (await this.execute('DELETE FROM clientes WHERE id_cliente=?',[id])).affectedRows; }
}
