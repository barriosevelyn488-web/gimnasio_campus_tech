import ClienteMenu from '../commands/ClienteMenu.js';
import PlanMenu from '../commands/PlanMenu.js';
import ContratoMenu from '../commands/ContratoMenu.js';
import ProgresoMenu from '../commands/ProgresoMenu.js';
import FinanzaMenu from '../commands/FinanzaMenu.js';

export class MenuFactory {
  static crearMenu(tipo) {
    switch (tipo) {
      case 'cliente':
        return ClienteMenu;
      case 'plan':
        return PlanMenu;
      case 'contrato':
        return ContratoMenu;
      case 'progreso':
        return ProgresoMenu;
      case 'finanza':
        return FinanzaMenu;
      default:
        throw new Error('Módulo de menú no encontrado.');
    }
  }
}