export const configurarBotonesApostar = (elementos) => {
    elementos.btnApostar.disabled = false;
    elementos.btnCambiar.disabled = true;
    elementos.btnPasar.disabled = true;
    elementos.btnNuevaPartida.disabled = true;
    elementos.inputApuesta.disabled = false;
};

export const configurarBotonesDescarte = (elementos) => {
    elementos.btnApostar.disabled = true;
    elementos.btnCambiar.disabled = false;
    elementos.btnPasar.disabled = false;
    elementos.btnNuevaPartida.disabled = true;
    elementos.inputApuesta.disabled = true;
};

export const configurarBotonesFinal = (elementos) => {
    elementos.btnApostar.disabled = true;
    elementos.btnCambiar.disabled = true;
    elementos.btnPasar.disabled = true;
    elementos.btnNuevaPartida.disabled = false;
    elementos.inputApuesta.disabled = true;
};
