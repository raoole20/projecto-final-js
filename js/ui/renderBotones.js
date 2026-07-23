export const habilitarPrediccion = (elementos) => {
    elementos.btnMayor.disabled = false;
    elementos.btnMenor.disabled = false;
};

export const deshabilitarPrediccion = (elementos) => {
    elementos.btnMayor.disabled = true;
    elementos.btnMenor.disabled = true;
};
