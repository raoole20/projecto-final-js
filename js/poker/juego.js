import { compararManos, nombreDeMano } from './puntuacion.js';

export const RESULTADO = {
    GANA: 'gana',
    PIERDE: 'pierde',
    EMPATA: 'empata',
};

export const repartir = (estado, apuesta) => {
    estado.fijarApuesta(apuesta);
    estado.ajustarFichas(-apuesta);
    estado.iniciarMano();
};

export const resolver = (estado) => {
    const manoJugador = estado.obtenerMano();
    const manoMaquina = estado.obtenerManoMaquina();
    const apuesta = estado.obtenerApuesta();
    const comparacion = compararManos(manoJugador, manoMaquina);

    let resultado = RESULTADO.PIERDE;
    let ganancia = 0;
    if (comparacion > 0) {
        resultado = RESULTADO.GANA;
        ganancia = apuesta * 2;
    } else if (comparacion === 0) {
        resultado = RESULTADO.EMPATA;
        ganancia = apuesta;
    }
    estado.ajustarFichas(ganancia);

    return {
        resultado,
        ganancia,
        apuesta,
        nombreJugador: nombreDeMano(manoJugador),
        nombreMaquina: nombreDeMano(manoMaquina),
    };
};
