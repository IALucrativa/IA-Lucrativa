import React from 'react';
import {C, F, T, Tf} from './cores';

// Boneco articulado da série. O Kaique é o visual padrão.
// NÃO mudar o rosto nem o corpo do Kaique sem pedido.
// Origem (0,0) = entre os pés, no chão. Mesmas medidas da prancha 1.

export type Braco = {ombro: number; cotovelo: number};
export type MaoObjeto = 'nada' | 'bone' | 'celular' | 'videogame';

export type Visual = {
  pele: string;
  peleSomb: string;
  cabelo: string;
  cabeloTipo: 'crespo' | 'topete';
  roupa: string;
  roupaSomb: string;
  faixa: boolean; // faixa refletiva da jaqueta
  gola: boolean;
  nome?: string; // etiqueta no peito
  calca: string;
  calcaSomb: string;
  tenis: string;
  oculosEscuros: boolean;
  chaveiro: boolean;
};

export const KAIQUE: Visual = {
  pele: C.pele,
  peleSomb: C.peleSomb,
  cabelo: C.cabelo,
  cabeloTipo: 'crespo',
  roupa: C.jaqueta,
  roupaSomb: C.jaquetaSomb,
  faixa: true,
  gola: true,
  nome: 'KAIQUE',
  calca: C.calca,
  calcaSomb: C.calcaSomb,
  tenis: C.tenis,
  oculosEscuros: false,
  chaveiro: true,
};

// Kaique em 2018 (flashback): camiseta, sem a jaqueta de entregador.
export const KAIQUE_2018: Visual = {
  ...KAIQUE,
  roupa: '#e2712c',
  roupaSomb: '#c25c1e',
  faixa: false,
  gola: false,
  nome: undefined,
  chaveiro: false,
};

// Wesley, o primo: camisa social roxa, topete e óculos escuros (até dentro de casa).
export const WESLEY: Visual = {
  pele: '#c98a5e',
  peleSomb: '#ab6f45',
  cabelo: '#2b1c14',
  cabeloTipo: 'topete',
  roupa: '#7b4bd1',
  roupaSomb: '#6239ad',
  faixa: false,
  gola: true,
  nome: undefined,
  calca: '#d9d4c7',
  calcaSomb: '#bdb7a8',
  tenis: '#1f1f24',
  oculosEscuros: true,
  chaveiro: false,
};

export const WESLEY_2018: Visual = {...WESLEY, roupa: '#2f8fd6', roupaSomb: '#2273b0', gola: false, oculosEscuros: false};

export type BonecoProps = {
  x: number;
  y: number;
  escala?: number;
  frame: number;
  visual?: Visual;
  bracoE?: Braco; // esquerda de quem olha
  bracoD?: Braco; // direita de quem olha
  maoE?: MaoObjeto;
  maoD?: MaoObjeto;
  cabeca?: number; // inclinação em graus
  olhar?: [number, number]; // -1..1
  boca?: 'o' | 'fechada' | 'sorriso' | 'assopro' | 'preocupada' | 'convencido';
  susto?: boolean; // sobrancelhas erguidas
  suor?: boolean;
  fuligem?: boolean; // rosto sujo de fumaça
  olhosFechados?: boolean;
  bonéNaCabeca?: boolean; // boné virado pra trás
  capacete?: boolean;
  semPernas?: boolean; // quando algo cobre as pernas (moto, balcão)
  pulo?: number;
};

const BRACO_SUP = 56;
const ANTEBRACO = 50;

const BoneNaMao: React.FC = () => (
  <g transform={`translate(0,${ANTEBRACO + 6}) rotate(180)`}>
    <path d="M-26,8 Q-24,-20 2,-22 Q28,-20 30,8 Z" fill={C.bone} {...T} />
    <path d="M-26,8 L-52,14 Q-40,22 -20,16 Z" fill={C.boneDet} {...T} />
    <circle cx={2} cy={-22} r={3} fill={C.boneDet} />
  </g>
);

const CelularNaMao: React.FC = () => (
  <g transform={`translate(0,${ANTEBRACO - 4})`}>
    <rect x={-10} y={-4} width={20} height={34} rx={4} fill="#22222a" {...Tf} />
    <rect x={-7} y={0} width={14} height={24} rx={2} fill="#6fb6ff" />
  </g>
);

