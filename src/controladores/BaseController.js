export class BaseController {
    // Clase base para controladores si manejas herencia común
    static async handleError(res, error) {
      console.error(`[Error en Controlador]:`, error.message);
      throw new Error(error.message);
    }
  }