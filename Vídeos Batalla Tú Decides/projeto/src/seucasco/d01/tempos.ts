// Don Caparazón (Seu Casco em espanhol) · Reto 1 · Convocatoria: os tempos da narração (em segundos).
// Tirados da transcrição de public/seucasco/d01/convocacao/narracion.mp3 (voz Jaime, 75,2 s), em 2026-11-12.

export type CenaConv = 'abertura' | 'partiu' | 'seucasco' | 'regra' | 'academia' | 'croche' | 'patinete' | 'obra' | 'lesmas' | 'meta' | 'prazo' | 'ameaca' | 'pergunta';
export type BlocoConv = {cena: CenaConv; fim: number; legendas: [number, string][]};
export type ConfigConvocacao = {audio: string | null; duracao: number; destaques: string[]; blocos: BlocoConv[]};

export const CONVOCACAO_D01: ConfigConvocacao = {
  audio: 'seucasco/d01/convocacao/narracion.mp3',
  duracao: 76.4,
  destaques: ['Diez', 'mil', 'salido', 'Don', 'Caparazón', 'tú', 'comentario', 'GIMNASIO', 'GANCHILLO', 'PATINETE', 'OBRA', 'milímetro', 'quinientos', 'temblar', 'veinticuatro', 'horas', 'palmo', 'lechuga', 'convocas'],
  blocos: [
    {cena: 'abertura', fim: 3.14, legendas: [[0.00, 'Diez mil babosas...'], [1.06, 'marchan hacia el huerto.']]},
    {cena: 'partiu', fim: 7.52, legendas: [[3.10, 'Y solo un soldado se interpone en su camino.'], [6.42, 'Ya ha salido.']]},
    {cena: 'seucasco', fim: 15.72, legendas: [[7.72, 'Este es Don Caparazón.'], [9.58, 'Ochenta años.'], [11.06, 'La tortuga más lenta del barrio.'], [13.40, 'Y su ejército...'], [14.20, 'lo montas tú.']]},
    {cena: 'regra', fim: 18.50, legendas: [[15.84, 'Cada comentario...'], [16.72, 'es una tortuga más.']]},
    {cena: 'academia', fim: 27.36, legendas: [[18.82, 'Si comentas GIMNASIO, llega el caparazón más duro del barrio.'], [22.74, 'Lo tumba todo...'], [24.02, 'pero, si vuelca, se queda con las patitas al aire.']]},
    {cena: 'croche', fim: 33.20, legendas: [[27.48, 'GANCHILLO viene blindado.'], [29.46, 'Nada lo atraviesa...'], [30.76, 'pero los hilillos se enganchan en todo.']]},
    {cena: 'patinete', fim: 38.32, legendas: [[33.36, 'PATINETE es la única tortuga rápida del mundo...'], [36.68, 'pero no sabe frenar.']]},
    {cena: 'obra', fim: 42.56, legendas: [[38.38, 'Y OBRA cava una trinchera en segundos...'], [41.02, 'en el sitio equivocado.']]},
    {cena: 'lesmas', fim: 49.08, legendas: [[42.80, 'Las babosas:'], [43.40, 'un milímetro por segundo.'], [45.64, 'Parece poco.'], [46.82, 'Es más rápido que Don Caparazón.']]},
    {cena: 'meta', fim: 54.50, legendas: [[49.18, 'Si pasamos de quinientos comentarios...'], [51.40, 'el suelo va a temblar.'], [53.20, 'Y no será un trueno.']]},
    {cena: 'prazo', fim: 64.86, legendas: [[54.60, 'Tenéis veinticuatro horas.'], [56.44, 'Mañana, a mediodía,'], [57.74, 'contamos comentario por comentario.'], [60.10, 'Cada comentario se convierte en una tortuga.'], [62.90, 'Ni una más, ni una menos.']]},
    {cena: 'ameaca', fim: 73.66, legendas: [[65.14, 'Por ahora, el ejército de Don Caparazón...'], [67.46, 'es Don Caparazón.'], [69.34, 'Ya ha avanzado un palmo.'], [71.20, 'Y las babosas ya han llegado a la lechuga.']]},
    {cena: 'pergunta', fim: 75.16, legendas: [[73.92, '¿A quién convocas?']]},
  ],
};
