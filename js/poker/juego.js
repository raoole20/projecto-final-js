import { decidirDescarteMaquina } from './manoMaquina.js';

// Empieza una mano nueva: cobra la apuesta, la iguala la máquina y reparte.
export const iniciarMano = (estado, apuesta) => {
    estado.repartirNuevaMano(apuesta);
};

// La máquina decide y realiza su descarte; devuelve cuántas cartas cambió.
export const descartarMaquina = (estado) => {
    const indices = decidirDescarteMaquina(estado.obtenerManoMaquina());
    return estado.cambiarCartasMaquina(indices);
};
