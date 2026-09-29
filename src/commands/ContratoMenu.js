import inquirer from 'inquirer';
import chalk from 'chalk';
import { AsignacionService } from '../services/AsignacionService.js';
import { ContratoService } from '../services/ContratoService.js';

export default class ContratoMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== ASIGNACIÓN Y CONTRATOS ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar contratos activos', value: 'listar' },
            { name: '2. Asignar plan y generar contrato (Transacción)', value: 'registrar' },
            { name: '3. Renovar contrato', value: 'renovar' },
            { name: '4. Finalizar contrato', value: 'finalizar' },
            { name: '5. Cancelar contrato', value: 'cancelar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Lista de Contratos ---'));
          const contratos = await AsignacionService.obtenerContratos();
          console.table(contratos);
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Nueva Asignación y Contrato ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'plan_id', message: 'ID del Plan de Entrenamiento:' },
            { type: 'input', name: 'fecha_asignacion', message: 'Fecha asignación (YYYY-MM-DD):' },
            { type: 'input', name: 'monto', message: 'Monto (Enter usa el precio del plan):' },
            { type: 'input', name: 'condiciones', message: 'Condiciones del contrato:' },
            { type: 'input', name: 'fecha_inicio', message: 'Fecha inicio (YYYY-MM-DD):' },
            { type: 'input', name: 'fecha_fin', message: 'Fecha fin (YYYY-MM-DD, opcional: se calcula del plan):' }
          ]);

          await AsignacionService.crearAsignacionConContrato(datos);
          console.log(chalk.green('✔ Transacción exitosa: Asignación y Contrato generados (COMMIT).'));
          await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
        } else if (['renovar','finalizar','cancelar'].includes(opcion)) {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del contrato:' }]);
          if (opcion === 'finalizar') await ContratoService.finalizar(id);
          if (opcion === 'cancelar') { const { motivo } = await inquirer.prompt([{ type: 'input', name: 'motivo', message: 'Motivo de cancelación:' }]); await ContratoService.cancelar(id,motivo); }
          if (opcion === 'renovar') { const d = await inquirer.prompt([{ type: 'input', name: 'fecha_inicio', message: 'Inicio (YYYY-MM-DD):' },{ type: 'input', name: 'fecha_fin', message: 'Fin (YYYY-MM-DD):' },{ type: 'input', name: 'monto', message: 'Monto:' },{ type: 'input', name: 'condiciones', message: 'Condiciones:' }]); await ContratoService.renovar(id,d); }
          console.log(chalk.green('Contrato actualizado correctamente.'));
        } else if (opcion === 'salir') {
          salir = true;
        }
      } catch (error) {
        console.log(chalk.red(`\n[Error Crítico]: ${error.message}`));
        await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
      }
    }
  }
}