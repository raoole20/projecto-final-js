import { crearMazo, mezclarMazo, repartirCarta } from '../cartas/mazo.js';

export const crearEstadoJuego = () => {
    let mazo = mezclarMazo(crearMazo());
    let cartaActual = repartirCarta(mazo);
    let racha = 0;
    let terminado = false;

    return {
        obtenerCartaActual: () => cartaActual,
        obtenerRacha: () => racha,
        estaTerminado: () => terminado,
        quedanCartas: () => mazo.length > 0,
        sacarCarta: () => repartirCarta(mazo),
        avanzar: (cartaNueva) => {
            cartaActual = cartaNueva;
        },
        incrementarRacha: () => {
            racha += 1;
        },
        reiniciarRacha: () => {
            racha = 0;
        },
        terminar: () => {
            terminado = true;
        },
    };
};
