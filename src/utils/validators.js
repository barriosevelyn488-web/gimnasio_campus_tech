export function validarEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarNoVacio(valor) {
  return valor !== undefined && valor !== null && String(valor).trim() !== '';
}

export function validarEnteroPositivo(valor, campo = 'El valor') {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) throw new Error(`${campo} debe ser un entero positivo.`);
  return numero;
}

export function validarEnteroOpcional(valor, campo) {
  return validarNoVacio(valor) ? validarEnteroPositivo(valor, campo) : null;
}

export function validarMonto(valor, permitirCero = false) {
  const numero = Number(valor);
  if (!validarNoVacio(valor) || !Number.isFinite(numero) || (permitirCero ? numero < 0 : numero <= 0)) {
    throw new Error('El monto no es válido.');
  }
  return numero;
}

export function validarFecha(valor, campo = 'La fecha') {
  const texto = String(valor ?? '').trim();
  const fecha = new Date(`${texto}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto) || Number.isNaN(fecha.valueOf()) || fecha.toISOString().slice(0, 10) !== texto) {
    throw new Error(`${campo} debe tener el formato YYYY-MM-DD.`);
  }
  return texto;
}

export function fechaHoy() {
  return new Date().toLocaleDateString('en-CA');
}

export function diaSemanaDeFecha(fecha) {
  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  return dias[(new Date(`${validarFecha(fecha)}T12:00:00`).getDay() + 6) % 7];
}

export function validarRangoFechas(inicio, fin, campo = 'El rango de fechas') {
  const desde = validarFecha(inicio, 'La fecha de inicio');
  const hasta = validarFecha(fin, 'La fecha de fin');
  if (hasta < desde) throw new Error(`${campo} no es válido: la fecha de fin es anterior a la de inicio.`);
  return { desde, hasta };
}

export function parsearJsonOpcional(valor, campo) {
  if (!validarNoVacio(valor)) return [];
  if (typeof valor !== 'string') return valor;
  try {
    const resultado = JSON.parse(valor);
    if (!Array.isArray(resultado)) throw new Error();
    return resultado;
  } catch {
    throw new Error(`${campo} debe ser un arreglo JSON válido, por ejemplo [].`);
  }
}

export function validarPorcentajeOpcional(valor, campo) {
  if (!validarNoVacio(valor)) return null;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 0 || numero > 100) throw new Error(`${campo} debe ser un entero entre 0 y 100.`);
  return numero;
}
