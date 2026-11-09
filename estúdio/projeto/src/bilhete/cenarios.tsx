import React from 'react';
import {C, T, Tf} from './cores';

// Todos os cenários usam o espaço de desenho 540×960 (o vídeo é 1080×1920).

// ---------- Elevador por dentro ----------
export const ElevadorInterior: React.FC<{
  display: string;
  painelAberto?: boolean;
}> = ({display, painelAberto = false}) => (
  <g>
    {/* teto com a luminária */}
    <polygon points="0,0 540,0 470,150 70,150" fill="#6d7580" {...T} />
    <rect x={170} y={45} width={200} height={55} rx={6} fill="#f4f1e0" {...T} />
    <line x1={237} y1={45} x2={237} y2={100} stroke={C.linha} strokeWidth={2} />
    <line x1={303} y1={45} x2={303} y2={100} stroke={C.linha} strokeWidth={2} />
    {/* paredes laterais */}
    <polygon points="0,0 70,150 70,850 0,960" fill={C.metalEsc} {...T} />
    <polygon points="540,0 470,150 470,850 540,960" fill={C.metalEsc} {...T} />
    {/* parede do fundo, de aço escovado, com placas */}
    <rect x={70} y={150} width={400} height={700} fill={C.metal} {...T} />
    {[170, 270, 370].map((x) => (
      <line key={x} x1={x} y1={150} x2={x} y2={850} stroke={C.metalEsc} strokeWidth={2} />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={80 + i * 65} y1={170} x2={95 + i * 65} y2={830} stroke={C.metalClaro} strokeWidth={1.2} opacity={0.6} />
    ))}
    {/* corrimão preso na parede */}
    <rect x={78} y={598} width={384} height={10} rx={5} fill={C.metalClaro} {...Tf} />
    {[100, 440].map((x) => (
      <rect key={x} x={x - 4} y={606} width={8} height={14} fill={C.metalEsc} {...Tf} />
    ))}
    {/* chão */}
    <polygon points="0,960 70,850 470,850 540,960" fill="#4a4f57" {...T} />
    {/* placa de capacidade presa na parede do fundo */}
    <rect x={95} y={215} width={64} height={34} rx={3} fill="#2f3540" {...Tf} />
    <text x={127} y={230} fontSize={8} fill="#e8e8e8" textAnchor="middle" fontFamily="Inter, Arial">CAPACIDADE</text>
    <text x={127} y={242} fontSize={8} fill="#e8e8e8" textAnchor="middle" fontFamily="Inter, Arial">6 PESSOAS</text>
    {/* painel de botões na parede direita */}
    <polygon points="488,452 528,436 528,700 488,684" fill="#2f3540" {...T} />
    <polygon points="492,462 524,449 524,474 492,487" fill="#111" {...Tf} />
    <text x={0} y={0} fontSize={14} fontWeight="bold" fill="#ff8a2a" fontFamily="JetBrains Mono, monospace" transform="translate(500,481) skewY(-22)">
      {display}
    </text>
    {['T', 'S', '1', '2', '3'].map((b, i) => (
      <g key={b} transform={`translate(508,${520 + i * 30}) skewY(-22)`}>
        <circle cx={0} cy={0} r={8} fill="#c9ced6" {...Tf} />
        <text x={0} y={3.5} fontSize={9} fontWeight="bold" textAnchor="middle" fill="#2f3540" fontFamily="Inter, Arial">
          {b}
        </text>
      </g>
    ))}
    {painelAberto && (
      <g>
        {/* tampa do painel aberta, presa pela dobradiça */}
        <polygon points="488,452 470,470 470,712 488,684" fill="#3d4552" {...T} />
        <path d="M494,600 q8,10 0,20 q-8,10 0,20" fill="none" stroke="#e04a3a" strokeWidth={2.5} />
        <path d="M502,598 q8,12 0,24 q-8,12 0,24" fill="none" stroke="#3a9ae0" strokeWidth={2.5} />
        <path d="M512,594 q8,12 0,24 q-8,12 0,24" fill="none" stroke="#f0c93a" strokeWidth={2.5} />
      </g>
    )}
  </g>
);

