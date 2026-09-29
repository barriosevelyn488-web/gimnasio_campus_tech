export function formatearMoneda(monto, moneda = process.env.MONEDA ?? 'GTQ') {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: moneda }).format(Number(monto));
}
