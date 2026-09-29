import inquirer from 'inquirer';
import chalk from 'chalk';
import { AsignacionService } from '../services/AsignacionService.js';
import { ContratoService } from '../services/ContratoService.js';
import { pausar, mostrarError } from '../utils/consola.js';

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
            { name: '1. Listar contratos y estados', value: 'listar' },
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
          console.table(await AsignacionService.obtenerContratos());
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Nueva Asignación y Contrato ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'detalle_plan_id', message: 'ID del paquete entrenamiento + nutrición (opcional):' },
            { type: 'input', name: 'plan_id', message: 'ID del Plan de Entrenamiento (Enter = el del paquete):' },
            { type: 'input', name: 'fecha_inicio', message: 'Fecha inicio (YYYY-MM-DD):' },
            { type: 'input', name: 'fecha_fin', message: 'Fecha fin (YYYY-MM-DD, Enter = se calcula con la duración del plan):' },
            { type: 'input', name: 'fecha_asignacion', message: 'Fecha asignación (YYYY-MM-DD, Enter = fecha de inicio):' },
            { type: 'input', name: 'monto', message: 'Monto (Enter = precio del plan):' },
            { type: 'input', name: 'condiciones', message: 'Condiciones del contrato (opcional):' },
            { type: 'confirm', name: 'registrar_pago', message: '¿El cliente pagó? (registra el ingreso "Mensualidad")', default: true }
          ]);
          const r = await AsignacionService.crearAsignacionConContrato(datos);
          console.log(chalk.green(`✔ COMMIT: asignación ${r.id_asignacion} y contrato ${r.id_contrato} generados (fin: ${r.fecha_fin}).`));
          if (r.id_movimiento) console.log(chalk.green(`✔ Ingreso registrado en finanzas: movimiento ${r.id_movimiento} por ${r.monto}.`));
        } else if (['renovar', 'finalizar', 'cancelar'].includes(opcion)) {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del contrato:' }]);
          if (opcion === 'finalizar') {
            await ContratoService.finalizar(id);
          } else if (opcion === 'cancelar') {
            const { motivo } = await inquirer.prompt([{ type: 'input', name: 'motivo', message: 'Motivo de cancelación:' }]);
            await ContratoService.cancelar(id, motivo);
          } else {
            const d = await inquirer.prompt([
              { type: 'input', name: 'fecha_inicio', message: 'Inicio (YYYY-MM-DD):' },
              { type: 'input', name: 'fecha_fin', message: 'Fin (YYYY-MM-DD):' },
              { type: 'input', name: 'monto', message: 'Monto:' },
              { type: 'input', name: 'condiciones', message: 'Condiciones (opcional):' },
              { type: 'confirm', name: 'registrar_pago', message: '¿El cliente pagó la renovación?', default: true }
            ]);
            const nuevo = await ContratoService.renovar(id, d);
            console.log(chalk.green(`Nuevo contrato generado: ${nuevo}`));
          }
          console.log(chalk.green('Contrato actualizado correctamente.'));
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
