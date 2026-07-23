import { elementos } from './ui/dom.js';
import { crearEstadoJuego } from './juego/estadoJuego.js';
import { jugarRonda } from './juego/juego.js';
import { RESULTADO } from './juego/reglas.js';
import { obtenerMejorRacha, guardarMejorRachaSiSupera } from './juego/puntaje.js';
import { inicializarRankingSemilla, obtenerTopRanking, guardarPuntuacion } from './ranking/ranking.js';
import { mostrarCarta } from './ui/renderCarta.js';
import { actualizarRacha, actualizarMejorRacha } from './ui/renderPuntaje.js';
import { mostrarMensaje } from './ui/renderMensaje.js';
import { habilitarPrediccion, deshabilitarPrediccion } from './ui/renderBotones.js';
import { renderizarRanking } from './ui/renderRanking.js';
import { mostrarConFadeIn, ocultarConFadeOut } from './ui/renderTransicion.js';

const NOMBRE_POR_DEFECTO = 'Jugador';

let estado;
let nombreJugador = NOMBRE_POR_DEFECTO;

const actualizarRankingEnPantalla = () => {
    renderizarRanking(elementos.listaRanking, obtenerTopRanking());
};

const iniciarPartida = () => {
    estado = crearEstadoJuego();
    mostrarCarta(elementos.cartaActual, estado.obtenerCartaActual());
    actualizarRacha(elementos.racha, estado.obtenerRacha());
    actualizarMejorRacha(elementos.mejorRacha, obtenerMejorRacha());
    mostrarMensaje(elementos.mensaje, '¿La siguiente carta será mayor o menor?', 'info');
    habilitarPrediccion(elementos);
    elementos.btnVolverRanking.classList.add('hidden');
};

const finalizarPartida = (texto, tipo) => {
    mostrarMensaje(elementos.mensaje, texto, tipo);
    deshabilitarPrediccion(elementos);
    if (estado.obtenerRacha() > 0) {
        guardarPuntuacion(nombreJugador, estado.obtenerRacha());
    }
    elementos.btnVolverRanking.classList.remove('hidden');
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
        finalizarPartida('Fallaste. Fin de la partida.', 'error');
        return;
    }

    if (!estado.quedanCartas()) {
        finalizarPartida('¡Te quedaste sin cartas! Ganaste la partida.', 'exito');
        return;
    }

    mostrarMensaje(elementos.mensaje, '¡Correcto! Sigue así.', 'exito');
};

const manejarContinuar = () => {
    nombreJugador = elementos.inputNombre.value.trim() || NOMBRE_POR_DEFECTO;
    ocultarConFadeOut(elementos.pantallaInicio, () => {
        mostrarConFadeIn(elementos.pantallaJuego);
        iniciarPartida();
    });
};

const manejarVolverRanking = () => {
    actualizarRankingEnPantalla();
    ocultarConFadeOut(elementos.pantallaJuego, () => {
        mostrarConFadeIn(elementos.pantallaInicio);
    });
};

export const inicializarEventos = () => {
    inicializarRankingSemilla();
    actualizarRankingEnPantalla();

    elementos.btnContinuar.addEventListener('click', manejarContinuar);
    elementos.btnVolverRanking.addEventListener('click', manejarVolverRanking);
    elementos.btnMayor.addEventListener('click', () => manejarPrediccion(RESULTADO.MAYOR));
    elementos.btnMenor.addEventListener('click', () => manejarPrediccion(RESULTADO.MENOR));
    elementos.btnNuevoJuego.addEventListener('click', iniciarPartida);
};
