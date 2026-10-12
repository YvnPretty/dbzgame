// Frases breves para la presentación y las animaciones de cada luchador.
const DIALOGOS = {
  Goku: '¡Vamos, muéstrame tu máximo poder!',
  Veguitto: '¡La fusión está lista para el combate!',
  Trunks: '¡Protegeré el futuro!',
  Gohan: '¡No voy a rendirme!',
  Veguetta: '¡Contempla el poder del príncipe saiyajin!',
  Cell: '¡Conoce mi forma perfecta!',
  Pikoro: '¡Concéntrate, la batalla comienza!',
  Gogeta: '¡Terminemos este combate con todo nuestro poder!',
};
export const dialogoDe = (personaje) => DIALOGOS[personaje] ?? '¡A luchar!';
