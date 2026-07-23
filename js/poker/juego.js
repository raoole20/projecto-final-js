import { evaluarMano } from './evaluador.js';
import { obtenerPago } from './tablaPagos.js';

export const repartir = (estado, apuesta) => {
    estado.fijarApuesta(apuesta);
    estado.ajustarFichas(-apuesta);
    estado.iniciarMano();
};

export const resolver = (estado) => {
    const rango = evaluarMano(estado.obtenerMano());
    const pago = obtenerPago(rango);
    const ganancia = estado.obtenerApuesta() * pago.multiplicador;
    estado.ajustarFichas(ganancia);
    return { rango, nombre: pago.nombre, multiplicador: pago.multiplicador, ganancia };
};
