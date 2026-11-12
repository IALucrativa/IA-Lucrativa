import React from 'react';
import {C, T, Tf} from './cores';
import {Braco} from './Rodnei';

// Tânia, do 501: enfermeira que trabalha à noite. Boneco articulado.
// NÃO mudar rosto nem corpo sem pedido. Origem (0,0) = entre os pés, no chão.

const P = {
  pele: '#7a4a32',
  peleSomb: '#5f3826',
  cabelo: '#1d1412',
  cabeloBrilho: '#3a2a24',
  plantao: '#3fa79a',
  plantaoSomb: '#2f8a7e',
  casa: '#7a2e3e',
  casaSomb: '#62232f',
  calcaCasa: '#3a3f4a',
  tenis: '#f2f2f2',
  labio: '#5a2a24',
};

export type MaoTania = 'nada' | 'bilhete' | 'maoNoPeito';

const BRACO_SUP = 58;
const ANTEBRACO = 52;

const BracoT: React.FC<{ombro: [number, number]; b: Braco; cor: string; objeto: MaoTania}> = ({ombro, b, cor, objeto}) => (
  <g transform={`translate(${ombro[0]},${ombro[1]}) rotate(${b.ombro})`}>
    <rect x={-11} y={-6} width={22} height={BRACO_SUP + 6} rx={10} fill={cor} {...T} />
    <g transform={`translate(0,${BRACO_SUP}) rotate(${b.cotovelo})`}>
      <rect x={-9.5} y={-8} width={19} height={ANTEBRACO + 4} rx={9} fill={cor} {...T} />
      {objeto === 'bilhete' && (
        <g transform={`translate(0,${ANTEBRACO + 4}) rotate(${-(b.ombro + b.cotovelo)})`}>
          <rect x={-20} y={-32} width={40} height={30} fill={C.papel} {...Tf} />
          <line x1={-13} y1={-22} x2={13} y2={-22} stroke="#999" strokeWidth={1.5} />
          <line x1={-13} y1={-14} x2={8} y2={-14} stroke="#999" strokeWidth={1.5} />
        </g>
      )}
      <circle cx={0} cy={ANTEBRACO + 2} r={10} fill={P.pele} {...T} />
    </g>
  </g>
);

