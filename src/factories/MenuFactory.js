import ClienteMenu from '../commands/ClienteMenu.js';
import PlanMenu from '../commands/PlanMenu.js';
import ContratoMenu from '../commands/ContratoMenu.js';
import ProgresoMenu from '../commands/ProgresoMenu.js';
import FinanzaMenu from '../commands/FinanzaMenu.js';
import NutricionMenu from '../commands/NutricionMenu.js';
import SeguimientoMenu from '../commands/SeguimientoMenu.js';
import RutinaMenu from '../commands/RutinaMenu.js';
import DetallePlanMenu from '../commands/DetallePlanMenu.js';
import PortalClienteMenu from '../commands/PortalClienteMenu.js';

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
      case 'nutricion':
        return NutricionMenu;
      case 'seguimiento':
        return SeguimientoMenu;
      case 'rutina':
        return RutinaMenu;
      case 'paquete':
        return DetallePlanMenu;
      case 'portal_cliente':
        return PortalClienteMenu;
      default:
        throw new Error('Módulo de menú no encontrado.');
    }
  }
}