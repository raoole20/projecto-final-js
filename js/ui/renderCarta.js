import { obtenerRutaImagen } from '../cartas/carta.js';

export const mostrarCarta = (elemento, carta) => {
    elemento.src = obtenerRutaImagen(carta);
    elemento.alt = carta;
};
