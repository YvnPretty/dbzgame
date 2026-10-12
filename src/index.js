import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import Swal from 'sweetalert2';
import Combate from './Combate.js';
import './style.css';

const $ = (id) => document.getElementById(id);
const seleccion = [
  { nombre: '', personaje: '' },
  { nombre: '', personaje: '' },
];
const listos = [false, false];
const carpetas = {
  Veguitto: 'Veguito',
  Trunks: 'Trunks',
  Gohan: 'Gohan',
  Goku: 'Goku',
  Veguetta: 'Veguetta',
  Cell: 'Cell',
  Pikoro: 'Pikoro',
  Gogeta: 'Gogueta',
};
const imagen = (personaje, pose = 'base') =>
  `./public/img/DB/${carpetas[personaje]}/${pose}.png`;
let combate;
let bloqueado = false;
let temporizador;
let battleMusicTimer = null;
let battleMusicContext = null;
const aviso = (text) =>
  Swal.fire({
    title: 'Revisa tu jugada',
    text,
    icon: 'info',
    confirmButtonColor: '#b02a37',
  });

function iniciarMusicaDeBatalla() {
  if (battleMusicTimer) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  battleMusicContext = new AudioCtx();
  const gain = battleMusicContext.createGain();
  gain.gain.value = 0.03;
  gain.connect(battleMusicContext.destination);
  const riff = [
    220, 247, 293.66, 329.63, 293.66, 247, 196, 220, 174.61, 196, 246.94,
    293.66,
  ];
  let indice = 0;
  const tocarNota = (frecuencia, inicio, duracion, forma = 'square') => {
    const oscilador = battleMusicContext.createOscillator();
    const volumen = battleMusicContext.createGain();
    oscilador.type = forma;
    oscilador.frequency.setValueAtTime(
      frecuencia,
      battleMusicContext.currentTime + inicio,
    );
    volumen.gain.setValueAtTime(
      0.0001,
      battleMusicContext.currentTime + inicio,
    );
    volumen.gain.linearRampToValueAtTime(
      0.22,
      battleMusicContext.currentTime + inicio + 0.02,
    );
    volumen.gain.exponentialRampToValueAtTime(
      0.0001,
      battleMusicContext.currentTime + inicio + duracion,
    );
    oscilador.connect(volumen).connect(gain);
    oscilador.start(battleMusicContext.currentTime + inicio);
    oscilador.stop(battleMusicContext.currentTime + inicio + duracion);
  };
  const siguientePaso = () => {
    if (!battleMusicContext) return;
    const nota = riff[indice % riff.length];
    tocarNota(nota, 0, 0.22, 'square');
    if (indice % 2 === 0) tocarNota(nota / 2, 0.04, 0.28, 'sawtooth');
    indice += 1;
    battleMusicTimer = setTimeout(siguientePaso, 240);
  };
  battleMusicTimer = setTimeout(siguientePaso, 240);
}

function detenerMusicaDeBatalla() {
  if (battleMusicTimer) {
    clearTimeout(battleMusicTimer);
    battleMusicTimer = null;
  }
  if (battleMusicContext) {
    battleMusicContext.close();
    battleMusicContext = null;
  }
}

function activarAnimacionPoder(indice, accion = 'basico') {
  const arena = $('arena');
  const luchador = $(`fighter-${indice}`);
  const overlay = $('attack-overlay');
  const visual = $('attack-visual');
  if (!arena || !luchador || !overlay || !visual) return;
  const personaje = seleccion[indice]?.personaje;
  const pose = accion === 'especial' ? 'especial' : 'basico';
  const src = personaje ? imagen(personaje, pose) : '';
  visual.src = src;
  visual.alt = `${personaje ?? 'Personaje'} usando ${accion}`;
  arena.classList.remove('powering');
  luchador.classList.remove('powering');
  overlay.classList.remove('show');
  void arena.offsetWidth;
  void luchador.offsetWidth;
  void overlay.offsetWidth;
  arena.classList.add('powering');
  luchador.classList.add('powering');
  overlay.classList.add('show');
  setTimeout(() => {
    arena.classList.remove('powering');
    luchador.classList.remove('powering');
    overlay.classList.remove('show');
  }, 650);
}

