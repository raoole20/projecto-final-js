import { obtenerValorNumerico, obtenerPalo } from '../cartas/carta.js';

const ESCALERA_RUEDA = [2, 3, 4, 5, 14];
const ESCALERA_REAL = [10, 11, 12, 13, 14];

export const obtenerValores = (mano) => mano.map(obtenerValorNumerico);

export const obtenerPalos = (mano) => mano.map(obtenerPalo);

export const contarPorValor = (valores) => {
    const conteo = {};
    for (const valor of valores) {
        conteo[valor] = (conteo[valor] ?? 0) + 1;
    }
    return conteo;
};

export const obtenerCantidadesOrdenadas = (conteo) =>
    Object.values(conteo).sort((a, b) => b - a);

export const obtenerValoresConCantidad = (conteo, cantidad) =>
    Object.keys(conteo)
        .filter((valor) => conteo[valor] === cantidad)
        .map(Number);

export const esColor = (palos) => palos.every((palo) => palo === palos[0]);

const valoresUnicosOrdenados = (valores) => [...new Set(valores)].sort((a, b) => a - b);

const sonIguales = (arrayA, arrayB) =>
    arrayA.length === arrayB.length && arrayA.every((valor, i) => valor === arrayB[i]);

export const esEscalera = (valores) => {
    const unicos = valoresUnicosOrdenados(valores);
    if (unicos.length !== 5) return false;
    const consecutiva = unicos[4] - unicos[0] === 4;
    return consecutiva || sonIguales(unicos, ESCALERA_RUEDA);
};

export const esEscaleraReal = (valores) =>
    sonIguales(valoresUnicosOrdenados(valores), ESCALERA_REAL);
