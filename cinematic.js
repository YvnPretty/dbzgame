(() => {
  const ATTACKS = {
    Veguito: {
      aliases: ["Veguito", "Veguitto"],
      folder: "Veguito",
      basico: { nombre: "Spirit Sword", frase: "Una hoja de ki directa al rival.", dano: 10 },
      especial: { nombre: "Final Kamehameha", frase: "La fusión concentra todo su poder en un solo disparo.", dano: 25 }
    },
    Trunks: {
      aliases: ["Trunks"],
      folder: "Trunks",
      basico: { nombre: "Finish Buster", frase: "¡El futuro no termina aquí!", dano: 10 },
      especial: { nombre: "Burning Attack", frase: "Una ráfaga explosiva lanzada a máxima potencia.", dano: 25 }
    },
    Gohan: {
      aliases: ["Gohan"],
      folder: "Gohan",
      basico: { nombre: "Masenko", frase: "¡No voy a dejar que lastimes a nadie!", dano: 10 },
      especial: { nombre: "Kamehameha Padre-Hijo", frase: "Todo el poder de Gohan concentrado en el golpe decisivo.", dano: 25 }
    },
    Goku: {
      aliases: ["Goku"],
      folder: "Goku",
      basico: { nombre: "Golpe Meteoro", frase: "¡Esto todavía no termina!", dano: 10 },
      especial: { nombre: "Kamehameha", frase: "Ki concentrado y liberado de frente a máxima potencia.", dano: 25 }
    },
    Veguetta: {
      aliases: ["Veguetta", "Vegeta"],
      folder: "Veguetta",
      basico: { nombre: "Galick Gun", frase: "¡El orgullo de un Saiyajin!", dano: 10 },
      especial: { nombre: "Final Flash", frase: "Una descarga devastadora concentrada en ambas manos.", dano: 25 }
    },
    Cell: {
      aliases: ["Cell"],
      folder: "Cell",
      basico: { nombre: "Rayo Perfecto", frase: "La perfección no admite errores.", dano: 10 },
      especial: { nombre: "Kamehameha Perfecto", frase: "Cell lleva su energía al límite para acabar el combate.", dano: 25 }
    },
    Pikoro: {
      aliases: ["Pikoro", "Piccolo"],
      folder: "Pikoro",
      basico: { nombre: "Granada Infernal", frase: "¡No bajes la guardia!", dano: 10 },
      especial: { nombre: "Makankosappo", frase: "Un rayo perforante de energía concentrada.", dano: 25 }
    },
    Gogueta: {
      aliases: ["Gogueta", "Gogeta"],
      folder: "Gogueta",
      basico: { nombre: "Big Bang Kamehameha", frase: "La fusión combina velocidad y poder en un solo ataque.", dano: 10 },
      especial: { nombre: "Stardust Breaker", frase: "Esto termina ahora.", dano: 25 }
    }
  };

  const aliasIndex = {};
  Object.entries(ATTACKS).forEach(([key, data]) => {
    data.aliases.forEach(alias => {
      aliasIndex[alias.toLowerCase()] = key;
    });
  });

  function getCharacterKey(playerNumber) {
    const preview = document.getElementById(`name_preview_p${playerNumber}`);
    const previewName = preview?.textContent?.trim();
    const selected = document.querySelector(`#py${playerNumber} .row img.bg-warning`);
    const rawName = previewName || selected?.alt || "";
    return aliasIndex[rawName.toLowerCase()] || null;
  }

  function getCharacter(playerNumber) {
    const key = getCharacterKey(playerNumber);
    return key ? { key, ...ATTACKS[key] } : null;
  }

  function getNickname(playerNumber) {
    const field = document.getElementById(`player${playerNumber}`);
    const label = document.querySelector(`#py${playerNumber} > p`);
    return field?.value?.trim() || label?.textContent?.trim() || `Jugador ${playerNumber}`;
  }

  function setAttackLabels(playerNumber) {
    const character = getCharacter(playerNumber);
    if (!character) return;

    const basicButton = document.getElementById(`p${playerNumber}-basico`);
    const specialButton = document.getElementById(`p${playerNumber}-especial`);

    if (basicButton) {
      basicButton.innerHTML =
        '<i class="fa-solid fa-hand-fist" aria-hidden="true"></i>' +
        `<span class="attack-label">${character.basico.nombre}</span>`;
      basicButton.setAttribute("aria-label", `${character.basico.nombre}, 10 de daño`);
    }

    if (specialButton) {
      specialButton.innerHTML =
        '<i class="fa-solid fa-fire" aria-hidden="true"></i>' +
        `<span class="attack-label">${character.especial.nombre}</span>`;
      specialButton.setAttribute("aria-label", `${character.especial.nombre}, 25 de daño`);
    }
  }

  function buildCinematic() {
    const root = document.createElement("div");
    root.id = "attack-cinematic";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <div class="attack-cinematic__veil"></div>
      <div class="attack-cinematic__flash"></div>
      <div class="attack-cinematic__energy"></div>
      <div class="attack-cinematic__stage">
        <img class="attack-cinematic__character" alt="">
        <div class="attack-cinematic__copy">
          <p class="attack-cinematic__fighter"></p>
          <h2 class="attack-cinematic__attack"></h2>
          <p class="attack-cinematic__phrase"></p>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    return root;
  }

  function buildArena() {
    const arena = document.createElement("section");
    arena.id = "battle-arena";
    arena.setAttribute("aria-label", "Escenario de combate");
    arena.innerHTML = `
      <div class="battle-arena__stage">
        <div class="battle-arena__vs">VS</div>
        <div class="battle-arena__fighters">
          <div id="arena-fighter-p1" class="arena-fighter arena-fighter--p1">
            <img id="arena-img-p1" class="arena-fighter__img" src="" alt="">
            <div id="arena-name-p1" class="arena-fighter__name"></div>
          </div>
          <div id="arena-fighter-p2" class="arena-fighter arena-fighter--p2">
            <img id="arena-img-p2" class="arena-fighter__img" src="" alt="">
            <div id="arena-name-p2" class="arena-fighter__name"></div>
          </div>
        </div>
      </div>
      <div class="battle-arena__hud">
        <div id="arena-hud-p1" class="arena-hud arena-hud--p1">
          <div class="arena-hud__title">
            <span class="arena-hud__player" id="arena-hud-player-p1"></span>
            <span class="arena-hud__character" id="arena-hud-character-p1"></span>
          </div>
        </div>
        <div id="arena-hud-p2" class="arena-hud arena-hud--p2">
          <div class="arena-hud__title">
            <span class="arena-hud__player" id="arena-hud-player-p2"></span>
            <span class="arena-hud__character" id="arena-hud-character-p2"></span>
          </div>
        </div>
      </div>
    `;

    const mainContainer = document.querySelector("body > .container");
    if (mainContainer) {
      mainContainer.insertAdjacentElement("afterend", arena);
    } else {
      document.body.appendChild(arena);
    }
    return arena;
  }

  const cinematic = buildCinematic();
  const arena = buildArena();
  const cinematicImage = cinematic.querySelector(".attack-cinematic__character");
  const fighterText = cinematic.querySelector(".attack-cinematic__fighter");
  const attackText = cinematic.querySelector(".attack-cinematic__attack");
  const phraseText = cinematic.querySelector(".attack-cinematic__phrase");
  let closeTimer = null;
  let battleEntered = false;
  const baseImages = { 1: "", 2: "" };

  function imageFor(playerNumber, type = "base") {
    const character = getCharacter(playerNumber);
    if (!character) return "";
    const file = type === "semilla" ? "curar" : type === "cargar" ? "energia" : type;
    return `./public/img/DB/${character.folder}/${file}.png`;
  }

  function setArenaImage(playerNumber, type = "base") {
    const img = document.getElementById(`arena-img-p${playerNumber}`);
    if (!img) return;
    const src = imageFor(playerNumber, type);
    if (!src) return;
    img.onerror = () => {
      img.onerror = null;
      img.src = imageFor(playerNumber, "base");
    };
    img.src = src;
  }

  function moveCombatUi(playerNumber) {
    const source = document.getElementById(`py${playerNumber}`);
    const hud = document.getElementById(`arena-hud-p${playerNumber}`);
    if (!source || !hud) return;

    const stats = Array.from(source.children).find(el =>
      el.classList?.contains("mt-3") &&
      !el.classList?.contains("battle-actions") &&
      el.querySelector?.(`#p${playerNumber}-vida`)
    );
    const actions = source.querySelector(".battle-actions");
    const status = document.getElementById(`p${playerNumber}-estado`);

    if (stats) hud.appendChild(stats);
    if (actions) hud.appendChild(actions);
    if (status) hud.appendChild(status);
  }

  function enterBattleIfReady() {
    if (battleEntered) return;
    const p1Ready = document.getElementById("btn_player1")?.classList.contains("d-none");
    const p2Ready = document.getElementById("btn_player2")?.classList.contains("d-none");
    if (!p1Ready || !p2Ready) return;

    const c1 = getCharacter(1);
    const c2 = getCharacter(2);
    if (!c1 || !c2) return;

    battleEntered = true;

    [1, 2].forEach(playerNumber => {
      const character = getCharacter(playerNumber);
      const nickname = getNickname(playerNumber);
      baseImages[playerNumber] = imageFor(playerNumber, "base");

      document.getElementById(`arena-name-p${playerNumber}`).textContent = nickname;
      document.getElementById(`arena-hud-player-p${playerNumber}`).textContent = nickname;
      document.getElementById(`arena-hud-character-p${playerNumber}`).textContent = character.key;

      const img = document.getElementById(`arena-img-p${playerNumber}`);
      img.src = baseImages[playerNumber];
      img.alt = `${character.key}, personaje de ${nickname}`;

      moveCombatUi(playerNumber);
      setAttackLabels(playerNumber);
    });

    document.body.classList.add("battle-mode");

    requestAnimationFrame(() => {
      arena.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function pulseClass(element, className, ms) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), ms);
  }

  function showDamage(targetPlayer, damage, special) {
    const target = document.getElementById(`arena-fighter-p${targetPlayer}`);
    if (!target) return;

    pulseClass(target, "is-hit", 470);

    const impact = document.createElement("span");
    impact.className = "impact-flash";
    target.appendChild(impact);
    window.setTimeout(() => impact.remove(), 560);

    const number = document.createElement("span");
    number.className = `damage-number${special ? " is-special" : ""}`;
    number.textContent = `-${damage}`;
    number.setAttribute("aria-label", `${damage} puntos de daño`);
    target.appendChild(number);
    window.setTimeout(() => number.remove(), 980);
  }

  function animateArenaAction(playerNumber, type) {
    if (!battleEntered) return;

    const fighter = document.getElementById(`arena-fighter-p${playerNumber}`);
    const img = document.getElementById(`arena-img-p${playerNumber}`);
    if (!fighter || !img) return;

    if (type === "basico" || type === "especial") {
      const target = playerNumber === 1 ? 2 : 1;
      const damage = type === "especial" ? 25 : 10;

      setArenaImage(playerNumber, type);
      pulseClass(fighter, "is-attacking", 620);

      window.setTimeout(() => {
        showDamage(target, damage, type === "especial");
      }, type === "especial" ? 420 : 310);

      window.setTimeout(() => {
        img.src = baseImages[playerNumber];
      }, type === "especial" ? 1050 : 850);
      return;
    }

    if (type === "cargar") {
      setArenaImage(playerNumber, "cargar");
      pulseClass(fighter, "is-charging", 760);
      window.setTimeout(() => { img.src = baseImages[playerNumber]; }, 760);
      return;
    }

    if (type === "semilla") {
      setArenaImage(playerNumber, "semilla");
      pulseClass(fighter, "is-healing", 760);
      window.setTimeout(() => { img.src = baseImages[playerNumber]; }, 760);
    }
  }

  function showAttack(playerNumber, attackType) {
    const character = getCharacter(playerNumber);
    if (!character || !character[attackType]) return;

    const attack = character[attackType];
    const nickname = getNickname(playerNumber);

    if (closeTimer) clearTimeout(closeTimer);

    cinematic.className = "";
    void cinematic.offsetWidth;

    cinematic.classList.add(
      "is-active",
      attackType === "especial" ? "is-special" : "is-basic",
      `player-${playerNumber}`
    );
    cinematic.setAttribute("aria-hidden", "false");

    fighterText.textContent = `${nickname} · ${character.key}`;
    attackText.innerHTML =
      `${attack.nombre}<span class="attack-cinematic__damage">-${attack.dano} HP</span>`;
    phraseText.textContent = attack.frase;

    const src = imageFor(playerNumber, attackType);
    const fallback = imageFor(playerNumber, "base");
    cinematicImage.alt = `${character.key} ejecutando ${attack.nombre}`;
    cinematicImage.onerror = () => {
      cinematicImage.onerror = null;
      cinematicImage.src = fallback;
    };
    cinematicImage.src = src;

    closeTimer = setTimeout(() => {
      cinematic.classList.remove("is-active");
      cinematic.setAttribute("aria-hidden", "true");
    }, attackType === "especial" ? 1650 : 1450);
  }

  [1, 2].forEach(playerNumber => {
    document
      .querySelectorAll(`#py${playerNumber} .row img`)
      .forEach(image => {
        image.addEventListener("click", () => {
          setTimeout(() => setAttackLabels(playerNumber), 0);
        });
      });

    const previewName = document.getElementById(`name_preview_p${playerNumber}`);
    if (previewName) {
      new MutationObserver(() => setAttackLabels(playerNumber))
        .observe(previewName, { childList: true, characterData: true, subtree: true });
    }

    const acceptButton = document.getElementById(`btn_player${playerNumber}`);
    acceptButton?.addEventListener("click", () => {
      window.setTimeout(enterBattleIfReady, 0);
    });

    ["cargar", "basico", "especial", "semilla"].forEach(actionType => {
      const button = document.getElementById(`p${playerNumber}-${actionType}`);
      if (!button) return;

      button.addEventListener("click", () => {
        if (button.disabled) return;

        if (actionType === "basico" || actionType === "especial") {
          showAttack(playerNumber, actionType);
        }

        animateArenaAction(playerNumber, actionType);
      });
    });
  });

  // Por si el script se carga después de que ambos jugadores ya quedaron listos.
  window.setTimeout(enterBattleIfReady, 50);
})();
