import inquirer from 'inquirer';
import chalk from 'chalk';
import { NutricionService } from '../services/NutricionService.js';
import { pausar, mostrarError, pedirLista, requerido, numeroPositivo, enteroNoNegativo } from '../utils/consola.js';

const TIPOS_COMIDA = ['Desayuno', 'Refacción mañana', 'Almuerzo', 'Refacción tarde', 'Cena'];

const preguntasAlimento = [
  { type: 'input', name: 'alimento', message: 'Alimento (ej. Arroz):', validate: requerido },
  { type: 'input', name: 'cantidad', message: 'Cantidad (ej. 150):', validate: numeroPositivo },
  { type: 'input', name: 'unidad', message: 'Unidad (g, ml, taza, unidad...):', default: 'g', validate: requerido },
  { type: 'input', name: 'calorias_estimadas', message: 'Calorías estimadas (kcal):', validate: enteroNoNegativo }
];

const preguntasPlan = [
  { type: 'input', name: 'cliente_id', message: 'ID del cliente:' },
  { type: 'input', name: 'plan_entrenamiento_id', message: 'ID del plan de entrenamiento:' },
  { type: 'input', name: 'descripcion', message: 'Descripción:' },
  { type: 'input', name: 'calorias_estimadas', message: 'Calorías estimadas:' },
  { type: 'input', name: 'fecha_inicio', message: 'Inicio (YYYY-MM-DD):' },
  { type: 'input', name: 'fecha_fin', message: 'Fin (YYYY-MM-DD):' }
];

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
            { name: '3. Actualizar plan nutricional', value: 'actualizar' },
            { name: '4. Registrar comida y alimentos', value: 'comida' },
            { name: '5. Reporte semanal', value: 'reporte' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Lista de Planes Nutricionales ---'));
          console.table(await NutricionService.obtenerPlanes());
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Nuevo Plan Nutricional ---'));
          const id = await NutricionService.crearPlan(await inquirer.prompt(preguntasPlan));
          console.log(chalk.green(`✔ Plan nutricional registrado con éxito. ID: ${id}`));
        } else if (opcion === 'actualizar') {
          const { id } = await inquirer.prompt([{ type: 'input', name: 'id', message: 'ID del plan nutricional:' }]);
          const datos = await inquirer.prompt([
            ...preguntasPlan,
            { type: 'select', name: 'estado', message: 'Estado:', choices: ['ACTIVO', 'FINALIZADO', 'CANCELADO'] }
          ]);
          const actualizados = await NutricionService.actualizarPlan(id, datos);
          console.log(actualizados ? chalk.green('Plan nutricional actualizado.') : chalk.yellow('No hubo cambios o el plan no existe.'));
        } else if (opcion === 'comida') {
          console.log(chalk.yellow('\n--- Registrar Comida ---'));
          const datos = await inquirer.prompt([
            { type: 'input', name: 'plan_nutricional_id', message: 'ID del plan nutricional:' },
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
            { type: 'select', name: 'tipo_comida', message: 'Tipo de comida:', choices: TIPOS_COMIDA },
            { type: 'input', name: 'indicaciones', message: 'Indicaciones (opcional):' }
          ]);
          const alimentos = await pedirLista('Alimento', preguntasAlimento);
          const id = await NutricionService.registrarComida({ ...datos, alimentos });
          console.log(chalk.green(`✔ Comida registrada: ${id}`));
        } else if (opcion === 'reporte') {
          const d = await inquirer.prompt([
            { type: 'input', name: 'plan_nutricional_id', message: 'ID plan nutricional:' },
            { type: 'input', name: 'inicio', message: 'Inicio semana (YYYY-MM-DD):' },
            { type: 'input', name: 'fin', message: 'Fin semana (YYYY-MM-DD):' }
          ]);
          const filas = await NutricionService.reporteSemanal(d.plan_nutricional_id, d.inicio, d.fin);
          console.table(filas);
          const total = filas.reduce((suma, f) => suma + Number(f.calorias_estimadas), 0);
          console.log(chalk.cyan(`Total de calorías en el periodo: ${total} kcal`));
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
