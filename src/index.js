import MainMenu from './commands/MainMenu.js';

async function main() {
  try {
    await MainMenu.iniciar();
  } catch (error) {
    console.error('Error crítico al iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

main();