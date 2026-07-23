const RANGOS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const PALOS = ['C', 'D', 'H', 'S'];

export const crearMazo = () => {
    const mazo = [];
    for (const rango of RANGOS) {
        for (const palo of PALOS) {
            mazo.push(`${rango}${palo}`);
        }
    }
    return mazo;
};

export const mezclarMazo = (mazo) => {
    const copia = [...mazo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
};

export const repartirCarta = (mazo) => {
    if (mazo.length === 0) {
        throw new Error('No hay cartas en el mazo');
    }
    return mazo.pop();
};
