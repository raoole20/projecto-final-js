import { elementos } from './ui/dom.js';
import { crearEstadoPoker, FASE } from './poker/estadoPoker.js';
import { repartir, resolver, RESULTADO } from './poker/juego.js';
import { esApuestaValida } from './poker/fichas.js';
import { ORDEN_MANOS } from './poker/puntuacion.js';
import { inicializarRankingSemilla, obtenerTopRanking, guardarPuntuacion } from './ranking/ranking.js';
import { renderizarMano, renderizarDorsos, renderizarManoRevelada } from './ui/renderMano.js';
import { renderizarRankingManos } from './ui/renderRankingManos.js';
import { actualizarFichas } from './ui/renderFichas.js';
import { actualizarRonda } from './ui/renderRonda.js';
import { mostrarMensaje } from './ui/renderMensaje.js';
import {
    configurarBotonesApostar,
    configurarBotonesDescarte,
    configurarBotonesFinal,
} from './ui/renderBotones.js';
import { renderizarRanking } from './ui/renderRanking.js';
import { mostrarConFadeIn, ocultarConFadeOut } from './ui/renderTransicion.js';

const NOMBRE_POR_DEFECTO = 'Jugador';

let estado;
let nombreJugador = NOMBRE_POR_DEFECTO;
let mejorFichas = 0;
let partidaGuardada = false;

const actualizarRankingEnPantalla = () => {
    renderizarRanking(elementos.listaRanking, obtenerTopRanking());
};

const guardarPuntuacionUnaVez = () => {
    if (partidaGuardada || !estado) return;
    guardarPuntuacion(nombreJugador, mejorFichas);
    partidaGuardada = true;
};

const refrescarFichas = () => {
    const fichas = estado.obtenerFichas();
    actualizarFichas(elementos.fichas, fichas);
    elementos.inputApuesta.max = fichas;
    mejorFichas = Math.max(mejorFichas, fichas);
};

const dibujarManoJugador = () => {
    renderizarMano(
        elementos.contenedorMano,
        estado.obtenerMano(),
        estado.obtenerRetenidas(),
        manejarClicCarta
    );
};

const mostrarDorsos = () => {
    renderizarDorsos(elementos.contenedorMano);
    renderizarDorsos(elementos.contenedorManoMaquina);
};

const refrescarRonda = () => {
    actualizarRonda(elementos.ronda, estado.obtenerRonda(), estado.obtenerRondasTotales());
};

const iniciarSesionJuego = () => {
    estado = crearEstadoPoker();
    mejorFichas = estado.obtenerFichas();
    partidaGuardada = false;
    refrescarFichas();
    refrescarRonda();
    mostrarDorsos();
    mostrarMensaje(elementos.mensaje, 'Haz tu apuesta y pulsa Apostar.', 'info');
    configurarBotonesApostar(elementos);
};

const manejarClicCarta = (indice) => {
    if (estado.obtenerFase() !== FASE.DESCARTE) return;
    estado.alternarRetencion(indice);
    dibujarManoJugador();
};

const manejarApostar = () => {
    if (estado.obtenerFase() !== FASE.APOSTAR) return;

    const apuesta = Number(elementos.inputApuesta.value);
    if (!esApuestaValida(apuesta, estado.obtenerFichas())) {
        mostrarMensaje(elementos.mensaje, `Apuesta un número entero entre 1 y ${estado.obtenerFichas()} fichas.`, 'error');
        return;
    }

    repartir(estado, apuesta);
    refrescarFichas();
    dibujarManoJugador();
    renderizarDorsos(elementos.contenedorManoMaquina);
    mostrarMensaje(elementos.mensaje, 'Toca las cartas que quieras conservar. Luego Cambiar o Pasar.', 'info');
    configurarBotonesDescarte(elementos);
};

const componerMensajeShowdown = ({ resultado, ganancia, apuesta, nombreJugador: nj, nombreMaquina }) => {
    const marcador = `Tú: ${nj} · Máquina: ${nombreMaquina}. `;
    if (resultado === RESULTADO.GANA) return { texto: `${marcador}¡Ganas ${ganancia} fichas!`, tipo: 'exito' };
    if (resultado === RESULTADO.EMPATA) return { texto: `${marcador}Empate, recuperas tu apuesta.`, tipo: 'info' };
    return { texto: `${marcador}Pierdes ${apuesta} fichas.`, tipo: 'error' };
};

const finalizarMano = () => {
    const resultado = resolver(estado);
    refrescarFichas();
    dibujarManoJugador();
    renderizarManoRevelada(elementos.contenedorManoMaquina, estado.obtenerManoMaquina());

    const { texto, tipo } = componerMensajeShowdown(resultado);

    if (estado.obtenerFichas() <= 0) {
        estado.terminarPartida();
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${texto} Te quedaste sin fichas. Pulsa Nueva partida.`, 'error');
        configurarBotonesFinal(elementos);
        return;
    }

    if (!estado.hayMasRondas()) {
        estado.terminarPartida();
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${texto} Fin de la partida con ${estado.obtenerFichas()} fichas.`, tipo);
        configurarBotonesFinal(elementos);
        return;
    }

    estado.avanzarRonda();
    refrescarRonda();
    mostrarMensaje(elementos.mensaje, `${texto} Apuesta para la siguiente ronda.`, tipo);
    configurarBotonesApostar(elementos);
};

const manejarCambiar = () => {
    if (estado.obtenerFase() !== FASE.DESCARTE) return;
    estado.reemplazarNoRetenidas();
    finalizarMano();
};

const manejarPasar = () => {
    if (estado.obtenerFase() !== FASE.DESCARTE) return;
    estado.plantarse();
    finalizarMano();
};

const manejarNuevaPartida = () => {
    iniciarSesionJuego();
};

const manejarContinuar = () => {
    nombreJugador = elementos.inputNombre.value.trim() || NOMBRE_POR_DEFECTO;
    ocultarConFadeOut(elementos.pantallaInicio, () => {
        mostrarConFadeIn(elementos.pantallaJuego);
        iniciarSesionJuego();
    });
};

const manejarVolverRanking = () => {
    guardarPuntuacionUnaVez();
    actualizarRankingEnPantalla();
    ocultarConFadeOut(elementos.pantallaJuego, () => {
        mostrarConFadeIn(elementos.pantallaInicio);
    });
};

export const inicializarEventos = () => {
    inicializarRankingSemilla();
    actualizarRankingEnPantalla();
    renderizarRankingManos(elementos.listaRankingManos, ORDEN_MANOS);

    elementos.btnContinuar.addEventListener('click', manejarContinuar);
    elementos.btnVolverRanking.addEventListener('click', manejarVolverRanking);
    elementos.btnApostar.addEventListener('click', manejarApostar);
    elementos.btnCambiar.addEventListener('click', manejarCambiar);
    elementos.btnPasar.addEventListener('click', manejarPasar);
    elementos.btnNuevaPartida.addEventListener('click', manejarNuevaPartida);
};
