import inquirer from 'inquirer';
import chalk from 'chalk';
import { SeguimientoService } from '../services/SeguimientoService.js';
import { pausar, mostrarError } from '../utils/consola.js';

export default class SeguimientoMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== BITÁCORA DE SEGUIMIENTO ==='));

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
          const { cliente_id } = await inquirer.prompt([{ type: 'input', name: 'cliente_id', message: 'ID del Cliente:' }]);
          console.table(await SeguimientoService.obtenerSeguimientos(cliente_id));
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Seguimiento ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'asignacion_id', message: 'ID de asignación (opcional):' },
            { type: 'input', name: 'progreso_id', message: 'ID de progreso físico (opcional):' },
            { type: 'input', name: 'plan_nutricional_id', message: 'ID de plan nutricional (opcional):' },
            { type: 'input', name: 'rutina_id', message: 'ID de rutina (opcional):' },
            { type: 'input', name: 'cumplimiento_rutinas', message: 'Cumplimiento de rutinas % (0-100, opcional):' },
            { type: 'input', name: 'cumplimiento_nutricion', message: 'Cumplimiento nutricional % (0-100, opcional):' },
            { type: 'input', name: 'observaciones', message: 'Observaciones:' },
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' }
          ]);
          const id = await SeguimientoService.crearSeguimiento(datos);
          console.log(chalk.green(`✔ Seguimiento registrado con éxito. ID: ${id}`));
        } else if (opcion === 'salir') {
          salir = true;
        }
      } catch (error) {
        mostrarError(error);
      }

      if (!salir) await pausar();
    }
  }
}
