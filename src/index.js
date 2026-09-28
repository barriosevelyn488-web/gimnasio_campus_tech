import ClienteMenu from './commands/ClienteMenu.js';

async function main() {
  try {
    await ClienteMenu.mostrarMenu();
  } catch (error) {
    console.error("Error crítico en la aplicación:", error.message);
  }
}

main();