import { crearMazo, mezclarMazo, repartirCarta } from '../cartas/mazo.js';
import { FICHAS_INICIALES } from './fichas.js';
import { FASE, GANADOR } from './constantes.js';
import { compararManos, nombreDeMano } from './puntuacion.js';

const TAMANO_MANO = 5;

const descartesVacios = () => new Array(TAMANO_MANO).fill(false);

// Estado mutable de una partida de Five Card Draw jugador contra máquina.
// El jugador apuesta, la máquina iguala la apuesta y, tras el descarte, gana el
// bote quien tenga la mejor mano. No hay rondas de apuestas.
export const crearEstadoPoker = () => {
    let fichasJugador = FICHAS_INICIALES;
    let fichasMaquina = FICHAS_INICIALES;
    let mazo = [];
    let manoJugador = [];
    let manoMaquina = [];
    let descartes = descartesVacios();
    let bote = 0;
    let apuesta = 0;
    let fase = FASE.ENTRE_MANOS;
    let numeroMano = 0;
    let cambioMaquina = 0;

    return {
        obtenerFichasJugador: () => fichasJugador,
        obtenerFichasMaquina: () => fichasMaquina,
        obtenerBote: () => bote,
        obtenerApuesta: () => apuesta,
        obtenerManoJugador: () => manoJugador,
        obtenerManoMaquina: () => manoMaquina,
        obtenerDescartes: () => descartes,
        obtenerFase: () => fase,
        obtenerNumeroMano: () => numeroMano,
        obtenerCambioMaquina: () => cambioMaquina,

        reiniciarPartida: () => {
            fichasJugador = FICHAS_INICIALES;
            fichasMaquina = FICHAS_INICIALES;
            bote = 0;
            apuesta = 0;
            numeroMano = 0;
            fase = FASE.ENTRE_MANOS;
        },

        // Cobra la apuesta al jugador, la iguala la máquina y reparte 5 cartas a
        // cada uno. La apuesta se limita a lo que ambos puedan cubrir.
        repartirNuevaMano: (cantidad) => {
            const efectiva = Math.min(cantidad, fichasJugador, fichasMaquina);
            apuesta = efectiva;
            fichasJugador -= efectiva;
            fichasMaquina -= efectiva;
            bote = efectiva * 2;

            mazo = mezclarMazo(crearMazo());
            manoJugador = Array.from({ length: TAMANO_MANO }, () => repartirCarta(mazo));
            manoMaquina = Array.from({ length: TAMANO_MANO }, () => repartirCarta(mazo));
            descartes = descartesVacios();
            cambioMaquina = 0;
            numeroMano += 1;
            fase = FASE.DESCARTE;
        },

        alternarDescarte: (indice) => {
            descartes[indice] = !descartes[indice];
        },

        // Sustituye las cartas marcadas del jugador y devuelve cuántas cambió.
        cambiarCartasJugador: () => {
            let cambiadas = 0;
            manoJugador = manoJugador.map((carta, indice) => {
                if (!descartes[indice]) return carta;
                cambiadas += 1;
                return repartirCarta(mazo);
            });
            descartes = descartesVacios();
            return cambiadas;
        },

        // Sustituye las cartas de la máquina indicadas por sus índices.
        cambiarCartasMaquina: (indices) => {
            const aCambiar = new Set(indices);
            manoMaquina = manoMaquina.map((carta, indice) =>
                aCambiar.has(indice) ? repartirCarta(mazo) : carta
            );
            cambioMaquina = aCambiar.size;
            return cambioMaquina;
        },

        // Enfrentamiento: reparte el bote a la mejor mano (o lo divide si empatan).
        resolverShowdown: () => {
            const comparacion = compararManos(manoJugador, manoMaquina);
            const premio = bote;
            let ganador;
            if (comparacion > 0) {
                fichasJugador += bote;
                ganador = GANADOR.JUGADOR;
            } else if (comparacion < 0) {
                fichasMaquina += bote;
                ganador = GANADOR.MAQUINA;
            } else {
                const mitad = Math.floor(bote / 2);
                fichasJugador += mitad + (bote - 2 * mitad);
                fichasMaquina += mitad;
                ganador = GANADOR.EMPATE;
            }
            bote = 0;
            fase = FASE.SHOWDOWN;
            return {
                ganador,
                premio,
                apuesta,
                nombreJugador: nombreDeMano(manoJugador),
                nombreMaquina: nombreDeMano(manoMaquina),
            };
        },

        fijarFase: (nuevaFase) => {
            fase = nuevaFase;
        },
    };
};
