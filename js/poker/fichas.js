// Fichas con las que empiezan tanto el jugador como la máquina.
export const FICHAS_INICIALES = 100;

// Apuesta sugerida por defecto en el input.
export const APUESTA_POR_DEFECTO = 10;

export const esApuestaValida = (apuesta, fichasDisponibles) =>
    Number.isInteger(apuesta) && apuesta > 0 && apuesta <= fichasDisponibles;
