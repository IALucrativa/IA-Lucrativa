import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, T, Tf} from './cores';
import {Rodnei, MolhoDeChaves, Braco} from './Rodnei';
import {Corredor, ElevadorInterior, HallDia, Placar, Vizinho} from './cenarios';

// Bilhete na Porta · Ep. 1 "O elevador parou" · 56 s a 30 fps.
// Tempos de cada parte do roteiro (em quadros).
export const CENAS = {
  gancho: [0, 95],
  quem: [95, 380],
  problema: [380, 560],
  tentativa1: [560, 800],
  tentativa2: [800, 1010],
  virada: [1010, 1250],
  bilhete: [1250, 1460],
  placar: [1460, 1580],
  voto: [1580, 1745],
} as const;
export const DURACAO_EP01 = 1745;

const s = (seg: number) => Math.round(seg * 30);

// Falas: [início no áudio, fim no áudio, quando entra no vídeo] em segundos,
// com as legendas (tempos relativos ao começo da fala). Sem legenda no bilhete: o texto já está na tela.
type Fala = {de: number; ate: number; em: number; legendas: [number, number, string][]};
const inteira = (txt: string, dur: number): [number, number, string][] => [[0, dur, txt]];
const FALAS: Fala[] = [
  {de: 0.0, ate: 3.3, em: 0.1, legendas: inteira('Para um técnico de elevador, isso deveria ser normal.', 3.3)},
  {de: 3.9, ate: 5.86, em: 3.5, legendas: inteira('Rodnei. Quarenta e um anos.', 1.96)},
  {de: 6.28, ate: 9.0, em: 5.7, legendas: inteira('Conhece todos os prédios da cidade por dentro.', 2.72)},
  {de: 9.55, ate: 10.43, em: 8.6, legendas: inteira('Menos o dele.', 0.88)},
  {de: 11.0, ate: 12.7, em: 9.7, legendas: inteira('Hoje, avisou que vai embora.', 1.7)},
  {de: 13.19, ate: 13.94, em: 11.6, legendas: inteira('Ninguém leu.', 0.9)},
  {
    de: 14.55, ate: 19.3, em: 13.0,
    legendas: [
      [0, 1.1, 'Onze da noite.'],
      [1.4, 3.45, 'O elevador parou entre dois andares.'],
      [3.85, 4.75, 'Com ele dentro.'],
    ],
  },
  {de: 19.8, ate: 21.85, em: 19.2, legendas: inteira('Ele sabe exatamente o que fazer.', 2.05)},
  {de: 22.32, ate: 23.76, em: 22.3, legendas: inteira('O problema é a mão.', 1.6)},
  {de: 24.42, ate: 26.5, em: 27.0, legendas: inteira('Plano B: lanterna na boca.', 2.08)},
  {de: 27.01, ate: 27.6, em: 31.2, legendas: inteira('Funcionou.', 0.8)},
  {de: 27.99, ate: 29.08, em: 32.0, legendas: inteira('Claro que funcionou.', 1.2)},
  {de: 29.49, ate: 31.06, em: 34.2, legendas: inteira('A porta abriu no andar dele.', 1.7)},
  {de: 31.53, ate: 33.26, em: 36.6, legendas: inteira('E alguém tinha chegado primeiro.', 1.9)},
  {de: 33.74, ate: 34.85, em: 42.0, legendas: []},
  {de: 35.19, ate: 36.89, em: 43.5, legendas: []},
  {de: 37.36, ate: 39.31, em: 49.2, legendas: inteira('Faltam vinte e nove noites.', 2.1)},
  {de: 39.75, ate: 41.01, em: 53.0, legendas: inteira('Ele conta para alguém...', 1.3)},
  {de: 41.38, ate: 42.08, em: 54.4, legendas: inteira('...ou esconde?', 0.9)},
  {de: 42.64, ate: 45.0, em: 55.5, legendas: inteira('Comente: contar ou esconder.', 2.5)},
];

const LEGENDAS: [number, number, string][] = FALAS.flatMap((f) =>
  f.legendas.map(([a, b, txt]) => [f.em + a, f.em + b, txt] as [number, number, string]),
);

// Efeitos pontuais e fundo baixo: [arquivo, quando entra (s), volume, duração máxima (s)]
const EFEITOS: [string, number, number, number?][] = [
  ['luz_piscando', 0, 0.35],
  ['zumbido_elevador', 0, 0.1, 3.17],
  ['zumbido_elevador', 12.67, 0.12, 18.2],
  ['chaves_caindo', 23.67, 0.6],
  ['clique', 30.83, 0.7],
  ['luz_volta', 30.9, 0.4],
  ['suspense', 36.5, 0.2],
  ['papel', 41.8, 0.5],
  ['uuush', 52.75, 0.35],
];

