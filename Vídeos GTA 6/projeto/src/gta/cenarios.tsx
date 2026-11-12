import React from 'react';
import {C, F, T, Tf} from './cores';
import {Boneco, KAIQUE, KAIQUE_2018, WESLEY, WESLEY_2018} from './Kaique';

// Cenários do Corre Pro GTA 6 (desenho 540×960, estilo A).
// Nada do jogo aparece: o videogame é genérico e a TV fica desligada.

// ---------- fumaça, fogo e faíscas ----------
export const Fumaca: React.FC<{x: number; y: number; frame: number; forca?: number}> = ({x, y, frame, forca = 1}) => {
  const bolas = [0, 1, 2, 3, 4, 5];
  return (
    <g fill={C.fumaca} {...Tf} opacity={0.92}>
      {bolas.map((i) => {
        const t = ((frame * 0.9 + i * 22) % 132) / 132; // 0..1 subindo
        const r = (14 + t * 22) * forca;
        const cx = x + Math.sin(t * 6 + i) * 14 * forca;
        const cy = y - t * 170 * forca;
        return <circle key={i} cx={cx} cy={cy} r={r} opacity={1 - t * 0.7} />;
      })}
    </g>
  );
};

export const Fogo: React.FC<{x: number; y: number; frame: number; escala?: number}> = ({x, y, frame, escala = 1}) => {
  const b = Math.sin(frame / 2.2) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <path d={`M-10,0 Q-16,-22 -4,-${36 + b} Q-2,-20 6,-${28 - b} Q12,-14 8,0 Z`} fill={C.fogo} {...Tf} />
      <path d={`M-6,0 Q-8,-14 -1,-${22 + b / 2} Q2,-10 4,0 Z`} fill={C.faisca} />
    </g>
  );
};

const Estrela: React.FC<{x: number; y: number; r: number; on: boolean}> = ({x, y, r, on}) =>
  on ? (
    <path
      transform={`translate(${x},${y}) scale(${r})`}
      d="M0,-10 l3,7 l8,0 l-6,5 l2,8 l-7,-4 l-7,4 l2,-8 l-6,-5 l8,0 Z"
      fill={C.faisca}
      {...Tf}
    />
  ) : null;

export const Faiscas: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => (
  <g>
    <Estrela x={x - 48} y={y - 22} r={1.1} on={frame % 9 < 5} />
    <Estrela x={x + 40} y={y - 40} r={0.8} on={frame % 7 > 2} />
    <Estrela x={x - 20} y={y - 56} r={0.6} on={frame % 11 > 5} />
  </g>
);

// ---------- o videogame genérico ----------
export const Videogame: React.FC<{x: number; y: number; escala?: number}> = ({x, y, escala = 1}) => (
  <g transform={`translate(${x},${y}) scale(${escala})`}>
    <rect x={-39} y={-15} width={78} height={30} rx={7} fill={C.console} {...T} />
    <rect x={-31} y={-3} width={34} height={5} rx={2} fill={C.consoleDet} />
    <circle cx={27} cy={0} r={4} fill={C.vermelho} />
  </g>
);

// Close embaixo do videogame: a etiqueta gasta "W." (semente do Ep. 1).
export const EtiquetaW: React.FC<{frame: number; zoom?: number}> = ({frame, zoom = 1}) => (
  <g transform={`translate(270,480) scale(${zoom}) translate(-270,-480)`}>
    <rect x={0} y={0} width={540} height={960} fill={C.movelDet} />
    <rect x={40} y={330} width={460} height={300} rx={40} fill={C.console} {...T} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={110 + i * 56} y={380} width={30} height={90} rx={8} fill={C.consoleDet} opacity={0.6} />
    ))}
    <g transform="rotate(-6 300 540)">
      <rect x={220} y={500} width={170} height={84} rx={8} fill="#f4ecd0" {...T} />
      <text x={305} y={566} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={58} fill={C.tinta} opacity={0.75}>
        W.
      </text>
      <path d="M232 510 L262 504 M360 580 L384 572" stroke="#d9cfae" strokeWidth={6} />
    </g>
    <circle cx={270} cy={480} r={330} fill="none" stroke="#000" strokeWidth={300} opacity={0.35 + Math.sin(frame / 10) * 0.02} />
  </g>
);

