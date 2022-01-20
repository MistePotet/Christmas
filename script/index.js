const juego = document.getElementById("juego")
const marcador = document.getElementById("marcador");
const start = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");
const boton = document.getElementById('boton');
const cerrado = document.getElementById('cerrado');
const abierto = document.getElementById('abierto');
const postal = document.getElementById('postal');
const finish = document.getElementById('win');
const feliz = document.getElementById('feliz');
const luz = document.getElementById('luz');
const rober = document.getElementById('rober');
const nieve = document.getElementById('nieve2');
const creditos = document.getElementById('creditos');
const azul = document.getElementById('azul');
const rojo = document.getElementById('rojo');
const verde = document.getElementById('verde');
const morado = document.getElementById('morado');
const rojo2 = document.getElementById('rojo2');
const verde2 = document.getElementById('verde2');
const selector3 = document.getElementById('selector3');
const elije = document.getElementById('elije');
const elije2 = document.getElementById('elije2');
const obj1 = document.getElementById('obj1');
const obj2 = document.getElementById('obj2');
const obj3 = document.getElementById('obj3');
const obj4 = document.getElementById('obj4');
const obj5 = document.getElementById('obj5');
const salto = document.getElementById('salto');
const objetivo = document.getElementById('objetivo');
const gramola = document.getElementById('gramola');
const audio = document.getElementById('audio');
const selector = document.getElementById('selector2');
const mano = document.getElementById('mano');
const mano_sobre = document.getElementById('mano_sobre');

const ctx = juego.getContext("2d")

const DIRECCIONES = {
    ARRIBA: 1,
    ABAJO: 2,
    IZQUIERDA: 3,
    DERECHA: 4
}

const FPS = 1000 / 10

const mapWidth = 370

const mapHeight = 280

let direccion = DIRECCIONES.DERECHA
let cabezaPosX = 10, cabezaPosY = 10

let coso = [
    { posX: 10, posY: 10 }
]

let posicionesDeCoso = new Set()

let comida = crearComida()

let puntos = 0

let objetivo_puntos = 0;

let intervaloDeJuego;

const aumentarMarcador = () => {
    marcador.innerText = puntos;
}

const agregarObjetivo = () => {
    if (objetivo_puntos >= 1000){
        
    objetivo.innerText = 'X';
    } else {
        
    objetivo.innerText = objetivo_puntos;
    }
}

function dibujaCoso() {
    for (let unidadDeCoso of coso) {
        ctx.beginPath()
        ctx.rect(unidadDeCoso.posX, unidadDeCoso.posY, 10, 10)
        ctx.stroke()
    }
}

function dibujarComida() {
    ctx.beginPath()
    ctx.rect(comida.posX, comida.posY, 10, 10)
    ctx.stroke()
}

function ajustarPosicion() {
    if (direccion === DIRECCIONES.DERECHA) cabezaPosX +=10;
    else if (direccion === DIRECCIONES.IZQUIERDA) cabezaPosX -=10;
    else if (direccion === DIRECCIONES.ABAJO) cabezaPosY +=10;
    else if (direccion === DIRECCIONES.ARRIBA) cabezaPosY -=10;
    else throw new Error("La dirección tiene un valor inválido asignado");

    coso.unshift({ posX: cabezaPosX, posY: cabezaPosY })
    coso.pop()
}

