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
  aberturaElevador?: number; // 0 fechado, 1 aberto
  sombraElevador?: number; // sombra dentro do elevador
  portaAberta?: boolean; // porta do apartamento do Rodnei aberta
  camera?: boolean; // câmera da Marlene presa na parede
}> = ({sombraOp, bilheteNoChao, feixe, aberturaElevador = 0, sombraElevador = 0, portaAberta = false, camera = false}) => {
  // bordas de cima e de baixo da porta do elevador (em perspectiva)
  const yCima = (x: number) => 412 - (x - 400) * (39 / 90);
  const yBaixo = (x: number) => 587 + (x - 400) * (150 / 90);
  const xe = 445 - 45 * aberturaElevador;
  const xd = 445 + 45 * aberturaElevador;
  const folha = (a: number, b: number) => `${a},${yCima(a)} ${b},${yCima(b)} ${b},${yBaixo(b)} ${a},${yBaixo(a)}`;
  return (
  <g>
    <defs>
      <clipPath id="folhaDireita">
        <polygon points={folha(xd, 490)} />
      </clipPath>
    </defs>
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
    {camera && (
      <g>
        <rect x={482} y={262} width={8} height={22} fill="#8793a3" {...Tf} />
        <rect x={452} y={280} width={40} height={20} rx={4} fill="#e8e8ec" {...Tf} />
        <rect x={444} y={284} width={10} height={12} rx={2} fill="#333" />
        <circle cx={482} cy={290} r={3.5} fill="#ff3b3b" />
      </g>
    )}
    {/* porta do apartamento do Rodnei */}
    {portaAberta ? (
      <g>
        {/* porta aberta: a luz da sala dele aparece e a folha da porta fica para dentro */}
        <polygon points="50,367 150,400 150,632 50,757" fill="#f3c97a" {...T} />
        <polygon points="50,367 82,360 82,742 50,757" fill="#a0623a" {...T} />
        <polygon points="50,757 150,632 230,690 120,850" fill="#f3c97a" opacity={0.35} />
      </g>
    ) : (
      <g>
        <polygon points="50,367 150,400 150,632 50,757" fill="#a0623a" {...T} />
        <polygon points="64,400 136,424 136,500 64,500" fill="#874f2c" opacity={0.6} />
        <polygon points="64,540 136,548 136,600 64,640" fill="#874f2c" opacity={0.6} />
        <circle cx={132} cy={545} r={5} fill={C.chave} {...Tf} />
        <circle cx={100} cy={455} r={4} fill="#2a2440" {...Tf} />
      </g>
    )}
    {bilheteNoChao && (
      <g>
        <polygon points="80,720 108,685 126,694 98,730" fill={C.papel} {...Tf} />
        <line x1={92} y1={718} x2={110} y2={696} stroke="#888" strokeWidth={1.5} />
        <line x1={74} y1={727} x2={114} y2={677} stroke={C.linha} strokeWidth={3} />
      </g>
    )}
    {/* elevador do térreo, de onde ele saiu */}
    <polygon points="392,404 498,360 498,742 392,592" fill="#8793a3" {...T} />
    {/* dentro do elevador (aparece quando a porta abre) */}
    <polygon points="400,412 490,373 490,737 400,587" fill="#e9e3c8" {...T} />
    <g opacity={sombraElevador}>
      <circle cx={445} cy={470} r={13} fill="#0d0b14" />
      <path d="M428,484 Q445,476 462,484 L468,650 L422,630 Z" fill="#0d0b14" />
    </g>
    <polygon points={folha(400, xe)} fill="#a9b4c2" {...T} />
    <polygon points={folha(xd, 490)} fill="#a9b4c2" {...T} />
    <polygon points="430,372 462,358 462,376 430,389" fill="#222" {...Tf} />
    <text x={0} y={0} fontSize={13} fontWeight="bold" fill={C.acento} transform="translate(441,384) skewY(-23)" fontFamily="Inter, Arial">
      T
    </text>
    <g clipPath="url(#folhaDireita)">
    <g transform={`translate(${452 + 45 * aberturaElevador},${470 - 45 * aberturaElevador * (39 / 90)}) skewY(-23)`}>
      <rect x={0} y={0} width={32} height={40} fill={C.papel} {...Tf} />
      <rect x={11} y={-4} width={10} height={6} fill={C.acento} opacity={0.7} />
      <text x={16} y={13} fontSize={6.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">ME MUDO</text>
      <text x={16} y={23} fontSize={6.5} fontWeight="bold" textAnchor="middle" fill="#333" fontFamily="Inter, Arial">DIA 30</text>
      <text x={16} y={33} fontSize={5} textAnchor="middle" fill="#555" fontFamily="Inter, Arial">Obrigado!</text>
    </g>
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
};

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
export const Placar: React.FC<{noite: string; chaves: number; entrada: number; perguntas?: string[]; riscada?: number; risco?: number; prazo?: string}> = ({noite, chaves, entrada, perguntas = ['Quem escreve?'], riscada = -1, risco = 0, prazo}) => (
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
    <rect x={330} y={22} width={192} height={40 + perguntas.length * 26} rx={12} fill={C.hud} opacity={0.9} />
    <text x={346} y={46} fontSize={13} fontWeight="bold" fill={C.acento}>
      PERGUNTAS
    </text>
    {perguntas.map((p, i) => (
      <g key={p}>
        <rect x={346} y={58 + i * 26} width={14} height={14} fill="none" stroke={C.hudTxt} strokeWidth={2} />
        <text x={368} y={70 + i * 26} fontSize={15} fill={C.hudTxt} opacity={i === riscada ? 1 - risco * 0.5 : 1}>
          {p}
        </text>
        {i === riscada && risco > 0 && (
          <>
            <line x1={366} y1={65 + i * 26} x2={366 + 140 * risco} y2={65 + i * 26} stroke="#e0463a" strokeWidth={3} />
            <path d={`M348,${60 + i * 26} l10,10 M358,${60 + i * 26} l-10,10`} stroke="#e0463a" strokeWidth={3} opacity={risco} />
          </>
        )}
      </g>
    ))}
    {prazo && (
      <g>
        <rect x={18} y={76} width={150} height={32} rx={16} fill="#e0463a" />
        <text x={93} y={98} fontSize={15} fontWeight="900" textAnchor="middle" fill="#fff">
          {prazo}
        </text>
      </g>
    )}
  </g>
);

// ---------- Sala do Rodnei, à noite, cheia de caixas ----------
export const SalaNoite: React.FC<{papel: number; dia?: boolean; hora?: number}> = ({papel, dia = false, hora = 23}) => (
  <g>
    <polygon points="0,0 540,0 470,150 70,150" fill="#8a6f55" {...T} />
    <polygon points="0,0 70,150 70,780 0,960" fill="#b89a74" {...T} />
    <polygon points="540,0 470,150 470,780 540,960" fill="#b3946e" {...T} />
    <rect x={70} y={150} width={400} height={630} fill="#cdb08a" {...T} />
    <polygon points="0,960 70,780 470,780 540,960" fill="#8a5a3a" {...T} />
    {[150, 240, 330, 420].map((x, i) => (
      <line key={x} x1={x} y1={780} x2={-40 + i * 200} y2={960} stroke="#74482c" strokeWidth={2} />
    ))}
    {/* tapete */}
    <polygon points="110,820 430,820 470,900 70,900" fill="#6e3b3b" {...Tf} />
    {/* janela na parede esquerda, com a noite */}
    <polygon points="14,250 56,268 56,470 14,470" fill={dia ? '#bfe4f5' : '#16213e'} {...T} />
    {dia ? <circle cx={34} cy={300} r={9} fill="#ffe27a" /> : <circle cx={34} cy={300} r={7} fill="#f3efd6" />}
    {dia && <polygon points="56,300 56,470 200,780 120,780" fill="#fff7c9" opacity={0.25} />}
    <line x1={35} y1={259} x2={35} y2={470} stroke={C.linha} strokeWidth={2} />
    {/* relógio na parede marcando 23h */}
    <circle cx={360} cy={250} r={34} fill="#fbf7ea" {...T} />
    <line x1={360} y1={250} x2={360} y2={226} stroke={C.linha} strokeWidth={4} strokeLinecap="round" />
    <line x1={360} y1={250} x2={360 + 15 * Math.sin(((hora % 12) / 12) * 2 * Math.PI)} y2={250 - 15 * Math.cos(((hora % 12) / 12) * 2 * Math.PI)} stroke={C.linha} strokeWidth={5} strokeLinecap="round" />
    <circle cx={360} cy={250} r={3} fill={C.linha} />
    {/* porta de entrada: olho mágico, trinco de corrente e a fresta embaixo */}
    <rect x={300} y={400} width={130} height={380} fill="#a0623a" {...T} />
    <rect x={316} y={420} width={98} height={140} fill="#874f2c" opacity={0.5} />
    <rect x={316} y={590} width={98} height={160} fill="#874f2c" opacity={0.5} />
    <circle cx={365} cy={470} r={5} fill="#2a2440" {...Tf} />
    <circle cx={410} cy={600} r={7} fill={C.chave} {...Tf} />
    <path d="M404,560 q-14,18 -2,30" fill="none" stroke="#9aa0a6" strokeWidth={3} />
    <rect x={398} y={552} width={14} height={8} fill="#9aa0a6" {...Tf} />
    <rect x={300} y={776} width={130} height={4} fill="#1b1b2a" />
    {/* o bilhete deslizando por baixo da porta */}
    {papel > 0 && (
      <g>
        <polygon points={`${335},${778 + papel * 40} ${395},${778 + papel * 40} ${400},${786 + papel * 60} ${330},${786 + papel * 60}`} fill={C.papel} {...Tf} />
      </g>
    )}
    {/* abajur de chão, apoiado no chão */}
    <rect x={448} y={560} width={6} height={220} fill="#3a3a3a" {...Tf} />
    <ellipse cx={451} cy={782} rx={22} ry={6} fill="#3a3a3a" {...Tf} />
    <path d="M426,560 L476,560 L466,520 L436,520 Z" fill="#f3d36b" {...T} />
    <polygon points="426,560 476,560 520,780 400,780" fill={C.luz} opacity={0.18} />
    {/* caixas da mudança empilhadas no chão */}
    <rect x={88} y={680} width={130} height={100} fill="#c79a5b" {...T} />
    <rect x={146} y={680} width={16} height={100} fill="#a87d42" opacity={0.6} />
    <text x={153} y={745} fontSize={14} fontWeight="bold" textAnchor="middle" fill="#5a3a1e" fontFamily="Inter, Arial">LIVROS</text>
    <rect x={100} y={600} width={104} height={80} fill="#c79a5b" {...T} />
    <rect x={146} y={600} width={14} height={80} fill="#a87d42" opacity={0.6} />
    <text x={152} y={650} fontSize={14} fontWeight="bold" textAnchor="middle" fill="#5a3a1e" fontFamily="Inter, Arial">SALA</text>
    <rect x={120} y={540} width={70} height={60} fill="#d8ad6c" {...T} />
    {/* rolo de fita em cima da caixa */}
    <ellipse cx={155} cy={536} rx={16} ry={6} fill="#c9b27a" {...Tf} />
  </g>
);

// ---------- Visor do elevador, de perto ----------
export const VisorElevador: React.FC<{andar: string; subindo: boolean}> = ({andar, subindo}) => (
  <g>
    <rect x={0} y={0} width={540} height={960} fill="#544b7a" />
    <rect x={0} y={880} width={540} height={80} fill="#7a5a4a" {...T} />
    {/* moldura e portas do elevador */}
    <rect x={60} y={520} width={420} height={360} fill="#8793a3" {...T} />
    <rect x={80} y={540} width={190} height={340} fill="#a9b4c2" {...T} />
    <rect x={270} y={540} width={190} height={340} fill="#a9b4c2" {...T} />
    {/* visor preso na parede, acima das portas */}
    <rect x={150} y={250} width={240} height={200} rx={16} fill="#111" {...T} />
    <text x={312} y={400} fontSize={150} fontWeight="bold" textAnchor="middle" fill="#ff8a2a" fontFamily="JetBrains Mono, monospace">
      {andar}
    </text>
    {subindo && <polygon points="168,380 192,336 216,380" fill="#ff8a2a" />}
    <rect x={500} y={650} width={22} height={44} rx={4} fill="#c9ced6" {...Tf} />
  </g>
);

// ---------- Porta vista de frente (501, síndica...) ----------
export const PortaFrente: React.FC<{
  numero: string;
  cor?: string;
  corEsc?: string;
  placa?: 'bemvindos' | 'sindica' | 'nenhuma';
  placaTorta?: boolean;
  papelNoChao?: boolean;
  luzEmbaixo?: boolean;
  dia?: boolean;
  aberta?: boolean; // porta aberta: aparece a sala de dentro
  placaAngulo?: number; // sobrepõe placaTorta
}> = ({numero, cor = '#a0623a', corEsc = '#874f2c', placa = 'bemvindos', placaTorta = false, papelNoChao = false, luzEmbaixo = true, dia = false, aberta = false, placaAngulo}) => (
  <g>
    <rect x={0} y={0} width={540} height={800} fill="#5d5486" />
    <rect x={0} y={780} width={540} height={20} fill="#874f2c" {...Tf} />
    <rect x={0} y={800} width={540} height={260} fill="#7a5a4a" {...T} />
    <line x1={0} y1={880} x2={540} y2={880} stroke="#6a4c3e" strokeWidth={2} />
    {/* arandela presa na parede */}
    <rect x={455} y={380} width={20} height={34} rx={4} fill="#8793a3" {...Tf} />
    <path d="M445,380 L485,380 L478,350 L452,350 Z" fill={dia ? '#e9e3c8' : '#f3d36b'} {...Tf} />
    {/* porta */}
    <rect x={140} y={240} width={260} height={560} fill={corEsc} {...T} />
    {aberta ? (
      <g>
        {/* dentro do apartamento: luz acesa, um quadro e um cabideiro */}
        <rect x={154} y={254} width={232} height={546} fill={dia ? '#e8d9bc' : '#f3c97a'} {...T} />
        <rect x={154} y={700} width={232} height={100} fill={dia ? '#c9b48e' : '#d9a85a'} />
        <rect x={300} y={330} width={60} height={46} fill="#7a9cc0" {...Tf} />
        <rect x={180} y={420} width={8} height={280} fill="#5a3a24" {...Tf} />
        <circle cx={184} cy={440} r={14} fill="#7a2e3e" {...Tf} />
        {/* folha da porta aberta para dentro */}
        <polygon points="154,254 196,270 196,784 154,800" fill={cor} {...T} />
      </g>
    ) : (
    <rect x={154} y={254} width={232} height={546} fill={cor} {...T} />
    )}
    {!aberta && <rect x={180} y={300} width={180} height={190} fill={corEsc} opacity={0.5} />}
    {!aberta && <rect x={180} y={540} width={180} height={220} fill={corEsc} opacity={0.5} />}
    {aberta ? (
      <>
        <rect x={225} y={204} width={90} height={30} rx={6} fill="#d8c37a" {...Tf} />
        <text x={270} y={227} fontSize={22} fontWeight="900" textAnchor="middle" fill="#3a2a1a" fontFamily="Inter, Arial">{numero}</text>
      </>
    ) : (
      <>
        <rect x={225} y={268} width={90} height={36} rx={6} fill="#d8c37a" {...Tf} />
        <text x={270} y={295} fontSize={26} fontWeight="900" textAnchor="middle" fill="#3a2a1a" fontFamily="Inter, Arial">{numero}</text>
      </>
    )}
    {!aberta && <circle cx={270} cy={340} r={6} fill="#1b1b2a" {...Tf} />}
    {placa === 'bemvindos' && !aberta && (
      <g transform={`rotate(${placaAngulo ?? (placaTorta ? 14 : 0)} 270 392)`}>
        <circle cx={270} cy={392} r={4} fill="#9aa0a6" {...Tf} />
        <path d="M270,392 L226,428 M270,392 L314,428" stroke="#6a4c3e" strokeWidth={2} fill="none" />
        <rect x={212} y={426} width={116} height={40} rx={6} fill="#f2e6c9" transform="rotate(-4 270 446)" {...Tf} />
        <text x={270} y={452} fontSize={15} fontWeight="bold" textAnchor="middle" fill="#6e3b3b" fontFamily="Inter, Arial" transform="rotate(-4 270 446)">BEM-VINDOS</text>
      </g>
    )}
    {placa === 'sindica' && !aberta && (
      <g>
        <rect x={205} y={380} width={130} height={36} rx={4} fill="#2f3540" {...Tf} />
        <text x={270} y={404} fontSize={17} fontWeight="900" textAnchor="middle" fill="#f3d36b" fontFamily="Inter, Arial">SÍNDICA</text>
      </g>
    )}
    {!aberta && <circle cx={372} cy={560} r={9} fill={C.chave} {...Tf} />}
    {luzEmbaixo && !aberta && (
      <>
        <rect x={154} y={796} width={232} height={5} fill="#ffe69a" />
        <polygon points="154,801 386,801 430,850 110,850" fill="#ffe69a" opacity={0.25} />
      </>
    )}
    <polygon points="160,812 380,812 400,846 140,846" fill="#5a4a3a" {...Tf} />
    {papelNoChao && (
      <g transform="rotate(-12 330 830)">
        <polygon points="312,820 352,816 356,838 314,842" fill={C.papel} {...Tf} />
        <line x1={320} y1={828} x2={346} y2={826} stroke="#999" strokeWidth={1.5} />
      </g>
    )}
    <path d="M440,800 L478,800 L472,760 L446,760 Z" fill="#b5653a" {...T} />
    <path d="M459,760 Q440,720 448,700 Q458,730 459,760 Z" fill="#3f8a4a" {...Tf} />
    <path d="M459,760 Q474,716 488,710 Q474,740 459,760 Z" fill="#4c9c56" {...Tf} />
  </g>
);

// ---------- Porta mais à esquerda, com parede e chão em toda a largura ----------
export const PortaLateral: React.FC<React.ComponentProps<typeof PortaFrente>> = (p) => (
  <g>
    <rect x={0} y={0} width={540} height={800} fill="#5d5486" />
    <rect x={0} y={780} width={540} height={20} fill="#874f2c" />
    <rect x={0} y={800} width={540} height={160} fill="#7a5a4a" />
    <line x1={0} y1={880} x2={540} y2={880} stroke="#6a4c3e" strokeWidth={2} />
    <g transform="translate(-110,0)">
      <PortaFrente {...p} />
    </g>
  </g>
);

// ---------- Porta do 501 (Ep. 1) ----------
export const Porta501: React.FC = () => <PortaFrente numero="501" />;

// ---------- Portaria: balcão com o livro de entradas ----------
export const Portaria: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <rect x={0} y={0} width={540} height={700} fill="#b9c7a8" />
    <rect x={0} y={700} width={540} height={260} fill="#b9a68a" {...T} />
    <line x1={0} y1={800} x2={540} y2={800} stroke="#a3907a" strokeWidth={2} />
    {/* quadro de chaves preso na parede */}
    <rect x={40} y={180} width={150} height={190} rx={6} fill="#7a5a3a" {...T} />
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
      <g key={`${r}${c}`}>
        <circle cx={70 + c * 45} cy={210 + r * 45} r={3} fill="#2f3540" />
        {!(r === 2 && c === 1) && <path d={`M${70 + c * 45},${213 + r * 45} l0,16`} stroke={C.chave} strokeWidth={4} strokeLinecap="round" />}
      </g>
    )))}
    <text x={115} y={392} fontSize={13} fontWeight="900" textAnchor="middle" fill="#3a2a1a" fontFamily="Inter, Arial">CHAVES</text>
    {/* lista de moradores presa na parede */}
    <rect x={340} y={160} width={170} height={230} rx={4} fill="#fbf7ea" {...T} />
    <text x={425} y={190} fontSize={15} fontWeight="900" textAnchor="middle" fill={C.hud} fontFamily="Inter, Arial">MORADORES</text>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line key={i} x1={355} y1={215 + i * 25} x2={495} y2={215 + i * 25} stroke="#c9c2ad" strokeWidth={3} />
    ))}
    {/* relógio */}
    <circle cx={270} cy={150} r={30} fill="#fbf7ea" {...T} />
    <line x1={270} y1={150} x2={270} y2={128} stroke={C.linha} strokeWidth={4} strokeLinecap="round" />
    <line x1={270} y1={150} x2={258} y2={157} stroke={C.linha} strokeWidth={4} strokeLinecap="round" />
    {children}
    {/* balcão na frente */}
    <rect x={30} y={600} width={480} height={22} fill="#8a5a3a" {...T} />
    <rect x={44} y={622} width={452} height={240} fill="#a0623a" {...T} />
    <rect x={64} y={650} width={190} height={180} fill="#874f2c" opacity={0.5} />
    <rect x={286} y={650} width={190} height={180} fill="#874f2c" opacity={0.5} />
    {/* livro aberto em cima do balcão */}
    <path d="M150,602 Q210,586 270,600 Q330,586 390,602 L390,610 L150,610 Z" fill="#fbf7ea" {...T} />
    <line x1={270} y1={592} x2={270} y2={608} stroke={C.linha} strokeWidth={2} />
    {/* telefone */}
    <rect x={420} y={584} width={50} height={18} rx={4} fill="#2f3540" {...Tf} />
  </g>
);

