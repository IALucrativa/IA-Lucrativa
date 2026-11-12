import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './cores';

// HUD da série: desenho próprio (nada que imite a tela do jogo).

// Contador: sempre no mesmo canto e no mesmo estilo (marca da série).
export const Contador: React.FC<{texto: string; sub?: string}> = ({texto, sub = 'PRO GTA 6'}) => {
  const f = useCurrentFrame();
  const pulso = 1 + Math.sin(f / 9) * 0.012;
  return (
    <g fontFamily={F} fontWeight="bold" transform={`translate(158,72) scale(${pulso}) rotate(-2) translate(-158,-72)`}>
      <rect x={20} y={24} width={276} height={96} rx={12} fill={C.acento} stroke="#111" strokeWidth={3} />
      <text x={158} y={70} textAnchor="middle" fontSize={36} textLength={244} lengthAdjust="spacingAndGlyphs" fill={C.hud}>
        {texto}
      </text>
      <text x={158} y={104} textAnchor="middle" fontSize={22} fill={C.hud}>
        {sub}
      </text>
    </g>
  );
};

const Moeda: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    <circle cx={x} cy={y} r={12} fill="#ffc400" stroke="#8a6a00" strokeWidth={2} />
    <text x={x} y={y + 6} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={15} fill="#6a4f00">
      $
    </text>
  </g>
);

const IconeControle: React.FC<{x: number; y: number; cor: string}> = ({x, y, cor}) => (
  <path transform={`translate(${x},${y})`} d="M-12,-6 Q0,-12 12,-6 Q18,10 10,10 Q2,4 -10,10 Q-18,10 -12,-6 Z" fill={cor} />
);

export const Pilulas: React.FC<{dinheiro: number; videogame: 'QUEIMADO' | 'NO CONSERTO' | 'FUNCIONANDO'}> = ({dinheiro, videogame}) => (
  <g fontFamily={F} fontWeight="bold">
    <rect x={318} y={26} width={200} height={42} rx={21} fill={C.hud} />
    <Moeda x={344} y={47} />
    <text x={364} y={55} fontSize={24} fill="#fff">
      R$ {dinheiro}
    </text>
    <rect x={318} y={76} width={200} height={42} rx={21} fill={C.hud} />
    <IconeControle x={344} y={97} cor="#fff" />
    <text x={366} y={105} fontSize={videogame === 'NO CONSERTO' ? 18 : 22} fill={videogame === 'FUNCIONANDO' ? C.verde : C.vermelho}>
      {videogame}
    </text>
  </g>
);

export const Cadeado: React.FC<{x: number; y: number; s?: number; cor?: string}> = ({x, y, s = 1, cor = '#fff'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-7} y={-2} width={14} height={12} rx={2} fill={cor} />
    <path d="M-4,-1 L-4,-7 Q0,-13 4,-7 L4,-1" fill="none" stroke={cor} strokeWidth={2.5} />
  </g>
);

// Faixa curta da meta (aparece embaixo do placar).
export const MetaFaixa: React.FC<{meta: number; item: string}> = ({meta, item}) => (
  <g fontFamily={F} fontWeight="bold">
    <rect x={20} y={132} width={498} height={40} rx={10} fill={C.hud} opacity={0.92} />
    <text x={34} y={158} fontSize={17} fill={C.acento}>
      META:
    </text>
    <text x={96} y={158} fontSize={17} fill="#fff">
      +{meta} SEGUIDORES
    </text>
    <text x={268} y={158} fontSize={17} fill="#fff">
      →
    </text>
    <Cadeado x={299} y={152} />
    <text x={314} y={158} fontSize={17} fill="#fff">
      {item}
    </text>
  </g>
);

// Os 6 itens da escada de desbloqueios.
const ITENS = ['PEÇA', 'FOLGA', 'WI-FI', 'CONTROLE', 'TV', 'PIZZA'];
export const Desbloqueados: React.FC<{feitos: number; y?: number}> = ({feitos, y = 196}) => (
  <g fontFamily={F} fontWeight="bold">
    <rect x={20} y={y} width={498} height={78} rx={12} fill={C.hud} opacity={0.92} />
    <text x={36} y={y + 24} fontSize={15} fill={C.acento}>
      DESBLOQUEADOS: {feitos} DE 6
    </text>
    {ITENS.map((nome, i) => (
      <g key={nome} transform={`translate(${60 + i * 80},${y + 52})`}>
        <rect x={-34} y={-16} width={68} height={32} rx={8} fill={i < feitos ? C.verde : '#3a3a4a'} />
        {i >= feitos && <Cadeado x={-20} y={0} s={0.8} cor="#bbb" />}
        <text x={i >= feitos ? 6 : 0} y={5} textAnchor="middle" fontSize={nome.length > 6 ? 9.5 : 12} fill="#fff">
          {nome}
        </text>
      </g>
    ))}
  </g>
);

