export const FICHAS_INICIALES = 100;

export const esApuestaValida = (apuesta, fichasDisponibles) =>
    Number.isInteger(apuesta) && apuesta > 0 && apuesta <= fichasDisponibles;