// ---------- o quarto do Kaique ----------
export const Quarto: React.FC<{frame: number; fumaca?: number; fogo?: boolean; brilho?: number; semVideogame?: boolean}> = ({
  frame,
  semVideogame = false,
  fumaca = 1,
  fogo = true,
  brilho = 0.3,
}) => {
  const predios: [number, number, number, number][] = [
    [338, 300, 30, 80],
    [370, 270, 28, 110],
    [400, 315, 34, 65],
    [436, 285, 26, 95],
    [464, 310, 18, 70],
  ];
  const janelas: React.ReactNode[] = [];
  predios.forEach(([x, y, w, h], i) => {
    for (let yy = y + 10; yy < y + h - 6; yy += 16)
      for (let xx = x + 6; xx < x + w - 6; xx += 10)
        if ((xx * 7 + yy * 3 + i) % 3 !== 0) janelas.push(<rect key={`${xx}-${yy}`} x={xx} y={yy} width={5} height={7} fill={C.janelaLuz} opacity={0.85} />);
  });
  const pisca = fogo ? 0.85 + Math.sin(frame / 3) * 0.15 : 0;
  return (
    <g>
      <defs>
        <radialGradient id="brilhoFogo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.fogo} stopOpacity={brilho * pisca} />
          <stop offset="1" stopColor={C.fogo} stopOpacity={0} />
        </radialGradient>
        <clipPath id="vistaQuarto">
          <rect x={334} y={212} width={142} height={168} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={540} height={650} fill={C.parede} />
      <rect x={0} y={0} width={540} height={90} fill={C.paredeSomb} />
      <rect x={0} y={650} width={540} height={310} fill={C.chao} />
      <g stroke={C.chaoLinha} strokeWidth={3}>
        <line x1={0} y1={700} x2={540} y2={700} />
        <line x1={0} y1={770} x2={540} y2={770} />
        <line x1={0} y1={855} x2={540} y2={855} />
        <line x1={120} y1={650} x2={120} y2={700} />
        <line x1={330} y1={650} x2={330} y2={700} />
        <line x1={220} y1={700} x2={220} y2={770} />
        <line x1={460} y1={700} x2={460} y2={770} />
        <line x1={90} y1={770} x2={90} y2={855} />
        <line x1={380} y1={770} x2={380} y2={855} />
        <line x1={250} y1={855} x2={250} y2={960} />
      </g>
      <rect x={0} y={638} width={540} height={14} fill={C.rodape} {...Tf} />
      <ellipse cx={330} cy={900} rx={190} ry={44} fill={C.tapete} {...Tf} />
      <ellipse cx={330} cy={900} rx={160} ry={32} fill="none" stroke={C.papel} strokeWidth={3} strokeDasharray="8 7" opacity={0.6} />

      {/* janela */}
      <rect x={326} y={204} width={158} height={184} rx={4} fill={C.movel} {...T} />
      <g clipPath="url(#vistaQuarto)">
        <rect x={334} y={212} width={142} height={168} fill={C.ceu} />
        <circle cx={448} cy={242} r={13} fill={C.lua} />
        {predios.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={C.predio} />
        ))}
        {janelas}
      </g>
      <line x1={405} y1={212} x2={405} y2={380} stroke={C.movel} strokeWidth={7} />
      <line x1={334} y1={296} x2={476} y2={296} stroke={C.movel} strokeWidth={7} />
      <rect x={318} y={384} width={174} height={12} rx={3} fill={C.movelDet} {...Tf} />

      {/* pôster da contagem (semente: um risco a mais por episódio) */}
      <g transform="rotate(-3 130 280)">
        <rect x={52} y={176} width={160} height={210} fill={C.papel} {...T} />
        <rect x={112} y={168} width={40} height={14} fill="#f3e3a0" opacity={0.85} transform="rotate(4 132 175)" />
        <text x={132} y={208} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={15} fill={C.tinta}>
          CONTAGEM
        </text>
        <text x={132} y={228} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={15} fill={C.tinta}>
          PRO GTA 6
        </text>
        <text x={132} y={252} textAnchor="middle" fontFamily={F} fontSize={13} fill={C.tinta} opacity={0.7}>
          9 10 11 12
        </text>
        <line x1={100} y1={248} x2={164} y2={248} stroke={C.vermelho} strokeWidth={2.5} />
        {[13, 14, 15, 16, 17, 18].map((d, i) => (
          <text key={d} x={78 + (i % 3) * 54} y={282 + Math.floor(i / 3) * 34} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={22} fill={C.tinta}>
            {d}
          </text>
        ))}
        <text x={132} y={366} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={30} fill={C.vermelho}>
          19/11
        </text>
        <ellipse cx={132} cy={356} rx={52} ry={22} fill="none" stroke={C.vermelho} strokeWidth={3} />
      </g>

      {/* prateleira com a lata do dinheiro */}
      <rect x={330} y={456} width={160} height={12} fill={C.movel} {...Tf} />
      <path d="M345 468 L345 486 L360 468 Z" fill={C.movelDet} {...Tf} />
      <path d="M475 468 L475 486 L460 468 Z" fill={C.movelDet} {...Tf} />
      <rect x={350} y={404} width={44} height={52} rx={4} fill="#c98a2a" {...Tf} />
      <rect x={350} y={418} width={44} height={22} fill={C.papel} {...Tf} />
      <text x={372} y={428} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={7.5} fill={C.tinta}>
        NÃO
      </text>
      <text x={372} y={437} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={7.5} fill={C.tinta}>
        MEXER
      </text>
      <rect x={406} y={426} width={22} height={30} rx={3} fill={C.bone} {...Tf} />
      <circle cx={417} cy={420} r={9} fill={C.pele} {...Tf} />
      <rect x={440} y={434} width={38} height={22} rx={3} fill={C.consoleDet} {...Tf} />
      <rect x={446} y={430} width={26} height={6} rx={2} fill={C.console} {...Tf} />

      {/* rack, TV desligada e o videogame */}
      <rect x={24} y={590} width={290} height={130} rx={4} fill={C.movel} {...T} />
      <rect x={38} y={640} width={122} height={66} rx={3} fill={C.movelDet} {...Tf} />
      <rect x={176} y={640} width={122} height={66} rx={3} fill={C.movelDet} {...Tf} />
      <circle cx={148} cy={673} r={4} fill={C.consoleDet} />
      <circle cx={188} cy={673} r={4} fill={C.consoleDet} />
      <rect x={36} y={720} width={14} height={14} fill={C.movelDet} {...Tf} />
      <rect x={288} y={720} width={14} height={14} fill={C.movelDet} {...Tf} />
      <rect x={104} y={568} width={40} height={22} fill={C.tvBorda} {...Tf} />
      <rect x={34} y={440} width={180} height={128} rx={6} fill={C.tvBorda} {...T} />
      <rect x={44} y={450} width={160} height={108} rx={3} fill={C.tv} />
      <path d="M54 458 L96 458 L62 540 L54 540 Z" fill="#fff" opacity={0.12} />
      <circle cx={262} cy={560} r={150} fill="url(#brilhoFogo)" />
      {!semVideogame && <Videogame x={261} y={575} />}
      {!semVideogame && <path d="M300 584 Q318 600 310 622 T322 640" fill="none" stroke={C.tinta} strokeWidth={3} />}
      {fogo && <Fogo x={278} y={562} frame={frame} />}
      {fumaca > 0 && <Fumaca x={266} y={540} frame={frame} forca={fumaca} />}
      {fogo && <Faiscas x={262} y={560} frame={frame} />}

      {/* baú de entrega e capacete */}
      <rect x={26} y={770} width={104} height={96} rx={8} fill={C.bau} {...T} />
      <rect x={26} y={770} width={104} height={20} rx={6} fill={C.bauDet} {...Tf} />
      <text x={78} y={834} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={14} fill="#fff">
        ENTREGAS
      </text>
      <path d="M146 866 Q146 820 186 818 Q226 820 226 866 Z" fill={C.tenis} {...T} />
      <path d="M152 846 L220 846" stroke={C.vermelho} strokeWidth={6} />
      <rect x={196} y={832} width={30} height={20} rx={4} fill={C.tv} opacity={0.85} />
    </g>
  );
};

