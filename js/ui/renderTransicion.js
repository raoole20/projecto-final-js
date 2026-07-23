export const mostrarConFadeIn = (elemento) => {
    elemento.classList.remove('hidden');
    elemento.classList.add('opacity-0');
    requestAnimationFrame(() => {
        elemento.classList.remove('opacity-0');
        elemento.classList.add('opacity-100');
    });
};

export const ocultarConFadeOut = (elemento, alTerminar) => {
    elemento.classList.remove('opacity-100');
    elemento.classList.add('opacity-0');
    elemento.addEventListener(
        'transitionend',
        () => {
            elemento.classList.add('hidden');
            alTerminar?.();
        },
        { once: true }
    );
};
