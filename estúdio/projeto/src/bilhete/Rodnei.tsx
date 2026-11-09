import React from 'react';
import {C, T, Tf} from './cores';

// Rodnei: boneco articulado. NÃO mudar rosto nem corpo sem pedido.
// Origem (0,0) = entre os pés, no chão. Unidades do desenho da prancha 1.

export type Braco = {ombro: number; cotovelo: number};
export type MaoObjeto = 'nada' | 'chaves' | 'lanterna' | 'bilhete' | 'aviso';

export type RodneiProps = {
  x: number;
  y: number;
  escala?: number;
  frame: number;
  bracoE?: Braco; // esquerda de quem olha
  bracoD?: Braco; // direita de quem olha
  maoE?: MaoObjeto;
  maoD?: MaoObjeto;
  cabeca?: number; // inclinação em graus
  olhar?: [number, number]; // -1..1
  boca?: 'o' | 'fechada' | 'lanterna' | 'aliviada';
  medo?: boolean; // sobrancelhas erguidas
  suor?: boolean;
  chavesNaCintura?: boolean;
  tremor?: number; // graus de tremor nas mãos
  pulo?: number; // deslocamento para cima
  lanternaAcesa?: boolean;
};

const BRACO_SUP = 64;
const ANTEBRACO = 58;

const Chaves: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <circle cx={0} cy={0} r={9} fill="none" stroke={C.chave} strokeWidth={3} />
    <g fill={C.chave} {...Tf}>
      <path d="M-8,6 l-6,22 l4,1 l1,-4 l3,1 l1,-4 l-2,-1 l3,-14 Z" />
      <path d="M-2,9 l0,24 l4,0 l0,-4 l3,0 l0,-4 l-3,0 l0,-16 Z" />
      <path d="M4,7 l7,21 l4,-1 l-1,-4 l3,-1 l-1,-4 l-3,1 l-5,-13 Z" />
      <path d="M8,2 l12,16 l3,-2 l-2,-3 l3,-2 l-2,-3 l-3,2 l-8,-10 Z" />
    </g>
  </g>
);

export const MolhoDeChaves = Chaves;

const Lanterna: React.FC<{acesa: boolean}> = ({acesa}) => (
  <g>
    {acesa && <polygon points="-4,96 4,96 34,250 -34,250" fill={C.luz} opacity={0.4} />}
    <rect x={-7} y={54} width={14} height={34} rx={3} fill="#3a3a3a" {...Tf} />
    <rect x={-10} y={84} width={20} height={10} rx={2} fill="#9aa0a6" {...Tf} />
  </g>
);

const BilheteNaMao: React.FC = () => (
  <g transform="translate(0,62) rotate(-90)">
    <rect x={-6} y={-16} width={34} height={24} fill={C.papel} {...Tf} />
    <line x1={2} y1={-8} x2={22} y2={-8} stroke="#999" strokeWidth={1.5} />
    <line x1={2} y1={-1} x2={18} y2={-1} stroke="#999" strokeWidth={1.5} />
  </g>
);

const AvisoNaMao: React.FC = () => (
  <g transform="translate(0,64) rotate(180)">
    <rect x={-18} y={-26} width={36} height={44} fill={C.papel} {...Tf} />
  </g>
);