// ---------- a rua (de moto até a assistência) ----------
export const Rua: React.FC<{frame: number; andar?: number; semaforo?: 'amarelo' | 'vermelho' | 'verde'; ciclistaX?: number}> = ({
  frame,
  andar = 0,
  semaforo = 'amarelo',
  ciclistaX = -200,
}) => {
  const desl = -(andar % 540);
  const predios = [
    [0, 330, 110, '#5b4a7a'],
    [110, 280, 120, '#6a5a8c'],
    [230, 350, 100, '#4f416d'],
    [330, 300, 110, '#6a5a8c'],
    [440, 340, 100, '#5b4a7a'],
  ] as const;
  return (
    <g>
      <defs>
        <linearGradient id="ceuRua" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2a5c" />
          <stop offset="1" stopColor="#f08a4b" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={540} height={620} fill="url(#ceuRua)" />
      {[0, 540].map((ox) => (
        <g key={ox} transform={`translate(${desl + ox},0)`}>
          {predios.map(([x, y, w, cor], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={620 - y} fill={cor} {...Tf} />
              {[0, 1, 2, 3, 4, 5, 6].map((r) =>
                [0, 1, 2].map((c) => (
                  <rect key={`${r}${c}`} x={x + 16 + c * 32} y={y + 20 + r * 40} width={16} height={22} fill={(r + c + i) % 3 === 0 ? C.janelaLuz : '#3a3058'} />
                )),
              )}
            </g>
          ))}
          <rect x={60} y={560} width={120} height={60} fill="#3a3058" {...Tf} />
          <text x={120} y={596} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={14} fill={C.acento}>
            PADARIA
          </text>
        </g>
      ))}
      {/* calçada e rua */}
      <rect x={0} y={620} width={540} height={50} fill="#a39a92" {...Tf} />
      <rect x={0} y={670} width={540} height={290} fill="#3b3b44" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={((i * 140 + desl * 1.4) % 700) + (desl * 1.4 < 0 ? 700 : 0) - 160} y={800} width={80} height={12} fill="#f2f2f2" />
      ))}
      {/* semáforo */}
      <rect x={470} y={360} width={10} height={260} fill="#2a2a31" {...Tf} />
      <rect x={452} y={300} width={46} height={110} rx={8} fill="#2a2a31" {...T} />
      <circle cx={475} cy={322} r={12} fill={semaforo === 'vermelho' ? '#ff3b30' : '#4a2020'} />
      <circle cx={475} cy={355} r={12} fill={semaforo === 'amarelo' ? '#ffcc00' : '#4a4020'} />
      <circle cx={475} cy={388} r={12} fill={semaforo === 'verde' ? '#3ccf6e' : '#1f3a26'} />
      {/* ciclista que ultrapassa */}
      <g transform={`translate(${ciclistaX},760)`}>
        <circle cx={-30} cy={40} r={24} fill="none" stroke="#111" strokeWidth={5} />
        <circle cx={40} cy={40} r={24} fill="none" stroke="#111" strokeWidth={5} />
        <path d="M-30,40 L0,0 L40,40 M0,0 L-6,-20 M0,0 L30,-6" stroke="#e0322b" strokeWidth={5} fill="none" />
        <circle cx={-2} cy={-64} r={14} fill="#c98a5e" {...Tf} />
        <path d="M-2,-50 L-6,-20 L10,10" stroke="#2f7dff" strokeWidth={14} strokeLinecap="round" fill="none" />
        <path d="M-2,-46 L26,-10" stroke="#2f7dff" strokeWidth={9} strokeLinecap="round" />
        <path d="M-16,-72 Q-2,-90 14,-72 Z" fill="#ffd23f" {...Tf} />
      </g>
    </g>
  );
};

