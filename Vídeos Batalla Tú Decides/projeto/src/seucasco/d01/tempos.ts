// Don Caparazón (Seu Casco em espanhol) · Reto 1 · Convocatoria: os tempos da narração (em segundos).
// PROVISÓRIOS: ainda são os da versão em português. Quando chegar a narração em espanhol
// (public/seucasco/d01/convocacao/narracion.mp3), refaça os tempos pela transcrição do áudio.

export type CenaConv = 'abertura' | 'partiu' | 'seucasco' | 'regra' | 'academia' | 'croche' | 'patinete' | 'obra' | 'lesmas' | 'meta' | 'prazo' | 'ameaca' | 'pergunta';
export type BlocoConv = {cena: CenaConv; fim: number; legendas: [number, string][]};
export type ConfigConvocacao = {audio: string | null; duracao: number; destaques: string[]; blocos: BlocoConv[]};

export const CONVOCACAO_D01: ConfigConvocacao = {
  audio: null, // trocar por 'seucasco/d01/convocacao/narracion.mp3' quando o áudio chegar
  duracao: 79.6,
  destaques: ['Diez', 'mil', 'salido', 'Don', 'Caparazón', 'tú', 'comentario', 'GIMNASIO', 'GANCHILLO', 'PATINETE', 'OBRA', 'milímetro', 'quinientos', 'temblar', 'veinticuatro', 'horas', 'palmo', 'lechuga', 'convocas'],
  blocos: [
    {cena: 'abertura', fim: 3.62, legendas: [[0, 'Diez mil babosas...'], [2.0, 'marchan hacia el huerto.']]},
    {cena: 'partiu', fim: 7.49, legendas: [[4.16, 'Y solo un soldado se interpone.'], [6.72, 'Ya ha salido.']]},
    {cena: 'seucasco', fim: 17.66, legendas: [[8.2, 'Este es Don Caparazón.'], [10.31, 'Ochenta años.'], [11.98, 'La tortuga más lenta del barrio.'], [14.57, 'Y su ejército...'], [16.17, 'lo montas tú.']]},
    {cena: 'regra', fim: 20.84, legendas: [[18.28, 'Cada comentario...'], [19.57, 'es una tortuga más.']]},
    {cena: 'academia', fim: 29.78, legendas: [[21.31, 'Si comentas GIMNASIO, llega el caparazón más duro del barrio.'], [25.06, 'Lo tumba todo...'], [26.76, 'pero, si vuelca, se queda con las patitas al aire.']]},
    {cena: 'croche', fim: 35.65, legendas: [[30.28, 'GANCHILLO viene blindado.'], [32.15, 'Nada lo atraviesa...'], [33.58, 'pero los hilillos se enganchan en todo.']]},
    {cena: 'patinete', fim: 40.2, legendas: [[36.06, 'PATINETE es la única tortuga rápida del mundo...'], [39.22, 'pero no sabe frenar.']]},
    {cena: 'obra', fim: 44.39, legendas: [[40.61, 'Y OBRA cava una trinchera en segundos...'], [43.54, 'en el sitio equivocado.']]},
    {cena: 'lesmas', fim: 50.84, legendas: [[44.84, 'Las babosas:'], [46.07, 'un milímetro por segundo.'], [48.14, 'Parece poco.'], [49.23, 'Es más rápido que Don Caparazón.']]},
    {cena: 'meta', fim: 56.56, legendas: [[51.28, 'Si pasamos de quinientos comentarios...'], [53.58, 'el suelo va a temblar.'], [55.16, 'Y no será un trueno.']]},
    {cena: 'prazo', fim: 68.27, legendas: [[57.01, 'Tenéis veinticuatro horas.'], [59.17, 'Mañana, a mediodía,'], [60.76, 'contamos comentario por comentario.'], [63.55, 'Cada comentario se convierte en una tortuga.'], [65.85, 'Ni una más, ni una menos.']]},
    {cena: 'ameaca', fim: 76.66, legendas: [[68.61, 'Por ahora, el ejército de Don Caparazón...'], [71.41, 'es Don Caparazón.'], [72.75, 'Ya ha avanzado un palmo.'], [74.36, 'Y las babosas ya han llegado a la lechuga.']]},
    {cena: 'pergunta', fim: 78.14, legendas: [[77.16, '¿A quién convocas?']]},
  ],
};
