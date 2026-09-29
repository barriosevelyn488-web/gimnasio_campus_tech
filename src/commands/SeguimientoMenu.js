import inquirer from 'inquirer';
import chalk from 'chalk';
import { SeguimientoService } from '../services/SeguimientoService.js';

export default class SeguimientoMenu {
  static async mostrarMenu() {
    let salir = false;
    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== SEGUIMIENTO INTEGRAL DE CLIENTES ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Consultar seguimientos por cliente', value: 'listar' },
            { name: '2. Registrar nuevo seguimiento', value: 'registrar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Historial de Seguimiento ---'));
          const { cliente_id } = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' }
          ]);
          const seguimientos = await SeguimientoService.obtenerSeguimientos(cliente_id);
          console.table(seguimientos);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Seguimiento ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'observacion', message: 'Observación:' },
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' }
          ]);
          await SeguimientoService.crearSeguimiento(datos);
          console.log(chalk.green('✔ Seguimiento registrado con éxito.'));
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'salir') {
          salir = true;
        }
      } catch (error) {
        console.log(chalk.red(`\n[Error]: ${error.message}`));
        await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
      }
    }
  }
}