const Sons: React.FC = () => (
  <>
    {FALAS.map((f, i) => (
      <Sequence key={`fala${i}`} from={s(f.em)} durationInFrames={s(f.ate - f.de)}>
        <Audio src={staticFile('ep01-narracao.mp3')} trimBefore={s(f.de)} />
      </Sequence>
    ))}
    {EFEITOS.map(([arq, em, vol, max], i) => (
      <Sequence key={`efeito${i}`} from={s(em)} durationInFrames={max ? s(max) : undefined}>
        <Audio src={staticFile(`sfx/${arq}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);

const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const atual = LEGENDAS.find(([a, b]) => f >= s(a) && f < s(b));
  if (!atual) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 1640,
        textAlign: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: 900,
        fontSize: 56,
        lineHeight: 1.15,
        color: '#fff',
        textShadow:
          '0 0 2px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 4px 0 0 #000, -4px 0 0 #000',
      }}
    >
      {atual[2]}
    </div>
  );
};

// Tela em espaço 540×960 desenhada em 1080×1920.
const Tela: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 540 960" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

// Corte com um fade curto vindo do preto.
const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 6], [1, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', opacity: op}} />;
};

const Etiqueta: React.FC<{texto: string}> = ({texto}) => (
  <g fontFamily="Inter, Arial, sans-serif">
    <rect x={18} y={22} width={texto.length * 11 + 34} height={40} rx={20} fill={C.hud} opacity={0.88} />
    <text x={35} y={48} fontSize={18} fontWeight="bold" fill={C.acento}>
      {texto}
    </text>
  </g>
);

const misturar = (a: Braco, b: Braco, t: number): Braco => ({
  ombro: a.ombro + (b.ombro - a.ombro) * t,
  cotovelo: a.cotovelo + (b.cotovelo - a.cotovelo) * t,
});

const BRACO_SOLTO_E: Braco = {ombro: 12, cotovelo: -10};
const BRACO_SOLTO_D: Braco = {ombro: -12, cotovelo: 10};

// Escuro com o rosto iluminado.
const Escuro: React.FC<{op: number; cx: number; cy: number; cor?: string}> = ({op, cx, cy, cor = '#05060c'}) => (
  <g>
    <defs>
      <radialGradient id={`escuro${cx}${cy}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={300}>
        <stop offset="0" stopColor={cor} stopOpacity={0} />
        <stop offset="0.25" stopColor={cor} stopOpacity={op * 0.55} />
        <stop offset="0.6" stopColor={cor} stopOpacity={op} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={540} height={960} fill={`url(#escuro${cx}${cy})`} />
  </g>
);

// 1. Gancho: a luz pisca e apaga.
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const piscadas = [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1];
  const apagado = f < 48 ? piscadas[Math.floor(f / 3) % piscadas.length] : 1;
  return (
    <Tela>
      <ElevadorInterior display="–" />
      <Rodnei x={270} y={1000} escala={1.6} frame={f} olhar={[0, -1]} suor={f > 40} />
      <Escuro op={apagado ? 0.94 : 0.15} cx={270} cy={480} />
    </Tela>
  );
};

// 2. Quem e prazo: de dia, cola o aviso; o vizinho passa sem olhar.
const Quem: React.FC = () => {
  const f = useCurrentFrame();
  const baixar = interpolate(f, [85, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bracoD = misturar({ombro: -148, cotovelo: 30}, BRACO_SOLTO_D, baixar);
  const vx = interpolate(f, [170, 250], [620, 410], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const andando = f < 250;
  const olhandoVizinho = f > 185;
  return (
    <Tela>
      <HallDia avisoColado />
      {f > 170 && <Vizinho x={vx} y={835} escala={1} frame={andando ? f : 0} />}
      <Rodnei
        x={150}
        y={900}
        escala={1.1}
        frame={f}
        bracoD={bracoD}
        medo={false}
        boca={f < 120 ? 'aliviada' : f < 200 ? 'aliviada' : 'fechada'}
        olhar={olhandoVizinho ? [1, 0] : f < 100 ? [1, -0.6] : [0.4, 0]}
        cabeca={olhandoVizinho ? 5 : 0}
      />
      <Etiqueta texto="MAIS CEDO" />
    </Tela>
  );
};

// 3. Problema: 23h, o elevador parou entre dois andares.
const Problema: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <ElevadorInterior display="–" />
      <Rodnei
        x={270}
        y={1000}
        escala={1.6}
        frame={f}
        chavesNaCintura={false}
        maoE="chaves"
        bracoE={{ombro: -20, cotovelo: -90}}
        bracoD={{ombro: 20, cotovelo: 90}}
        tremor={3}
        suor
        olhar={[Math.sin(f / 20) * 0.8, -0.3]}
      />
      <Escuro op={0.6} cx={270} cy={500} cor="#0a1430" />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

// 4. Tentativa 1: abre o painel; a mão treme e as chaves caem.
const Tentativa1: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const QUEDA = 150;
  const caiu = f >= QUEDA;
  const tremor = interpolate(f, [0, QUEDA], [1, 7], {extrapolateRight: 'clamp'});
  const queda = interpolate(f, [QUEDA, QUEDA + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const susto = caiu ? Math.max(0, 1 - spring({frame: f - QUEDA, fps, config: {damping: 8}})) : 0;
  return (
    <Tela>
      <ElevadorInterior display="–" painelAberto />
      <Rodnei
        x={270}
        y={1000}
        escala={1.6}
        frame={f}
        chavesNaCintura={false}
        maoE={caiu ? 'nada' : 'chaves'}
        bracoE={{ombro: 10, cotovelo: -60}}
        bracoD={{ombro: -70, cotovelo: -20}}
        tremor={caiu ? 0 : tremor}
        cabeca={caiu ? 0 : 7}
        olhar={caiu ? [-0.3, 1] : [1, 0]}
        boca={caiu ? 'o' : 'fechada'}
        suor
        pulo={susto * 40}
      />
      {caiu && <MolhoDeChaves x={257} y={760 + queda * 260} r={queda * 160} />}
      <Escuro op={0.5} cx={330} cy={520} cor="#0a1430" />
    </Tela>
  );
};

// 5. Tentativa 2: lanterna na boca, clique, a luz volta.
const Tentativa2: React.FC = () => {
  const f = useCurrentFrame();
  const CLIQUE = 125;
  const voltou = f >= CLIQUE;
  const luz = interpolate(f, [CLIQUE, CLIQUE + 4, CLIQUE + 12], [0.5, 0, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = interpolate(f, [CLIQUE, CLIQUE + 3, CLIQUE + 10], [0, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const relaxar = interpolate(f, [CLIQUE + 30, CLIQUE + 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <ElevadorInterior display={voltou ? 'T' : '–'} painelAberto />
      <Rodnei
        x={270}
        y={1000}
        escala={1.6}
        frame={f}
        chavesNaCintura={false}
        boca={relaxar > 0.5 ? 'aliviada' : 'lanterna'}
        medo={!(relaxar > 0.5)}
        maoD={relaxar > 0.5 ? 'lanterna' : 'nada'}
        lanternaAcesa={relaxar <= 0.5}
        bracoE={misturar({ombro: -25, cotovelo: -65}, BRACO_SOLTO_E, relaxar)}
        bracoD={misturar({ombro: -70, cotovelo: -20}, {ombro: -8, cotovelo: 4}, relaxar)}
        cabeca={relaxar > 0.5 ? 0 : 6}
        olhar={relaxar > 0.5 ? [0, 0] : [1, 0]}
      />
      {luz > 0 && <Escuro op={luz} cx={360} cy={500} cor="#0a1430" />}
      <rect x={0} y={0} width={540} height={960} fill="#fff" opacity={flash} />
    </Tela>
  );
};

// 6. Virada: a porta abre no térreo; o bilhete no chão; a sombra some.
const Virada: React.FC = () => {
  const f = useCurrentFrame();
  const sombra = interpolate(f, [110, 190], [0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <Corredor sombraOp={sombra} bilheteNoChao feixe={false} />
      <ellipse cx={300} cy={470} rx={40} ry={46} fill={C.luz} opacity={0.22} />
      <Rodnei
        x={250}
        y={880}
        frame={f}
        chavesNaCintura={false}
        maoE="chaves"
        maoD="lanterna"
        bracoD={{ombro: -40, cotovelo: -153}}
        olhar={[1, -1]}
        tremor={2}
        suor
      />
    </Tela>
  );
};

// 7. O bilhete, de perto.
const FRASE = ['Eu parei o elevador.', 'Queria ver se você', 'ia ter coragem.'];
const Bilhete: React.FC = () => {
  const f = useCurrentFrame();
  const total = FRASE.join('').length;
  const letras = Math.floor(interpolate(f, [10, 43, 55, 106], [0, FRASE[0].length, FRASE[0].length, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const tx = Math.sin(f * 1.9) * 2.5;
  const ty = Math.cos(f * 2.3) * 2;
  let usadas = 0;
  return (
    <Tela>
      <g filter="url(#desfoque)">
        <defs>
          <filter id="desfoque">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      </g>
      <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.55} />
      <g transform={`translate(${tx},${ty}) rotate(-3 270 470)`}>
        {/* papel */}
        <rect x={80} y={300} width={380} height={300} fill={C.papel} {...T} />
        <line x1={80} y1={400} x2={460} y2={400} stroke="#e6dfc8" strokeWidth={2} />
        <line x1={80} y1={500} x2={460} y2={500} stroke="#e6dfc8" strokeWidth={2} />
        {FRASE.map((linha, i) => {
          const vis = Math.max(0, Math.min(linha.length, letras - usadas));
          usadas += linha.length;
          return (
            <text key={i} x={110} y={370 + i * 70} fontSize={34} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              {linha.slice(0, vis)}
            </text>
          );
        })}
        {/* mão do Rodnei segurando o papel (manga do macacão vindo de baixo) */}
        <g transform="translate(430,590) rotate(-25)">
          <rect x={-34} y={20} width={68} height={260} rx={30} fill={C.macacao} {...T} />
          <ellipse cx={0} cy={18} rx={42} ry={36} fill={C.pele} {...T} />
          <ellipse cx={-30} cy={-6} rx={14} ry={24} fill={C.pele} transform="rotate(35 -30 -6)" {...T} />
        </g>
      </g>
    </Tela>
  );
};

// Rodnei segurando o bilhete no corredor (partes 8 e 9).
const RodneiComBilhete: React.FC<{f: number; olhar: [number, number]}> = ({f, olhar}) => (
  <Rodnei
    x={250}
    y={880}
    frame={f}
    chavesNaCintura={false}
    maoE="chaves"
    maoD="bilhete"
    bracoD={{ombro: 20, cotovelo: 100}}
    olhar={olhar}
    tremor={1.5}
    suor
  />
);

// 8. Placar.
const PlacarCena: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 8, fps, config: {damping: 12}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <RodneiComBilhete f={f} olhar={[-0.4, 1]} />
      <Placar noite="1/30" chaves={12} entrada={entrada} />
    </Tela>
  );
};

// 9. Voto.
const Voto: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 6, fps, config: {damping: 11}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <RodneiComBilhete f={f + 120} olhar={f < 55 ? [-0.4, 1] : [-1, 0]} />
      <Placar noite="1/30" chaves={12} entrada={1} />
      <g transform={`translate(270,215) scale(${entrada}) translate(-270,-215)`} fontFamily="Inter, Arial, sans-serif">
        <rect x={40} y={120} width={460} height={190} rx={22} fill={C.hud} opacity={0.94} />
        <text x={270} y={160} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          Ele conta para alguém ou esconde?
        </text>
        <rect x={62} y={182} width={176} height={62} rx={31} fill={C.acento} />
        <text x={150} y={224} fontSize={30} fontWeight="900" textAnchor="middle" fill={C.hud}>
          CONTAR
        </text>
        <text x={270} y={222} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          ou
        </text>
        <rect x={302} y={182} width={176} height={62} rx={31} fill="#fff" />
        <text x={390} y={224} fontSize={28} fontWeight="900" textAnchor="middle" fill={C.hud}>
          ESCONDER
        </text>
        <text x={270} y={286} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.acento}>
          Comente aqui embaixo 👇
        </text>
      </g>
    </Tela>
  );
};

const PARTES: [keyof typeof CENAS, React.FC][] = [
  ['gancho', Gancho],
  ['quem', Quem],
  ['problema', Problema],
  ['tentativa1', Tentativa1],
  ['tentativa2', Tentativa2],
  ['virada', Virada],
  ['bilhete', Bilhete],
  ['placar', PlacarCena],
  ['voto', Voto],
];

export const Ep01: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {PARTES.map(([nome, Cena]) => {
      const [de, ate] = CENAS[nome];
      return (
        <Sequence key={nome} from={de} durationInFrames={ate - de}>
          <Cena />
          {nome !== 'gancho' && <Entrada />}
        </Sequence>
      );
    })}
    <Legenda />
    <Sons />
  </AbsoluteFill>
);
