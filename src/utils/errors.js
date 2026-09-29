export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const MENSAJES_MYSQL = {
  ER_DUP_ENTRY: 'Ya existe un registro con ese valor único (por ejemplo, el correo).',
  ER_ROW_IS_REFERENCED_2: 'No se puede eliminar: el registro tiene información relacionada (asignaciones, contratos, progreso...).',
  ER_NO_REFERENCED_ROW_2: 'Uno de los ID ingresados no existe en la base de datos.',
  ER_CHECK_CONSTRAINT_VIOLATED: 'Los datos no cumplen las reglas de la base (montos, fechas o rangos).',
  ER_TRUNCATED_WRONG_VALUE: 'Uno de los valores tiene un formato inválido.',
  ER_WRONG_VALUE_FOR_TYPE: 'Uno de los valores tiene un formato inválido.',
  WARN_DATA_TRUNCATED: 'Uno de los valores no es válido para su campo.',
  ER_DATA_TOO_LONG: 'Uno de los textos es demasiado largo.',
  ECONNREFUSED: 'No fue posible conectar con MySQL. Revisa que el servidor esté encendido y el archivo .env.',
  ER_ACCESS_DENIED_ERROR: 'Usuario o contraseña de MySQL incorrectos. Revisa el archivo .env.'
};

export function mensajeError(error) {
  return MENSAJES_MYSQL[error?.code] ?? error?.message ?? 'Ocurrió un error inesperado.';
}
