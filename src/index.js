import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from "sweetalert2";
import Acciones from "./Acciones.js";
import './style.css';

const btn_player1 = document.getElementById("btn_player1");
const btn_player2 = document.getElementById("btn_player2");
const player1 = document.getElementById("py1");
const player2 = document.getElementById("py2");
const nombre1 = document.getElementById("player1");
const nombre2 = document.getElementById("player2");
const campo_player1 = document.getElementById("campo_p1") || nombre1.closest(".col-md-5");
const campo_player2 = document.getElementById("campo_p2") || nombre2.closest(".col-md-5");
let pj1 = "", pj2 = "";
let jugador1, jugador2;

nombre1.addEventListener("input",(event) =>{
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/,"");
});
nombre2.addEventListener("input",(event) =>{
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/,"");
});

const remover_seleccion = (color,...elementos) =>{
    elementos.map((elemento)=>{
        elemento.classList.remove("bg-warning");
        elemento.classList.add(color);
    });
}

const msj_error = (msj) =>{
    Swal.fire({
        title: "Error!",
        text: msj,
        icon: "warning",
        confirmButtonColor: "#dc3545"
    });
}

const preview_p1 = document.getElementById("preview_p1");
const img_preview_p1 = document.getElementById("img_preview_p1");
const name_preview_p1 = document.getElementById("name_preview_p1");

const preview_p2 = document.getElementById("preview_p2");
const img_preview_p2 = document.getElementById("img_preview_p2");
const name_preview_p2 = document.getElementById("name_preview_p2");

const MAPA_PERSONAJES = {
    "Veguitto": "./public/img/DB/Veguito/base.png",
    "Veguito": "./public/img/DB/Veguito/base.png",
    "Trunks": "./public/img/DB/Trunks/base.png",
    "Gohan": "./public/img/DB/Gohan/base.png",
    "Goku": "./public/img/DB/Goku/base.png",
    "Veguetta": "./public/img/DB/Veguetta/base.png",
    "Vegeta": "./public/img/DB/Veguetta/base.png",
    "Cell": "./public/img/DB/Cell/base.png",
    "Pikoro": "./public/img/DB/Pikoro/base.png",
    "Piccolo": "./public/img/DB/Pikoro/base.png",
    "Gogeta": "./public/img/DB/Gogueta/base.png",
    "Gogueta": "./public/img/DB/Gogueta/base.png"
};

const imagenes_p1 = player1.querySelectorAll(".row img");
const imagenes_p2 = player2.querySelectorAll(".row img");

for(let i=0; i<imagenes_p1.length; i++){
    imagenes_p1[i].addEventListener("click",() => {
        if (jugador1) return;
        remover_seleccion("bg-danger",...imagenes_p1);
        imagenes_p1[i].classList.remove("bg-danger");
        imagenes_p1[i].classList.add("bg-warning");
        pj1 = imagenes_p1[i].alt;
        if(img_preview_p1 && preview_p1 && MAPA_PERSONAJES[pj1]){
            img_preview_p1.src = MAPA_PERSONAJES[pj1];
            img_preview_p1.alt = pj1;
            if(name_preview_p1) name_preview_p1.textContent = pj1;
            preview_p1.classList.remove("d-none");
        }
    });
}
for(let i=0; i<imagenes_p2.length; i++){
    imagenes_p2[i].addEventListener("click",() => {
        if (jugador2) return;
        remover_seleccion("bg-primary",...imagenes_p2);
        imagenes_p2[i].classList.remove("bg-primary");
        imagenes_p2[i].classList.add("bg-warning");
        pj2 = imagenes_p2[i].alt;
        if(img_preview_p2 && preview_p2 && MAPA_PERSONAJES[pj2]){
            img_preview_p2.src = MAPA_PERSONAJES[pj2];
            img_preview_p2.alt = pj2;
            if(name_preview_p2) name_preview_p2.textContent = pj2;
            preview_p2.classList.remove("d-none");
        }
    });
}

btn_player1.addEventListener("click",() => {
    if(nombre1.value == ""){
        msj_error("El jugador 1 no ah ingresado su NickName");
    }else if(pj1 == ""){
        msj_error("El jugador 1 no ah seleccionado un personaje");
    }else{
        jugador1 = new Acciones(nombre1.value,pj1);
        nombre1.disabled = true;
        if(campo_player1) campo_player1.classList.add("d-none");
        player1.querySelector(".row").classList.add("d-none");
        player1.querySelector("p").textContent = nombre1.value;
        btn_player1.classList.add("d-none");
        actualizarCombate();
    }
});