// A moto de entrega com o Kaique (de lado, olhando para a direita).
export const Moto: React.FC<{x: number; y: number; frame: number; tremido?: number}> = ({x, y, frame, tremido = 0}) => {
  const t = Math.sin(frame * 1.7) * tremido;
  return (
    <g transform={`translate(${x},${y + t})`}>
      {/* Kaique sentado (pernas escondidas pela moto) */}
      <Boneco
        x={-10}
        y={52}
        frame={frame}
        escala={0.78}
        visual={KAIQUE}
        semPernas
        capacete
        bracoE={{ombro: -60, cotovelo: -30}}
        bracoD={{ombro: -70, cotovelo: -20}}
        olhar={[1, 0]}
        boca="fechada"
      />
      {/* baú preso na garupa */}
      <rect x={-136} y={-104} width={74} height={70} rx={8} fill={C.bau} {...T} />
      <rect x={-136} y={-104} width={74} height={14} rx={6} fill={C.bauDet} {...Tf} />
      {/* a moto */}
      <circle cx={-90} cy={30} r={40} fill="#1f1f24" {...T} />
      <circle cx={-90} cy={30} r={16} fill="#9aa0aa" {...Tf} />
      <circle cx={110} cy={30} r={40} fill="#1f1f24" {...T} />
      <circle cx={110} cy={30} r={16} fill="#9aa0aa" {...Tf} />
      <path d="M-120,-10 L-40,-30 L60,-30 L120,-4 L96,20 L-70,20 Z" fill="#d8342b" {...T} />
      <path d="M-60,-40 L30,-40 L40,-28 L-70,-28 Z" fill="#1f1f24" {...Tf} />
      <path d="M90,-30 L110,-90 L130,-92" fill="none" stroke="#2a2a31" strokeWidth={8} strokeLinecap="round" />
      <circle cx={122} cy={-60} r={10} fill="#fff6c0" {...Tf} />
      {/* o videogame amarrado em cima do baú, com cuidado */}
      <rect x={-130} y={-126} width={62} height={22} rx={6} fill={C.console} {...Tf} />
      <path d="M-122,-126 L-122,-90 M-76,-126 L-76,-90" stroke="#e0322b" strokeWidth={3} />
    </g>
  );
};

