import { crearMazo, mezclarMazo, repartirCarta } from '../cartas/mazo.js';
import { FICHAS_INICIALES } from './fichas.js';

export const FASE = {
    APOSTAR: 'apostar',
    DESCARTE: 'descarte',
    RESULTADO: 'resultado',
    FINAL: 'final',
};

export const RONDAS_POR_PARTIDA = 5;
const TAMANO_MANO = 5;

const manoRetenidasVacia = () => new Array(TAMANO_MANO).fill(false);

export const crearEstadoPoker = () => {
    let mazo = [];
    let mano = [];
    let retenidas = manoRetenidasVacia();
    let fichas = FICHAS_INICIALES;
    let apuesta = 0;
    let fase = FASE.APOSTAR;
    let ronda = 1;

    return {
        obtenerMano: () => mano,
        obtenerRetenidas: () => retenidas,
        obtenerFichas: () => fichas,
        obtenerApuesta: () => apuesta,
        obtenerFase: () => fase,
        obtenerRonda: () => ronda,
        obtenerRondasTotales: () => RONDAS_POR_PARTIDA,
        hayMasRondas: () => ronda < RONDAS_POR_PARTIDA,

        iniciarMano: () => {
            mazo = mezclarMazo(crearMazo());
            mano = Array.from({ length: TAMANO_MANO }, () => repartirCarta(mazo));
            retenidas = manoRetenidasVacia();
            fase = FASE.DESCARTE;
        },
        alternarRetencion: (indice) => {
            retenidas[indice] = !retenidas[indice];
        },
        reemplazarNoRetenidas: () => {
            mano = mano.map((carta, indice) => (retenidas[indice] ? carta : repartirCarta(mazo)));
            fase = FASE.RESULTADO;
        },
        plantarse: () => {
            fase = FASE.RESULTADO;
        },
        ajustarFichas: (delta) => {
            fichas += delta;
        },
        fijarApuesta: (cantidad) => {
            apuesta = cantidad;
        },
        avanzarRonda: () => {
            ronda += 1;
            fase = FASE.APOSTAR;
        },
        terminarPartida: () => {
            fase = FASE.FINAL;
        },
    };
};
