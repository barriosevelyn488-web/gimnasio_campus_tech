import { PortalClienteController } from '../controladores/PortalClienteController.js';
import { FinanzaController } from '../controladores/FinanzaController.js';
import { ProgresoController } from '../controladores/ProgresoController.js';
import { SeguimientoController } from '../controladores/SeguimientoController.js';
import { SeguimientoService } from './SeguimientoService.js';
import { validarNoVacio } from '../utils/validators.js';

export class PortalClienteService {
  static async ingresar(identificador) {
    if (!validarNoVacio(identificador)) throw new Error('Escribe tu ID de cliente o tu correo.');
    const cliente = await PortalClienteController.buscarCliente(String(identificador).trim());
    if (!cliente) throw new Error('No encontramos un cliente con ese ID o correo.');
    return cliente;
  }

  static async miPlan(clienteId) {
    const asignacion = await PortalClienteController.asignacionActiva(clienteId);
    if (!asignacion) return null;
    return {
      asignacion,
      rutinas: await PortalClienteController.rutinasActivas(asignacion.plan_id),
      comidas: asignacion.plan_nutricional_id ? await PortalClienteController.comidas(asignacion.plan_nutricional_id) : []
    };
  }

  static async registrarCumplimiento(clienteId, d) {
    const asignacion = await PortalClienteController.asignacionActiva(clienteId);
    if (!asignacion) throw new Error('No tienes un plan activo. Consulta con tu entrenador.');
    return SeguimientoService.crearSeguimiento({
      ...d,
      cliente_id: clienteId,
      asignacion_id: asignacion.id_asignacion,
      plan_nutricional_id: asignacion.plan_nutricional_id,
      observaciones: d.observaciones?.trim() || 'Registro diario del cliente',
      registrado_por: 'CLIENTE'
    });
  }

  static async misContratosYPagos(clienteId) {
    return {
      contratos: await PortalClienteController.contratos(clienteId),
      pagos: await FinanzaController.listarMovimientos({ cliente_id: clienteId })
    };
  }

  static async miProgreso(clienteId) {
    return {
      progreso: await ProgresoController.listarProgresoPorCliente(clienteId),
      seguimientos: await SeguimientoController.listarSeguimientosCliente(clienteId)
    };
  }
}
