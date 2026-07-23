export const renderizarRankingManos = (contenedor, nombresOrdenados) => {
    contenedor.innerHTML = nombresOrdenados
        .map(
            (nombre, indice) => `
                <li class="flex gap-2 px-2 py-0.5 text-slate-300">
                    <span class="w-4 text-right text-slate-500">${indice + 1}</span>
                    <span>${nombre}</span>
                </li>
            `
        )
        .join('');
};
