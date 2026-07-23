import { elementos } from './ui/dom.js';
import { crearEstadoPoker, FASE } from './poker/estadoPoker.js';
import { repartir, resolver } from './poker/juego.js';
import { esApuestaValida } from './poker/fichas.js';
import { obtenerTablaPagos } from './poker/tablaPagos.js';
import { inicializarRankingSemilla, obtenerTopRanking, guardarPuntuacion } from './ranking/ranking.js';
import { renderizarMano, renderizarDorsos } from './ui/renderMano.js';
import { renderizarTablaPagos } from './ui/renderTablaPagos.js';
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

const mostrarTablaPagos = (rangoActivo = null) => {
    renderizarTablaPagos(elementos.listaPagos, obtenerTablaPagos(), rangoActivo);
};

const dibujarMano = () => {
    renderizarMano(
        elementos.contenedorMano,
        estado.obtenerMano(),
        estado.obtenerRetenidas(),
        manejarClicCarta
    );
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
    mostrarTablaPagos();
    renderizarDorsos(elementos.contenedorMano);
    mostrarMensaje(elementos.mensaje, 'Haz tu apuesta y pulsa Apostar.', 'info');
    configurarBotonesApostar(elementos);
};

const manejarClicCarta = (indice) => {
    if (estado.obtenerFase() !== FASE.DESCARTE) return;
    estado.alternarRetencion(indice);
    dibujarMano();
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
    mostrarTablaPagos();
    dibujarMano();
    mostrarMensaje(elementos.mensaje, 'Toca las cartas que quieras conservar. Luego Cambiar o Pasar.', 'info');
    configurarBotonesDescarte(elementos);
};

const componerTextoResultado = (resultado, apuesta) =>
    resultado.ganancia > 0
        ? `¡${resultado.nombre}! Ganas ${resultado.ganancia} fichas.`
        : `${resultado.nombre}. Perdiste tu apuesta de ${apuesta} fichas.`;

const finalizarMano = () => {
    const apuesta = estado.obtenerApuesta();
    const resultado = resolver(estado);
    refrescarFichas();
    dibujarMano();
    mostrarTablaPagos(resultado.rango);

    const textoResultado = componerTextoResultado(resultado, apuesta);
    const tipo = resultado.ganancia > 0 ? 'exito' : 'error';

    if (estado.obtenerFichas() <= 0) {
        estado.terminarPartida();
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${textoResultado} Te quedaste sin fichas. Pulsa Nueva partida.`, 'error');
        configurarBotonesFinal(elementos);
        return;
    }

    if (!estado.hayMasRondas()) {
        estado.terminarPartida();
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${textoResultado} Fin de la partida con ${estado.obtenerFichas()} fichas.`, tipo);
        configurarBotonesFinal(elementos);
        return;
    }

    estado.avanzarRonda();
    refrescarRonda();
    mostrarMensaje(elementos.mensaje, `${textoResultado} Apuesta para la siguiente ronda.`, tipo);
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

    elementos.btnContinuar.addEventListener('click', manejarContinuar);
    elementos.btnVolverRanking.addEventListener('click', manejarVolverRanking);
    elementos.btnApostar.addEventListener('click', manejarApostar);
    elementos.btnCambiar.addEventListener('click', manejarCambiar);
    elementos.btnPasar.addEventListener('click', manejarPasar);
    elementos.btnNuevaPartida.addEventListener('click', manejarNuevaPartida);
};