const BracoSvg: React.FC<{
  ombro: [number, number];
  b: Braco;
  cor: string;
  objeto: MaoObjeto;
  tremor: number;
  frame: number;
  lanternaAcesa: boolean;
  fase: number;
}> = ({ombro, b, cor, objeto, tremor, frame, lanternaAcesa, fase}) => {
  const t = tremor ? Math.sin(frame * 2.3 + fase) * tremor : 0;
  return (
    <g transform={`translate(${ombro[0]},${ombro[1]}) rotate(${b.ombro})`}>
      <rect x={-12} y={-6} width={24} height={BRACO_SUP + 6} rx={11} fill={cor} {...T} />
      <g transform={`translate(0,${BRACO_SUP}) rotate(${b.cotovelo + t})`}>
        <rect x={-10} y={-8} width={20} height={ANTEBRACO + 4} rx={10} fill={cor} {...T} />
        {objeto === 'lanterna' && <Lanterna acesa={lanternaAcesa} />}
        <circle cx={0} cy={ANTEBRACO + 2} r={11} fill={C.pele} {...T} />
        {objeto === 'chaves' && <Chaves x={0} y={ANTEBRACO + 10} r={-(b.ombro + b.cotovelo + t)} />}
        {objeto === 'bilhete' && <BilheteNaMao />}
        {objeto === 'aviso' && <AvisoNaMao />}
      </g>
    </g>
  );
};

