class Personaje{
    #vida = 100;
    #nombre;
    #personaje;
    #ki = 100;
    #energia = 100;
    #semilla = 2;

    constructor(nombre, personaje = ""){
        this.#nombre = nombre;
        this.#personaje = personaje;
        this.mostrarEstadisticas();
    }
    mostrarEstadisticas(){
        console.log(`
            nombre:${this.#nombre},
            personaje:${this.#personaje},
            *************************
            ki:${this.#ki},
            vida:${this.#vida},
            energia:${this.#energia},
            semilla:${this.#semilla},
        `);
    }
    getVida(){
        return this.#vida;
    }
    getKi(){
        return this.#ki;
    }
    getEnergia(){
        return this.#energia;
    }
    getSemilla(){
        return this.#semilla;
    }
    getNombre(){
        return this.#nombre;
    }
    setVida(vida){
        this.#vida = vida;
    }
    setKi(ki){
        this.#ki = ki;
    }
    setEnergia(energia){
        this.#energia = energia;
    }
    setSemilla(semilla){
        this.#semilla = semilla;
    }
}

export default Personaje;