// ---------- a Assistência do Josué ----------
export const Josue: React.FC<{frame: number; cheirando?: boolean; segurando?: 'nada' | 'videogame' | 'virado'}> = ({
  frame,
  cheirando = false,
  segurando = 'nada',
}) => {
  const fungada = cheirando ? Math.sin(frame / 3) * 3 : 0;
  return (
    <g>
      {/* corpo atrás do balcão */}
      <path d="M190,640 Q270,600 350,640 L360,700 L180,700 Z" fill="#7a5a3a" {...T} />
      <path d="M250,612 L270,650 L290,612" fill="#f2e6cf" {...Tf} />
      <rect x={258} y={560} width={24} height={50} fill="#c99a76" {...Tf} />
      <g transform={`translate(0,${fungada})`}>
        <ellipse cx={270} cy={530} rx={40} ry={46} fill="#d9a882" {...T} />
        <path d="M232,518 Q226,486 246,480 L248,512 Z" fill="#d6d6d6" {...Tf} />
        <path d="M308,518 Q314,486 294,480 L292,512 Z" fill="#d6d6d6" {...Tf} />
        {/* óculos de lupa na testa */}
        <rect x={238} y={486} width={64} height={18} rx={9} fill="#2a2a31" {...Tf} />
        <circle cx={256} cy={495} r={8} fill="#9fd8ff" {...Tf} />
        <circle cx={284} cy={495} r={8} fill="#9fd8ff" {...Tf} />
        <circle cx={256} cy={526} r={4} fill="#111" />
        <circle cx={284} cy={526} r={4} fill="#111" />
        <path d="M270,530 Q262,546 272,548" fill="none" stroke="#b07f5c" strokeWidth={3} strokeLinecap="round" />
        <path d="M248,556 Q270,546 292,556 Q282,566 270,560 Q258,566 248,556 Z" fill="#d6d6d6" {...Tf} />
      </g>
      {/* braços e o que ele segura */}
      {segurando === 'nada' && (
        <>
          <rect x={196} y={640} width={26} height={60} rx={12} fill="#7a5a3a" {...T} />
          <rect x={318} y={640} width={26} height={60} rx={12} fill="#7a5a3a" {...T} />
        </>
      )}
      {segurando !== 'nada' && (
        <g>
          <path d={`M200,650 Q210,600 236,${cheirando ? 590 : 610}`} stroke="#7a5a3a" strokeWidth={24} strokeLinecap="round" fill="none" />
          <path d={`M340,650 Q330,600 304,${cheirando ? 590 : 610}`} stroke="#7a5a3a" strokeWidth={24} strokeLinecap="round" fill="none" />
          <g transform={`translate(270,${cheirando ? 580 : 600})`}>
            {segurando === 'videogame' ? (
              <Videogame x={0} y={0} escala={1.1} />
            ) : (
              <g>
                <rect x={-43} y={-16} width={86} height={32} rx={8} fill={C.console} {...T} />
                <rect x={-10} y={-10} width={28} height={18} rx={3} fill="#f4ecd0" {...Tf} />
                <text x={4} y={4} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={12} fill={C.tinta} opacity={0.75}>
                  W.
                </text>
              </g>
            )}
            <circle cx={-36} cy={6} r={11} fill="#d9a882" {...Tf} />
            <circle cx={36} cy={6} r={11} fill="#d9a882" {...Tf} />
          </g>
        </g>
      )}
    </g>
  );
};

