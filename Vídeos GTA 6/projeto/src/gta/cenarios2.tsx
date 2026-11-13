import React from 'react';
import {C, F, T, Tf} from './cores';

// Cenários novos do Ep. 2 (desenho 540×960, estilo A).

// Corredor do prédio, na frente da porta do Kaique.
export const Corredor: React.FC<{frame: number; portaAberta?: boolean}> = ({portaAberta = false}) => (
  <g>
    <rect x={0} y={0} width={540} height={660} fill="#c9b48a" />
    <rect x={0} y={0} width={540} height={80} fill="#b8a27a" />
    <rect x={0} y={420} width={540} height={10} fill="#a68d62" />
    <rect x={0} y={660} width={540} height={300} fill="#8a8f99" />
    <g stroke="#7a7f89" strokeWidth={3}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={i * 90} y1={660} x2={i * 90 - 40} y2={960} />
      ))}
      <line x1={0} y1={760} x2={540} y2={760} />
      <line x1={0} y1={870} x2={540} y2={870} />
    </g>
    <rect x={0} y={648} width={540} height={14} fill="#6b5a3e" {...Tf} />
    {/* lâmpada de teto */}
    <rect x={250} y={20} width={40} height={14} fill="#eee" {...Tf} />
    <polygon points="252,34 288,34 360,300 180,300" fill="#fff6c0" opacity={0.18} />
    {/* porta do Kaique (101) */}
    <rect x={60} y={300} width={170} height={360} fill="#5a3a24" {...T} />
    {portaAberta ? (
      <polygon points="60,300 110,320 110,640 60,660" fill="#7a4e30" {...T} />
    ) : (
      <>
        <rect x={68} y={308} width={154} height={344} fill="#7a4e30" {...T} />
        <circle cx={205} cy={490} r={7} fill="#d8c37a" {...Tf} />
        <circle cx={145} cy={400} r={6} fill="#1b1b2a" {...Tf} />
        <rect x={120} y={340} width={50} height={22} rx={3} fill="#d8c37a" {...Tf} />
        <text x={145} y={356} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={14} fill="#3a2a1a">
          101
        </text>
      </>
    )}
    {/* campainha */}
    <rect x={244} y={470} width={18} height={26} rx={3} fill="#eee" {...Tf} />
    <circle cx={253} cy={483} r={5} fill="#e0322b" />
    {/* capacho */}
    <rect x={70} y={668} width={150} height={30} rx={4} fill="#6b4630" {...Tf} />
    <text x={145} y={689} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={12} fill="#c9b48a">
      BEM-VINDO
    </text>
    {/* porta vizinha e quadro de avisos */}
    <rect x={400} y={300} width={140} height={360} fill="#5a3a24" {...T} />
    <rect x={408} y={308} width={132} height={344} fill="#6e4a30" {...T} />
    <rect x={290} y={200} width={90} height={110} fill="#b07a4a" {...T} />
    <rect x={298} y={208} width={74} height={94} fill="#e8d9b0" />
    <rect x={306} y={218} width={30} height={22} fill="#fff" {...Tf} />
    <rect x={340} y={232} width={26} height={30} fill="#ffe08a" {...Tf} />
    <rect x={308} y={252} width={28} height={34} fill="#cfe8ff" {...Tf} />
  </g>
);

// Visão pelo olho mágico: círculo distorcido com o corredor e quem está na porta.
export const OlhoMagico: React.FC<{frame: number; children?: React.ReactNode}> = ({children}) => (
  <g>
    <defs>
      <clipPath id="olho">
        <circle cx={270} cy={470} r={230} />
      </clipPath>
      <radialGradient id="vinheta" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.6" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.85} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={540} height={960} fill="#0a0a0f" />
    <g clipPath="url(#olho)">
      <g transform="translate(270,470) scale(1.25) translate(-270,-470)">
        <Corredor frame={0} />
        {children}
      </g>
      <circle cx={270} cy={470} r={230} fill="url(#vinheta)" />
    </g>
    <circle cx={270} cy={470} r={230} fill="none" stroke="#2a2a31" strokeWidth={10} />
  </g>
);

// Central de entregas: onde ficam o Rui e o quadro de escala.
export const Central: React.FC<{frame: number}> = () => (
  <g>
    <rect x={0} y={0} width={540} height={660} fill="#d9d2c0" />
    <rect x={0} y={0} width={540} height={70} fill="#c6bea9" />
    <rect x={0} y={660} width={540} height={300} fill="#6d7280" />
    <rect x={0} y={648} width={540} height={14} fill="#4a4e58" {...Tf} />
    {/* placa */}
    <rect x={120} y={110} width={300} height={56} rx={8} fill={C.jaqueta} {...T} />
    <text x={270} y={146} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={24} fill={C.hud}>
      CENTRAL DE ENTREGAS
    </text>
    {/* quadro de escala */}
    <rect x={60} y={210} width={420} height={230} rx={6} fill="#fff" {...T} />
    <text x={270} y={240} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={18} fill={C.tinta}>
      ESCALA DA SEMANA
    </text>
    {[
      ['17/11', 'TIÃO', '18h–1h'],
      ['18/11', 'KAIQUE', '12h–18h'],
      ['19/11', 'KAIQUE', '18h–1h'],
    ].map(([d, n, h], i) => (
      <g key={d}>
        <line x1={80} y1={262 + i * 56} x2={460} y2={262 + i * 56} stroke="#ddd" strokeWidth={2} />
        <text x={90} y={300 + i * 56} fontFamily={F} fontWeight="bold" fontSize={18} fill={C.tinta}>
          {d}
        </text>
        <text x={200} y={300 + i * 56} fontFamily={F} fontWeight="bold" fontSize={18} fill={C.tinta}>
          {n}
        </text>
        <text x={340} y={300 + i * 56} fontFamily={F} fontWeight="bold" fontSize={18} fill={i === 2 ? C.vermelho : C.tinta}>
          {h}
        </text>
      </g>
    ))}
    <ellipse cx={392} cy={406} rx={70} ry={24} fill="none" stroke={C.vermelho} strokeWidth={4} />
    {/* baús empilhados */}
    <rect x={430} y={540} width={90} height={80} rx={8} fill={C.bau} {...T} />
    <rect x={440} y={470} width={70} height={70} rx={8} fill={C.bau} {...T} />
  </g>
);
