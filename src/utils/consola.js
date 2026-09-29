import inquirer from 'inquirer';
import chalk from 'chalk';
import { mensajeError } from './errors.js';

export async function pausar() {
  await inquirer.prompt([{ type: 'input', name: 'continuar', message: 'Presiona Enter para continuar...' }]);
}

export const requerido = (v) => String(v ?? '').trim() !== '' || 'Este dato es obligatorio.';
export const numeroPositivo = (v) => Number(v) > 0 || 'Ingresa un número mayor que 0.';
export const enteroNoNegativo = (v) => (String(v).trim() !== '' && Number.isInteger(Number(v)) && Number(v) >= 0) || 'Ingresa un número entero (0 o más).';

export async function pedirLista(titulo, preguntas, { opcional = false } = {}) {
  const items = [];
  let otro = true;
  if (opcional) {
    ({ otro } = await inquirer.prompt([{ type: 'confirm', name: 'otro', message: `¿Deseas agregar ${titulo.toLowerCase()}?`, default: false }]));
  }
  while (otro) {
    console.log(chalk.yellow(`\n${titulo} #${items.length + 1}`));
    items.push(await inquirer.prompt(preguntas));
    ({ otro } = await inquirer.prompt([{ type: 'confirm', name: 'otro', message: '¿Agregar otro?', default: false }]));
  }
  return items;
}

export function mostrarError(error) {
  if (error?.name === 'ExitPromptError') throw error;
  console.log(chalk.red(`\n[Error]: ${mensajeError(error)}`));
}
