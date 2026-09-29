import inquirer from 'inquirer';
import chalk from 'chalk';
import { ProgresoService } from '../services/ProgresoService.js';
import { pausar, mostrarError, pedirLista, requerido, numeroPositivo } from '../utils/consola.js';

const preguntasMedida = [
  { type: 'input', name: 'tipo', message: 'Medida (cintura, brazo, pecho...):', validate: requerido },
  { type: 'input', name: 'valor', message: 'Valor (ej. 80):', validate: numeroPositivo },
  { type: 'input', name: 'unidad', message: 'Unidad:', default: 'cm', validate: requerido }
];

export default class ProgresoMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== PROGRESO FÍSICO ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Consultar historial de progreso por cliente', value: 'listar' },
            { name: '2. Registrar nueva medición', value: 'registrar' },
            { name: '3. Eliminar registro de progreso', value: 'eliminar' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Historial de Progreso ---'));
          const { cliente_id } = await inquirer.prompt([{ type: 'input', name: 'cliente_id', message: 'ID del Cliente:' }]);
          const registros = await ProgresoService.obtenerProgresoCliente(cliente_id);
          console.table(registros.map((r) => ({
            ...r,
            medidas: r.medidas.map((m) => `${m.tipo}: ${m.valor} ${m.unidad}`).join(', '),
            fotos: r.fotos.join(', ')
          })));
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Medición Física ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'cliente_id', message: 'ID del Cliente:' },
            { type: 'input', name: 'peso', message: 'Peso (kg):' },
            { type: 'input', name: 'porcentaje_grasa', message: 'Porcentaje de grasa (%, opcional):' },
            { type: 'input', name: 'comentarios', message: 'Comentarios (opcional):' },
            { type: 'input', name: 'fecha_registro', message: 'Fecha (YYYY-MM-DD):' }
          ]);
          const medidas = await pedirLista('Medida corporal', preguntasMedida, { opcional: true });
          const fotos = (await pedirLista('Foto', [{ type: 'input', name: 'url', message: 'URL o ruta de la foto:', validate: requerido }], { opcional: true }))
            .map((f) => f.url);
          const id = await ProgresoService.crearProgreso({ ...datos, medidas, fotos });
          console.log(chalk.green(`✔ Medición física registrada con éxito. ID: ${id}`));
        } else if (opcion === 'eliminar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del registro de progreso:' }]);
          const eliminados = await ProgresoService.eliminar(id);
          console.log(eliminados ? chalk.green('Registro eliminado.') : chalk.yellow('El registro no existe.'));
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