// Cartão grande da meta, com o botão de seguir.
export const MetaCartao: React.FC<{meta: number; item: string; efeito: string; de?: number}> = ({meta, item, efeito, de = 6}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const e = spring({frame: f - de, fps, config: {damping: 12}});
  const pulso = 1 + Math.max(0, Math.sin((f - de - 40) / 5)) * 0.06 * (f > de + 40 ? 1 : 0);
  return (
    <g fontFamily={F} transform={`translate(270,470) scale(${e}) translate(-270,-470)`}>
      <rect x={40} y={300} width={460} height={340} rx={24} fill={C.hud} opacity={0.95} stroke={C.acento} strokeWidth={4} />
      <text x={270} y={346} textAnchor="middle" fontSize={22} fontWeight="900" fill={C.acento}>
        META DOS SEGUIDORES
      </text>
      <text x={270} y={412} textAnchor="middle" fontSize={58} fontWeight="900" fill="#fff">
        +{meta}
      </text>
      <text x={270} y={442} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#cfd3e0">
        seguidores até amanhã, 12h
      </text>
      {/* a peça trancada */}
      <g transform="translate(118,510)">
        <rect x={-34} y={-30} width={68} height={60} rx={10} fill="#3a3a4a" />
        <path d="M-18,-12 L18,-12 L18,12 L-18,12 Z M-10,-12 L-10,-20 M0,-12 L0,-20 M10,-12 L10,-20" fill="#9aa0aa" stroke="#9aa0aa" strokeWidth={3} />
        <Cadeado x={20} y={20} s={1.2} cor={C.acento} />
      </g>
      <text x={168} y={504} fontSize={22} fontWeight="900" fill="#fff">
        {item}
      </text>
      <text x={168} y={532} fontSize={17} fontWeight="bold" fill={C.verde}>
        {efeito}
      </text>
      <g transform={`translate(270,592) scale(${pulso})`}>
        <rect x={-170} y={-28} width={340} height={56} rx={28} fill={C.acento} />
        <text x={0} y={10} textAnchor="middle" fontSize={24} fontWeight="900" fill={C.hud}>
          SEGUE PRA DESBLOQUEAR
        </text>
      </g>
    </g>
  );
};

// A conta do dinheiro, linha por linha.
export const Conta: React.FC<{linhas: {txt: string; cor?: string; em: number}[]; jogoEm: number}> = ({linhas, jogoEm}) => {
  const f = useCurrentFrame();
  const op = (em: number) => interpolate(f, [em, em + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <g fontFamily={F} fontWeight="900">
      <rect x={70} y={280} width={400} height={400} rx={24} fill={C.hud} opacity={0.95} />
      {linhas.map((l, i) => (
        <text key={i} x={410} y={360 + i * 74} textAnchor="end" fontSize={52} fill={l.cor ?? '#fff'} opacity={op(l.em)}>
          {l.txt}
        </text>
      ))}
      <line x1={110} y1={448} x2={430} y2={448} stroke="#fff" strokeWidth={4} opacity={op(linhas[2]?.em ?? 0)} />
      <g opacity={op(jogoEm)}>
        <rect x={100} y={586} width={340} height={66} rx={14} fill="#3a3a4a" />
        <text x={130} y={630} fontSize={28} fill="#fff">
          JOGO: R$ ???
        </text>
        <path d="M370,600 L420,640 M420,600 L370,640" stroke={C.vermelho} strokeWidth={9} strokeLinecap="round" />
      </g>
    </g>
  );
};

// Cartão "KAIQUE · ..." de apresentação.
export const CartaoNome: React.FC<{nome: string; linha2: string; y?: number}> = ({nome, linha2, y = 196}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const c = spring({frame: f - 6, fps, config: {damping: 14}});
  return (
    <g transform={`translate(0,${(1 - c) * -80})`} opacity={c} fontFamily={F}>
      <rect x={90} y={y} width={360} height={86} rx={16} fill={C.hud} opacity={0.92} />
      <text x={270} y={y + 40} fontSize={32} fontWeight="900" textAnchor="middle" fill="#fff">
        {nome}
      </text>
      <text x={270} y={y + 70} fontSize={16} fontWeight="bold" textAnchor="middle" fill={C.acento}>
        {linha2}
      </text>
    </g>
  );
};

// Cartão de voto (duas opções de uma palavra).
export const CartaoVoto: React.FC<{pergunta: string; opcoes: [string, string]; y?: number}> = ({pergunta, opcoes, y = 150}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const e = spring({frame: f - 6, fps, config: {damping: 11}});
  return (
    <g transform={`translate(270,${y + 100}) scale(${e}) translate(-270,${-y - 100})`} fontFamily={F}>
      <rect x={30} y={y} width={480} height={190} rx={22} fill={C.hud} opacity={0.95} />
      <text x={270} y={y + 40} fontSize={21} fontWeight="bold" textAnchor="middle" fill="#fff">
        {pergunta}
      </text>
      <rect x={46} y={y + 62} width={200} height={62} rx={31} fill={C.acento} />
      <text x={146} y={y + 104} fontSize={27} fontWeight="900" textAnchor="middle" fill={C.hud}>
        {opcoes[0]}
      </text>
      <text x={270} y={y + 102} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
        ou
      </text>
      <rect x={294} y={y + 62} width={200} height={62} rx={31} fill="#fff" />
      <text x={394} y={y + 104} fontSize={27} fontWeight="900" textAnchor="middle" fill={C.hud}>
        {opcoes[1]}
      </text>
      <text x={270} y={y + 166} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.acento}>
        Comente aqui embaixo
      </text>
    </g>
  );
};

// Selo de velocidade da moto.
export const Velocimetro: React.FC<{kmh: number}> = ({kmh}) => (
  <g fontFamily={F} fontWeight="900" transform="translate(440,560) rotate(6)">
    <circle cx={0} cy={0} r={52} fill={C.hud} stroke={C.acento} strokeWidth={4} />
    <text x={0} y={8} textAnchor="middle" fontSize={34} fill="#fff">
      {kmh}
    </text>
    <text x={0} y={30} textAnchor="middle" fontSize={14} fill={C.acento}>
      km/h
    </text>
  </g>
);
