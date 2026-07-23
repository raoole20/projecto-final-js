import { obtenerValorNumerico, obtenerPalo } from '../cartas/carta.js';
import { CATEGORIA, categoriaMano } from './puntuacion.js';

const contarPorValor = (mano) => {
    const conteo = {};
    for (const carta of mano) {
        const valor = obtenerValorNumerico(carta);
        conteo[valor] = (conteo[valor] ?? 0) + 1;
    }
    return conteo;
};

// Índices de las cartas cuyo valor aparece exactamente `veces` en la mano.
const indicesConRepeticion = (mano, veces) => {
    const conteo = contarPorValor(mano);
    return mano
        .map((carta, indice) => ({ indice, veces: conteo[obtenerValorNumerico(carta)] }))
        .filter((c) => c.veces === veces)
        .map((c) => c.indice);
};

// Si 4 cartas comparten palo, devuelve el índice de la carta sobrante; si no, -1.
const indiceFueraDeColor = (mano) => {
    const porPalo = {};
    mano.forEach((carta, indice) => {
        const palo = obtenerPalo(carta);
        (porPalo[palo] ??= []).push(indice);
    });
    for (const palo of Object.keys(porPalo)) {
        if (porPalo[palo].length === 4) {
            return mano.findIndex((_, indice) => !porPalo[palo].includes(indice));
        }
    }
    return -1;
};

// Si al quitar una carta las otras 4 forman proyecto de escalera (4 valores
// distintos dentro de un rango de 5), devuelve el índice a descartar; si no, -1.
const indiceFueraDeEscalera = (mano) => {
    for (let i = 0; i < mano.length; i++) {
        const resto = mano.filter((_, indice) => indice !== i).map(obtenerValorNumerico);
        const unicos = new Set(resto);
        if (unicos.size === 4 && Math.max(...resto) - Math.min(...resto) <= 4) return i;
    }
    return -1;
};

const indiceCartaMasAlta = (mano) => {
    let mejor = 0;
    for (let i = 1; i < mano.length; i++) {
        if (obtenerValorNumerico(mano[i]) > obtenerValorNumerico(mano[mejor])) mejor = i;
    }
    return mejor;
};

// Devuelve los índices que la máquina descartará para mejorar su mano.
export const decidirDescarteMaquina = (mano) => {
    const categoria = categoriaMano(mano);
    const todos = mano.map((_, indice) => indice);

    switch (categoria) {
        case CATEGORIA.ESCALERA_COLOR:
        case CATEGORIA.FULL:
        case CATEGORIA.COLOR:
        case CATEGORIA.ESCALERA:
            return []; // mano servida
        case CATEGORIA.POKER:
            return indicesConRepeticion(mano, 1); // descarta el kicker
        case CATEGORIA.TRIO:
            return indicesConRepeticion(mano, 1); // descarta las 2 sueltas
        case CATEGORIA.DOBLE_PAR:
            return indicesConRepeticion(mano, 1); // descarta la 5ª carta
        case CATEGORIA.PAREJA:
            return indicesConRepeticion(mano, 1); // conserva la pareja, cambia 3
        default: {
            const fueraColor = indiceFueraDeColor(mano);
            if (fueraColor !== -1) return [fueraColor];
            const fueraEscalera = indiceFueraDeEscalera(mano);
            if (fueraEscalera !== -1) return [fueraEscalera];
            const alta = indiceCartaMasAlta(mano);
            return todos.filter((indice) => indice !== alta); // conserva la más alta
        }
    }
};