seleccion.forEach((seleccionJugador, i) => {
  const n = i + 1;
  $(`py${n}`)
    .querySelectorAll('.row img')
    .forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Elegir ${img.alt}, jugador ${n}`);
      img.setAttribute('aria-pressed', 'false');
      const elegir = () => {
        if (listos[i]) return;
        seleccionJugador.personaje = img.alt;
        $(`py${n}`)
          .querySelectorAll('.row img')
          .forEach((item) => {
            item.classList.toggle('bg-warning', item === img);
            item.setAttribute('aria-pressed', String(item === img));
          });
        $(`img_preview_p${n}`).src = imagen(img.alt);
        $(`img_preview_p${n}`).alt = img.alt;
        $(`name_preview_p${n}`).textContent = img.alt;
        $(`preview_p${n}`).classList.remove('d-none');
      };
      img.addEventListener('click', elegir);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elegir();
        }
      });
    });
  $(`btn_player${n}`).addEventListener('click', () => {
    const nombre = $(`player${n}`).value.trim();
    if (!nombre) return aviso(`Escribe el nombre del jugador ${n}.`);
    if (!seleccionJugador.personaje)
      return aviso(`Elige el personaje del jugador ${n}.`);
    seleccionJugador.nombre = nombre;
    listos[i] = true;
    $(`player${n}`).disabled = true;
    $(`btn_player${n}`).disabled = true;
    $(`btn_player${n}`).textContent = '¡Listo!';
    $(`py${n}`)
      .querySelectorAll('.row img')
      .forEach((img) => {
        img.tabIndex = -1;
        img.setAttribute('aria-disabled', 'true');
      });
    $('estado').textContent = `Jugador ${n} listo. Esperando al otro jugador…`;
    if (listos.every(Boolean)) iniciar();
  });
});

function iniciar() {
  clearTimeout(temporizador);
  detenerMusicaDeBatalla();
  combate = new Combate(seleccion);
  bloqueado = false;
  $('seleccion').classList.add('d-none');
  $('arena').classList.remove('d-none');
  $('estado').textContent = 'Elige una acción cuando sea tu turno.';
  $('resultado').textContent = '';
  $('registro').replaceChildren();
  $('revancha').classList.add('d-none');
  $('luchadores').innerHTML = seleccion
    .map((jugador, i) => {
      const basico = combate.jugadores[i].getAtaqueBasico().nombre;
      const especial = combate.jugadores[i].getAtaqueEspecial().nombre;
      return `
        <div class="col-md-6"><article id="fighter-${i}" class="fighter p-3 p-lg-4">
            <h3 id="nombre-${i}" class="h4"></h3><p id="personaje-${i}" class="text-secondary"></p>
            <img id="sprite-${i}" class="battle-sprite" alt="">
            ${['vida', 'ki', 'energia'].map((stat) => `<div class="stat-label">${{ vida: 'Vida', ki: 'Ki', energia: 'Energía' }[stat]}</div><div class="progress mb-2"><div id="battle-${i}-${stat}" class="progress-bar bg-${{ vida: 'success', ki: 'info', energia: 'warning' }[stat]} text-dark fw-bold" role="progressbar" aria-label="${stat}" aria-valuemin="0" aria-valuemax="100"></div></div>`).join('')}
            <p id="semillas-${i}" class="mt-3"></p><p id="escudo-${i}" class="shield-status"></p>
            <div class="actions">
                <button class="btn btn-outline-light" data-player="${i}" data-action="basico">${basico} <small>15 daño · −5 energía / −10 ki</small></button>
                <button class="btn btn-warning" data-player="${i}" data-action="especial">${especial} <small>30 daño · −15 energía / −20 ki</small></button>
                <button class="btn btn-outline-info" data-player="${i}" data-action="defensa">Defender <small>Reduce el daño a la mitad</small></button>
                <button class="btn btn-outline-warning" data-player="${i}" data-action="energia">Cargar energía <small>+15 energía / +10 ki</small></button>
                <button class="btn btn-outline-success" data-player="${i}" data-action="curar">Semilla del ermitaño <small>Recupera vida, ki y energía</small></button>
            </div>
        </article></div>`;
    })
    .join('');
  seleccion.forEach((jugador, i) => {
    $(`nombre-${i}`).textContent = `${jugador.nombre} · J${i + 1}`;
    $(`personaje-${i}`).textContent = jugador.personaje;
    $(`sprite-${i}`).src = imagen(jugador.personaje);
    $(`sprite-${i}`).alt = jugador.personaje;
  });
  actualizar();
  $('turno').focus();
}

function actualizar() {
  const terminado = combate.ganador !== null;
  $('turno').textContent = terminado
    ? '¡Combate terminado!'
    : `Turno ${combate.ronda}: ${combate.jugadores[combate.turno].nombre} · J${combate.turno + 1}`;
  combate.jugadores.forEach((jugador, i) => {
    $(`fighter-${i}`).classList.toggle(
      'active-turn',
      !terminado && combate.turno === i,
    );
    for (const [stat, value] of Object.entries({
      vida: jugador.getVida(),
      ki: jugador.getKi(),
      energia: jugador.getEnergia(),
    })) {
      const barra = $(`battle-${i}-${stat}`);
      barra.style.width = `${value}%`;
      barra.textContent = `${value}`;
      barra.setAttribute('aria-valuenow', value);
    }
    $(`semillas-${i}`).textContent =
      `Semillas disponibles: ${jugador.getSemilla()} / 2`;
    $(`escudo-${i}`).textContent = jugador.defendiendo
      ? '🛡 Defensa activa'
      : '';
    document.querySelectorAll(`[data-player="${i}"]`).forEach((btn) => {
      const accion = btn.dataset.action;
      const falta =
        (accion === 'basico' && !jugador.puedeAtacar(5, 10)) ||
        (accion === 'especial' &&
          (combate.turnosTotales < 2 || !jugador.puedeAtacar(15, 20))) ||
        (accion === 'curar' && jugador.getSemilla() === 0);
      btn.disabled = bloqueado || terminado || combate.turno !== i || falta;
    });
  });
  if (terminado) detenerMusicaDeBatalla();
  else if (combate.turnosTotales >= 2) iniciarMusicaDeBatalla();
}

$('luchadores').addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn || bloqueado || btn.disabled) return;
  const i = Number(btn.dataset.player);
  const accion = btn.dataset.action;
  const respuesta = combate.actuar(i, accion);
  if (respuesta.error) return aviso(respuesta.error);
  const entrada = document.createElement('li');
  entrada.textContent = respuesta.mensaje;
  $('registro').prepend(entrada);
  if ($('registro').children.length > 50)
    $('registro').lastElementChild.remove();
  $(`sprite-${i}`).src = imagen(seleccion[i].personaje, 'base');
  if (accion === 'basico' || accion === 'especial')
    activarAnimacionPoder(i, accion);
  bloqueado = true;
  if (respuesta.ganador !== null) {
    $('resultado').textContent =
      `🏆 ¡${seleccion[i].nombre} gana con ${seleccion[i].personaje}!`;
    $('revancha').classList.remove('d-none');
    $('estado').textContent =
      'Puedes jugar la revancha o elegir nuevos personajes.';
  }
  actualizar();
  temporizador = setTimeout(() => {
    seleccion.forEach((jugador, indice) => {
      $(`sprite-${indice}`).src = imagen(jugador.personaje);
    });
    bloqueado = false;
    actualizar();
  }, 500);
});
$('revancha').addEventListener('click', iniciar);
$('cambiar').addEventListener('click', async () => {
  if (combate.ganador === null) {
    const respuesta = await Swal.fire({
      title: '¿Salir del combate?',
      text: 'Se perderá el progreso de esta partida.',
      showCancelButton: true,
      confirmButtonText: 'Cambiar personajes',
      cancelButtonText: 'Seguir jugando',
    });
    if (!respuesta.isConfirmed) return;
  }
  clearTimeout(temporizador);
  detenerMusicaDeBatalla();
  $('arena').classList.add('d-none');
  $('seleccion').classList.remove('d-none');
  $('estado').textContent = 'Elige tus personajes y pulsa Aceptar.';
  listos.fill(false);
  seleccion.forEach((_, i) => {
    $(`player${i + 1}`).disabled = false;
    $(`btn_player${i + 1}`).disabled = false;
    $(`btn_player${i + 1}`).textContent = 'Aceptar';
    $(`py${i + 1}`)
      .querySelectorAll('.row img')
      .forEach((img) => {
        img.tabIndex = 0;
        img.removeAttribute('aria-disabled');
      });
  });
  $('player1').focus();
});
