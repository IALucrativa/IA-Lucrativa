import React from 'react';
import {C, T, Tf} from './cores';
import {Braco, MolhoDeChaves} from './Rodnei';

// Marlene, a síndica: boneco articulado. NÃO mudar rosto nem corpo sem pedido.
// Origem (0,0) = entre os pés, no chão. Um pouco mais baixa que o Rodnei.

const M = {
  pele: '#b97a56',
  peleSomb: '#9a6244',
  cabelo: '#8a3b2a',
  cabeloEsc: '#6e2c1f',
  cardiga: '#8a6bb0',
  cardigaSomb: '#71559a',
  blusa: '#f3ece0',
  saia: '#5a5560',
  meia: '#7a5544',
  sapato: '#6e2433',
  batom: '#a83246',
  oculos: '#3a2a2a',
};

export type MaoMarlene = 'nada' | 'prancheta' | 'bilhete' | 'aponta';

const BRACO_SUP = 56;
const ANTEBRACO = 50;

const BracoM: React.FC<{ombro: [number, number]; b: Braco; cor: string; objeto: MaoMarlene}> = ({ombro, b, cor, objeto}) => (
  <g transform={`translate(${ombro[0]},${ombro[1]}) rotate(${b.ombro})`}>
    <rect x={-11} y={-6} width={22} height={BRACO_SUP + 6} rx={10} fill={cor} {...T} />
    <g transform={`translate(0,${BRACO_SUP}) rotate(${b.cotovelo})`}>
      <rect x={-9.5} y={-8} width={19} height={ANTEBRACO + 4} rx={9} fill={cor} {...T} />
      {objeto === 'prancheta' && (
        <g transform={`translate(0,${ANTEBRACO + 2}) rotate(${-(b.ombro + b.cotovelo)}) translate(-30,-4)`}>
          <rect x={-24} y={-34} width={48} height={62} rx={3} fill="#a87d42" {...Tf} />
          <rect x={-19} y={-26} width={38} height={50} fill="#fbf7ea" />
          <rect x={-8} y={-38} width={16} height={8} rx={2} fill="#9aa0a6" {...Tf} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-14} y1={-16 + i * 10} x2={14} y2={-16 + i * 10} stroke="#999" strokeWidth={1.5} />
          ))}
        </g>
      )}
      {objeto === 'bilhete' && (
        <g transform={`translate(0,${ANTEBRACO + 4}) rotate(${-(b.ombro + b.cotovelo)})`}>
          <rect x={-20} y={-30} width={40} height={30} fill={C.papel} {...Tf} />
          <line x1={-13} y1={-20} x2={13} y2={-20} stroke="#999" strokeWidth={1.5} />
          <line x1={-13} y1={-12} x2={8} y2={-12} stroke="#999" strokeWidth={1.5} />
        </g>
      )}
      {objeto === 'aponta' ? (
        <g>
          <circle cx={0} cy={ANTEBRACO + 2} r={10} fill={M.pele} {...T} />
          <rect x={-3.5} y={ANTEBRACO + 6} width={7} height={18} rx={3.5} fill={M.pele} {...Tf} />
        </g>
      ) : (
        <circle cx={0} cy={ANTEBRACO + 2} r={10} fill={M.pele} {...T} />
      )}
    </g>
  </g>
);

