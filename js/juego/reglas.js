export const RESULTADO = {
    MAYOR: 'mayor',
    MENOR: 'menor',
    EMPATE: 'empate',
};

export const compararValores = (valorAnterior, valorNuevo) => {
    if (valorNuevo > valorAnterior) return RESULTADO.MAYOR;
    if (valorNuevo < valorAnterior) return RESULTADO.MENOR;
    return RESULTADO.EMPATE;
};

export const esPrediccionCorrecta = (prediccion, resultado) => prediccion === resultado;
