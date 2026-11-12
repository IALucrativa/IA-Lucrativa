// Seu Casco · Desafio 1 · Convocação: os tempos da narração (em segundos).
// PROVISÓRIOS até o áudio chegar; depois vêm das pausas da voz (ffmpeg silencedetect).

export type CenaConv = 'abertura' | 'partiu' | 'seucasco' | 'regra' | 'academia' | 'croche' | 'patinete' | 'obra' | 'lesmas' | 'meta' | 'prazo' | 'ameaca' | 'pergunta';
export type BlocoConv = {cena: CenaConv; fim: number; legendas: [number, string][]};
export type ConfigConvocacao = {audio: string | null; duracao: number; destaques: string[]; blocos: BlocoConv[]};

export const CONVOCACAO_D01: ConfigConvocacao = {
  audio: null,
  duracao: 72,
  destaques: ['Dez', 'mil', 'partiu', 'Seu', 'Casco', 'você', 'comentário', 'ACADEMIA', 'CROCHÊ', 'PATINETE', 'OBRA', 'milímetro', 'quinhentos', 'tremer', 'vinte', 'quatro', 'horas', 'palmo', 'alface', 'convoca'],
  blocos: [
    {cena: 'abertura', fim: 3.2, legendas: [[0, 'Dez mil lesmas...'], [1.4, 'estão marchando para a horta.']]},
    {cena: 'partiu', fim: 7.4, legendas: [[3.8, 'E só um soldado está no caminho.'], [6.1, 'Ele já partiu.']]},
    {cena: 'seucasco', fim: 15.0, legendas: [[8.0, 'Esse é o Seu Casco.'], [9.6, 'Oitenta anos.'], [10.7, 'O jabuti mais lento do bairro.'], [12.6, 'E o exército dele...'], [14.0, 'quem monta é você.']]},
    {cena: 'regra', fim: 18.4, legendas: [[15.6, 'Cada comentário...'], [16.9, 'é um jabuti a mais.']]},
    {cena: 'academia', fim: 26.4, legendas: [[19.0, 'Se comentar ACADEMIA, vem o casco mais duro do bairro.'], [22.2, 'Derruba qualquer coisa...'], [23.8, 'mas, se capotar, fica de patinha pro ar.']]},
    {cena: 'croche', fim: 31.6, legendas: [[27.0, 'CROCHÊ vem blindado.'], [28.3, 'Nada atravessa...'], [29.6, 'mas os fiozinhos enroscam em tudo.']]},
    {cena: 'patinete', fim: 35.8, legendas: [[32.2, 'PATINETE é o único jabuti rápido do mundo...'], [34.6, 'só não sabe frear.']]},
    {cena: 'obra', fim: 39.8, legendas: [[36.4, 'E OBRA cava uma trincheira em segundos...'], [38.6, 'no lugar errado.']]},
    {cena: 'lesmas', fim: 46.0, legendas: [[40.4, 'As lesmas:'], [41.4, 'um milímetro por segundo.'], [43.2, 'Parece pouco.'], [44.3, 'É mais rápido que o Seu Casco.']]},
    {cena: 'meta', fim: 51.6, legendas: [[46.6, 'Se passar de quinhentos comentários...'], [49.2, 'o chão vai tremer.'], [50.5, 'E não vai ser trovão.']]},
    {cena: 'prazo', fim: 62.2, legendas: [[52.2, 'Vocês têm vinte e quatro horas.'], [54.4, 'Amanhã, ao meio-dia,'], [55.8, 'a gente conta comentário por comentário.'], [58.2, 'Cada comentário vira um jabuti.'], [60.2, 'Nem um a mais, nem um a menos.']]},
    {cena: 'ameaca', fim: 69.6, legendas: [[62.8, 'Por enquanto, o exército do Seu Casco...'], [65.0, 'é o Seu Casco.'], [66.2, 'Ele já andou um palmo.'], [67.8, 'E as lesmas já chegaram na alface.']]},
    {cena: 'pergunta', fim: 71.2, legendas: [[70.0, 'Quem você convoca?']]},
  ],
};
