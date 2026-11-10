// Desafio 1 · Batalhas: a contagem real de cada plataforma e os tempos da narração.
// Os tempos (em segundos) vêm das pausas da voz (ffmpeg silencedetect) no arquivo de cada plataforma.

export type Tipo = 'AÇOUGUE' | 'FEIRANTE' | 'LOTÉRICA' | 'SALÃO';
export type Contagem = {comuns: number} & Record<Tipo, number>;

export type CenaBatalha =
  | 'chamado'
  | 'contagem'
  | 'frente'
  | 'barriga'
  | 'pinguins'
  | 'feirante'
  | 'loterica'
  | 'salao'
  | 'comuns'
  | 'patada'
  | 'dezmil'
  | 'rola'
  | 'pao'
  | 'placar'
  | 'gancho';

export type Bloco = {cena: CenaBatalha; fim: number; legendas: [number, string][]};

export type ConfigBatalha = {
  plataforma: 'instagram' | 'tiktok' | 'youtube';
  audio: string;
  contagem: Contagem;
  frente: Tipo;
  faltaram: number;
  duracao: number; // s, com o respiro final
  destaques: string[];
  blocos: Bloco[];
};

export const soldados = (c: Contagem) => c.comuns + c['AÇOUGUE'] + c.FEIRANTE + c['LOTÉRICA'] + c['SALÃO'];

export const BATALHA_INSTAGRAM: ConfigBatalha = {
  plataforma: 'instagram',
  audio: 'bisnaga/d01/batalha/instagram.mp3',
  contagem: {comuns: 17, 'AÇOUGUE': 3, FEIRANTE: 1, 'LOTÉRICA': 1, 'SALÃO': 1},
  frente: 'AÇOUGUE',
  faltaram: 27,
  duracao: 86.7,
  destaques: ['Vinte', 'três', 'Dezessete', 'seis', 'AÇOUGUE.', 'AÇOUGUE?', 'barriga', 'vazia.', 'Mil,', 'FEIRANTE', 'LOTÉRICA', 'SALÃO', 'comuns', 'espaço.', 'patada,', 'dez', 'mil.', 'mil', 'Bisnaga', 'fornada', 'salvo.', 'honra.', 'vinte', 'sete', 'roendo.'],
  blocos: [
    {cena: 'chamado', fim: 2.36, legendas: [[0, 'Vinte e três gatos atenderam o chamado.']]},
    {cena: 'contagem', fim: 8.64, legendas: [[2.9, 'Dezessete gatos comuns...'], [4.75, 'e seis do comércio.'], [6.38, 'Nem um a mais, nem um a menos.']]},
    {cena: 'frente', fim: 14.62, legendas: [[9.2, 'Na frente, o mais pedido:'], [11.25, 'AÇOUGUE.'], [12.41, 'Três gatos. A força do bairro.']]},
    {cena: 'barriga', fim: 19.55, legendas: [[15.16, 'Eles avançam...'], [16.62, 'e param.'], [17.73, 'Ninguém luta de barriga vazia.']]},
    {cena: 'pinguins', fim: 24.71, legendas: [[19.95, 'Os pinguins não esperam.'], [21.55, 'Mil, escorregando de barriga pelo chão encerado.']]},
    {cena: 'feirante', fim: 29.49, legendas: [[25.22, 'O FEIRANTE grita.'], [26.57, 'A primeira fila trava...'], [28.46, 'até a voz acabar.']]},
    {cena: 'loterica', fim: 35.18, legendas: [[30.05, 'A LOTÉRICA tropeça numa forma de bolo.'], [32.55, 'Uma prateleira inteira cai.'], [34.6, 'Sem querer.']]},
    {cena: 'salao', fim: 40.54, legendas: [[35.78, 'O SALÃO desliza no meio deles com estilo...'], [38.69, 'até cair farinha no topete.']]},
    {cena: 'comuns', fim: 45.88, legendas: [[41.26, 'Os dezessete comuns fazem o que gato faz de melhor:'], [44.75, 'ocupam espaço.']]},
    {cena: 'patada', fim: 52.27, legendas: [[46.5, 'E o AÇOUGUE?'], [47.62, 'Terminou de comer.'], [48.97, 'Agora sim:'], [50.15, 'uma patada, uma fila inteira.']]},
    {cena: 'dezmil', fim: 57.99, legendas: [[52.79, 'Mas são dez mil.'], [54.48, 'E vinte e três gatos...'], [56.2, 'não seguram dez mil pinguins.']]},
    {cena: 'rola', fim: 63.6, legendas: [[58.66, 'Foi aí que o Bisnaga se virou no sono...'], [61.16, 'e deitou em cima da fornada da madrugada.']]},
    {cena: 'pao', fim: 69.72, legendas: [[64.06, 'Seis quilos de gato.'], [66.23, 'Nenhum pinguim tira ele dali.'], [68.57, 'O pão está salvo.']]},
    {cena: 'placar', fim: 80.51, legendas: [[70.16, 'Os gatos recuam com honra.'], [72.49, 'A cozinha...'], [73.52, 'ficou com os pinguins.'], [75.42, 'Vocês mandaram vinte e três soldados.'], [77.99, 'Faltaram vinte e sete para segurar a cozinha.']]},
    {cena: 'gancho', fim: 85.43, legendas: [[81.11, 'Mas lá fora, na porta de aço...'], [83.78, 'tem alguma coisa roendo.']]},
  ],
};
