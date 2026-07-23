const CLASE_POR_TIPO = {
    exito: 'text-emerald-400',
    error: 'text-red-400',
    info: 'text-slate-300',
};

export const mostrarMensaje = (elemento, texto, tipo = 'info') => {
    elemento.textContent = texto;
    elemento.className = `text-lg font-semibold text-center ${CLASE_POR_TIPO[tipo]}`;
};
