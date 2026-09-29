import inquirer from 'inquirer';
import chalk from 'chalk';
import { FinanzaService } from '../services/FinanzaService.js';

export default class FinanzaMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN FINANCIERA ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar movimientos financieros', value: 'listar' },
            { name: '2. Registrar ingreso o egreso', value: 'registrar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Historial de Movimientos ---'));
          const movimientos = await FinanzaService.obtenerMovimientos();
          console.table(movimientos);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Movimiento Financiero ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'categoria_id', message: 'ID de la Categoría de Finanza:' },
            { type: 'input', name: 'monto', message: 'Monto ($):' },
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
            { type: 'input', name: 'descripcion', message: 'Descripción:' }
          ]);

          await FinanzaService.crearMovimiento(datos);
          console.log(chalk.green('✔ Movimiento financiero registrado con éxito.'));
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