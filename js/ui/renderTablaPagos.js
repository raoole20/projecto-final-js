const claseFila = (esActiva) =>
    esActiva
        ? 'flex justify-between px-2 py-1 rounded bg-emerald-600 text-white font-bold'
        : 'flex justify-between px-2 py-1 rounded text-slate-300';

export const renderizarTablaPagos = (contenedor, tabla, rangoActivo = null) => {
    contenedor.innerHTML = tabla
        .filter((fila) => fila.multiplicador > 0)
        .map(
            (fila) => `
                <li class="${claseFila(fila.rango === rangoActivo)}">
                    <span>${fila.nombre}</span>
                    <span>x${fila.multiplicador}</span>
                </li>
            `
        )
        .join('');
};