export const Assistencia: React.FC<{frame: number; cheirando?: boolean; segurando?: 'nada' | 'videogame' | 'virado'; preco?: number}> = ({
  frame,
  cheirando,
  segurando = 'nada',
  preco = 0,
}) => (
  <g>
    <rect x={0} y={0} width={540} height={960} fill="#3f7a78" />
    <rect x={0} y={0} width={540} height={70} fill="#356866" />
    {/* prateleiras com aparelhos abertos */}
    {[180, 300].map((py) => (
      <g key={py}>
        <rect x={20} y={py} width={500} height={10} fill={C.movel} {...Tf} />
        <rect x={40} y={py - 46} width={60} height={46} rx={4} fill="#2a2a31" {...Tf} />
        <rect x={46} y={py - 40} width={48} height={30} fill="#5b6b7a" />
        <rect x={120} y={py - 30} width={50} height={30} rx={4} fill="#c9c9cf" {...Tf} />
        <rect x={190} y={py - 56} width={40} height={56} rx={6} fill="#8a6a4a" {...Tf} />
        <circle cx={210} cy={py - 30} r={12} fill="#2a2a31" />
        <rect x={380} y={py - 38} width={90} height={38} rx={4} fill="#d9dbe0" {...Tf} />
        <rect x={392} y={py - 30} width={40} height={6} fill="#9aa0aa" />
      </g>
    ))}
    {/* placa */}
    <g transform="rotate(2 400 380)">
      <rect x={310} y={340} width={200} height={70} rx={6} fill={C.papel} {...T} />
      <text x={410} y={370} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={15} fill={C.vermelho}>
        NÃO FAZEMOS MILAGRE
      </text>
      <text x={410} y={394} textAnchor="middle" fontFamily={F} fontWeight="bold" fontSize={14} fill={C.tinta}>
        (MAS TENTAMOS)
      </text>
    </g>
    {/* rádio de pilha */}
    <rect x={40} y={360} width={90} height={50} rx={8} fill="#c4473a" {...T} />
    <circle cx={68} cy={385} r={14} fill="#2a2a31" />
    <rect x={92} y={372} width={28} height={8} fill="#2a2a31" />
    <line x1={120} y1={360} x2={140} y2={318} stroke="#2a2a31" strokeWidth={3} />
    <Josue frame={frame} cheirando={cheirando} segurando={segurando} />
    {/* balcão */}
    <rect x={0} y={690} width={540} height={270} fill="#8a5a3c" {...T} />
    <rect x={0} y={690} width={540} height={24} fill="#a06b48" {...T} />
    <text x={270} y={800} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={30} fill={C.papel} opacity={0.9}>
      ASSISTÊNCIA DO JOSUÉ
    </text>
    {/* etiqueta de preço */}
    {preco > 0 && (
      <g transform={`translate(400,610) scale(${preco}) rotate(-8)`}>
        <path d="M-70,-30 L60,-30 L80,0 L60,30 L-70,30 Z" fill={C.acento} {...T} />
        <circle cx={58} cy={0} r={6} fill="#fff" {...Tf} />
        <text x={-4} y={12} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={34} fill={C.tinta}>
          R$ 480
        </text>
      </g>
    )}
  </g>
);

