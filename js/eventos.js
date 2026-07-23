import { elementos } from './ui/dom.js';
import { crearEstadoJuego } from './juego/estadoJuego.js';
import { jugarRonda } from './juego/juego.js';
import { RESULTADO } from './juego/reglas.js';
import { obtenerMejorRacha, guardarMejorRachaSiSupera } from './juego/puntaje.js';
import { mostrarCarta } from './ui/renderCarta.js';
import { actualizarRacha, actualizarMejorRacha } from './ui/renderPuntaje.js';
import { mostrarMensaje } from './ui/renderMensaje.js';
import { habilitarPrediccion, deshabilitarPrediccion } from './ui/renderBotones.js';

let estado;

const iniciarPartida = () => {
    estado = crearEstadoJuego();
    mostrarCarta(elementos.cartaActual, estado.obtenerCartaActual());
    actualizarRacha(elementos.racha, estado.obtenerRacha());
    actualizarMejorRacha(elementos.mejorRacha, obtenerMejorRacha());
    mostrarMensaje(elementos.mensaje, '¿La siguiente carta será mayor o menor?', 'info');
    habilitarPrediccion(elementos);
};

const manejarPrediccion = (prediccion) => {
    if (estado.estaTerminado()) return;

    const { resultado, acierto, cartaNueva } = jugarRonda(estado, prediccion);

    mostrarCarta(elementos.cartaActual, cartaNueva);
    actualizarRacha(elementos.racha, estado.obtenerRacha());
    actualizarMejorRacha(elementos.mejorRacha, guardarMejorRachaSiSupera(estado.obtenerRacha()));

    if (resultado === RESULTADO.EMPATE) {
        mostrarMensaje(elementos.mensaje, 'Empate, la carta es igual. ¡Sigue intentando!', 'info');
        return;
    }

    if (!acierto) {
        mostrarMensaje(elementos.mensaje, 'Fallaste. Fin de la partida.', 'error');
        deshabilitarPrediccion(elementos);
        return;
    }

    if (!estado.quedanCartas()) {
        mostrarMensaje(elementos.mensaje, '¡Te quedaste sin cartas! Ganaste la partida.', 'exito');
        deshabilitarPrediccion(elementos);
        return;
    }

    mostrarMensaje(elementos.mensaje, '¡Correcto! Sigue así.', 'exito');
};

export const inicializarEventos = () => {
    elementos.btnMayor.addEventListener('click', () => manejarPrediccion(RESULTADO.MAYOR));
    elementos.btnMenor.addEventListener('click', () => manejarPrediccion(RESULTADO.MENOR));
    elementos.btnNuevoJuego.addEventListener('click', iniciarPartida);

    iniciarPartida();
};