// ---------- Livro de entradas, de perto ----------
export const LivroClose: React.FC<{riscado: number; destaque: number}> = ({riscado, destaque}) => {
  const linhas: [string, string, string][] = [
    ['21:15', 'Bruno', '504'],
    ['22:40', 'Família Lopes', '503'],
    ['23:02', '', '5º'],
  ];
  return (
    <g fontFamily="Inter, Arial">
      <rect x={0} y={0} width={540} height={960} fill="#8a5a3a" />
      <line x1={0} y1={300} x2={540} y2={300} stroke="#74482c" strokeWidth={3} />
      <line x1={0} y1={700} x2={540} y2={700} stroke="#74482c" strokeWidth={3} />
      <path d="M30,220 Q150,190 270,215 Q390,190 510,220 L510,760 Q390,735 270,760 Q150,735 30,760 Z" fill="#fbf7ea" {...T} />
      <line x1={270} y1={215} x2={270} y2={760} stroke={C.linha} strokeWidth={2.5} />
      <text x={150} y={270} fontSize={20} fontWeight="900" textAnchor="middle" fill={C.hud}>ENTRADAS</text>
      <text x={150} y={292} fontSize={13} fontWeight="bold" textAnchor="middle" fill="#666">ontem, noite</text>
      {linhas.map(([h, nome, ap], i) => (
        <g key={i}>
          <line x1={45} y1={350 + i * 90} x2={255} y2={350 + i * 90} stroke="#c9c2ad" strokeWidth={2} />
          <text x={50} y={340 + i * 90} fontSize={17} fill="#1f2a5a" fontStyle="italic" fontFamily="FreeSerif, serif">{h}</text>
          <text x={110} y={340 + i * 90} fontSize={i === 2 ? 30 : 19} fill="#1f2a5a" fontStyle="italic" fontFamily="FreeSerif, serif">{i === 2 ? 'T' : nome}</text>
          <text x={225} y={340 + i * 90} fontSize={17} fill="#1f2a5a" fontStyle="italic" fontFamily="FreeSerif, serif">{ap}</text>
        </g>
      ))}
      {/* o resto do nome, riscado com força */}
      <path d={`M128,${520} q8,-14 16,0 q8,14 16,0 q8,-14 16,0 q8,14 16,0`} fill="none" stroke="#1f2a5a" strokeWidth={4}
        strokeDasharray={200} strokeDashoffset={200 * (1 - riscado)} />
      <path d={`M126,${512} L196,${506} M128,${526} L198,${522}`} stroke="#1f2a5a" strokeWidth={3} strokeDasharray={160} strokeDashoffset={160 * (1 - riscado)} />
      {/* círculo de destaque no "T" */}
      <ellipse cx={118} cy={518} rx={24} ry={28} fill="none" stroke="#e0463a" strokeWidth={4} strokeDasharray={170} strokeDashoffset={170 * (1 - destaque)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={290} y1={350 + i * 70} x2={495} y2={350 + i * 70} stroke="#c9c2ad" strokeWidth={2} />
      ))}
      {/* caneta apoiada no livro */}
      <g transform="rotate(-30 420 640)">
        <rect x={340} y={632} width={150} height={14} rx={7} fill="#2f6db5" {...Tf} />
        <polygon points="340,632 318,639 340,646" fill="#d6dbe1" {...Tf} />
      </g>
    </g>
  );
};

