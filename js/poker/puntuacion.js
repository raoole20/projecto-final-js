import { obtenerValorNumerico, obtenerPalo } from '../cartas/carta.js';

export const CATEGORIA = {
    CARTA_ALTA: 0,
    PAREJA: 1,
    DOBLE_PAR: 2,
    TRIO: 3,
    ESCALERA: 4,
    COLOR: 5,
    FULL: 6,
    POKER: 7,
    ESCALERA_COLOR: 8,
};

const NOMBRE_CATEGORIA = {
    [CATEGORIA.CARTA_ALTA]: 'Carta alta',
    [CATEGORIA.PAREJA]: 'Pareja',
    [CATEGORIA.DOBLE_PAR]: 'Doble par',
    [CATEGORIA.TRIO]: 'Trío',
    [CATEGORIA.ESCALERA]: 'Escalera',
    [CATEGORIA.COLOR]: 'Color',
    [CATEGORIA.FULL]: 'Full house',
    [CATEGORIA.POKER]: 'Póker',
    [CATEGORIA.ESCALERA_COLOR]: 'Escalera de color',
};

export const ORDEN_MANOS = [
    'Escalera de color',
    'Póker',
    'Full house',
    'Color',
    'Escalera',
    'Trío',
    'Doble par',
    'Pareja',
    'Carta alta',
];

// Detecta escalera; maneja la rueda A-2-3-4-5 (el As cuenta como 1, cima = 5).
const analizarEscalera = (valoresUnicosAsc) => {
    if (valoresUnicosAsc.length !== 5) return { esEscalera: false, cima: 0 };
    const [a, b, c, d, e] = valoresUnicosAsc;
    if (e - a === 4) return { esEscalera: true, cima: e };
    if (a === 2 && b === 3 && c === 4 && d === 5 && e === 14) return { esEscalera: true, cima: 5 };
    return { esEscalera: false, cima: 0 };
};

// Agrupa los valores por cantidad (desc) y luego por valor (desc),
// para que los desempates queden ordenados por importancia.
const valoresPorGrupo = (conteo) =>
    Object.keys(conteo)
        .map(Number)
        .sort((a, b) => conteo[b] - conteo[a] || b - a)
        .flatMap((valor) => new Array(conteo[valor]).fill(valor));

const analizarMano = (mano) => {
    const valores = mano.map(obtenerValorNumerico);
    const palos = mano.map(obtenerPalo);

    const conteo = {};
    for (const valor of valores) conteo[valor] = (conteo[valor] ?? 0) + 1;
    const cantidades = Object.values(conteo).sort((a, b) => b - a);
    const porGrupo = valoresPorGrupo(conteo);

    const esColor = palos.every((palo) => palo === palos[0]);
    const valoresUnicosAsc = [...new Set(valores)].sort((a, b) => a - b);
    const { esEscalera, cima } = analizarEscalera(valoresUnicosAsc);
    const valoresDesc = [...valores].sort((a, b) => b - a);

    if (esColor && esEscalera) return { categoria: CATEGORIA.ESCALERA_COLOR, desempates: [cima] };
    if (cantidades[0] === 4) return { categoria: CATEGORIA.POKER, desempates: porGrupo };
    if (cantidades[0] === 3 && cantidades[1] === 2) return { categoria: CATEGORIA.FULL, desempates: porGrupo };
    if (esColor) return { categoria: CATEGORIA.COLOR, desempates: valoresDesc };
    if (esEscalera) return { categoria: CATEGORIA.ESCALERA, desempates: [cima] };
    if (cantidades[0] === 3) return { categoria: CATEGORIA.TRIO, desempates: porGrupo };
    if (cantidades[0] === 2 && cantidades[1] === 2) return { categoria: CATEGORIA.DOBLE_PAR, desempates: porGrupo };
    if (cantidades[0] === 2) return { categoria: CATEGORIA.PAREJA, desempates: porGrupo };
    return { categoria: CATEGORIA.CARTA_ALTA, desempates: valoresDesc };
};

export const puntuarMano = (mano) => {
    const { categoria, desempates } = analizarMano(mano);
    return [categoria, ...desempates];
};

export const nombreDeMano = (mano) => NOMBRE_CATEGORIA[analizarMano(mano).categoria];

export const tieneJuego = (mano) => analizarMano(mano).categoria >= CATEGORIA.PAREJA;

// Devuelve 1 si manoA gana, -1 si manoB gana, 0 si empatan.
export const compararManos = (manoA, manoB) => {
    const puntosA = puntuarMano(manoA);
    const puntosB = puntuarMano(manoB);
    for (let i = 0; i < Math.max(puntosA.length, puntosB.length); i++) {
        const valorA = puntosA[i] ?? 0;
        const valorB = puntosB[i] ?? 0;
        if (valorA !== valorB) return valorA > valorB ? 1 : -1;
    }
    return 0;
};
