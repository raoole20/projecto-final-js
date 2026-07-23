import { obtenerValorNumerico } from '../cartas/carta.js';
import { compararValores, esPrediccionCorrecta, RESULTADO } from './reglas.js';

export const jugarRonda = (estado, prediccion) => {
    const cartaAnterior = estado.obtenerCartaActual();
    const cartaNueva = estado.sacarCarta();

    const valorAnterior = obtenerValorNumerico(cartaAnterior);
    const valorNuevo = obtenerValorNumerico(cartaNueva);
    const resultado = compararValores(valorAnterior, valorNuevo);

    estado.avanzar(cartaNueva);

    if (resultado === RESULTADO.EMPATE) {
        return { cartaNueva, resultado, acierto: null };
    }

    const acierto = esPrediccionCorrecta(prediccion, resultado);

    if (acierto) {
        estado.incrementarRacha();
    } else {
        estado.reiniciarRacha();
        estado.terminar();
    }

    return { cartaNueva, resultado, acierto };
};