// ---------- Lista de moradores do 5º andar, de perto ----------
export const ListaClose: React.FC<{destaque: number}> = ({destaque}) => {
  const nomes = [['501', 'Tânia'], ['502', 'Sr. Prado'], ['503', 'Família Lopes'], ['504', 'Bruno']];
  return (
    <g fontFamily="Inter, Arial">
      <rect x={0} y={0} width={540} height={960} fill="#b9c7a8" />
      <rect x={60} y={170} width={420} height={560} rx={8} fill="#fbf7ea" {...T} />
      <circle cx={270} cy={190} r={7} fill="#9aa0a6" {...Tf} />
      <text x={270} y={250} fontSize={34} fontWeight="900" textAnchor="middle" fill={C.hud}>MORADORES</text>
      <text x={270} y={290} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#666">5º ANDAR</text>
      {nomes.map(([ap, nome], i) => (
        <g key={ap}>
          <line x1={90} y1={360 + i * 90} x2={450} y2={360 + i * 90} stroke="#c9c2ad" strokeWidth={2} />
          <text x={100} y={348 + i * 90} fontSize={28} fontWeight="900" fill="#5a3a1e">{ap}</text>
          <text x={190} y={348 + i * 90} fontSize={30} fontWeight="bold" fill={C.hud}>{nome}</text>
        </g>
      ))}
      <rect x={176} y={308} width={120} height={56} rx={28} fill="none" stroke="#e0463a" strokeWidth={5}
        strokeDasharray={360} strokeDashoffset={360 * (1 - destaque)} />
    </g>
  );
};

