import inquirer from 'inquirer';
import chalk from 'chalk';
import { FinanzaService } from '../services/FinanzaService.js';
import { pausar, mostrarError } from '../utils/consola.js';
import { formatearMoneda } from '../utils/formatters.js';

const preguntasFiltro = [
  { type: 'input', name: 'desde', message: 'Desde (opcional YYYY-MM-DD):' },
  { type: 'input', name: 'hasta', message: 'Hasta (opcional YYYY-MM-DD):' },
  { type: 'input', name: 'cliente_id', message: 'Cliente ID (opcional):' }
];

export default class FinanzaMenu {
  static async mostrarMenu() {
    let salir = false;

    while (!salir) {
      console.clear();
      console.log(chalk.cyan.bold('=== GESTIÓN FINANCIERA ==='));

      const { opcion } = await inquirer.prompt([
        {
          type: 'select',
          name: 'opcion',
          message: 'Seleccione una opción:',
          choices: [
            { name: '1. Listar movimientos financieros', value: 'listar' },
            { name: '2. Registrar ingreso o egreso', value: 'registrar' },
            { name: '3. Consultar balance con filtros', value: 'balance' },
            { name: '0. Volver al menú principal', value: 'salir' }
          ]
        }
      ]);

      try {
        if (opcion === 'listar') {
          console.log(chalk.yellow('\n--- Historial de Movimientos ---'));
          const movimientos = await FinanzaService.obtenerMovimientos(await inquirer.prompt(preguntasFiltro));
          console.table(movimientos.map((m) => ({ ...m, monto: formatearMoneda(m.monto) })));
        } else if (opcion === 'registrar') {
          console.log(chalk.yellow('\n--- Registrar Movimiento Financiero ---'));
          const categorias = await FinanzaService.obtenerCategorias();
          const datos = await inquirer.prompt([
            {
              type: 'select',
              name: 'categoria_id',
              message: 'Categoría:',
              choices: categorias.map((c) => ({ name: `${c.tipo} - ${c.nombre}`, value: c.id_categoria }))
            },
            { type: 'input', name: 'monto', message: `Monto (${process.env.MONEDA ?? 'GTQ'}):` },
            { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
            { type: 'input', name: 'descripcion', message: 'Descripción:' },
            { type: 'input', name: 'contrato_id', message: 'ID de contrato (opcional, solo ingresos):' }
          ]);
          const id = await FinanzaService.crearMovimiento(datos);
          console.log(chalk.green(`✔ Movimiento financiero registrado con éxito. ID: ${id}`));
        } else if (opcion === 'balance') {
          const totales = await FinanzaService.obtenerBalance(await inquirer.prompt(preguntasFiltro));
          console.table({
            Ingresos: formatearMoneda(totales.ingresos),
            Egresos: formatearMoneda(totales.egresos),
            Balance: formatearMoneda(totales.balance)
          });
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
