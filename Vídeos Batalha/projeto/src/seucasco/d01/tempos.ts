// Seu Casco · Desafio 1 · Convocação: os tempos da narração (em segundos).
// Vêm das pausas da voz (ffmpeg silencedetect) em audios/narracao.mp3 (78,4 s).

export type CenaConv = 'abertura' | 'partiu' | 'seucasco' | 'regra' | 'academia' | 'croche' | 'patinete' | 'obra' | 'lesmas' | 'meta' | 'prazo' | 'ameaca' | 'pergunta';
export type BlocoConv = {cena: CenaConv; fim: number; legendas: [number, string][]};
export type ConfigConvocacao = {audio: string | null; duracao: number; destaques: string[]; blocos: BlocoConv[]};

export const CONVOCACAO_D01: ConfigConvocacao = {
  audio: 'seucasco/d01/convocacao/narracao.mp3',
  duracao: 79.6,
  destaques: ['Dez', 'mil', 'partiu', 'Seu', 'Casco', 'você', 'comentário', 'ACADEMIA', 'CROCHÊ', 'PATINETE', 'OBRA', 'milímetro', 'quinhentos', 'tremer', 'vinte', 'quatro', 'horas', 'palmo', 'alface', 'convoca'],
  blocos: [
    {cena: 'abertura', fim: 3.62, legendas: [[0, 'Dez mil lesmas...'], [2.0, 'estão marchando para a horta.']]},
    {cena: 'partiu', fim: 7.49, legendas: [[4.16, 'E só um soldado está no caminho.'], [6.72, 'Ele já partiu.']]},
    {cena: 'seucasco', fim: 17.66, legendas: [[8.2, 'Esse é o Seu Casco.'], [10.31, 'Oitenta anos.'], [11.98, 'O jabuti mais lento do bairro.'], [14.57, 'E o exército dele...'], [16.17, 'quem monta é você.']]},
    {cena: 'regra', fim: 20.84, legendas: [[18.28, 'Cada comentário...'], [19.57, 'é um jabuti a mais.']]},
    {cena: 'academia', fim: 29.78, legendas: [[21.31, 'Se comentar ACADEMIA, vem o casco mais duro do bairro.'], [25.06, 'Derruba qualquer coisa...'], [26.76, 'mas, se capotar, fica de patinha pro ar.']]},
    {cena: 'croche', fim: 35.65, legendas: [[30.28, 'CROCHÊ vem blindado.'], [32.15, 'Nada atravessa...'], [33.58, 'mas os fiozinhos enroscam em tudo.']]},
    {cena: 'patinete', fim: 40.2, legendas: [[36.06, 'PATINETE é o único jabuti rápido do mundo...'], [39.22, 'só não sabe frear.']]},
    {cena: 'obra', fim: 44.39, legendas: [[40.61, 'E OBRA cava uma trincheira em segundos...'], [43.54, 'no lugar errado.']]},
    {cena: 'lesmas', fim: 50.84, legendas: [[44.84, 'As lesmas:'], [46.07, 'um milímetro por segundo.'], [48.14, 'Parece pouco.'], [49.23, 'É mais rápido que o Seu Casco.']]},
    {cena: 'meta', fim: 56.56, legendas: [[51.28, 'Se passar de quinhentos comentários...'], [53.58, 'o chão vai tremer.'], [55.16, 'E não vai ser trovão.']]},
    {cena: 'prazo', fim: 68.27, legendas: [[57.01, 'Vocês têm vinte e quatro horas.'], [59.17, 'Amanhã, ao meio-dia,'], [60.76, 'a gente conta comentário por comentário.'], [63.55, 'Cada comentário vira um jabuti.'], [65.85, 'Nem um a mais, nem um a menos.']]},
    {cena: 'ameaca', fim: 76.66, legendas: [[68.61, 'Por enquanto, o exército do Seu Casco...'], [71.41, 'é o Seu Casco.'], [72.75, 'Ele já andou um palmo.'], [74.36, 'E as lesmas já chegaram na alface.']]},
    {cena: 'pergunta', fim: 78.14, legendas: [[77.16, 'Quem você convoca?']]},
  ],
};
