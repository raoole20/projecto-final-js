const CLASE_BASE = 'text-lg font-semibold text-center min-h-[3rem] flex items-center justify-center px-4';

const CLASE_POR_TIPO = {
    exito: 'text-emerald-400',
    error: 'text-red-400',
    info: 'text-slate-300',
};

export const mostrarMensaje = (elemento, texto, tipo = 'info') => {
    elemento.textContent = texto;
    elemento.className = `${CLASE_BASE} ${CLASE_POR_TIPO[tipo]}`;
};
