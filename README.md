# DBZ 2.0 — Combate por turnos

Proyecto académico de **Aplicaciones Web Frontend**. Aplicación web de combate local para dos jugadores, desarrollada con HTML, CSS y JavaScript orientado a objetos.

| Datos académicos |                           |
| ---------------- | ------------------------- |
| Asignatura       | Aplicaciones Web Frontend |
| Profesor         | Yakumo                    |
| Alumno           | Meza Corella Cesar        |

**[Abrir el juego](https://YvnPretty.github.io/dbzgame/)**

## Descripción

Cada jugador introduce su nombre, selecciona un personaje y confirma su elección. Los participantes alternan turnos y administran vida, ki, energía y semillas del ermitaño hasta que uno de los personajes pierde toda su vida.

El proyecto incluye selección mediante ratón o teclado, animaciones de ataques, música de batalla, diálogos propios, pantalla de carga, registro de movimientos y alerta del ganador con regreso a la selección. Las partidas son locales, en un mismo dispositivo, y se reinician al recargar la página.

## Reglas del juego

| Acción               | Efecto                                                         | Consumo                             |
| -------------------- | -------------------------------------------------------------- | ----------------------------------- |
| Ataque básico        | 15 puntos de daño                                              | 5 de energía y 10 de ki             |
| Ataque especial      | 30 puntos de daño; disponible después de dos turnos            | 15 de energía y 20 de ki            |
| Defender             | Reduce a la mitad el daño durante el siguiente turno del rival | Un turno                            |
| Cargar energía       | Recupera 15 de energía y 10 de ki, con un máximo de 100        | Un turno                            |
| Semilla del ermitaño | Restaura vida, energía y ki                                    | Una de las dos semillas disponibles |

Los nombres aceptan de 1 a 24 letras o números, incluidas letras acentuadas; no se permiten espacios ni símbolos. Empieza el jugador 1 y cada acción válida cambia el turno. El especial está bloqueado en los turnos globales 1 y 2 y disponible para ambos jugadores desde el turno 3. Las semillas solo pueden usarse si al menos una barra está por debajo de 100.

Una acción inválida no consume el turno. La partida termina cuando un personaje llega a cero de vida.

## Ejecución local

Requisitos: Node.js 22.18 o posterior, npm y Python 3 para el servidor de ejemplo.

```sh
npm ci
npm test
npm run build
python3 -m http.server 8765 --directory dist
```

Abrir `http://localhost:8765`. Después de editar el código, ejecutar nuevamente `npm run build`.

## Organización

```text
.github/workflows/pages.yml  Pruebas, compilación y publicación
src/
  Personaje.js               Estadísticas y ataques de los personajes
  Acciones.js                Ataques, defensa, curación y recarga
  Combate.js                 Turnos, validaciones y victoria
  validacion.js              Validación compartida de nombres
  dialogos.js                Frases de los ocho personajes
  index.js                   Interfaz e interacción
  style.css                  Estilos y animaciones
public/img/                 Imágenes utilizadas por el juego
scripts/build.cjs           Preparación de la carpeta dist
tests/combate.test.js        Pruebas de las reglas de combate
index.html                  Estructura de la página
webpack.config.cjs           Configuración de compilación
babel.config.json           Transpilación ECMAScript con preset-env
```

Bootstrap proporciona la estructura visual, Font Awesome los iconos y SweetAlert2 los avisos. Babel transpila JavaScript mediante babel-loader y Webpack genera la versión de producción en `dist/`.

## Publicación

GitHub Actions ejecuta las pruebas, compila y publica `dist/` en GitHub Pages tras cada cambio en `main`. También se puede iniciar la publicación desde la pestaña **Actions**. En **Settings → Pages**, el origen de publicación debe ser **GitHub Actions**.

El repositorio conserva el código fuente y los recursos utilizados. Las dependencias, los respaldos y los archivos compilados quedan fuera del control de versiones. No se requiere base de datos ni configuración de claves.

## Créditos

Proyecto realizado con fines educativos. Dragon Ball y sus personajes pertenecen a sus respectivos titulares. Los recursos visuales se conservan del proyecto original y no se presentan como creaciones propias.
