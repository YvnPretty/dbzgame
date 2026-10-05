# Dragon Ball Game 2.0

Juego local para dos jugadores con selección de personajes y barras de vida, ki y energía.

## Jugar

La versión compilada está incluida. Desde esta carpeta ejecuta:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Abre http://127.0.0.1:8080, introduce los nombres, elige los personajes y pulsa **Aceptar** para ambos jugadores.

## Controles

- **Cargar ki:** recupera 10 de ki y 15 de energía, hasta 100.
- **Atk básico:** causa 10 de daño; consume 10 de ki y 5 de energía.
- **Atk especial:** causa 25 de daño; consume 20 de ki y 15 de energía.
- **Semilla:** restaura vida, ki y energía; dos por jugador.

Los ataques se desactivan cuando faltan recursos. El combate termina cuando un jugador se queda sin vida. Recarga la página para empezar otra partida.

## Desarrollo

```bash
npm ci
npm run build
```

El código fuente está en `src/` y los recursos en `public/`. La compilación actualiza `public/bundle.js` y `bundle.js`.