// ---------- flashback de 2018 ----------
export const Flashback: React.FC<{frame: number; aperto?: number}> = ({frame, aperto = 0}) => (
  <g>
    <defs>
      <filter id="sepia">
        <feColorMatrix type="matrix" values="0.45 0.6 0.15 0 0.04  0.38 0.55 0.13 0 0.02  0.28 0.42 0.1 0 0  0 0 0 1 0" />
      </filter>
    </defs>
    <g filter="url(#sepia)">
      <rect x={0} y={0} width={540} height={960} fill="#e7d7b5" />
      <rect x={0} y={0} width={540} height={600} fill="#cfa86e" />
      <rect x={380} y={120} width={120} height={160} fill="#9fd0e8" {...T} />
      <line x1={440} y1={120} x2={440} y2={280} stroke={C.linha} strokeWidth={3} />
      <Boneco x={150} y={820} frame={frame} escala={0.82} visual={KAIQUE_2018} bracoD={{ombro: -70 + aperto * 4, cotovelo: -20}} boca="sorriso" olhar={[1, 0]} />
      <Boneco x={390} y={820} frame={frame} escala={0.86} visual={WESLEY_2018} bracoE={{ombro: 70 - aperto * 4, cotovelo: 20}} boca="convencido" olhar={[-1, 0]} />
      {/* mesa com o guardanapo */}
      <rect x={60} y={700} width={420} height={30} fill="#8a5a3c" {...T} />
      <rect x={80} y={730} width={20} height={200} fill="#6b4630" {...Tf} />
      <rect x={440} y={730} width={20} height={200} fill="#6b4630" {...Tf} />
    </g>
    {/* o guardanapo em close, por cima (legível) */}
    <g transform="translate(270,330) rotate(-4)">
      <rect x={-200} y={-90} width={400} height={180} fill="#fffdf6" {...T} />
      <path d="M-200,-60 L200,-60 M-200,60 L200,60" stroke="#e9e2cf" strokeWidth={3} />
      <text x={0} y={-24} textAnchor="middle" fontFamily="'DejaVu Serif', serif" fontStyle="italic" fontWeight="bold" fontSize={22} fill="#1f2a5a">
        QUEM JOGAR O GTA 6
      </text>
      <text x={0} y={8} textAnchor="middle" fontFamily="'DejaVu Serif', serif" fontStyle="italic" fontWeight="bold" fontSize={22} fill="#1f2a5a">
        PRIMEIRO GANHA.
      </text>
      <text x={0} y={42} textAnchor="middle" fontFamily="'DejaVu Serif', serif" fontStyle="italic" fontSize={17} fill="#1f2a5a">
        quem perde usa a camiseta.
      </text>
      <text x={150} y={78} textAnchor="middle" fontFamily="'DejaVu Serif', serif" fontStyle="italic" fontSize={14} fill="#1f2a5a">
        K. e W.
      </text>
    </g>
    <g fontFamily={F} fontWeight="900">
      <rect x={20} y={40} width={130} height={56} rx={10} fill="#000" opacity={0.75} />
      <text x={85} y={80} textAnchor="middle" fontSize={34} fill={C.acento}>
        2018
      </text>
    </g>
  </g>
);

