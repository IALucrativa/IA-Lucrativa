import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, T, Tf} from '../bilhete/cores';
import {Rodnei} from '../bilhete/Rodnei';

// Foto de capa da página do Facebook: 1640×624 (desenho em 820×312).
// No celular o Facebook corta os lados: tudo o que importa fica no meio (x 140 a 680).
// No computador a foto de perfil cobre o canto de baixo à esquerda: nada importante ali.

const F = 'Inter, Arial, sans-serif';

const Logo: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path
      d="M-300,-230 Q-300,-280 -250,-280 L250,-280 Q300,-280 300,-230 L300,150 Q300,200 250,200 L-40,200 L-170,320 L-140,200 L-250,200 Q-300,200 -300,150 Z"
      fill={C.hud}
      stroke="#fff"
      strokeWidth={34}
      strokeLinejoin="round"
    />
    <path d="M-70,-150 L130,-40 L-70,70 Z" fill={C.acento} stroke={C.acento} strokeWidth={40} strokeLinejoin="round" />
  </g>
);

// Alvo da mira, preso num suporte apoiado no chão.
const Alvo: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    <rect x={x - 4} y={y + 30} width={8} height={262 - y - 30} fill="#5a4a3a" {...Tf} />
    <rect x={x - 22} y={258} width={44} height={6} rx={3} fill="#5a4a3a" {...Tf} />
    {[34, 26, 18, 10].map((r, i) => (
      <circle key={r} cx={x} cy={y} r={r} fill={i % 2 ? '#fff' : '#ff4d5e'} {...Tf} />
    ))}
    <circle cx={x} cy={y} r={3.5} fill={C.hud} />
    <g fontFamily={F}>
      <rect x={x - 22} y={y - 58} width={44} height={20} rx={10} fill={C.acento} {...Tf} />
      <text x={x} y={y - 43.5} fontSize={12} fontWeight="900" textAnchor="middle" fill={C.hud}>
        100
      </text>
    </g>
  </g>
);

// Panela de ouro em cima de um fogareiro apoiado no chão.
const PanelaOuro: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 36} y={236} width={72} height={26} rx={4} fill="#3a3a48" {...Tf} />
    <rect x={x - 24} y={232} width={48} height={5} fill="#22222c" />
    <path d={`M${x - 28},196 L${x + 28},196 L${x + 25},232 L${x - 25},232 Z`} fill="#f5c842" {...T} />
    <rect x={x - 32} y={190} width={64} height={8} rx={4} fill="#e0a92a" {...Tf} />
    <rect x={x - 5} y={178} width={10} height={12} rx={3} fill="#5a5a66" {...Tf} />
    <circle cx={x - 9} cy={212} r={3} fill={C.hud} />
    <circle cx={x + 9} cy={212} r={3} fill={C.hud} />
    {[-22, 0, 22].map((d, i) => (
      <path key={i} d={`M${x + d},170 l4,-8 l-4,-8`} fill="none" stroke="#fff6c9" strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
    ))}
  </g>
);

export const CapaFacebook: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 820 312" width={1640} height={624}>
      <defs>
        <radialGradient id="fundoFb" cx="0.5" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#4a4270" />
          <stop offset="1" stopColor="#1b1830" />
        </radialGradient>
      </defs>
      <rect width={820} height={312} fill="url(#fundoFb)" />
      {/* lua e prédios ao fundo */}
      <circle cx={760} cy={48} r={20} fill="#f3efd6" opacity={0.9} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={10 + i * 118} y={262 - (i % 3) * 28 - 60} width={70} height={(i % 3) * 28 + 60} fill="#2a2440" opacity={0.75} />
      ))}
      {/* chão */}
      <rect x={0} y={262} width={820} height={50} fill="#14111f" />

      {/* Rodnei com o bilhete, à esquerda do meio */}
      <Rodnei x={185} y={268} escala={0.55} frame={0} maoD="bilhete" bracoD={{ombro: 20, cotovelo: 100}} olhar={[0.6, -0.2]} boca="o" medo />

      {/* desafios, à direita do meio */}
      <Alvo x={672} y={178} />
      <PanelaOuro x={596} />

      {/* marca no centro */}
      <Logo x={410} y={58} s={0.075} />
      <g fontFamily={F} fontWeight="900" textAnchor="middle" stroke="#000" strokeWidth={6} paintOrder="stroke">
        <text x={410} y={128} fontSize={40}>
          <tspan fill="#fff">VOCÊ DECIDE </tspan>
          <tspan fill={C.acento}>AÍ</tspan>
        </text>
      </g>
      <text x={410} y={154} fontSize={13} fontWeight="bold" textAnchor="middle" fill="#e9e6f5" fontFamily={F}>
        Séries e desafios em que VOCÊ decide.
      </text>
      <g fontFamily={F}>
        <rect x={295} y={170} width={230} height={30} rx={15} fill={C.acento} {...Tf} />
        <text x={410} y={190} fontSize={13} fontWeight="900" textAnchor="middle" fill={C.hud}>
          VÍDEO NOVO TODO DIA · 12H
        </text>
      </g>
      {/* "comente" como no voto */}
      <g fontFamily={F}>
        <rect x={305} y={212} width={210} height={34} rx={10} fill="#fff" {...T} />
        <circle cx={326} cy={229} r={9} fill={C.acento} {...Tf} />
        <text x={342} y={234.5} fontSize={14} fontWeight="900" fill={C.hud}>
          COMENTE 1 PALAVRA
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
