const CLAVE_MEJOR_RACHA = 'higherLower.mejorRacha';

export const obtenerMejorRacha = () => Number(localStorage.getItem(CLAVE_MEJOR_RACHA)) || 0;

export const guardarMejorRachaSiSupera = (racha) => {
    const mejorActual = obtenerMejorRacha();
    if (racha <= mejorActual) {
        return mejorActual;
    }
    localStorage.setItem(CLAVE_MEJOR_RACHA, String(racha));
    return racha;
};