// ---------- Vulto de macacão azul, de costas ----------
export const VultoMacacao: React.FC<{x: number; y: number; escala?: number}> = ({x, y, escala = 1}) => (
  <g transform={`translate(${x},${y}) scale(${escala})`}>
    <ellipse cx={0} cy={10} rx={70} ry={12} fill="#000" opacity={0.25} />
    <path d="M-48,-144 L-4,-144 L-8,0 L-38,0 Z" fill={C.macacaoSomb} {...T} />
    <path d="M4,-144 L48,-144 L38,0 L8,0 Z" fill={C.macacaoSomb} {...T} />
    <path d="M-44,-4 L-6,-4 L-6,12 L-48,12 Z" fill={C.sapato} {...T} />
    <path d="M6,-4 L44,-4 L48,12 L6,12 Z" fill={C.sapato} {...T} />
    <path d="M-46,-266 Q0,-276 46,-266 L54,-142 L-54,-142 Z" fill={C.macacao} {...T} />
    <rect x={-54} y={-154} width={108} height={12} fill={C.cinto} {...Tf} />
    <rect x={-60} y={-262} width={22} height={124} rx={10} fill={C.macacaoSomb} {...T} />
    <rect x={38} y={-262} width={22} height={124} rx={10} fill={C.macacaoSomb} {...T} />
    <rect x={-10} y={-284} width={20} height={18} fill="#6b5a4a" {...Tf} />
    {/* cabeça de costas, com boné: não dá para ver o rosto */}
    <ellipse cx={0} cy={-316} rx={33} ry={38} fill="#2a2420" {...T} />
    <path d="M-36,-326 Q0,-372 36,-326 Z" fill="#2f3540" {...T} />
  </g>
);

