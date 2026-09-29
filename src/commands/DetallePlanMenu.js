import inquirer from 'inquirer';
import chalk from 'chalk';
import { DetallePlanService } from '../services/DetallePlanService.js';
import { pausar, mostrarError } from '../utils/consola.js';

export default class DetallePlanMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== PAQUETES (ENTRENAMIENTO + NUTRICIÓN) ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar paquetes', value: 'listar' },
            { name: '2. Crear paquete desde un plan nutricional', value: 'registrar' },
            { name: '3. Actualizar observaciones', value: 'actualizar' },
            { name: '4. Eliminar paquete', value: 'eliminar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.table(await DetallePlanService.obtenerPaquetes());
        } else if (opcion === 'registrar') {
          const datos = await inquirer.prompt([
            { type: 'input', name: 'plan_nutricional_id', message: 'ID del plan nutricional (el plan de entrenamiento se toma de él):' },
            { type: 'input', name: 'observaciones', message: 'Observaciones (opcional):' }
          ]);
          const id = await DetallePlanService.crearPaquete(datos);
          console.log(chalk.green(`✔ Paquete registrado con éxito. ID: ${id}`));
        } else if (opcion === 'actualizar') {
          const { id, observaciones } = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'ID del paquete:' },
            { type: 'input', name: 'observaciones', message: 'Nuevas observaciones:' }
          ]);
          const actualizados = await DetallePlanService.actualizarObservaciones(id, observaciones);
          console.log(actualizados ? chalk.green('Paquete actualizado.') : chalk.yellow('El paquete no existe.'));
        } else if (opcion === 'eliminar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del paquete:' }]);
          const eliminados = await DetallePlanService.eliminarPaquete(id);
          console.log(eliminados ? chalk.green('Paquete eliminado.') : chalk.yellow('El paquete no existe.'));
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
