import test from 'node:test';
import assert from 'node:assert/strict';
import { nombreValido } from '../src/validacion.js';
import { dialogoDe } from '../src/dialogos.js';
import Combate from '../src/Combate.js';

test('nombres permiten letras y números, incluidas letras en español', () => {
  for (const nombre of ['César123', 'Ana', 'Goku2', 'Ñoño', '123'])
    assert.equal(nombreValido(nombre), true);
});
test('rechaza vacío, espacios, símbolos, HTML y nombres demasiado largos', () => {
  for (const nombre of ['', ' ', 'Ana Luis', ' Ana', 'Ana ', 'Ana!', '<img>', 'a'.repeat(25)]) {
    assert.equal(nombreValido(nombre), false);
    assert.throws(() => new Combate([{ nombre, personaje: 'Goku' }, { nombre: 'Luis', personaje: 'Cell' }]));
  }
});
test('cada personaje tiene diálogo propio', () => {
  const nombres = ['Goku', 'Veguitto', 'Trunks', 'Gohan', 'Veguetta', 'Cell', 'Pikoro', 'Gogeta'];
  assert.equal(new Set(nombres.map(dialogoDe)).size, 8);
});
