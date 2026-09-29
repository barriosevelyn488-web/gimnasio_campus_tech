import MainMenu from './commands/MainMenu.js';
import { mensajeError } from './utils/errors.js';

async function main() {
  try {
    await MainMenu.iniciar();
  } catch (error) {
    if (error?.name === 'ExitPromptError') {
      console.log('\nAplicación cerrada.');
      process.exit(0);
    }
    console.error('Error crítico al iniciar la aplicación:', mensajeError(error));
    process.exit(1);
  }
}

main();
