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
            { name: '3. Registrar comida (datos en formato JSON)', value: 'comida' },
            { name: '4. Reporte semanal', value: 'reporte' },
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
            { type: 'input', name: 'cliente_id', message: 'ID del cliente:' },
            { type: 'input', name: 'plan_entrenamiento_id', message: 'ID del plan de entrenamiento:' },
            { type: 'input', name: 'descripcion', message: 'Descripción:' },
            { type: 'input', name: 'calorias_estimadas', message: 'Calorías estimadas:' },
            { type: 'input', name: 'fecha_inicio', message: 'Inicio (YYYY-MM-DD):' },
            { type: 'input', name: 'fecha_fin', message: 'Fin (YYYY-MM-DD):' }
          ]);
          await NutricionService.crearPlan(datos);
          console.log(chalk.green('✔ Plan nutricional registrado con éxito.'));
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'comida') {
          const { json } = await inquirer.prompt([{ type: 'input', name: 'json', message: 'JSON de comida y alimentos:' }]);
          const id = await NutricionService.registrarComida(JSON.parse(json)); console.log(chalk.green(`Comida registrada: ${id}`));
        } else if (opcion === 'reporte') {
          const d = await inquirer.prompt([{ type: 'input', name: 'plan_nutricional_id', message: 'ID plan nutricional:' },{ type: 'input', name: 'inicio', message: 'Inicio semana (YYYY-MM-DD):' },{ type: 'input', name: 'fin', message: 'Fin semana (YYYY-MM-DD):' }]);
          console.table(await NutricionService.reporteSemanal(d.plan_nutricional_id,d.inicio,d.fin));
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