function agregarUnidadACoso() {
    let direccionUltimaUnidad 
    let ultimaUnidad

    if (coso.length === 1) {
        direccionUltimaUnidad = direccion
        ultimaUnidad = coso[0]
    } else {
        ultimaUnidad = coso[coso.length - 1]
        let penultimaUnidad = coso[coso.length - 2]

        let diferenciaX = penultimaUnidad.posX - ultimaUnidad.posX
        let diferenciaY = penultimaUnidad.posY - ultimaUnidad.posY

        if (diferenciaX > 0) {
            direccionUltimaUnidad = DIRECCIONES.DERECHA
        } else if (diferenciaX < 0) {
            direccionUltimaUnidad = DIRECCIONES.IZQUIERDA
        } else if (diferenciaY > 0) {
            direccionUltimaUnidad = DIRECCIONES.ABAJO
        } else if (diferenciaY <0) {
            direccionUltimaUnidad = DIRECCIONES.ARRIBA
        }
    }

    switch(direccionUltimaUnidad) {
        case DIRECCIONES.ARRIBA:
            nuevaUnidad = { posX: ultimaUnidad.posX, posY: ultimaUnidad.posY + 10 }
            break;
        case DIRECCIONES.ABAJO:
            nuevaUnidad = { posX: ultimaUnidad.posX, posY: ultimaUnidad.posY - 10 }
            break;
        case DIRECCIONES.DERECHA:
            nuevaUnidad = { posX: ultimaUnidad.posX + 10, posY: ultimaUnidad.posY }
            break;
        case DIRECCIONES.IZQUIERDA:
            nuevaUnidad = { posX: ultimaUnidad.posX - 10, posY: ultimaUnidad.posY }
            break;
    }

    coso.push(nuevaUnidad)
}

function incrementarPuntaje() {
    puntos++
    aumentarMarcador()
}

function limpiarCanvas() {
    ctx.clearRect(0, 0, juego.clientWidth, juego.height);
}

function revisarColisiones() {
    if (cabezaPosX < 0 || cabezaPosY < 0 || cabezaPosX >= mapWidth || cabezaPosY >= mapHeight) {
        console.log("Has chocado con la pared!")
        gameOver()
    }

    if (posicionesDeCoso.size !== coso.length) {
        console.log("Has chocado contigo mismo!")
        gameOver()
    }

    if (posicionesDeCoso.has(`${comida.posX}${comida.posY}`)) {
        comida = crearComida()
        incrementarPuntaje()
        agregarUnidadACoso()

    }
}

const direccionEventos = e => {
    if (e.code === "ArrowUp" && direccion !== DIRECCIONES.ABAJO) {
        direccion = DIRECCIONES.ARRIBA
    } else if (e.code === "ArrowDown" && direccion !== DIRECCIONES.ARRIBA) {
        direccion = DIRECCIONES.ABAJO
    } else if (e.code === "ArrowLeft" && direccion !== DIRECCIONES.DERECHA) {
        direccion = DIRECCIONES.IZQUIERDA
    } else if (e.code === "ArrowRight" && direccion !== DIRECCIONES.IZQUIERDA) {
        direccion = DIRECCIONES.DERECHA
    }
}

function crearComida() {
    let min = Math.ceil(5);
    let max = Math.floor(25);
    let posX = (Math.floor(Math.random() * (max - min)) + min) * 10
    let posY = (Math.floor(Math.random() * (max - min)) + min) * 10

    if (posicionesDeCoso.has(`${posX}${posY}`)) {
        return crearComida()
    }

    return { posX, posY }
}

function actualizarPosicionesDeCoso() {
    posicionesDeCoso = new Set()
    coso.forEach(unidadDeCoso => posicionesDeCoso.add(`${unidadDeCoso.posX}${unidadDeCoso.posY}`))
}

function gameLoop() {
    limpiarCanvas()
    ajustarPosicion()
    actualizarPosicionesDeCoso()
    dibujaCoso()
    dibujarComida()
    revisarColisiones()
    win()
}

function gameOver() {
    clearInterval(intervaloDeJuego)
    gameOverSign.style.display = 'block';   
    start.style.opacity = '100%';
    selector.style.opacity = '100%';
    start.disabled = false;
    elije.style.display = 'block';
    elije2.style.display = 'block';
    selector3.style.display = 'block';
    obj1.style.display = 'block';
    obj2.style.display = 'block';
    obj3.style.display = 'block';
    obj4.style.display = 'block';
    obj5.style.display = 'block';
    salto.style.display = 'block';
}

