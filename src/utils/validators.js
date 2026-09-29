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
export function validarMonto(valor, permitirCero = false) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || (permitirCero ? numero < 0 : numero <= 0)) throw new Error('El monto no es válido.');
  return numero;
}
