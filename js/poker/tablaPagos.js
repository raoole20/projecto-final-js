import { RANGO_MANO } from './rangosMano.js';

const TABLA_PAGOS = [
    { rango: RANGO_MANO.ESCALERA_REAL, nombre: 'Escalera Real', multiplicador: 250 },
    { rango: RANGO_MANO.ESCALERA_COLOR, nombre: 'Escalera de Color', multiplicador: 50 },
    { rango: RANGO_MANO.POKER, nombre: 'Póker', multiplicador: 25 },
    { rango: RANGO_MANO.FULL, nombre: 'Full House', multiplicador: 9 },
    { rango: RANGO_MANO.COLOR, nombre: 'Color', multiplicador: 6 },
    { rango: RANGO_MANO.ESCALERA, nombre: 'Escalera', multiplicador: 4 },
    { rango: RANGO_MANO.TRIO, nombre: 'Trío', multiplicador: 3 },
    { rango: RANGO_MANO.DOBLE_PAR, nombre: 'Doble Par', multiplicador: 2 },
    { rango: RANGO_MANO.PAR_ALTO, nombre: 'Pareja (J o mejor)', multiplicador: 1 },
    { rango: RANGO_MANO.NADA, nombre: 'Sin premio', multiplicador: 0 },
];

export const obtenerTablaPagos = () => TABLA_PAGOS;

export const obtenerPago = (rango) =>
    TABLA_PAGOS.find((fila) => fila.rango === rango) ?? TABLA_PAGOS[TABLA_PAGOS.length - 1];
