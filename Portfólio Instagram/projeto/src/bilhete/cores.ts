// Estilo A: cartoon com contorno (escolhido na prancha 1).
export const C = {
  linha: '#1b1b2a',
  lw: 3,
  macacao: '#2f6db5',
  macacaoSomb: '#245793',
  pele: '#e0a77f',
  peleSomb: '#c98d66',
  cabelo: '#3a2a22',
  sapato: '#2a2a2a',
  cinto: '#5a3a24',
  chave: '#d8c37a',
  papel: '#fbf7ea',
  luz: '#ffe69a',
  hud: '#1b1b2a',
  hudTxt: '#ffffff',
  acento: '#ffcc33',
  metal: '#b9c0c9',
  metalEsc: '#8d96a1',
  metalClaro: '#d6dbe1',
};

// Traço padrão para formas com contorno.
export const T = {
  stroke: C.linha,
  strokeWidth: C.lw,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};
export const Tf = {...T, strokeWidth: 2};
