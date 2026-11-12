// Estilo A: cartoon com contorno (escolhido na prancha 1, em 2026-11-12).
export const C = {
  linha: '#1b1b2a',
  lw: 3,
  // Kaique
  pele: '#a86b45',
  peleSomb: '#8d5735',
  cabelo: '#1a1412',
  jaqueta: '#b6e021',
  jaquetaSomb: '#93b817',
  faixa: '#e6e9ee',
  calca: '#2b3550',
  calcaSomb: '#222a40',
  tenis: '#f2f2f2',
  solado: '#9a9aa2',
  bone: '#d8342b',
  boneDet: '#a8231c',
  controleChaveiro: '#2f7dff',
  // quarto
  parede: '#4d5d8f',
  paredeSomb: '#43527f',
  rodape: '#2f3a5e',
  chao: '#8a5a3c',
  chaoLinha: '#764b30',
  tapete: '#c4473a',
  ceu: '#16204a',
  predio: '#26305e',
  janelaLuz: '#ffd76a',
  lua: '#f5f0d6',
  movel: '#6b4630',
  movelDet: '#56371f',
  tv: '#141418',
  tvBorda: '#2a2a31',
  console: '#d9dbe0',
  consoleDet: '#9aa0aa',
  fumaca: '#c9c9cf',
  faisca: '#ffd23f',
  fogo: '#ff7a1a',
  bau: '#2f9e57',
  bauDet: '#247d44',
  papel: '#fbf7ea',
  tinta: '#2a2a33',
  vermelho: '#e0322b',
  // HUD
  hud: '#1b1b2a',
  hudTxt: '#ffffff',
  acento: '#ffd23f',
  verde: '#3ccf6e',
};

export const F = "Inter, 'Liberation Sans', Arial, Helvetica, sans-serif";

// Traço padrão para formas com contorno.
export const T = {
  stroke: C.linha,
  strokeWidth: C.lw,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};
export const Tf = {...T, strokeWidth: 2};
