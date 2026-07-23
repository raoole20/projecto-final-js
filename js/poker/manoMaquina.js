import { repartirCarta } from '../cartas/mazo.js';
import { obtenerValorNumerico } from '../cartas/carta.js';
import { tieneJuego } from './puntuacion.js';

const TAMANO_MANO = 5;
const PROBABILIDAD_FORZAR_JUEGO = 0.85;

const extraerCartaPorValor = (mazo, valor) => {
    const indice = mazo.findIndex((carta) => obtenerValorNumerico(carta) === valor);
    return indice === -1 ? null : mazo.splice(indice, 1)[0];
};

// Convierte una mano de carta alta en al menos pareja duplicando el valor
// de una de sus cartas con una "gemela" tomada del mazo restante.
const forzarPareja = (mano, mazo) => {
    for (const carta of mano) {
        const gemela = extraerCartaPorValor(mazo, obtenerValorNumerico(carta));
        if (!gemela) continue;
        const indiceReemplazo = mano.findIndex((otra) => otra !== carta);
        mano[indiceReemplazo] = gemela;
        return;
    }
};

export const crearManoMaquina = (mazo, azar = Math.random) => {
    const mano = Array.from({ length: TAMANO_MANO }, () => repartirCarta(mazo));
    if (!tieneJuego(mano) && azar() < PROBABILIDAD_FORZAR_JUEGO) {
        forzarPareja(mano, mazo);
    }
    return mano;
};
