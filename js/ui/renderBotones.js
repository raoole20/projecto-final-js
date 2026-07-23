const mostrar = (seccion) => {
    seccion.classList.remove('hidden');
    seccion.classList.add('flex');
};

const ocultar = (seccion) => {
    seccion.classList.add('hidden');
    seccion.classList.remove('flex');
};

// Entre manos: se ajusta la apuesta y se reparte.
export const configurarEntreManos = (elementos) => {
    mostrar(elementos.accionesRepartir);
    ocultar(elementos.accionesDescarte);
    elementos.inputApuesta.disabled = false;
    elementos.btnRepartir.disabled = false;
    elementos.btnNuevaPartida.disabled = false;
};

// Descarte: el jugador elige qué cartas cambiar y confirma.
export const configurarDescarte = (elementos) => {
    ocultar(elementos.accionesRepartir);
    mostrar(elementos.accionesDescarte);
    elementos.btnCambiar.disabled = false;
    elementos.btnNuevaPartida.disabled = false;
};

// Mientras la máquina resuelve: todo bloqueado.
export const bloquearAcciones = (elementos) => {
    elementos.inputApuesta.disabled = true;
    elementos.btnRepartir.disabled = true;
    elementos.btnCambiar.disabled = true;
    elementos.btnNuevaPartida.disabled = true;
};

// Fin de partida: solo se puede empezar una nueva.
export const configurarFinal = (elementos) => {
    mostrar(elementos.accionesRepartir);
    ocultar(elementos.accionesDescarte);
    elementos.inputApuesta.disabled = true;
    elementos.btnRepartir.disabled = true;
    elementos.btnNuevaPartida.disabled = false;
};