// ---------- Tela da gravação da câmera ----------
export const TelaGravacao: React.FC<{papel: number; tempo: string; children?: React.ReactNode}> = ({papel, tempo, children}) => (
  <g>
    <rect x={0} y={0} width={540} height={960} fill="#2a2a30" />
    {/* monitor apoiado na mesa da portaria */}
    <rect x={0} y={760} width={540} height={200} fill="#8a5a3a" {...T} />
    <rect x={225} y={700} width={90} height={62} fill="#3a3a40" {...T} />
    <rect x={30} y={200} width={480} height={510} rx={18} fill="#1b1b22" {...T} />
    <defs>
      <filter id="cinza">
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <clipPath id="telaClip">
        <rect x={52} y={222} width={436} height={466} />
      </clipPath>
    </defs>
    <g clipPath="url(#telaClip)">
      <g filter="url(#cinza)" transform="translate(52,222) scale(0.81,0.485) translate(0,0)">
        <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
        <g opacity={papel}>
          <polygon points="80,720 108,685 126,694 98,730" fill="#fff" />
        </g>
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <rect key={i} x={52} y={222 + i * 40} width={436} height={2} fill="#000" opacity={0.25} />
      ))}
      <circle cx={80} cy={252} r={8} fill="#ff3b3b" />
      <text x={96} y={258} fontSize={18} fontWeight="900" fill="#fff" fontFamily="JetBrains Mono, monospace">REC</text>
      <text x={470} y={258} fontSize={18} fontWeight="bold" fill="#fff" textAnchor="end" fontFamily="JetBrains Mono, monospace">{tempo}</text>
      {children}
    </g>
  </g>
);
