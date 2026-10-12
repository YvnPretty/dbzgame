// Se admiten letras Unicode (incluidas ñ y vocales acentuadas) y números.
export const nombreValido = (nombre) =>
  typeof nombre === 'string' && /^[\p{L}\p{N}]{1,24}$/u.test(nombre);