// ---------- Hall do térreo, de dia ----------
export const HallDia: React.FC<{avisoColado: boolean}> = ({avisoColado}) => (
  <g>
    {/* teto e luminária */}
    <polygon points="0,0 540,0 470,170 70,170" fill="#e9e1cf" {...T} />
    <rect x={240} y={60} width={60} height={14} rx={3} fill="#fffbe8" {...Tf} />
    {/* parede do fundo */}
    <rect x={70} y={170} width={400} height={600} fill="#e6c79c" {...T} />
    {/* paredes laterais */}
    <polygon points="0,0 70,170 70,770 0,960" fill="#d8b688" {...T} />
    <polygon points="540,0 470,170 470,770 540,960" fill="#d3b083" {...T} />
    {/* chão de piso */}
    <polygon points="0,960 70,770 470,770 540,960" fill="#b9a68a" {...T} />
    {[110, 190, 270, 350, 430].map((x, i) => (
      <line key={x} x1={x} y1={770} x2={-60 + i * 165} y2={960} stroke="#a3907a" strokeWidth={2} />
    ))}
    <line x1={40} y1={840} x2={500} y2={840} stroke="#a3907a" strokeWidth={2} />
    <line x1={15} y1={905} x2={525} y2={905} stroke="#a3907a" strokeWidth={2} />
    {/* rodapé */}
    <rect x={70} y={758} width={400} height={12} fill="#9a7a58" {...Tf} />
    {/* elevador: moldura, portas, visor e botão */}
    <rect x={180} y={350} width={180} height={420} fill={C.metalEsc} {...T} />
    <rect x={192} y={362} width={78} height={408} fill={C.metal} {...T} />
    <rect x={270} y={362} width={78} height={408} fill={C.metal} {...T} />
    <rect x={240} y={312} width={60} height={28} rx={4} fill="#111" {...Tf} />
    <text x={270} y={333} fontSize={18} fontWeight="bold" textAnchor="middle" fill="#ff8a2a" fontFamily="JetBrains Mono, monospace">T</text>
    <rect x={376} y={540} width={22} height={40} rx={4} fill={C.metalClaro} {...Tf} />
    <circle cx={387} cy={560} r={6} fill="#f0c93a" {...Tf} />
    {/* aviso da mudança colado com fita na porta do elevador */}
    {avisoColado && (
      <g>
        <rect x={286} y={470} width={50} height={64} fill={C.papel} {...Tf} />
        <rect x={302} y={464} width={18} height={10} fill="#f3d36b" opacity={0.85} />
        <text x={311} y={490} fontSize={8.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">ME MUDO</text>
        <text x={311} y={503} fontSize={8.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">DIA 30</text>
        <text x={311} y={518} fontSize={6.5} textAnchor="middle" fill="#555" fontFamily="Inter, Arial">Obrigado!</text>
      </g>
    )}
    {/* caixas de correio presas na parede esquerda */}
    <polygon points="12,330 58,352 58,470 12,456" fill="#7a5a3a" {...T} />
    {[0, 1, 2].map((r) =>
      [0, 1].map((c) => (
        <polygon
          key={`${r}${c}`}
          points={`${16 + c * 21},${348 + r * 36 + c * 10} ${34 + c * 21},${357 + r * 36 + c * 10} ${34 + c * 21},${380 + r * 36 + c * 10} ${16 + c * 21},${371 + r * 36 + c * 10}`}
          fill="#a07a50"
          {...Tf}
        />
      )),
    )}
    {/* vaso de planta apoiado no chão */}
    <path d="M410,770 L452,770 L446,820 L416,820 Z" fill="#b5653a" {...T} />
    <path d="M431,770 Q400,720 412,690 Q428,730 431,770 Z" fill="#3f8a4a" {...Tf} />
    <path d="M431,770 Q450,710 470,700 Q452,740 431,770 Z" fill="#4c9c56" {...Tf} />
    <path d="M431,770 Q430,700 438,670 Q444,720 431,770 Z" fill="#357a40" {...Tf} />
    {/* tapete na frente do elevador */}
    <polygon points="195,790 345,790 365,830 175,830" fill="#8a3a3a" {...Tf} />
    {/* porta de vidro da entrada na parede direita, com luz do dia */}
    <polygon points="488,250 528,220 528,800 488,745" fill="#cfe9f5" {...T} />
    <line x1={508} y1={236} x2={508} y2={772} stroke={C.linha} strokeWidth={2} />
    <polygon points="430,770 488,745 528,800 470,860" fill="#fff7c9" opacity={0.35} />
  </g>
);

// ---------- Corredor do térreo, à noite (da prancha 1, sem câmera) ----------
export const Corredor: React.FC<{
  sombraOp: number;
  bilheteNoChao: boolean;
  feixe: boolean;
}> = ({sombraOp, bilheteNoChao, feixe}) => (
  <g>
    <defs>
      <radialGradient id="lampCorredor" cx="0.5" cy="0" r="0.8">
        <stop offset="0" stopColor={C.luz} stopOpacity={0.35} />
        <stop offset="1" stopColor={C.luz} stopOpacity={0} />
      </radialGradient>
    </defs>
    <polygon points="0,0 540,0 540,150 360,390 240,390 0,150" fill="#3b3550" {...T} />
    <polygon points="0,150 240,390 240,520 0,820" fill="#5d5486" {...T} />
    <polygon points="540,150 360,390 360,520 540,820" fill="#544b7a" {...T} />
    <rect x={240} y={390} width={120} height={130} fill="#2a2440" {...T} />
    <polygon points="0,820 240,520 360,520 540,820 540,960 0,960" fill="#7a5a4a" {...T} />
    <g stroke="#6a4c3e" strokeWidth={2} fill="none">
      <line x1={270} y1={520} x2={150} y2={960} />
      <line x1={300} y1={520} x2={300} y2={960} />
      <line x1={330} y1={520} x2={450} y2={960} />
      <line x1={200} y1={590} x2={400} y2={590} />
      <line x1={140} y1={680} x2={460} y2={680} />
    </g>
    <polygon points="0,800 240,512 240,520 0,820" fill="#874f2c" opacity={0.7} />
    <polygon points="540,800 360,512 360,520 540,820" fill="#874f2c" opacity={0.7} />
    {/* janela no fim do corredor */}
    <rect x={272} y={402} width={56} height={44} fill="#101a33" {...Tf} />
    <line x1={300} y1={402} x2={300} y2={446} stroke={C.linha} strokeWidth={2} />
    <circle cx={316} cy={414} r={4} fill="#f3efd6" opacity={0.9} />
    {/* lâmpada presa no teto */}
    <rect x={290} y={232} width={20} height={8} fill="#8793a3" {...Tf} />
    <ellipse cx={300} cy={246} rx={24} ry={8} fill={C.papel} {...Tf} />
    <polygon points="276,250 324,250 420,520 180,520" fill="url(#lampCorredor)" />
    {/* porta do apartamento do Rodnei */}
    <polygon points="50,367 150,400 150,632 50,757" fill="#a0623a" {...T} />
    <polygon points="64,400 136,424 136,500 64,500" fill="#874f2c" opacity={0.6} />
    <polygon points="64,540 136,548 136,600 64,640" fill="#874f2c" opacity={0.6} />
    <circle cx={132} cy={545} r={5} fill={C.chave} {...Tf} />
    <circle cx={100} cy={455} r={4} fill="#2a2440" {...Tf} />
    {bilheteNoChao && (
      <g>
        <polygon points="80,720 108,685 126,694 98,730" fill={C.papel} {...Tf} />
        <line x1={92} y1={718} x2={110} y2={696} stroke="#888" strokeWidth={1.5} />
        <line x1={74} y1={727} x2={114} y2={677} stroke={C.linha} strokeWidth={3} />
      </g>
    )}
    {/* elevador do térreo, de onde ele saiu */}
    <polygon points="392,404 498,360 498,742 392,592" fill="#8793a3" {...T} />
    <polygon points="400,412 490,373 490,737 400,587" fill="#a9b4c2" {...T} />
    <line x1={445} y1={392} x2={445} y2={662} stroke={C.linha} strokeWidth={2} />
    <polygon points="430,372 462,358 462,376 430,389" fill="#222" {...Tf} />
    <text x={0} y={0} fontSize={13} fontWeight="bold" fill={C.acento} transform="translate(441,384) skewY(-23)" fontFamily="Inter, Arial">
      T
    </text>
    <g transform="translate(452,470) skewY(-23)">
      <rect x={0} y={0} width={32} height={40} fill={C.papel} {...Tf} />
      <rect x={11} y={-4} width={10} height={6} fill={C.acento} opacity={0.7} />
      <text x={16} y={13} fontSize={6.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">ME MUDO</text>
      <text x={16} y={23} fontSize={6.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">DIA 30</text>
      <text x={16} y={33} fontSize={5} textAnchor="middle" fill="#555" fontFamily="Inter, Arial">Obrigado!</text>
    </g>
    <rect x={503} y={520} width={10} height={20} rx={2} fill="#8793a3" {...Tf} />
    {/* caixas da mudança apoiadas no chão */}
    <rect x={18} y={828} width={104} height={78} fill="#c79a5b" {...T} />
    <rect x={18} y={828} width={104} height={10} fill="#a87d42" />
    <rect x={62} y={828} width={16} height={78} fill="#a87d42" opacity={0.6} />
    <rect x={34} y={770} width={76} height={58} fill="#c79a5b" {...T} />
    <rect x={66} y={770} width={12} height={58} fill="#a87d42" opacity={0.6} />
    <text x={70} y={872} fontSize={12} fontWeight="bold" textAnchor="middle" fill="#5a3a1e" fontFamily="Inter, Arial">COZINHA</text>
    {/* facho da lanterna */}
    {feixe && (
      <>
        <polygon points="314,580 324,584 336,446 262,446" fill={C.luz} opacity={0.38} />
        <ellipse cx={299} cy={470} rx={38} ry={44} fill={C.luz} opacity={0.23} />
      </>
    )}
    {/* a sombra no fim do corredor */}
    <g opacity={sombraOp}>
      <circle cx={300} cy={462} r={9} fill="#0d0b14" />
      <path d="M287,472 Q300,466 313,472 L318,520 L282,520 Z" fill="#0d0b14" />
    </g>
  </g>
);

// ---------- Vizinho (só passa, olhando o celular) ----------
export const Vizinho: React.FC<{x: number; y: number; escala?: number; frame: number}> = ({x, y, escala = 1, frame}) => {
  const passo = Math.sin(frame / 4) * 18;
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <ellipse cx={0} cy={8} rx={50} ry={10} fill="#000" opacity={0.18} />
      <g transform={`rotate(${passo} 0 -130)`}>
        <rect x={-14} y={-130} width={26} height={128} rx={8} fill="#6b6f78" {...T} />
        <path d="M-20,-6 L14,-6 L16,8 L-26,8 Z" fill="#f2f2f2" {...T} />
      </g>
      <g transform={`rotate(${-passo} 0 -130)`}>
        <rect x={-12} y={-130} width={26} height={128} rx={8} fill="#7a7e88" {...T} />
        <path d="M-18,-6 L16,-6 L18,8 L-24,8 Z" fill="#f2f2f2" {...T} />
      </g>
      {/* moletom verde */}
      <path d="M-34,-250 Q0,-262 30,-250 L36,-126 L-38,-126 Z" fill="#3f8a5a" {...T} />
      {/* braço segurando o celular na frente do peito */}
      <path d="M-20,-236 Q-50,-200 -44,-176 L-30,-172 Q-34,-196 -10,-220 Z" fill="#357a4c" {...T} />
      <rect x={-62} y={-196} width={16} height={26} rx={3} fill="#222" {...Tf} />
      <rect x={-60} y={-193} width={12} height={19} fill="#9fd8ff" />
      <circle cx={-40} cy={-176} r={9} fill="#c98d66" {...Tf} />
      {/* cabeça de perfil, olhando para baixo, para o celular */}
      <rect x={-8} y={-268} width={16} height={18} fill="#a8724f" {...Tf} />
      <g transform="rotate(14 0 -268)">
        <ellipse cx={0} cy={-298} rx={28} ry={32} fill="#c98d66" {...T} />
        <path d="M-28,-302 Q-30,-336 2,-334 Q30,-332 28,-306 Q22,-322 4,-320 Q-6,-308 -28,-302 Z" fill="#1d1612" {...Tf} />
        <circle cx={18} cy={-336} r={12} fill="#1d1612" {...Tf} />
        <path d="M-27,-296 L-36,-288 L-27,-284" fill="#c98d66" {...Tf} />
        <ellipse cx={-14} cy={-294} rx={3} ry={2} fill="#1a1a1a" />
      </g>
    </g>
  );
};

// ---------- Placar ----------
export const Placar: React.FC<{noite: string; chaves: number; entrada: number}> = ({noite, chaves, entrada}) => (
  <g transform={`translate(0,${(1 - entrada) * -140})`} opacity={entrada} fontFamily="Inter, Arial, sans-serif">
    <rect x={18} y={22} width={150} height={44} rx={22} fill={C.hud} opacity={0.9} />
    <text x={93} y={51} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.hudTxt}>
      NOITE {noite}
    </text>
    <rect x={178} y={22} width={92} height={44} rx={22} fill={C.hud} opacity={0.9} />
    <g transform="translate(196,34)" fill={C.acento}>
      <circle cx={9} cy={10} r={8} fill="none" stroke={C.acento} strokeWidth={4} />
      <rect x={16} y={8} width={18} height={4} />
      <rect x={28} y={12} width={4} height={6} />
      <rect x={22} y={12} width={4} height={4} />
    </g>
    <text x={250} y={51} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.hudTxt}>
      {chaves}
    </text>
    <rect x={330} y={22} width={192} height={66} rx={12} fill={C.hud} opacity={0.9} />
    <text x={346} y={46} fontSize={13} fontWeight="bold" fill={C.acento}>
      PERGUNTAS
    </text>
    <rect x={346} y={58} width={14} height={14} fill="none" stroke={C.hudTxt} strokeWidth={2} />
    <text x={368} y={70} fontSize={15} fill={C.hudTxt}>
      Quem escreve?
    </text>
  </g>
);