// Posição da mão, para desenhar o objeto por cima dos dois braços.
const rad = (g: number) => (g * Math.PI) / 180;
const posMao = (o: [number, number], b: Braco): [number, number] => {
  const ex = o[0] - BRACO_SUP * Math.sin(rad(b.ombro));
  const ey = o[1] + BRACO_SUP * Math.cos(rad(b.ombro));
  const t = b.ombro + b.cotovelo;
  return [ex - (ANTEBRACO + 2) * Math.sin(rad(t)), ey + (ANTEBRACO + 2) * Math.cos(rad(t))];
};

const VideogameNaMao: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x + 4},${y - 6})`}>
    <rect x={-36} y={-12} width={72} height={26} rx={7} fill={C.console} {...T} />
    <rect x={-28} y={-2} width={30} height={5} rx={2} fill={C.consoleDet} />
    <circle cx={26} cy={1} r={3.5} fill={C.vermelho} />
  </g>
);

const BracoSvg: React.FC<{
  ombro: [number, number];
  b: Braco;
  cor: string;
  pele: string;
  objeto: MaoObjeto;
}> = ({ombro, b, cor, pele, objeto}) => (
  <g transform={`translate(${ombro[0]},${ombro[1]}) rotate(${b.ombro})`}>
    <rect x={-11} y={-6} width={22} height={BRACO_SUP + 6} rx={10} fill={cor} {...T} />
    <g transform={`translate(0,${BRACO_SUP}) rotate(${b.cotovelo})`}>
      <rect x={-10} y={-8} width={20} height={ANTEBRACO + 4} rx={9} fill={cor} {...T} />
      <circle cx={0} cy={ANTEBRACO + 2} r={12} fill={pele} {...T} />
      {objeto === 'bone' && <BoneNaMao />}
      {objeto === 'celular' && <CelularNaMao />}
    </g>
  </g>
);

export const Boneco: React.FC<BonecoProps> = ({
  x,
  y,
  escala = 1,
  frame,
  visual: v = KAIQUE,
  bracoE = {ombro: 10, cotovelo: -8},
  bracoD = {ombro: -10, cotovelo: 8},
  maoE = 'nada',
  maoD = 'nada',
  cabeca = 0,
  olhar = [0, 0],
  boca = 'fechada',
  susto = false,
  suor = false,
  fuligem = false,
  olhosFechados = false,
  bonéNaCabeca = false,
  capacete = false,
  semPernas = false,
  pulo = 0,
}) => {
  const resp = Math.sin(frame / 12) * 1.2;
  const px = olhar[0] * 4;
  const py = olhar[1] * 4;
  const piscar = !olhosFechados && frame % 101 > 96;
  const fechados = olhosFechados || piscar;
  return (
    <g transform={`translate(${x},${y - pulo}) scale(${escala})`}>
      {!semPernas && (
        <>
          <ellipse cx={0} cy={8 + pulo / escala} rx={70} ry={12} fill="#000" opacity={0.22} />
          {/* pernas */}
          <path d="M-30,-130 L-32,-8 L-6,-8 L-2,-110 Z" fill={v.calca} {...T} />
          <path d="M4,-110 L8,-8 L34,-8 L32,-130 Z" fill={v.calcaSomb} {...T} />
          {/* tênis (cadarço de cor diferente em cada pé) */}
          <path d="M-40,-12 Q-40,-24 -24,-24 L-4,-22 L-2,0 L-46,0 Q-48,-8 -40,-12 Z" fill={v.tenis} {...T} />
          <path d="M6,-22 L26,-24 Q42,-24 44,-12 Q50,-8 48,0 L4,0 Z" fill={v.tenis} {...T} />
          <rect x={-48} y={-2} width={48} height={6} rx={2} fill={C.solado} />
          <rect x={2} y={-2} width={48} height={6} rx={2} fill={C.solado} />
          {v === KAIQUE && (
            <>
              <path d="M-30,-18 l8,6 M-24,-20 l8,6" stroke="#ff8a00" strokeWidth={3} />
              <path d="M18,-20 l8,6 M24,-20 l8,6" stroke="#2f7dff" strokeWidth={3} />
            </>
          )}
        </>
      )}
      <g transform={`translate(0,${resp})`}>
        {/* chaveiro de controle (azul, nada que pareça outra coisa) */}
        {v.chaveiro && !semPernas && (
          <>
            <line x1={28} y1={-116} x2={34} y2={-92} stroke={C.consoleDet} strokeWidth={2} />
            <path d="M24,-92 Q34,-96 44,-92 Q48,-82 42,-81 Q34,-85 26,-81 Q20,-82 24,-92 Z" fill={C.controleChaveiro} {...Tf} />
            <circle cx={39} cy={-90} r={1.6} fill="#ffd23f" />
            <circle cx={29} cy={-89} r={1.6} fill="#fff" />
          </>
        )}
        {/* tronco */}
        <path d="M-46,-236 Q0,-252 42,-236 L36,-114 L-38,-114 Z" fill={v.roupa} {...T} />
        {v.gola && <path d="M-22,-238 L0,-210 L22,-238" fill={v.roupaSomb} {...Tf} />}
        {v.faixa && (
          <>
            <path d="M0,-232 L0,-114" stroke={v.roupaSomb} strokeWidth={4} />
            <rect x={-40} y={-178} width={78} height={10} fill={C.faixa} opacity={0.9} />
            <rect x={-38} y={-130} width={74} height={16} fill={v.roupaSomb} {...Tf} />
          </>
        )}
        {!v.faixa && <path d="M-36,-122 L34,-122" stroke={v.roupaSomb} strokeWidth={6} />}
        {v.nome && (
          <>
            <rect x={10} y={-202} width={22} height={12} rx={2} fill={C.papel} {...Tf} />
            <text x={21} y={-193} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={6.5} fill={C.tinta}>
              {v.nome}
            </text>
          </>
        )}
        {/* pescoço e cabeça */}
        <rect x={-11} y={-264} width={22} height={24} fill={v.peleSomb} {...Tf} />
        <g transform={`rotate(${cabeca} 0 -262)`}>
          <circle cx={-34} cy={-294} r={9} fill={v.pele} {...Tf} />
          <circle cx={32} cy={-294} r={9} fill={v.pele} {...Tf} />
          {capacete ? (
            <>
              <ellipse cx={-1} cy={-296} rx={34} ry={38} fill={v.pele} {...T} />
              <path d="M-42,-290 Q-44,-352 -1,-354 Q42,-352 40,-290 L30,-290 Q28,-330 -1,-332 Q-30,-330 -32,-290 Z" fill={C.tenis} {...T} />
              <path d="M-40,-318 L38,-318" stroke={C.vermelho} strokeWidth={6} />
            </>
          ) : (
            <>
              <ellipse cx={-1} cy={-296} rx={34} ry={38} fill={v.pele} {...T} />
              {v.cabeloTipo === 'crespo' ? (
                <g fill={v.cabelo}>
                  <circle cx={-28} cy={-318} r={11} />
                  <circle cx={-16} cy={-330} r={12} />
                  <circle cx={-1} cy={-334} r={13} />
                  <circle cx={14} cy={-330} r={12} />
                  <circle cx={26} cy={-318} r={11} />
                  <circle cx={-8} cy={-322} r={10} />
                  <circle cx={8} cy={-322} r={10} />
                </g>
              ) : (
                <path d="M-32,-306 Q-36,-346 -4,-350 Q20,-366 40,-342 Q34,-336 36,-310 Q26,-326 0,-326 Q-22,-326 -32,-306 Z" fill={v.cabelo} {...Tf} />
              )}
              {bonéNaCabeca && (
                <g>
                  <path d="M-34,-318 Q-32,-350 -1,-352 Q30,-350 32,-318 Z" fill={C.bone} {...T} />
                  <path d="M20,-322 L50,-314 Q44,-306 26,-312 Z" fill={C.boneDet} {...T} />
                </g>
              )}
            </>
          )}
          {/* sobrancelhas */}
          {susto ? (
            <>
              <path d="M-26,-316 Q-18,-324 -10,-318" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
              <path d="M4,-318 Q12,-324 20,-316" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
            </>
          ) : boca === 'convencido' ? (
            <>
              <path d="M-26,-312 Q-18,-318 -10,-314" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
              <path d="M4,-316 Q12,-316 20,-310" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-26,-313 Q-18,-317 -10,-314" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
              <path d="M4,-314 Q12,-317 20,-313" fill="none" stroke={v.cabelo} strokeWidth={4} strokeLinecap="round" />
            </>
          )}
          {/* olhos */}
          {v.oculosEscuros ? (
            <g>
              <path d="M-30,-306 L28,-306 L26,-292 Q14,-286 4,-294 L-4,-294 Q-14,-286 -28,-292 Z" fill="#141418" {...Tf} />
              <path d="M-24,-302 L-14,-302" stroke="#fff" strokeWidth={2} opacity={0.6} />
            </g>
          ) : fechados ? (
            <>
              <path d="M-24,-300 Q-16,-296 -8,-300" fill="none" stroke={C.linha} strokeWidth={3} />
              <path d="M4,-300 Q12,-296 20,-300" fill="none" stroke={C.linha} strokeWidth={3} />
            </>
          ) : (
            <>
              <ellipse cx={-16} cy={-300} rx={10} ry={12} fill="#fff" {...Tf} />
              <ellipse cx={11} cy={-300} rx={10} ry={12} fill="#fff" {...Tf} />
              <circle cx={-16 + px} cy={-299 + py} r={4.5} fill="#111" />
              <circle cx={11 + px} cy={-299 + py} r={4.5} fill="#111" />
              <circle cx={-17 + px} cy={-301 + py} r={1.5} fill="#fff" />
              <circle cx={10 + px} cy={-301 + py} r={1.5} fill="#fff" />
            </>
          )}
          {/* nariz */}
          <path d="M-3,-292 Q-7,-282 0,-282" fill="none" stroke={v.peleSomb} strokeWidth={3} strokeLinecap="round" />
          {/* boca */}
          {boca === 'o' && <ellipse cx={-3} cy={-272} rx={8} ry={9} fill="#5a1f1f" {...Tf} />}
          {boca === 'fechada' && <path d="M-10,-272 Q-3,-270 4,-272" fill="none" stroke="#5a1f1f" strokeWidth={3} strokeLinecap="round" />}
          {boca === 'sorriso' && <path d="M-13,-275 Q-3,-262 8,-275 Z" fill="#5a1f1f" {...Tf} />}
          {boca === 'preocupada' && <path d="M-12,-268 Q-3,-276 6,-268" fill="none" stroke="#5a1f1f" strokeWidth={3} strokeLinecap="round" />}
          {boca === 'convencido' && <path d="M-12,-274 Q0,-266 10,-278" fill="none" stroke="#5a1f1f" strokeWidth={3} strokeLinecap="round" />}
          {boca === 'assopro' && (
            <>
              <ellipse cx={-3} cy={-272} rx={4} ry={4} fill="#5a1f1f" {...Tf} />
              <circle cx={-24} cy={-288} r={6} fill={v.pele} opacity={0.7} />
              <circle cx={18} cy={-288} r={6} fill={v.pele} opacity={0.7} />
            </>
          )}
          {fuligem && (
            <g fill="#3a3a44" opacity={0.55}>
              <ellipse cx={-18} cy={-286} rx={9} ry={5} />
              <ellipse cx={12} cy={-312} rx={7} ry={4} />
              <ellipse cx={14} cy={-282} rx={6} ry={4} />
            </g>
          )}
          {suor && <path d="M36,-318 Q32,-308 36,-304 Q42,-308 36,-318 Z" fill="#9fd8ff" {...Tf} />}
        </g>
        {/* braços (por cima do tronco) */}
        <BracoSvg ombro={[-38, -228]} b={bracoE} cor={v.roupa} pele={v.pele} objeto={maoE} />
        <BracoSvg ombro={[36, -228]} b={bracoD} cor={v.roupa} pele={v.pele} objeto={maoD} />
        {maoE === 'videogame' && <VideogameNaMao x={posMao([-38, -228], bracoE)[0]} y={posMao([-38, -228], bracoE)[1]} />}
        {maoD === 'videogame' && <VideogameNaMao x={posMao([36, -228], bracoD)[0] - 44} y={posMao([36, -228], bracoD)[1]} />}
      </g>
    </g>
  );
};

// Atalho: o Kaique com o visual padrão.
export const Kaique: React.FC<Omit<BonecoProps, 'visual'>> = (p) => <Boneco {...p} visual={KAIQUE} />;