// ---------- tela do celular ----------
export const Celular: React.FC<{frame: number; tipo: 'story' | 'mensagem'; letras?: number; fundo?: React.ReactNode}> = ({
  frame,
  tipo,
  letras = 999,
  fundo,
}) => {
  const msg = 'Primo, amanhã eu passo aí pra buscar o MEU videogame.';
  const vis = msg.slice(0, letras);
  const vibra = tipo === 'mensagem' && frame < 20 ? Math.sin(frame * 3) * 4 : 0;
  return (
    <g>
      {fundo ?? <rect x={0} y={0} width={540} height={960} fill="#2a2440" />}
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.45} />
      <g transform={`translate(${vibra},0) rotate(-3 270 480)`}>
        {/* mão */}
        <ellipse cx={420} cy={800} rx={70} ry={110} fill={C.pele} {...T} />
        <rect x={120} y={140} width={300} height={600} rx={36} fill="#1f1f24" {...T} />
        <rect x={134} y={160} width={272} height={560} rx={24} fill={tipo === 'story' ? '#7b4bd1' : '#ece5dd'} />
        <ellipse cx={360} cy={690} rx={60} ry={40} fill={C.pele} {...T} />
        {tipo === 'story' ? (
          <g>
            <rect x={146} y={172} width={248} height={5} rx={2} fill="#fff" opacity={0.5} />
            <rect x={146} y={172} width={Math.min(248, frame * 4)} height={5} rx={2} fill="#fff" />
            <circle cx={164} cy={200} r={14} fill="#c98a5e" {...Tf} />
            <text x={186} y={206} fontFamily={F} fontWeight="bold" fontSize={16} fill="#fff">
              wesley.turbo
            </text>
            {/* selfie do Wesley */}
            <Boneco x={270} y={720} frame={frame} escala={1.05} visual={WESLEY} semPernas boca="convencido" bracoD={{ombro: -150, cotovelo: -20}} />
            <g transform="rotate(-6 270 300)">
              <rect x={150} y={250} width={240} height={96} rx={14} fill="#fff" {...T} />
              <text x={270} y={286} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={22} fill="#111">
                PRÉ-VENDA
              </text>
              <text x={270} y={320} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={22} fill="#3ccf6e">
                GARANTIDA ✓
              </text>
            </g>
          </g>
        ) : (
          <g>
            <rect x={134} y={160} width={272} height={64} rx={24} fill="#2f6d5e" />
            <circle cx={170} cy={192} r={18} fill="#c98a5e" {...Tf} />
            <text x={198} y={200} fontFamily={F} fontWeight="bold" fontSize={20} fill="#fff">
              Wesley (primo)
            </text>
            <g>
              <rect x={150} y={250} width={236} height={150} rx={14} fill="#fff" {...Tf} />
              {quebrar(vis, 21).map((linha, i) => (
                <text key={i} x={164} y={284 + i * 28} fontFamily={F} fontSize={20} fill="#111">
                  {linha}
                </text>
              ))}
              <text x={372} y={392} textAnchor="end" fontFamily={F} fontSize={12} fill="#888">
                23:47
              </text>
            </g>
          </g>
        )}
      </g>
    </g>
  );
};

const quebrar = (txt: string, max: number) => {
  const linhas: string[] = [];
  let atual = '';
  txt.split(' ').forEach((p) => {
    if ((atual + ' ' + p).trim().length > max) {
      linhas.push(atual.trim());
      atual = p;
    } else atual += ' ' + p;
  });
  if (atual.trim()) linhas.push(atual.trim());
  return linhas;
};
