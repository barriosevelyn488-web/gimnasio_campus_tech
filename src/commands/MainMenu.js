import inquirer from 'inquirer';
import chalk from 'chalk';
import { MenuFactory } from '../factories/MenuFactory.js';
import pool from '../config/db.js';
import { pausar, mostrarError } from '../utils/consola.js';

export default class MainMenu {
  static async iniciar() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('========================================='));
      console.log(chalk.cyan.bold('    SISTEMA DE GESTIÓN DE GIMNASIO CLI   '));
      console.log(chalk.cyan.bold('========================================='));

      const { rol } = await inquirer.prompt([
        {
          type: 'select',
          name: 'rol',
          message: '¿Cómo deseas ingresar?',
          choices: [
            { name: '1. Entrenador (administración)', value: 'entrenador' },
            { name: '2. Cliente (mi plan y cumplimiento diario)', value: 'cliente' },
            { name: '0. Salir de la aplicación', value: 'salir' }
          ]
        }
      ]);

      if (rol === 'salir') {
        salir = true;
      } else if (rol === 'entrenador') {
        await MainMenu.menuEntrenador();
      } else {
        try {
          await MenuFactory.crearMenu('portal_cliente').mostrarMenu();
        } catch (error) {
          mostrarError(error);
          await pausar();
        }
      }
    }

    await pool.end();
    console.log(chalk.green('¡Gracias por usar el sistema! Hasta pronto.'));
  }

  static async menuEntrenador() {
    while (true) {
      console.clear();
      console.log(chalk.cyan.bold('=== MENÚ DEL ENTRENADOR ==='));

      const { modulo } = await inquirer.prompt([
        {
          type: 'select',
          name: 'modulo',
          message: 'Seleccione un módulo a gestionar:',
          choices: [
            { name: '1. Gestión de Clientes', value: 'cliente' },
            { name: '2. Planes de Entrenamiento', value: 'plan' },
            { name: '3. Rutinas de Entrenamiento', value: 'rutina' },
            { name: '4. Planes Nutricionales', value: 'nutricion' },
            { name: '5. Paquetes Entrenamiento + Nutrición', value: 'paquete' },
            { name: '6. Asignación y Contratos (Transacciones)', value: 'contrato' },
            { name: '7. Progreso Físico', value: 'progreso' },
            { name: '8. Bitácora de Seguimiento', value: 'seguimiento' },
            { name: '9. Gestión Financiera', value: 'finanza' },
            { name: '0. Volver', value: 'volver' }
          ]
        }
      ]);

      if (modulo === 'volver') return;

      try {
        await MenuFactory.crearMenu(modulo).mostrarMenu();
      } catch (error) {
        mostrarError(error);
        await pausar();
      }
    }
  }
}
