import { obtenerRutaImagen } from '../cartas/carta.js';

const CARTA_DORSO = 'grey_back';
const TAMANO_MANO = 5;

const crearCartaDom = (carta, marcada, alClic) => {
    const figura = document.createElement('div');
    figura.className = 'flex flex-col items-center gap-1 cursor-pointer select-none';

    const imagen = document.createElement('img');
    imagen.src = obtenerRutaImagen(carta);
    imagen.alt = carta;
    imagen.className = `w-16 sm:w-20 rounded-lg transition-transform duration-200 ${
        marcada ? 'ring-4 ring-red-500 -translate-y-2' : 'ring-0'
    }`;

    const etiqueta = document.createElement('span');
    etiqueta.textContent = marcada ? 'CAMBIAR' : '';
    etiqueta.className = 'text-xs font-bold text-red-400 h-4';

    figura.append(imagen, etiqueta);
    figura.addEventListener('click', alClic);
    return figura;
};

// Mano del jugador durante el descarte: se pueden marcar cartas para cambiar.
export const renderizarMano = (contenedor, mano, descartes, alClicCarta) => {
    contenedor.innerHTML = '';
    mano.forEach((carta, indice) => {
        contenedor.append(crearCartaDom(carta, descartes[indice], () => alClicCarta(indice)));
    });
};

export const renderizarDorsos = (contenedor) => {
    contenedor.innerHTML = '';
    for (let i = 0; i < TAMANO_MANO; i++) {
        const imagen = document.createElement('img');
        imagen.src = obtenerRutaImagen(CARTA_DORSO);
        imagen.alt = 'Carta oculta';
        imagen.className = 'w-16 sm:w-20 rounded-lg opacity-70';
        contenedor.append(imagen);
    }
};

// Mano estática boca arriba (sin interacción), para el enfrentamiento.
export const renderizarManoRevelada = (contenedor, mano) => {
    contenedor.innerHTML = '';
    for (const carta of mano) {
        const imagen = document.createElement('img');
        imagen.src = obtenerRutaImagen(carta);
        imagen.alt = carta;
        imagen.className = 'w-16 sm:w-20 rounded-lg';
        contenedor.append(imagen);
    }
};
