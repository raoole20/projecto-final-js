import { elementos } from './ui/dom.js';
import { crearEstadoPoker } from './poker/estadoPoker.js';
import { FASE, GANADOR } from './poker/constantes.js';
import { esApuestaValida, APUESTA_POR_DEFECTO } from './poker/fichas.js';
import { iniciarMano, descartarMaquina } from './poker/juego.js';
import { ORDEN_MANOS } from './poker/puntuacion.js';
import { inicializarRankingSemilla, obtenerTopRanking, guardarPuntuacion } from './ranking/ranking.js';
import { renderizarMano, renderizarDorsos, renderizarManoRevelada } from './ui/renderMano.js';
import { renderizarRankingManos } from './ui/renderRankingManos.js';
import { actualizarFichas } from './ui/renderFichas.js';
import { actualizarIndicadorMano } from './ui/renderRonda.js';
import { mostrarMensaje } from './ui/renderMensaje.js';
import {
    configurarEntreManos,
    configurarDescarte,
    bloquearAcciones,
    configurarFinal,
} from './ui/renderBotones.js';
import { renderizarRanking } from './ui/renderRanking.js';
import { mostrarConFadeIn, ocultarConFadeOut } from './ui/renderTransicion.js';

const NOMBRE_POR_DEFECTO = 'Jugador';
const DELAY_MAQUINA = 900;

let estado;
let nombreJugador = NOMBRE_POR_DEFECTO;
let mejorFichas = 0;
let partidaGuardada = false;
let procesando = false;

// ------------------------- Refrescos de pantalla -------------------------

const refrescarMarcadores = () => {
    actualizarFichas(elementos.fichasJugador, estado.obtenerFichasJugador());
    actualizarFichas(elementos.fichasMaquina, estado.obtenerFichasMaquina());
    actualizarFichas(elementos.bote, estado.obtenerBote());
    elementos.inputApuesta.max = estado.obtenerFichasJugador();
    mejorFichas = Math.max(mejorFichas, estado.obtenerFichasJugador());
};

const refrescarIndicador = () => {
    actualizarIndicadorMano(elementos.indicadorMano, estado.obtenerNumeroMano());
};

const dibujarManoJugadorInteractiva = () => {
    renderizarMano(elementos.contenedorMano, estado.obtenerManoJugador(), estado.obtenerDescartes(), manejarClicCarta);
};

const dibujarManoJugadorEstatica = () => {
    renderizarManoRevelada(elementos.contenedorMano, estado.obtenerManoJugador());
};

// ------------------------- Ranking -------------------------

const actualizarRankingEnPantalla = () => {
    renderizarRanking(elementos.listaRanking, obtenerTopRanking());
};

const guardarPuntuacionUnaVez = () => {
    if (partidaGuardada || !estado) return;
    guardarPuntuacion(nombreJugador, mejorFichas);
    partidaGuardada = true;
};

// ------------------------- Ciclo de una partida -------------------------

const iniciarSesionJuego = () => {
    estado = crearEstadoPoker();
    estado.reiniciarPartida();
    mejorFichas = estado.obtenerFichasJugador();
    partidaGuardada = false;
    procesando = false;
    elementos.inputApuesta.value = APUESTA_POR_DEFECTO;
    refrescarMarcadores();
    refrescarIndicador();
    renderizarDorsos(elementos.contenedorMano);
    renderizarDorsos(elementos.contenedorManoMaquina);
    mostrarMensaje(elementos.mensaje, 'Ajusta tu apuesta y pulsa «Repartir mano».', 'info');
    configurarEntreManos(elementos);
};

const manejarRepartir = () => {
    if (procesando || estado.obtenerFase() !== FASE.ENTRE_MANOS) return;

    const apuesta = Number(elementos.inputApuesta.value);
    if (!esApuestaValida(apuesta, estado.obtenerFichasJugador())) {
        mostrarMensaje(elementos.mensaje, `Apuesta un número entero entre 1 y ${estado.obtenerFichasJugador()} fichas.`, 'error');
        return;
    }

    iniciarMano(estado, apuesta);
    refrescarMarcadores();
    refrescarIndicador();
    dibujarManoJugadorInteractiva();
    renderizarDorsos(elementos.contenedorManoMaquina);
    actualizarBotonCambiar();
    configurarDescarte(elementos);
    mostrarMensaje(
        elementos.mensaje,
        `Mano #${estado.obtenerNumeroMano()} · Apuesta ${estado.obtenerApuesta()}. Marca las cartas a cambiar y confirma (0 = plantarse).`,
        'info'
    );
};

