import inquirer from 'inquirer';
import chalk from 'chalk';
import { PortalClienteService } from '../services/PortalClienteService.js';
import { pausar, mostrarError } from '../utils/consola.js';
import { fechaHoy } from '../utils/validators.js';

const porcentaje = (v) => (Number.isInteger(Number(v)) && String(v).trim() !== '' && Number(v) >= 0 && Number(v) <= 100) || 'Ingresa un número entero entre 0 y 100.';

export default class PortalClienteMenu {
  static async mostrarMenu() {
    console.clear();
    console.log(chalk.cyan.bold('=== PORTAL DEL CLIENTE ==='));
    const { identificador } = await inquirer.prompt([{ type: 'input', name: 'identificador', message: 'Tu ID de cliente o correo:' }]);
    const cliente = await PortalClienteService.ingresar(identificador);

    let salir = false;
    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold(`=== PORTAL DEL CLIENTE: ${cliente.nombre} ${cliente.apellido} ===`));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: '¿Qué deseas hacer?',
          choices: [
            { name: '1. Ver mi plan (rutinas y comidas)', value: 'plan' },
            { name: '2. Registrar mi cumplimiento del día', value: 'cumplimiento' },
            { name: '3. Ver mis contratos y pagos', value: 'pagos' },
            { name: '4. Ver mi progreso y seguimientos', value: 'progreso' },
            { name: '0. Salir del portal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'plan') {
          const plan = await PortalClienteService.miPlan(cliente.id_cliente);
          if (!plan) {
            console.log(chalk.yellow('\nNo tienes un plan activo. Consulta con tu entrenador.'));
          } else {
            const a = plan.asignacion;
            console.log(chalk.yellow(`\nPlan: ${a.plan}  |  Contrato ${a.id_contrato}: ${a.fecha_inicio?.toISOString?.().slice(0, 10) ?? a.fecha_inicio} a ${a.fecha_fin?.toISOString?.().slice(0, 10) ?? a.fecha_fin}`));
            console.log(chalk.cyan('\nRutinas:'));
            console.table(plan.rutinas);
            console.log(chalk.cyan(`Plan nutricional: ${a.plan_nutricional ?? 'sin plan nutricional asignado'}`));
            if (plan.comidas.length) console.table(plan.comidas);
          }
        } else if (opcion === 'cumplimiento') {
          const plan = await PortalClienteService.miPlan(cliente.id_cliente);
          if (!plan) throw new Error('No tienes un plan activo. Consulta con tu entrenador.');
          const datos = await inquirer.prompt([
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):', default: fechaHoy() },
            {
              type: 'select',
              name: 'rutina_id',
              message: '¿Qué rutina hiciste?',
              choices: [
                ...plan.rutinas.map((r) => ({ name: r.nombre, value: String(r.id_rutina) })),
                { name: 'Ninguna / día de descanso', value: '' }
              ]
            },
            { type: 'input', name: 'cumplimiento_rutinas', message: '¿Qué porcentaje de la rutina completaste? (0-100):', validate: porcentaje },
            { type: 'input', name: 'cumplimiento_nutricion', message: '¿Qué porcentaje de tu plan de comidas cumpliste hoy? (0-100):', validate: porcentaje },
            { type: 'input', name: 'observaciones', message: 'Comentario (opcional):' }
          ]);
          const id = await PortalClienteService.registrarCumplimiento(cliente.id_cliente, datos);
          console.log(chalk.green(`✔ Cumplimiento registrado. Tu entrenador lo verá en la bitácora (ID ${id}).`));
        } else if (opcion === 'pagos') {
          const { contratos, pagos } = await PortalClienteService.misContratosYPagos(cliente.id_cliente);
          console.log(chalk.cyan('\nContratos:'));
          console.table(contratos);
          console.log(chalk.cyan('Pagos registrados:'));
          console.table(pagos.map(({ id_movimiento, categoria, monto, fecha, descripcion }) => ({ id_movimiento, categoria, monto, fecha, descripcion })));
        } else if (opcion === 'progreso') {
          const { progreso, seguimientos } = await PortalClienteService.miProgreso(cliente.id_cliente);
          console.log(chalk.cyan('\nProgreso físico:'));
          console.table(progreso.map((r) => ({
            fecha: r.fecha_registro,
            peso: r.peso,
            grasa: r.porcentaje_grasa,
            medidas: r.medidas.map((m) => `${m.tipo}: ${m.valor} ${m.unidad}`).join(', ')
          })));
          console.log(chalk.cyan('Seguimientos:'));
          console.table(seguimientos.map((s) => ({
            fecha: s.fecha,
            registrado_por: s.registrado_por,
            rutina: s.rutina,
            rutinas_pct: s.cumplimiento_rutinas,
            nutricion_pct: s.cumplimiento_nutricion,
            observaciones: s.observaciones
          })));
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
