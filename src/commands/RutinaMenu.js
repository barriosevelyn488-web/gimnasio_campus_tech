import inquirer from 'inquirer';
import chalk from 'chalk';
import { RutinaService } from '../services/RutinaService.js';
import { pausar, mostrarError } from '../utils/consola.js';

export default class RutinaMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== RUTINAS DE ENTRENAMIENTO ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar rutinas', value: 'listar' },
            { name: '2. Registrar rutina en un plan', value: 'registrar' },
            { name: '3. Actualizar rutina', value: 'actualizar' },
            { name: '4. Desactivar rutina', value: 'desactivar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          const { plan_id } = await inquirer.prompt([{ type: 'input', name: 'plan_id', message: 'ID del plan (Enter = todas):' }]);
          console.table(await RutinaService.obtenerRutinas(plan_id));
        } else if (opcion === 'registrar') {
          const datos = await inquirer.prompt([
            { type: 'input', name: 'plan_id', message: 'ID del plan de entrenamiento:' },
            { type: 'input', name: 'nombre', message: 'Nombre de la rutina:' },
            { type: 'input', name: 'descripcion', message: 'Descripción / ejercicios (opcional):' }
          ]);
          const id = await RutinaService.crearRutina(datos);
          console.log(chalk.green(`✔ Rutina registrada con éxito. ID: ${id}`));
        } else if (opcion === 'actualizar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID de la rutina:' }]);
          const datos = await inquirer.prompt([
            { type: 'input', name: 'nombre', message: 'Nuevo nombre:' },
            { type: 'input', name: 'descripcion', message: 'Nueva descripción (opcional):' },
            { type: 'select', name: 'estado', message: 'Estado:', choices: ['ACTIVA', 'INACTIVA'] }
          ]);
          const actualizadas = await RutinaService.actualizarRutina(id, datos);
          console.log(actualizadas ? chalk.green('Rutina actualizada.') : chalk.yellow('La rutina no existe.'));
        } else if (opcion === 'desactivar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID de la rutina:' }]);
          const desactivadas = await RutinaService.desactivarRutina(id);
          console.log(desactivadas ? chalk.green('Rutina desactivada; se conserva en los seguimientos.') : chalk.yellow('La rutina no existe o ya estaba inactiva.'));
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
