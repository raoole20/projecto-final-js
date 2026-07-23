const CLAVE_RANKING = 'higherLower.ranking';
const RECORD_SEMILLA = { nombre: 'Raul Espina', racha: 999 };

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

export const guardarPuntuacion = (nombre, racha) => {
    const ranking = obtenerRanking();
    ranking.push({ nombre, racha });
    ranking.sort((a, b) => b.racha - a.racha);
    guardarRankingCompleto(ranking);
    return ranking;
};

export const obtenerTopRanking = (cantidad = 5) => obtenerRanking().slice(0, cantidad);
