const CLAVE_RANKING = 'pokerCincoCartas.ranking';
const RECORD_SEMILLA = { nombre: 'Raul Espina', puntos: 99999 };
const MAXIMO_ENTRADAS = 50;

export const obtenerRanking = () => {
    const datos = localStorage.getItem(CLAVE_RANKING);
    return datos ? JSON.parse(datos) : [];
};

const guardarRankingCompleto = (ranking) => {
    localStorage.setItem(CLAVE_RANKING, JSON.stringify(ranking));
};

export const inicializarRankingSemilla = () => {
    if (localStorage.getItem(CLAVE_RANKING) !== null) return;
    guardarRankingCompleto([RECORD_SEMILLA]);
};

export const guardarPuntuacion = (nombre, puntos) => {
    const ranking = obtenerRanking();
    ranking.push({ nombre, puntos });
    ranking.sort((a, b) => b.puntos - a.puntos);
    const recortado = ranking.slice(0, MAXIMO_ENTRADAS);
    guardarRankingCompleto(recortado);
    return recortado;
};

export const obtenerTopRanking = (cantidad = 5) => obtenerRanking().slice(0, cantidad);
