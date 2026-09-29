import inquirer from 'inquirer';
import chalk from 'chalk';
import { ProgresoService } from '../services/ProgresoService.js';

export default class ProgresoMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== PROGRESO FÍSICO ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Consultar historial de progreso por cliente', value: 'listar' },
            { name: '2. Registrar nueva medición', value: 'registrar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Historial de Progreso ---'));
          const { cliente_id } = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' }
          ]);
          const registros = await ProgresoService.obtenerProgresoCliente(cliente_id);
          console.table(registros);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Medición Física ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'peso', message: 'Peso (kg):' },
            { type: 'input', name: 'altura', message: 'Altura (m):' },
            { type: 'input', name: 'porcentaje_grasa', message: 'Porcentaje de grasa (%):' },
            { type: 'input', name: 'fecha_registro', message: 'Fecha (YYYY-MM-DD):' }
          ]);

          await ProgresoService.crearProgreso(datos);
          console.log(chalk.green('✔ Medición física registrada con éxito.'));
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