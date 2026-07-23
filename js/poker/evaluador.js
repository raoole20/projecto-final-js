import { RANGO_MANO } from './rangosMano.js';
import {
    obtenerValores,
    obtenerPalos,
    contarPorValor,
    obtenerCantidadesOrdenadas,
    obtenerValoresConCantidad,
    esColor,
    esEscalera,
    esEscaleraReal,
} from './analisisMano.js';

const VALOR_MINIMO_PAR_ALTO = 11; // J

const tieneParAlto = (conteo) => {
    const pares = obtenerValoresConCantidad(conteo, 2);
    return pares.length === 1 && pares[0] >= VALOR_MINIMO_PAR_ALTO;
};

export const evaluarMano = (mano) => {
    const valores = obtenerValores(mano);
    const palos = obtenerPalos(mano);
    const conteo = contarPorValor(valores);
    const cantidades = obtenerCantidadesOrdenadas(conteo);

    const color = esColor(palos);
    const escalera = esEscalera(valores);

    if (color && escalera && esEscaleraReal(valores)) return RANGO_MANO.ESCALERA_REAL;
    if (color && escalera) return RANGO_MANO.ESCALERA_COLOR;
    if (cantidades[0] === 4) return RANGO_MANO.POKER;
    if (cantidades[0] === 3 && cantidades[1] === 2) return RANGO_MANO.FULL;
    if (color) return RANGO_MANO.COLOR;
    if (escalera) return RANGO_MANO.ESCALERA;
    if (cantidades[0] === 3) return RANGO_MANO.TRIO;
    if (cantidades[0] === 2 && cantidades[1] === 2) return RANGO_MANO.DOBLE_PAR;
    if (tieneParAlto(conteo)) return RANGO_MANO.PAR_ALTO;
    return RANGO_MANO.NADA;
};
