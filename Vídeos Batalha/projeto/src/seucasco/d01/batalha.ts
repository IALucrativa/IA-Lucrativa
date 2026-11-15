// Seu Casco · Desafio 1 · Batalha: a contagem real (soma das plataformas) e os tempos da narração.
// Os tempos (em segundos) vêm das pausas da voz (ffmpeg silencedetect) em batalha/audios/narracao.mp3 (89,2 s).

export type CenaBat = 'abertura' | 'chegada' | 'ausentes' | 'frente' | 'avanco' | 'patinete' | 'empurrao' | 'capota' | 'comuns' | 'recuo' | 'heroi' | 'vitoria' | 'gancho';
export type BlocoBat = {cena: CenaBat; fim: number; legendas: [number, string][]};
export type ContagemSC = {comuns: number; ACADEMIA: number; CROCHE: number; PATINETE: number; OBRA: number};
export type ConfigBatalhaSC = {audio: string | null; duracao: number; contagem: ContagemSC; destaques: string[]; blocos: BlocoBat[]};

export const BATALHA_SC_D01: ConfigBatalhaSC = {
  audio: 'seucasco/d01/batalha/narracao.mp3',
  duracao: 90.2,
  // Instagram + YouTube (o TikTok não teve comentários), confirmado em 15/11/2026
  contagem: {comuns: 99, ACADEMIA: 57, CROCHE: 0, PATINETE: 53, OBRA: 0},
  destaques: ['Duzentos', 'nove', 'ACADEMIA', 'PATINETES', 'CROCHÊ', 'OBRA', 'Dez', 'mil', 'tanque', 'capotadas', 'comuns', 'recuam', 'Seu', 'Casco', 'alface', 'Vitória', 'duzentos', 'tremer', 'Sozinha'],
  blocos: [
    {cena: 'abertura', fim: 3.06, legendas: [[0, 'Duzentos e nove jabutis atenderam o chamado.']]},
    {cena: 'chegada', fim: 12.13, legendas: [[3.57, 'Noventa e nove comuns...'], [5.26, 'cinquenta e sete de ACADEMIA...'], [7.49, 'e cinquenta e três de PATINETE.'], [9.97, 'Nem um a mais, nem um a menos.']]},
    {cena: 'ausentes', fim: 17.67, legendas: [[12.67, 'CROCHÊ e OBRA? Ninguém chamou.'], [15.25, 'Hoje não tem blindagem... nem trincheira.']]},
    {cena: 'frente', fim: 25.02, legendas: [[18.38, 'Na frente, o mais pedido: ACADEMIA.'], [21.59, 'Cinquenta e sete cascos. Os mais duros do bairro.']]},
    {cena: 'avanco', fim: 29.81, legendas: [[25.65, 'As lesmas avançam.'], [27.21, 'Dez mil...'], [28.31, 'deixando gosma em tudo.']]},
    {cena: 'patinete', fim: 39.28, legendas: [[30.51, 'Cinquenta e três PATINETES saem em disparada.'], [33.68, 'Atravessam as lesmas de ponta a ponta...'], [36.37, 'e não param.'], [37.59, 'Cinquenta e três no tanque.']]},
    {cena: 'empurrao', fim: 44.33, legendas: [[39.69, 'Agora é a ACADEMIA.'], [41.63, 'Um empurrão... e a fila inteira sai rolando.']]},
    {cena: 'capota', fim: 51.29, legendas: [[44.71, 'Cinquenta e sete empurrões.'], [46.92, 'E, na gosma... cinquenta e sete capotadas.'], [50.2, 'De patinha pro ar.']]},
    {cena: 'comuns', fim: 61.08, legendas: [[51.92, 'Os noventa e nove comuns fazem o que jabuti faz de melhor:'], [55.78, 'entram no casco.'], [57.34, 'Noventa e nove pedras em volta da horta.'], [60.14, 'Ninguém passa.']]},
    {cena: 'recuo', fim: 68.42, legendas: [[61.7, 'Pela primeira vez...'], [63.15, 'as lesmas recuam.'], [64.66, 'A um milímetro por segundo.'], [67.06, 'Vai levar a noite inteira.']]},
    {cena: 'heroi', fim: 74.56, legendas: [[69.17, 'E o Seu Casco?'], [70.37, 'Chegou agora.'], [71.67, 'Olhou a horta salva...'], [73.32, 'e comeu a alface.']]},
    {cena: 'vitoria', fim: 83.61, legendas: [[75.11, 'Vitória.'], [76.18, 'A horta é dos jabutis.'], [78.29, 'Vocês mandaram duzentos e nove soldados.'], [81.3, 'Com quinhentos... o chão vai tremer.']]},
    {cena: 'gancho', fim: 89.23, legendas: [[84.23, 'Mas lá no pé de manga...'], [86.03, 'uma folha está descendo o tronco.'], [88.36, 'Sozinha.']]},
  ],
};
