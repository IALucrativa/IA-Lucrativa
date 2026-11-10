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
  | 'gancho'
  | 'porta'
  | 'mira'
  | 'tropeca'
  | 'prateleira'
  | 'silencio';

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

export const BATALHA_YOUTUBE: ConfigBatalha = {
  plataforma: 'youtube',
  audio: 'bisnaga/d01/batalha/youtube.mp3',
  contagem: {comuns: 18, 'AÇOUGUE': 11, FEIRANTE: 5, 'LOTÉRICA': 4, 'SALÃO': 4},
  frente: 'AÇOUGUE',
  faltaram: 8,
  duracao: 92.2,
  destaques: ['Quarenta', 'dois', 'Dezoito', 'vinte', 'quatro', 'AÇOUGUE', 'Onze', 'geladeiras', 'Mil', 'FEIRANTES', 'LOTÉRICAS', 'SALÕES', 'comuns', 'espaço', 'patadas', 'dez', 'mil', 'pouco', 'Bisnaga', 'fornada', 'salvo', 'honra', 'oito', 'roendo'],
  blocos: [
    {cena: 'chamado', fim: 2.41, legendas: [[0, 'Quarenta e dois gatos atenderam o chamado.']]},
    {cena: 'contagem', fim: 9.14, legendas: [[2.9, 'Dezoito gatos comuns...'], [4.75, 'e vinte e quatro do comércio.'], [6.88, 'Nem um a mais, nem um a menos.']]},
    {cena: 'frente', fim: 16.21, legendas: [[9.74, 'Na frente, o mais pedido:'], [11.74, 'AÇOUGUE.'], [12.78, 'Onze gatos.'], [14.2, 'A maior força que esse bairro já viu.']]},
    {cena: 'barriga', fim: 22.43, legendas: [[16.8, 'Eles avançam...'], [18.21, 'e param.'], [19.27, 'Onze gatos.'], [20.77, 'Onze geladeiras abertas.']]},
    {cena: 'pinguins', fim: 27.42, legendas: [[22.89, 'Os pinguins não esperam.'], [24.44, 'Mil, escorregando de barriga pelo chão encerado.']]},
    {cena: 'feirante', fim: 34.09, legendas: [[27.75, 'Cinco FEIRANTES gritam juntos.'], [30.13, 'A primeira fila inteira trava...'], [32.45, 'até as cinco vozes acabarem.']]},
    {cena: 'loterica', fim: 41.2, legendas: [[34.71, 'Quatro LOTÉRICAS miram com cuidado...'], [37.29, 'e erram todas.'], [38.81, 'Aí uma tropeça.'], [40.08, 'E derruba a prateleira.']]},
    {cena: 'salao', fim: 47.27, legendas: [[41.7, 'Quatro SALÕES deslizam no meio deles, em formação...'], [45.16, 'até cair farinha no primeiro topete.']]},
    {cena: 'comuns', fim: 52.79, legendas: [[47.89, 'Os dezoito comuns fazem o que gato faz de melhor:'], [51.85, 'ocupam espaço.']]},
    {cena: 'patada', fim: 58.33, legendas: [[53.3, 'E o AÇOUGUE?'], [54.33, 'Terminou de comer.'], [55.74, 'Onze patadas.'], [57.11, 'Onze filas no chão.']]},
    {cena: 'dezmil', fim: 65.42, legendas: [[58.74, 'Foi por pouco.'], [59.93, 'Mas são dez mil.'], [61.78, 'E quarenta e dois gatos...'], [63.59, 'não seguram dez mil pinguins.']]},
    {cena: 'rola', fim: 70.84, legendas: [[66.07, 'Foi aí que o Bisnaga se virou no sono...'], [68.57, 'e deitou em cima da fornada da madrugada.']]},
    {cena: 'pao', fim: 76.62, legendas: [[71.26, 'Seis quilos de gato.'], [73.34, 'Nenhum pinguim tira ele dali.'], [75.76, 'O pão está salvo.']]},
    {cena: 'placar', fim: 86.25, legendas: [[77.04, 'Os gatos recuam com honra.'], [79.24, 'A cozinha...'], [80.19, 'ficou com os pinguins.'], [81.78, 'Vocês mandaram quarenta e dois soldados.'], [84.25, 'Faltaram oito para segurar a cozinha.']]},
    {cena: 'gancho', fim: 90.94, legendas: [[86.81, 'Mas lá fora, na porta de aço...'], [89.41, 'tem alguma coisa roendo.']]},
  ],
};

