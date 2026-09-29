import inquirer from 'inquirer';
import chalk from 'chalk';
import ClienteService from '../services/ClienteService.js';
import { pausar, mostrarError } from '../utils/consola.js';

const preguntasCliente = (prefijo = '') => [
  { type: 'input', name: 'nombre', message: `${prefijo}Nombre:` },
  { type: 'input', name: 'apellido', message: `${prefijo}Apellido:` },
  { type: 'input', name: 'email', message: `${prefijo}Correo electrónico:` },
  { type: 'input', name: 'telefono', message: `${prefijo}Teléfono (opcional):` }
];

export default class ClienteMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN DE CLIENTES ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar clientes', value: 'listar' },
            { name: '2. Registrar nuevo cliente', value: 'registrar' },
            { name: '3. Buscar cliente por ID', value: 'buscar' },
            { name: '4. Actualizar cliente', value: 'actualizar' },
            { name: '5. Eliminar cliente', value: 'eliminar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        switch (opcion) {
          case 'listar': {
            console.log(chalk.green('\n--- Lista de Clientes ---'));
            console.table(await ClienteService.listarClientes());
            break;
          }
          case 'registrar': {
            const creado = await ClienteService.registrar(await inquirer.prompt(preguntasCliente()));
            console.log(chalk.green(`\n¡Cliente registrado con éxito! ID: ${creado.id_cliente}`));
            break;
          }
          case 'buscar': {
            const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'Ingrese el ID del cliente:' }]);
            console.log(chalk.green('\n--- Cliente Encontrado ---'));
            console.table([await ClienteService.buscarClientePorId(id)]);
            break;
          }
          case 'actualizar': {
            const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del cliente a actualizar:' }]);
            const actual = await ClienteService.buscarClientePorId(id);
            const datos = await inquirer.prompt([
              { type: 'input', name: 'nombre', message: 'Nuevo nombre:', default: actual.nombre },
              { type: 'input', name: 'apellido', message: 'Nuevo apellido:', default: actual.apellido },
              { type: 'input', name: 'email', message: 'Nuevo correo:', default: actual.email },
              { type: 'input', name: 'telefono', message: 'Nuevo teléfono:', default: actual.telefono ?? '' }
            ]);
            await ClienteService.actualizarCliente(id, datos);
            console.log(chalk.green('\n¡Cliente actualizado correctamente!'));
            break;
          }
          case 'eliminar': {
            const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del cliente a eliminar:' }]);
            const { confirmar } = await inquirer.prompt([{ type: 'confirm', name: 'confirmar', message: '¿Seguro que deseas eliminarlo?', default: false }]);
            if (confirmar) {
              await ClienteService.eliminarCliente(id);
              console.log(chalk.red('\n¡Cliente eliminado correctamente!'));
            }
            break;
          }
          case 'salir':
            salir = true;
            break;
        }
      } catch (error) {
        mostrarError(error);
      }

      if (!salir) await pausar();
    }
  }
}