function setGame() {
    puntos = 0;
    coso.length = 1;
    marcador.innerText = puntos;
    cabezaPosX = 10;
    cabezaPosY = 10;
    direccion = DIRECCIONES.DERECHA
}

const startGame = () => {
    setGame()
    gameOverSign.style.display = 'none';
    start.style.opacity = '0%';
    selector.style.opacity = '0%';
    gameLoop()
    document.addEventListener('keyup', direccionEventos);
    intervaloDeJuego = setInterval(gameLoop, FPS);
}

start.addEventListener('click', startGame)

function win() {
    if (puntos === objetivo_puntos) {
        finish.style.animation = 'win 4s forwards'
        azul.style.animation = 'azul 7s 1s';
        verde.style.animation = 'verde 7s 1s';
        rojo.style.animation = 'rojo 7s 1s';
        rojo2.style.animation = 'rojo 7s 1s';
        verde2.style.animation = 'verde 7s 1s';
        morado.style.animation = 'morado 7s 1s';
        mano_sobre.style.animation = 'mano_sobre 4.5s 3s forwards';
        mano.style.animation = 'mano 5s 6s forwards';
        boton.style.animation = 'aparicion1 1.8s 6s forwards';
        cerrado.style.animation = 'aparicion2 1.8s 6s forwards';
        gameOverSign.style.display = 'none';
        comida = 0;
        coso = 0;
    }
}

function saltarJuego() {
    mano_sobre.style.animation = 'mano_sobre 4.5s 1.8s forwards';
    mano.style.animation = 'mano 5s 5s forwards';
    boton.style.animation = 'aparicion1 1.8s 4s forwards';
    cerrado.style.animation = 'aparicion2 1.8s 4s forwards';
    gameOverSign.style.display = 'none';    
}

const carta = () => {
    boton.style.animation = 'boton 3s forwards';
    cerrado.style.animation = 'cerrado 4s forwards';
    abierto.style.animation = 'abierto 4s forwards';
    postal.style.animation = 'postal 4s 1s forwards';
    nieve.style.animation = 'nieve2 4s 5s forwards';
    rober.style.animation = 'rober 4s 8s forwards linear';
    feliz.style.animation = 'feliz 3s 10s forwards';
    luz.style.animation = 'luz 3s 13s infinite';
    negro.style.animation = 'negro 7s 16s forwards linear'
    creditos.style.animation = 'creditos 7s 16s forwards linear';
}

boton.addEventListener('click', carta)

const accion1 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    objetivo_puntos = 5;
    agregarObjetivo()
}

const accion2 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    objetivo_puntos = 10;
    agregarObjetivo()
}

const accion3 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    objetivo_puntos = 15;
    agregarObjetivo()
}

const accion4 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    objetivo_puntos = 20;
    agregarObjetivo()
}

const accion5 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    objetivo_puntos = 1036;
    agregarObjetivo()
}

const accion6 = () => {
    limpiarCanvas()
    puntos = 0;
    marcador.innerText = puntos;
    gameOverSign.style.display = 'none';
    elije.style.display = 'none';
    elije2.style.display = 'none';
    selector3.style.display = 'none';
    obj1.style.display = 'none';
    obj2.style.display = 'none';
    obj3.style.display = 'none';
    obj4.style.display = 'none';
    obj5.style.display = 'none';
    salto.style.display = 'none';
    objetivo_puntos = 1036;
    agregarObjetivo()
    saltarJuego()
}

obj1.addEventListener('click', accion1)
obj2.addEventListener('click', accion2)
obj3.addEventListener('click', accion3)
obj4.addEventListener('click', accion4)
obj5.addEventListener('click', accion5)
salto.addEventListener('click', accion6)


function musica() {
    audio.play();
}

gramola.addEventListener('click', musica)