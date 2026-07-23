const escaparTexto = (texto) => {
    const elementoTemporal = document.createElement('span');
    elementoTemporal.textContent = texto;
    return elementoTemporal.innerHTML;
};

export const renderizarRanking = (elemento, ranking) => {
    elemento.innerHTML = ranking
        .map(
            (entrada, indice) => `
                <li class="flex justify-between px-3 py-1 rounded ${indice === 0 ? 'text-amber-400 font-bold' : 'text-slate-200'}">
                    <span>${indice + 1}. ${escaparTexto(entrada.nombre)}</span>
                    <span>${entrada.racha}</span>
                </li>
            `
        )
        .join('');
};
