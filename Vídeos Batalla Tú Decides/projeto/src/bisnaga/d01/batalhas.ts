// Desafio 1 · Batalha: a contagem real (soma das três plataformas) e os tempos da narração.
// Os tempos (em segundos) vêm das pausas da voz (ffmpeg silencedetect).

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
  | 'silencio'
  | 'recuam'
  | 'acorda'
  | 'vitoria';

export type Bloco = {cena: CenaBatalha; fim: number; legendas: [number, string][]};

export type ConfigBatalha = {
  audio: string;
  contagem: Contagem;
  frente: Tipo;
  duracao: number; // s, com o respiro final
  destaques: string[];
  blocos: Bloco[];
};

export const soldados = (c: Contagem) => c.comuns + c['AÇOUGUE'] + c.FEIRANTE + c['LOTÉRICA'] + c['SALÃO'];

export const BATALHA_D01: ConfigBatalha = {
  audio: 'bisnaga/d01/batalha/narracao.mp3',
  contagem: {comuns: 40, 'AÇOUGUE': 50, FEIRANTE: 40, 'LOTÉRICA': 40, 'SALÃO': 30},
  frente: 'AÇOUGUE',
  duracao: 96.0,
  destaques: ['Duzentos', 'Quarenta', 'cento', 'sessenta', 'AÇOUGUE', 'Cinquenta', 'barriga', 'vazia', 'Mil', 'FEIRANTES', 'trava', 'LOTÉRICAS', 'tropeçam', 'tropeços', 'prateleiras', 'SALÕES', 'topete', 'comuns', 'porta', 'patadas', 'recuam', 'todos', 'Bisnaga', 'dormir', 'Vitória', 'duzentos', 'quinhentos', 'musiquinha', 'roendo'],
  blocos: [
    {cena: 'chamado', fim: 2.29, legendas: [[0, 'Duzentos gatos atenderam o chamado.']]},
    {cena: 'contagem', fim: 8.93, legendas: [[2.9, 'Quarenta comuns...'], [4.22, 'e cento e sessenta do comércio.'], [6.52, 'Nem um a mais, nem um a menos.']]},
    {cena: 'frente', fim: 16.3, legendas: [[9.55, 'Na frente, o mais pedido:'], [11.56, 'AÇOUGUE.'], [12.59, 'Cinquenta gatos.'], [14.32, 'A maior força que esse bairro já viu.']]},
    {cena: 'barriga', fim: 21.33, legendas: [[17.03, 'Eles avançam...'], [18.5, 'e param.'], [19.61, 'Ninguém luta de barriga vazia.']]},
    {cena: 'pinguins', fim: 26.54, legendas: [[21.81, 'Os pinguins não esperam.'], [23.39, 'Mil, escorregando de barriga pelo chão encerado.']]},
    {cena: 'feirante', fim: 33.45, legendas: [[27.18, 'Quarenta FEIRANTES gritam ao mesmo tempo.'], [29.95, 'A cozinha inteira trava...'], [31.98, 'até as vozes acabarem.']]},
    {cena: 'loterica', fim: 45.43, legendas: [[34.34, 'Quarenta LOTÉRICAS miram com cuidado...'], [37.11, 'e erram todas.'], [38.59, 'Desistem.'], [39.68, 'Viram de costas...'], [41.02, 'e tropeçam.'], [42.3, 'Quarenta tropeços.'], [44.03, 'Todas as prateleiras no chão.']]},
    {cena: 'salao', fim: 51.75, legendas: [[46.14, 'Trinta SALÕES desfilam em formação pelo chão encerado...'], [49.87, 'até cair farinha no primeiro topete.']]},
    {cena: 'comuns', fim: 58.7, legendas: [[52.51, 'Os quarenta comuns fazem o que gato faz de melhor:'], [56.37, 'deitam na porta.'], [57.85, 'Ninguém passa.']]},
    {cena: 'patada', fim: 65.07, legendas: [[59.37, 'E o AÇOUGUE?'], [60.54, 'Terminou de comer.'], [61.85, 'Cinquenta patadas.'], [63.52, 'Cinquenta filas no chão.']]},
    {cena: 'recuam', fim: 73.89, legendas: [[65.79, 'Pela primeira vez...'], [67.23, 'os pinguins recuam.'], [68.93, 'Um.'], [69.72, 'Depois cem.'], [70.84, 'Depois todos, de volta para dentro da geladeira.']]},
    {cena: 'acorda', fim: 79.79, legendas: [[74.63, 'E o Bisnaga?'], [75.79, 'Acordou agora.'], [77.15, 'Olhou a cozinha vazia...'], [78.9, 'e voltou a dormir.']]},
    {cena: 'vitoria', fim: 89.45, legendas: [[80.55, 'Vitória.'], [81.62, 'A cozinha é dos gatos.'], [83.73, 'Vocês mandaram duzentos soldados.'], [86.13, 'Com quinhentos...'], [87.22, 'o bairro inteiro vai ouvir a musiquinha.']]},
    {cena: 'gancho', fim: 94.93, legendas: [[90.15, 'Mas lá fora, na porta de aço...'], [93.03, 'tem alguma coisa roendo.']]},
  ],
};
