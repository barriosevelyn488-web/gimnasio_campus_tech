export function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  export function validarNoVacio(valor) {
    return valor !== undefined && valor !== null && valor.toString().trim() !== '';
  }