export const BATALHA_TIKTOK: ConfigBatalha = {
  plataforma: 'tiktok',
  audio: 'bisnaga/d01/batalha/tiktok.mp3',
  contagem: {comuns: 1, 'AÇOUGUE': 0, FEIRANTE: 0, 'LOTÉRICA': 1, 'SALÃO': 0},
  frente: 'LOTÉRICA',
  faltaram: 48,
  duracao: 73.9,
  destaques: ['Dois', 'comum', 'LOTÉRICA', 'dez', 'mil', 'fica', 'erra', 'Erra', 'tropeça', 'Duzentos', 'querer', 'silêncio', 'Bisnaga', 'fornada', 'salvo', 'honra', 'dois', 'quarenta', 'oito', 'roendo'],
  blocos: [
    {cena: 'chamado', fim: 2.1, legendas: [[0, 'Dois gatos atenderam o chamado.']]},
    {cena: 'contagem', fim: 7.72, legendas: [[2.69, 'Um gato comum.'], [4.1, 'E uma LOTÉRICA.'], [5.57, 'Nem um a mais, nem um a menos.']]},
    {cena: 'dezmil', fim: 13.23, legendas: [[8.24, 'Dois contra dez mil.'], [10.74, 'Os pinguins nem diminuem a velocidade.']]},
    {cena: 'porta', fim: 19.37, legendas: [[13.77, 'O gato comum fica na porta da cozinha.'], [16.45, 'Não ataca.'], [17.53, 'Não foge.'], [18.74, 'Só fica.']]},
    {cena: 'mira', fim: 23.96, legendas: [[20.11, 'A LOTÉRICA mira o primeiro pinguim com cuidado...'], [23.54, 'e erra.']]},
    {cena: 'mira', fim: 26.64, legendas: [[24.63, 'Mira o segundo.'], [25.93, 'Erra de novo.']]},
    {cena: 'tropeca', fim: 32.4, legendas: [[27.29, 'Aí ela desiste de mirar.'], [29.09, 'Dá um passo para trás...'], [30.69, 'e tropeça numa forma de bolo.']]},
    {cena: 'prateleira', fim: 37.66, legendas: [[32.87, 'A prateleira inteira cai.'], [34.72, 'Duzentos pinguins no chão.'], [36.98, 'Sem querer.']]},
    {cena: 'silencio', fim: 40.71, legendas: [[38.31, 'Por um segundo, a cozinha fica em silêncio.']]},
    {cena: 'dezmil', fim: 45.99, legendas: [[41.28, 'Mas são dez mil.'], [42.83, 'E dois gatos...'], [44.14, 'não seguram dez mil pinguins.']]},
    {cena: 'rola', fim: 51.47, legendas: [[46.54, 'Foi aí que o Bisnaga se virou no sono...'], [48.97, 'e deitou em cima da fornada da madrugada.']]},
    {cena: 'pao', fim: 57.59, legendas: [[51.89, 'Seis quilos de gato.'], [54.03, 'Nenhum pinguim tira ele dali.'], [56.59, 'O pão está salvo.']]},
    {cena: 'placar', fim: 67.7, legendas: [[58.03, 'Os gatos recuam com honra.'], [60.35, 'A cozinha...'], [61.36, 'ficou com os pinguins.'], [63.1, 'Vocês mandaram dois soldados.'], [65.19, 'Faltaram quarenta e oito para segurar a cozinha.']]},
    {cena: 'gancho', fim: 72.65, legendas: [[68.27, 'Mas lá fora, na porta de aço...'], [71.01, 'tem alguma coisa roendo.']]},
  ],
};
