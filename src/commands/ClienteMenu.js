import inquirer from 'inquirer';
import chalk from 'chalk';
import ClienteService from '../services/ClienteService.js';

export default class ClienteMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN DE CLIENTES ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'list',
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
          case 'listar':
            const clientes = await ClienteService.listarClientes();
            console.log(chalk.green('\n--- Lista de Clientes ---'));
            console.table(clientes);
            break;

          case 'registrar':
            const datosNuevos = await inquirer.prompt([
              { name: 'nombre', message: 'Nombre:' },
              { name: 'apellido', message: 'Apellido:' },
              { name: 'correo', message: 'Correo electrónico:' },
              { name: 'telefono', message: 'Teléfono:' }
            ]);
            const creado = await ClienteService.registrar(datosNuevos);
            console.log(chalk.green(`\n¡Cliente registrado con éxito! ID: ${creado.id_cliente}`));
            break;

          case 'buscar':
            const { idBuscar } = await inquirer.prompt([
              { name: 'idBuscar', message: 'Ingrese el ID del cliente:' }
            ]);
            const cliente = await ClienteService.buscarClientePorId(idBuscar);
            console.log(chalk.green('\n--- Cliente Encontrado ---'));
            console.log(cliente);
            break;

          case 'actualizar':
            const { idActualizar } = await inquirer.prompt([
              { name: 'idActualizar', message: 'ID del cliente a actualizar:' }
            ]);
            const datosActualizados = await inquirer.prompt([
              { name: 'nombre', message: 'Nuevo nombre:' },
              { name: 'apellido', message: 'Nuevo apellido:' },
              { name: 'correo', message: 'Nuevo correo:' },
              { name: 'telefono', message: 'Nuevo teléfono:' }
            ]);
            await ClienteService.actualizarCliente(idActualizar, datosActualizados);
            console.log(chalk.green('\n¡Cliente actualizado correctamente!'));
            break;

          case 'eliminar':
            const { idEliminar } = await inquirer.prompt([
              { name: 'idEliminar', message: 'ID del cliente a eliminar:' }
            ]);
            await ClienteService.eliminarCliente(idEliminar);
            console.log(chalk.red('\n¡Cliente eliminado correctamente!'));
            break;

          case 'salir':
            salir = true;
            break;
        }
      } catch (error) {
        console.log(chalk.red(`\n[Error]: ${error.message}`));
      }

      if (!salir) {
        await inquirer.prompt([{ name: 'continuar', message: '\nPresiona Enter para continuar...' }]);
      }
    }
  }
}