export const Marlene: React.FC<{
  x: number;
  y: number;
  escala?: number;
  frame: number;
  bracoE?: Braco;
  bracoD?: Braco;
  maoE?: MaoMarlene;
  maoD?: MaoMarlene;
  olhar?: [number, number];
  cara?: 'desconfiada' | 'seria' | 'sorriso' | 'surpresa';
  cabeca?: number;
}> = ({
  x,
  y,
  escala = 1,
  frame,
  bracoE = {ombro: 10, cotovelo: -8},
  bracoD = {ombro: -10, cotovelo: 8},
  maoE = 'nada',
  maoD = 'nada',
  olhar = [0, 0],
  cara = 'seria',
  cabeca = 0,
}) => {
  const resp = Math.sin(frame / 13 + 1) * 1;
  const px = olhar[0] * 3;
  const py = olhar[1] * 3.5;
  const piscar = (frame + 40) % 101 > 96;
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <ellipse cx={0} cy={10} rx={64} ry={12} fill="#000" opacity={0.25} />
      {/* pernas com meia-calça e sapatos */}
      <rect x={-30} y={-112} width={22} height={112} rx={8} fill={M.meia} {...T} />
      <rect x={8} y={-112} width={22} height={112} rx={8} fill={M.meia} {...T} />
      <path d="M-34,-4 L-6,-4 L-4,10 L-40,10 Q-40,0 -34,-4 Z" fill={M.sapato} {...T} />
      <path d="M6,-4 L34,-4 Q40,0 40,10 L4,10 Z" fill={M.sapato} {...T} />
      <g transform={`translate(0,${resp})`}>
        {/* saia */}
        <path d="M-40,-178 L40,-178 L54,-100 L-54,-100 Z" fill={M.saia} {...T} />
        {/* blusa e cardigã */}
        <path d="M-38,-246 Q0,-256 38,-246 L44,-174 L-44,-174 Z" fill={M.blusa} {...T} />
        <path d="M-38,-246 Q-20,-250 -10,-250 L-6,-174 L-44,-174 Z" fill={M.cardiga} {...T} />
        <path d="M38,-246 Q20,-250 10,-250 L6,-174 L44,-174 Z" fill={M.cardiga} {...T} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-9} cy={-232 + i * 20} r={2.5} fill={M.cardigaSomb} />
        ))}
        {/* chaveiro grande da síndica, preso no bolso do cardigã */}
        <rect x={20} y={-200} width={20} height={18} fill={M.cardigaSomb} {...Tf} />
        <MolhoDeChaves x={30} y={-178} />
        {/* pescoço, cordinha dos óculos */}
        <rect x={-8} y={-262} width={16} height={16} fill={M.peleSomb} {...Tf} />
        <path d="M-22,-282 Q-24,-240 0,-236 Q24,-240 22,-282" fill="none" stroke="#c9a24a" strokeWidth={1.5} />
        {/* cabeça */}
        <g transform={`rotate(${cabeca} 0 -262)`}>
          {/* cabelo cacheado atrás */}
          {[[-30, -300], [-34, -280], [30, -300], [34, -280], [-20, -322], [0, -330], [20, -322]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={14} fill={M.cabelo} {...Tf} />
          ))}
          <ellipse cx={0} cy={-290} rx={30} ry={35} fill={M.pele} {...T} />
          {/* franja de cachos */}
          {[[-18, -318], [-4, -322], [10, -320], [22, -312]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={10} fill={M.cabeloEsc} />
          ))}
          {/* brincos de pérola */}
          <circle cx={-30} cy={-280} r={3.5} fill="#f6f2e8" {...Tf} />
          <circle cx={30} cy={-280} r={3.5} fill="#f6f2e8" {...Tf} />
          {/* sobrancelhas */}
          {cara === 'desconfiada' ? (
            <>
              <path d="M-20,-304 Q-12,-310 -4,-305" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
              <path d="M4,-302 Q12,-301 20,-302" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
            </>
          ) : cara === 'surpresa' ? (
            <>
              <path d="M-20,-306 Q-12,-313 -4,-307" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
              <path d="M4,-307 Q12,-313 20,-306" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-20,-303 Q-12,-307 -4,-304" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
              <path d="M4,-304 Q12,-307 20,-303" fill="none" stroke={M.cabeloEsc} strokeWidth={3} strokeLinecap="round" />
            </>
          )}
          {/* olhos (meio fechados quando desconfiada) */}
          {piscar ? (
            <>
              <path d="M-18,-292 Q-11,-289 -4,-292" fill="none" stroke={C.linha} strokeWidth={2.5} />
              <path d="M4,-292 Q11,-289 18,-292" fill="none" stroke={C.linha} strokeWidth={2.5} />
            </>
          ) : (
            <>
              <ellipse cx={-11} cy={-292} rx={7} ry={cara === 'desconfiada' ? 5 : 8} fill="#fff" {...Tf} />
              <ellipse cx={11} cy={-292} rx={7} ry={cara === 'desconfiada' ? 5 : 8} fill="#fff" {...Tf} />
              <circle cx={-11 + px} cy={-292 + py * 0.6} r={3.2} fill="#1a1a1a" />
              <circle cx={11 + px} cy={-292 + py * 0.6} r={3.2} fill="#1a1a1a" />
            </>
          )}
          {/* óculos retangulares na ponta do nariz */}
          <rect x={-21} y={-286} width={17} height={11} rx={2} fill="none" stroke={M.oculos} strokeWidth={2} />
          <rect x={4} y={-286} width={17} height={11} rx={2} fill="none" stroke={M.oculos} strokeWidth={2} />
          <line x1={-4} y1={-281} x2={4} y2={-281} stroke={M.oculos} strokeWidth={2} />
          <path d="M0,-284 Q4,-276 -1,-273" fill="none" stroke={M.peleSomb} strokeWidth={2.5} strokeLinecap="round" />
          {/* boca com batom */}
          {cara === 'sorriso' && <path d="M-9,-266 Q0,-259 9,-266" fill="none" stroke={M.batom} strokeWidth={3.5} strokeLinecap="round" />}
          {cara === 'seria' && <path d="M-7,-264 L7,-264" stroke={M.batom} strokeWidth={3.5} strokeLinecap="round" />}
          {cara === 'desconfiada' && <path d="M-7,-263 Q2,-266 8,-268" fill="none" stroke={M.batom} strokeWidth={3.5} strokeLinecap="round" />}
          {cara === 'surpresa' && <ellipse cx={0} cy={-265} rx={4} ry={5} fill={M.batom} {...Tf} />}
        </g>
        {/* braços */}
        <BracoM ombro={[-36, -238]} b={bracoE} cor={M.cardigaSomb} objeto={maoE} />
        <BracoM ombro={[36, -238]} b={bracoD} cor={M.cardiga} objeto={maoD} />
      </g>
    </g>
  );
};