btn_player2.addEventListener("click",() => {
    if(nombre2.value == ""){
        msj_error("El jugador 2 no ah ingresado su NickName");
    }else if(pj2 == ""){
        msj_error("El jugador 2 no ah seleccionado un personaje");
    }else{
        jugador2 = new Acciones(nombre2.value,pj2);
        nombre2.disabled = true;
        if(campo_player2) campo_player2.classList.add("d-none");
        player2.querySelector(".row").classList.add("d-none");
        player2.querySelector("p").textContent = nombre2.value;
        btn_player2.classList.add("d-none");
        actualizarCombate();
    }
});

// Controles compartidos por ambos jugadores.
let combateTerminado = false;
const estado = (n, mensaje) => {
    document.getElementById(`p${n}-estado`).textContent = mensaje;
};

function actualizarCombate() {
    const listos = Boolean(jugador1 && jugador2);
    [jugador1, jugador2].forEach((jugador, i) => {
        const n = i + 1;
        if (jugador) {
            for (const [stat, valor] of Object.entries({vida: jugador.getVida(), ki: jugador.getKi(), energia: jugador.getEnergia()})) {
                const barra = document.getElementById(`p${n}-${stat}`);
                barra.style.width = `${valor}%`;
                barra.textContent = `${valor}%`;
                barra.setAttribute("aria-valuenow", valor);
            }
            document.getElementById(`p${n}-semillas`).textContent = jugador.getSemilla();
        }
        const activo = listos && !combateTerminado;
        document.getElementById(`p${n}-cargar`).disabled = !activo || (jugador.getKi() === 100 && jugador.getEnergia() === 100);
        document.getElementById(`p${n}-basico`).disabled = !activo || jugador.getKi() < 10 || jugador.getEnergia() < 5;
        document.getElementById(`p${n}-especial`).disabled = !activo || jugador.getKi() < 20 || jugador.getEnergia() < 15;
        document.getElementById(`p${n}-semilla`).disabled = !activo || jugador.getSemilla() === 0 || (jugador.getVida() === 100 && jugador.getKi() === 100 && jugador.getEnergia() === 100);
        if (!listos && jugador) estado(n, "Listo. Esperando al otro jugador.");
        else if (listos && !combateTerminado && document.getElementById(`p${n}-estado`).textContent.match(/Esperando|Elige/)) estado(n, "¡Listos para combatir!");
    });
}

function ejecutarAccion(n, accion) {
    if (!jugador1 || !jugador2 || combateTerminado) return;
    const jugador = n === 1 ? jugador1 : jugador2;
    const rival = n === 1 ? jugador2 : jugador1;
    if (document.getElementById(`p${n}-${accion}`).disabled) return;
    let mensaje;
    if (accion === "cargar") {
        jugador.cargaEnergia();
        mensaje = "Cargaste ki (+10) y energía (+15).";
    } else if (accion === "semilla") {
        jugador.curacion();
        mensaje = "Semilla usada: vida, ki y energía restaurados.";
    } else {
        const especial = accion === "especial";
        if (especial) jugador.atkEspecial(); else jugador.atkBasico();
        const dano = especial ? 25 : 10;
        rival.setVida(Math.max(0, rival.getVida() - dano));
        mensaje = `${especial ? "Ataque especial" : "Ataque básico"}: ${dano} de daño.`;
        estado(n === 1 ? 2 : 1, `Recibiste ${dano} de daño.`);
    }
    estado(n, mensaje);
    if (rival.getVida() === 0) {
        combateTerminado = true;
        estado(n, "¡Ganaste el combate!");
        estado(n === 1 ? 2 : 1, "Sin vida. Combate terminado.");
        Swal.fire({title: "¡Victoria!", text: `${jugador.getNombre()} ganó el combate.`, icon: "success"});
    }
    actualizarCombate();
}

for (const n of [1, 2]) {
    for (const accion of ["cargar", "especial", "basico", "semilla"]) {
        document.getElementById(`p${n}-${accion}`).addEventListener("click", () => ejecutarAccion(n, accion));
    }
}
