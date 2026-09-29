import inquirer from 'inquirer';
import chalk from 'chalk';
import { NutricionService } from '../services/NutricionService.js';

export default class NutricionMenu {
  static async mostrarMenu() {
    let salir = false;
    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN DE PLANES NUTRICIONALES ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar planes nutricionales', value: 'listar' },
            { name: '2. Registrar plan nutricional', value: 'registrar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Lista de Planes Nutricionales ---'));
          const planes = await NutricionService.obtenerPlanes();
          console.table(planes);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Nuevo Plan Nutricional ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'nombre', message: 'Nombre del plan:' },
            { type: 'input', name: 'objetivo', message: 'Objetivo:' },
            { type: 'input', name: 'calorias_diarias', message: 'Calorías diarias (número):' }
          ]);
          await NutricionService.crearPlan(datos);
          console.log(chalk.green('✔ Plan nutricional registrado con éxito.'));
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