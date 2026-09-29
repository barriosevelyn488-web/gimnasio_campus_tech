import inquirer from 'inquirer';
import chalk from 'chalk';
import { PlanService } from '../services/PlanService.js';

export default class PlanMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN DE PLANES DE ENTRENAMIENTO ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar planes', value: 'listar' },
            { name: '2. Registrar nuevo plan', value: 'registrar' },
            { name: '3. Actualizar plan', value: 'actualizar' },
            { name: '4. Desactivar plan', value: 'eliminar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Lista de Planes de Entrenamiento ---'));
          const planes = await PlanService.obtenerPlanes();
          console.table(planes);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Nuevo Plan ---'));
          const nuevoPlan = await inquirer.prompt([
            { type: 'input', name: 'nombre', message: 'Nombre del plan:' },
            { type: 'input', name: 'descripcion', message: 'Descripción:' },
            { type: 'input', name: 'duracion_semanas', message: 'Duración en semanas (número):' },
            { type: 'input', name: 'metas_fisicas', message: 'Metas físicas:' },
            { type: 'select', name: 'nivel', message: 'Nivel:', choices: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'] },
            { type: 'input', name: 'precio', message: 'Precio:' }
          ]);

          await PlanService.crearPlan(nuevoPlan);
          console.log(chalk.green('✔ Plan de entrenamiento registrado con éxito.'));
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'actualizar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del plan a actualizar:' }]);
          const datos = await inquirer.prompt([
            { type: 'input', name: 'nombre', message: 'Nuevo nombre:' },
            { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
            { type: 'input', name: 'duracion_semanas', message: 'Duración en semanas:' },
            { type: 'input', name: 'metas_fisicas', message: 'Metas físicas:' },
            { type: 'select', name: 'nivel', message: 'Nivel:', choices: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'] },
            { type: 'input', name: 'precio', message: 'Precio:' }
          ]);
          const actualizados = await PlanService.actualizarPlan(id, datos);
          console.log(actualizados ? chalk.green('Plan actualizado.') : chalk.yellow('No hubo cambios o el plan no existe.'));
        } else if (opcion === 'eliminar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del plan a desactivar:' }]);
          const desactivados = await PlanService.eliminarPlan(id);
          console.log(desactivados ? chalk.green('Plan desactivado; se conserva su historial.') : chalk.yellow('El plan no existe o ya estaba inactivo.'));
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