// ------------------------- Descarte -------------------------

const actualizarBotonCambiar = () => {
    const marcadas = estado.obtenerDescartes().filter(Boolean).length;
    elementos.btnCambiar.textContent = marcadas === 0 ? 'Plantarse' : `Cambiar (${marcadas})`;
};

const manejarClicCarta = (indice) => {
    if (procesando || estado.obtenerFase() !== FASE.DESCARTE) return;
    estado.alternarDescarte(indice);
    dibujarManoJugadorInteractiva();
    actualizarBotonCambiar();
};

const manejarCambiar = () => {
    if (procesando || estado.obtenerFase() !== FASE.DESCARTE) return;

    const cambiadas = estado.cambiarCartasJugador();
    dibujarManoJugadorEstatica();

    procesando = true;
    bloquearAcciones(elementos);
    const textoJugador = cambiadas === 0 ? 'Te plantas.' : `Cambias ${cambiadas} carta(s).`;
    mostrarMensaje(elementos.mensaje, `${textoJugador} La máquina juega…`, 'info');

    setTimeout(() => {
        const nMaquina = descartarMaquina(estado);
        procesando = false;
        irAShowdown(nMaquina);
    }, DELAY_MAQUINA);
};

// ------------------------- Enfrentamiento y fin de mano -------------------------

const mensajeShowdown = (res) => {
    const marcador = `Tú: ${res.nombreJugador} · Máquina: ${res.nombreMaquina}. `;
    if (res.ganador === GANADOR.JUGADOR) return { texto: `${marcador}Ganas ${res.apuesta} fichas 🎉`, tipo: 'exito' };
    if (res.ganador === GANADOR.EMPATE) return { texto: `${marcador}Empate: recuperas tu apuesta.`, tipo: 'info' };
    return { texto: `${marcador}Pierdes ${res.apuesta} fichas.`, tipo: 'error' };
};

const irAShowdown = (nMaquina) => {
    const res = estado.resolverShowdown();
    refrescarMarcadores();
    renderizarManoRevelada(elementos.contenedorManoMaquina, estado.obtenerManoMaquina());
    dibujarManoJugadorEstatica();

    const cambioMaquina = nMaquina === 0 ? 'La máquina se plantó.' : `La máquina cambió ${nMaquina} carta(s).`;
    const { texto, tipo } = mensajeShowdown(res);
    finalizarMano(`${cambioMaquina} ${texto}`, tipo);
};

const finalizarMano = (texto, tipo) => {
    refrescarMarcadores();
    const fichasJugador = estado.obtenerFichasJugador();
    const fichasMaquina = estado.obtenerFichasMaquina();

    if (fichasJugador <= 0) {
        estado.fijarFase(FASE.FINAL);
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${texto} Te quedaste sin fichas. Fin de la partida.`, 'error');
        configurarFinal(elementos);
        return;
    }
    if (fichasMaquina <= 0) {
        estado.fijarFase(FASE.FINAL);
        guardarPuntuacionUnaVez();
        mostrarMensaje(elementos.mensaje, `${texto} ¡Dejaste sin fichas a la máquina! Ganas la partida 🏆`, 'exito');
        configurarFinal(elementos);
        return;
    }

    estado.fijarFase(FASE.ENTRE_MANOS);
    mostrarMensaje(elementos.mensaje, `${texto} Ajusta tu apuesta y reparte otra mano.`, tipo);
    configurarEntreManos(elementos);
};

// ------------------------- Navegación -------------------------

const manejarNuevaPartida = () => {
    if (procesando) return;
    guardarPuntuacionUnaVez();
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
    if (procesando) return;
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
    elementos.btnRepartir.addEventListener('click', manejarRepartir);
    elementos.btnCambiar.addEventListener('click', manejarCambiar);
    elementos.btnNuevaPartida.addEventListener('click', manejarNuevaPartida);
};
