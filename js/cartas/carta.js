const VALOR_POR_RANGO = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
};

export const obtenerRango = (carta) => carta.slice(0, -1);

export const obtenerPalo = (carta) => carta.slice(-1);

export const obtenerValorNumerico = (carta) => {
    const rango = obtenerRango(carta);
    return VALOR_POR_RANGO[rango] ?? Number(rango);
};

export const obtenerRutaImagen = (carta) => `cartas/${carta}.png`;