export const Tania: React.FC<{
  x: number;
  y: number;
  escala?: number;
  frame: number;
  roupa?: 'plantao' | 'casa';
  bracoE?: Braco;
  bracoD?: Braco;
  maoE?: MaoTania;
  maoD?: MaoTania;
  olhar?: [number, number];
  cara?: 'seria' | 'assustada' | 'fala' | 'sorriso';
  cabeca?: number;
}> = ({
  x,
  y,
  escala = 1,
  frame,
  roupa = 'plantao',
  bracoE = {ombro: 10, cotovelo: -8},
  bracoD = {ombro: -10, cotovelo: 8},
  maoE = 'nada',
  maoD = 'nada',
  olhar = [0, 0],
  cara = 'seria',
  cabeca = 0,
}) => {
  const resp = Math.sin(frame / 12 + 2) * 1;
  const px = olhar[0] * 3;
  const py = olhar[1] * 3.5;
  const piscar = (frame + 20) % 89 > 85;
  const falando = cara === 'fala' && Math.floor(frame / 4) % 2 === 0;
  const top = roupa === 'plantao' ? P.plantao : P.casa;
  const topS = roupa === 'plantao' ? P.plantaoSomb : P.casaSomb;
  const calca = roupa === 'plantao' ? P.plantao : P.calcaCasa;
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <ellipse cx={0} cy={10} rx={62} ry={12} fill="#000" opacity={0.25} />
      {/* calça e tênis */}
      <path d="M-40,-150 L-3,-150 L-7,0 L-33,0 Z" fill={calca} {...T} />
      <path d="M3,-150 L40,-150 L33,0 L7,0 Z" fill={calca} {...T} />
      <path d="M-38,-4 L-5,-4 L-3,12 L-46,12 Q-46,0 -38,-4 Z" fill={P.tenis} {...T} />
      <path d="M5,-4 L38,-4 Q46,0 46,12 L3,12 Z" fill={P.tenis} {...T} />
      <g transform={`translate(0,${resp})`}>
        {/* rabo de cavalo de tranças, atrás do corpo */}
        <g transform={`rotate(${Math.sin(frame / 15) * 2} 8 -334)`}>
          {[-8, 0, 8].map((dx, i) => (
            <path key={i} d={`M${dx + 8},-334 Q${dx + 70},-300 ${dx + 58},-200`} fill="none" stroke={P.cabelo} strokeWidth={9} strokeLinecap="round" />
          ))}
        </g>
        {/* blusa (pijama cirúrgico ou moletom) */}
        <path d="M-40,-252 Q0,-262 40,-252 L44,-146 L-44,-146 Z" fill={top} {...T} />
        {roupa === 'plantao' ? (
          <>
            <path d="M-12,-254 L0,-236 L12,-254" fill={P.pele} {...Tf} />
            <rect x={14} y={-222} width={20} height={18} fill={topS} {...Tf} />
            {/* crachá no cordão */}
            <path d="M-14,-252 Q-6,-220 -4,-206 M14,-252 Q4,-220 -4,-206" stroke="#2f6db5" strokeWidth={2} fill="none" />
            <rect x={-14} y={-206} width={20} height={26} rx={2} fill="#fff" {...Tf} />
            <rect x={-11} y={-202} width={14} height={8} fill="#9fd8ff" />
            <line x1={-11} y1={-188} x2={3} y2={-188} stroke="#999" strokeWidth={1.5} />
          </>
        ) : (
          <>
            <path d="M-16,-254 Q0,-240 16,-254" fill="none" stroke={topS} strokeWidth={4} />
            <rect x={-26} y={-190} width={52} height={22} rx={6} fill={topS} {...Tf} />
          </>
        )}
        {/* pescoço e cabeça */}
        <rect x={-8} y={-268} width={16} height={18} fill={P.peleSomb} {...Tf} />
        <g transform={`rotate(${cabeca} 0 -268)`}>
          <ellipse cx={0} cy={-300} rx={30} ry={36} fill={P.pele} {...T} />
          {/* cabelo puxado para trás, com linhas de tranças */}
          <path d="M-31,-306 Q-30,-342 0,-344 Q30,-342 31,-306 Q22,-326 0,-328 Q-22,-326 -31,-306 Z" fill={P.cabelo} {...Tf} />
          {[-16, -6, 4, 14].map((dx) => (
            <path key={dx} d={`M${dx},-342 Q${dx + 2},-334 ${dx + 1},-326`} stroke={P.cabeloBrilho} strokeWidth={2} fill="none" />
          ))}
          <circle cx={0} cy={-344} r={9} fill={P.cabelo} {...Tf} />
          {/* argolas pequenas */}
          <circle cx={-30} cy={-290} r={4} fill="none" stroke="#d8c37a" strokeWidth={2} />
          <circle cx={30} cy={-290} r={4} fill="none" stroke="#d8c37a" strokeWidth={2} />
          {/* sobrancelhas */}
          {cara === 'assustada' ? (
            <>
              <path d="M-20,-318 Q-12,-325 -4,-319" fill="none" stroke={P.cabelo} strokeWidth={3.2} strokeLinecap="round" />
              <path d="M4,-319 Q12,-325 20,-318" fill="none" stroke={P.cabelo} strokeWidth={3.2} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-20,-315 Q-12,-318 -4,-315" fill="none" stroke={P.cabelo} strokeWidth={3.2} strokeLinecap="round" />
              <path d="M4,-315 Q12,-318 20,-315" fill="none" stroke={P.cabelo} strokeWidth={3.2} strokeLinecap="round" />
            </>
          )}
          {/* olhos */}
          {piscar ? (
            <>
              <path d="M-18,-303 Q-11,-300 -4,-303" fill="none" stroke={C.linha} strokeWidth={2.5} />
              <path d="M4,-303 Q11,-300 18,-303" fill="none" stroke={C.linha} strokeWidth={2.5} />
            </>
          ) : (
            <>
              <ellipse cx={-11} cy={-303} rx={7} ry={cara === 'assustada' ? 9 : 8} fill="#fff" {...Tf} />
              <ellipse cx={11} cy={-303} rx={7} ry={cara === 'assustada' ? 9 : 8} fill="#fff" {...Tf} />
              <circle cx={-11 + px} cy={-303 + py * 0.6} r={3.4} fill="#1a1a1a" />
              <circle cx={11 + px} cy={-303 + py * 0.6} r={3.4} fill="#1a1a1a" />
              <circle cx={-10 + px} cy={-304.5 + py * 0.6} r={1.1} fill="#fff" />
              <circle cx={12 + px} cy={-304.5 + py * 0.6} r={1.1} fill="#fff" />
            </>
          )}
          <path d="M0,-298 Q5,-290 -1,-287" fill="none" stroke={P.peleSomb} strokeWidth={2.5} strokeLinecap="round" />
          {/* boca */}
          {cara === 'sorriso' && <path d="M-9,-278 Q0,-271 9,-278" fill="none" stroke={P.labio} strokeWidth={3.5} strokeLinecap="round" />}
          {cara === 'seria' && <path d="M-7,-276 L7,-276" stroke={P.labio} strokeWidth={3.5} strokeLinecap="round" />}
          {cara === 'assustada' && <ellipse cx={0} cy={-276} rx={4.5} ry={6} fill={P.labio} {...Tf} />}
          {cara === 'fala' && (falando ? <ellipse cx={0} cy={-276} rx={6} ry={4.5} fill={P.labio} {...Tf} /> : <path d="M-7,-276 L7,-276" stroke={P.labio} strokeWidth={3.5} strokeLinecap="round" />)}
        </g>
        {/* braços */}
        <BracoT ombro={[-38, -244]} b={bracoE} cor={topS} objeto={maoE} />
        <BracoT ombro={[38, -244]} b={bracoD} cor={top} objeto={maoD} />
      </g>
    </g>
  );
};