export const Rodnei: React.FC<RodneiProps> = ({
  x,
  y,
  escala = 1,
  frame,
  bracoE = {ombro: 12, cotovelo: -10},
  bracoD = {ombro: -12, cotovelo: 10},
  maoE = 'nada',
  maoD = 'nada',
  cabeca = 0,
  olhar = [0, 0],
  boca = 'o',
  medo = true,
  suor = false,
  chavesNaCintura = true,
  tremor = 0,
  pulo = 0,
  lanternaAcesa = true,
}) => {
  const resp = Math.sin(frame / 12) * 1.2; // respiração
  const px = olhar[0] * 3.5;
  const py = olhar[1] * 4;
  const piscar = frame % 97 > 92;
  return (
    <g transform={`translate(${x},${y - pulo}) scale(${escala})`}>
      {/* sombra no chão */}
      <ellipse cx={0} cy={10 + pulo / escala} rx={78} ry={14} fill="#000" opacity={0.25} />
      {/* pernas */}
      <path d="M-49,-144 L-4,-144 L-8,0 L-38,0 Z" fill={C.macacao} {...T} />
      <path d="M4,-144 L49,-144 L39,0 L8,0 Z" fill={C.macacaoSomb} {...T} />
      <path d="M-44,-4 L-6,-4 L-4,14 L-52,14 Q-52,2 -44,-4 Z" fill={C.sapato} {...T} />
      <path d="M6,-4 L42,-4 Q52,2 52,14 L4,14 Z" fill={C.sapato} {...T} />
      <g transform={`translate(0,${resp})`}>
        {/* tronco */}
        <path d="M-45,-266 Q0,-276 45,-266 L54,-142 L-54,-142 Z" fill={C.macacao} {...T} />
        <path d="M0,-268 L0,-142" stroke={C.macacaoSomb} strokeWidth={3} />
        <path d="M-14,-268 L0,-250 L14,-268" fill={C.peleSomb} {...Tf} />
        <rect x={-36} y={-230} width={26} height={22} fill={C.macacaoSomb} {...Tf} />
        <rect x={6} y={-236} width={38} height={14} rx={2} fill={C.papel} {...Tf} />
        <text x={25} y={-225.5} fontSize={8} fontWeight="bold" textAnchor="middle" fill={C.macacaoSomb} fontFamily="Inter, Arial, sans-serif">
          RODNEI
        </text>
        {/* cinto */}
        <rect x={-54} y={-154} width={108} height={12} fill={C.cinto} {...Tf} />
        <rect x={-6} y={-155} width={14} height={14} fill={C.chave} {...Tf} />
        {chavesNaCintura && <Chaves x={-38} y={-132} />}
        {/* pescoço e cabeça */}
        <rect x={-10} y={-284} width={20} height={18} fill={C.peleSomb} {...Tf} />
        <g transform={`rotate(${cabeca} 0 -284)`}>
          <ellipse cx={-34} cy={-314} rx={7} ry={10} fill={C.pele} {...T} />
          <ellipse cx={34} cy={-314} rx={7} ry={10} fill={C.pele} {...T} />
          <ellipse cx={0} cy={-318} rx={34} ry={40} fill={C.pele} {...T} />
          <path d="M-34,-324 Q-36,-360 0,-362 Q38,-360 35,-324 Q30,-344 0,-346 Q-26,-344 -34,-324 Z" fill={C.cabelo} {...Tf} />
          {medo ? (
            <>
              <path d="M-22,-340 Q-14,-348 -6,-342" fill="none" stroke={C.cabelo} strokeWidth={3.5} strokeLinecap="round" />
              <path d="M6,-342 Q14,-348 22,-340" fill="none" stroke={C.cabelo} strokeWidth={3.5} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-22,-338 Q-14,-341 -6,-338" fill="none" stroke={C.cabelo} strokeWidth={3.5} strokeLinecap="round" />
              <path d="M6,-338 Q14,-341 22,-338" fill="none" stroke={C.cabelo} strokeWidth={3.5} strokeLinecap="round" />
            </>
          )}
          {piscar ? (
            <>
              <path d="M-21,-325 Q-13,-321 -5,-325" fill="none" stroke={C.linha} strokeWidth={2.5} />
              <path d="M5,-325 Q13,-321 21,-325" fill="none" stroke={C.linha} strokeWidth={2.5} />
            </>
          ) : (
            <>
              <ellipse cx={-13} cy={-325} rx={9} ry={11} fill="#fff" {...Tf} />
              <ellipse cx={13} cy={-325} rx={9} ry={11} fill="#fff" {...Tf} />
              <circle cx={-13 + px} cy={-325 + py} r={4} fill="#1a1a1a" />
              <circle cx={13 + px} cy={-325 + py} r={4} fill="#1a1a1a" />
              <circle cx={-11.5 + px} cy={-326.5 + py} r={1.3} fill="#fff" />
              <circle cx={14.5 + px} cy={-326.5 + py} r={1.3} fill="#fff" />
            </>
          )}
          <path d="M0,-320 Q6,-308 -1,-305" fill="none" stroke={C.peleSomb} strokeWidth={3} strokeLinecap="round" />
          <path d="M-16,-298 Q0,-306 16,-298 Q8,-294 0,-297 Q-8,-294 -16,-298 Z" fill={C.cabelo} />
          {boca === 'o' && <ellipse cx={0} cy={-289} rx={5} ry={6} fill="#5a2a22" {...Tf} />}
          {boca === 'fechada' && <path d="M-6,-289 Q0,-291 6,-289" fill="none" stroke="#5a2a22" strokeWidth={3} strokeLinecap="round" />}
          {boca === 'aliviada' && <path d="M-8,-290 Q0,-284 8,-290" fill="none" stroke="#5a2a22" strokeWidth={3} strokeLinecap="round" />}
          {boca === 'lanterna' && (
            <g>
              {lanternaAcesa && <polygon points="40,-293 40,-285 150,-262 150,-316" fill={C.luz} opacity={0.45} />}
              <rect x={-4} y={-295} width={36} height={12} rx={3} fill="#3a3a3a" {...Tf} />
              <rect x={30} y={-298} width={10} height={18} rx={2} fill="#9aa0a6" {...Tf} />
              <ellipse cx={-2} cy={-289} rx={5} ry={7} fill="#5a2a22" {...Tf} />
            </g>
          )}
          {suor && <path d="M37,-340 Q41,-332 37,-328 Q33,-332 37,-340 Z" fill="#bfe3ff" {...Tf} />}
        </g>
        {/* braços (por cima do tronco) */}
        <BracoSvg ombro={[-42, -258]} b={bracoE} cor={C.macacaoSomb} objeto={maoE} tremor={tremor} frame={frame} lanternaAcesa={lanternaAcesa} fase={0} />
        <BracoSvg ombro={[42, -258]} b={bracoD} cor={C.macacao} objeto={maoD} tremor={tremor} frame={frame} lanternaAcesa={lanternaAcesa} fase={1.7} />
      </g>
    </g>
  );
};
