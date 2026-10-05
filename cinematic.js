(() => {
  const ATTACKS = {
    Veguito: {
      aliases: ["Veguito", "Veguitto"],
      folder: "Veguito",
      basico: { nombre: "Spirit Sword", frase: "Una hoja de ki directa al rival." },
      especial: { nombre: "Final Kamehameha", frase: "La fusión concentra todo su poder en un solo disparo." }
    },
    Trunks: {
      aliases: ["Trunks"],
      folder: "Trunks",
      basico: { nombre: "Finish Buster", frase: "¡El futuro no termina aquí!" },
      especial: { nombre: "Burning Attack", frase: "Una ráfaga explosiva lanzada a máxima potencia." }
    },
    Gohan: {
      aliases: ["Gohan"],
      folder: "Gohan",
      basico: { nombre: "Masenko", frase: "¡No voy a dejar que lastimes a nadie!" },
      especial: { nombre: "Kamehameha Padre-Hijo", frase: "Todo el poder de Gohan concentrado en el golpe decisivo." }
    },
    Goku: {
      aliases: ["Goku"],
      folder: "Goku",
      basico: { nombre: "Golpe Meteoro", frase: "¡Esto todavía no termina!" },
      especial: { nombre: "Kamehameha", frase: "Ki concentrado y liberado de frente a máxima potencia." }
    },
    Veguetta: {
      aliases: ["Veguetta", "Vegeta"],
      folder: "Veguetta",
      basico: { nombre: "Galick Gun", frase: "¡El orgullo de un Saiyajin!" },
      especial: { nombre: "Final Flash", frase: "Una descarga devastadora concentrada en ambas manos." }
    },
    Cell: {
      aliases: ["Cell"],
      folder: "Cell",
      basico: { nombre: "Rayo Perfecto", frase: "La perfección no admite errores." },
      especial: { nombre: "Kamehameha Perfecto", frase: "Cell lleva su energía al límite para acabar el combate." }
    },
    Pikoro: {
      aliases: ["Pikoro", "Piccolo"],
      folder: "Pikoro",
      basico: { nombre: "Granada Infernal", frase: "¡No bajes la guardia!" },
      especial: { nombre: "Makankosappo", frase: "Un rayo perforante de energía concentrada." }
    },
    Gogueta: {
      aliases: ["Gogueta", "Gogeta"],
      folder: "Gogueta",
      basico: { nombre: "Big Bang Kamehameha", frase: "La fusión combina velocidad y poder en un solo ataque." },
      especial: { nombre: "Stardust Breaker", frase: "Esto termina ahora." }
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

  function setAttackLabels(playerNumber) {
    const character = getCharacter(playerNumber);
    if (!character) return;

    const basicButton = document.getElementById(`p${playerNumber}-basico`);
    const specialButton = document.getElementById(`p${playerNumber}-especial`);

    if (basicButton) {
      basicButton.innerHTML =
        '<i class="fa-solid fa-hand-fist" aria-hidden="true"></i>' +
        `<span class="attack-label">${character.basico.nombre}</span>`;
      basicButton.setAttribute("aria-label", character.basico.nombre);
    }

    if (specialButton) {
      specialButton.innerHTML =
        '<i class="fa-solid fa-fire" aria-hidden="true"></i>' +
        `<span class="attack-label">${character.especial.nombre}</span>`;
      specialButton.setAttribute("aria-label", character.especial.nombre);
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

  const cinematic = buildCinematic();
  const cinematicImage = cinematic.querySelector(".attack-cinematic__character");
  const fighterText = cinematic.querySelector(".attack-cinematic__fighter");
  const attackText = cinematic.querySelector(".attack-cinematic__attack");
  const phraseText = cinematic.querySelector(".attack-cinematic__phrase");
  let closeTimer = null;

  function showAttack(playerNumber, attackType) {
    const character = getCharacter(playerNumber);
    if (!character || !character[attackType]) return;

    const attack = character[attackType];
    const nickname = document.querySelector(`#py${playerNumber} > p`)?.textContent?.trim();
    const displayFighter = nickname && nickname !== "Seleccionar personaje"
      ? `${nickname} · ${character.key}`
      : character.key;

    if (closeTimer) clearTimeout(closeTimer);

    cinematic.className = "";
    void cinematic.offsetWidth;

    cinematic.classList.add(
      "is-active",
      attackType === "especial" ? "is-special" : "is-basic",
      `player-${playerNumber}`
    );
    cinematic.setAttribute("aria-hidden", "false");

    fighterText.textContent = displayFighter;
    attackText.textContent = attack.nombre;
    phraseText.textContent = attack.frase;

    const src = `./public/img/DB/${character.folder}/${attackType}.png`;
    const fallback = `./public/img/DB/${character.folder}/base.png`;
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

    ["basico", "especial"].forEach(attackType => {
      const button = document.getElementById(`p${playerNumber}-${attackType}`);
      if (!button) return;
      button.addEventListener("click", () => {
        if (!button.disabled) showAttack(playerNumber, attackType);
      });
    });
  });
})();
