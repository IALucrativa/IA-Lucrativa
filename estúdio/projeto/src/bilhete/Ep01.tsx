import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, T} from './cores';
import {Rodnei, Braco} from './Rodnei';
import {Corredor, HallDia, Placar, Porta501, SalaNoite, VisorElevador} from './cenarios';

// Bilhete na Porta · Ep. 1 "O que é meu" (roteiro v2).
// Medo do Rodnei só no rosto: sem tremor no corpo.

const s = (seg: number) => Math.round(seg * 30);

// ---------- peças comuns ----------
const Tela: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 540 960" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5], [1, 0], {extrapolateRight: 'clamp'});
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
const SOLTO_D: Braco = {ombro: -12, cotovelo: 10};
const SEGURA_BILHETE: Braco = {ombro: 20, cotovelo: 100};

// Close de um bilhete, com o texto aparecendo no ritmo da leitura.
const BilheteClose: React.FC<{linhas: string[]; de: number; ate: number; fundo: 'sala' | 'corredor'}> = ({linhas, de, ate, fundo}) => {
  const f = useCurrentFrame();
  const total = linhas.join('').length;
  const letras = Math.floor(interpolate(f, [de, ate], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const flutua = Math.sin(f / 18) * 2;
  let usadas = 0;
  return (
    <Tela>
      <defs>
        <filter id="desfoque">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g filter="url(#desfoque)">
        {fundo === 'sala' ? <SalaNoite papel={0} /> : <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />}
      </g>
      <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.55} />
      <g transform={`translate(0,${flutua}) rotate(-3 270 470)`}>
        <rect x={70} y={300} width={400} height={300} fill={C.papel} {...T} />
        <line x1={70} y1={400} x2={470} y2={400} stroke="#e6dfc8" strokeWidth={2} />
        <line x1={70} y1={500} x2={470} y2={500} stroke="#e6dfc8" strokeWidth={2} />
        {linhas.map((linha, i) => {
          const vis = Math.max(0, Math.min(linha.length, letras - usadas));
          usadas += linha.length;
          return (
            <text key={i} x={100} y={370 + i * 70} fontSize={33} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              {linha.slice(0, vis)}
            </text>
          );
        })}
        {/* mão do Rodnei segurando o papel */}
        <g transform="translate(440,590) rotate(-25)">
          <rect x={-34} y={20} width={68} height={260} rx={30} fill={C.macacao} {...T} />
          <ellipse cx={0} cy={18} rx={42} ry={36} fill={C.pele} {...T} />
          <ellipse cx={-30} cy={-6} rx={14} ry={24} fill={C.pele} transform="rotate(35 -30 -6)" {...T} />
        </g>
      </g>
    </Tela>
  );
};

// ---------- cenas ----------

// 1. Quem é.
const QuemE: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const cartao = spring({frame: f - 8, fps, config: {damping: 14}});
  return (
    <Tela>
      <HallDia avisoColado={false} />
      <Rodnei x={240} y={880} escala={1.15} frame={f} medo={false} boca="aliviada" />
      <g transform={`translate(0,${(1 - cartao) * -120})`} opacity={cartao} fontFamily="Inter, Arial, sans-serif">
        <rect x={110} y={200} width={320} height={86} rx={16} fill={C.hud} opacity={0.92} />
        <text x={270} y={240} fontSize={32} fontWeight="900" textAnchor="middle" fill="#fff">
          RODNEI
        </text>
        <text x={270} y={270} fontSize={17} fontWeight="bold" textAnchor="middle" fill={C.acento}>
          técnico de elevador · térreo
        </text>
      </g>
    </Tela>
  );
};

// 2. O que ele quer: cola o aviso da mudança.
const Aviso: React.FC = () => {
  const f = useCurrentFrame();
  const baixar = interpolate(f, [118, 136], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <HallDia avisoColado />
      <Rodnei
        x={150}
        y={900}
        escala={1.1}
        frame={f}
        bracoD={misturar({ombro: -148, cotovelo: 30}, SOLTO_D, baixar)}
        medo={false}
        boca="aliviada"
        olhar={f < 125 ? [1, -0.6] : [0.3, 0]}
      />
    </Tela>
  );
};

// 3. Às 23h, um papel desliza por baixo da porta.
const Sala: React.FC = () => {
  const f = useCurrentFrame();
  const PAPEL = 45;
  const papel = interpolate(f, [PAPEL, PAPEL + 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const viu = f > PAPEL + 8;
  return (
    <Tela>
      <SalaNoite papel={papel} />
      <Rodnei
        x={225}
        y={905}
        escala={1.1}
        frame={f}
        medo={viu}
        boca={viu ? 'o' : 'fechada'}
        olhar={viu ? [1, 0.6] : [-0.6, 0.3]}
        cabeca={viu ? 4 : 0}
        suor={viu}
      />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

// 4. O primeiro bilhete.
const Bilhete1: React.FC = () => (
  <BilheteClose linhas={['Você não vai embora', 'antes de devolver', 'o que é meu.']} de={9} ate={92} fundo="sala" />
);

// 5. Ele abre a porta; alguém entra no elevador.
const Sombra: React.FC = () => {
  const f = useCurrentFrame();
  const abertura = interpolate(f, [55, 95], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta aberturaElevador={abertura} sombraElevador={0.9} />
      <Rodnei
        x={205}
        y={885}
        frame={f}
        maoD="bilhete"
        bracoD={SEGURA_BILHETE}
        medo
        boca="o"
        olhar={[1, -0.1]}
        cabeca={5}
        suor
      />
    </Tela>
  );
};

// 6. O visor sobe e para no 5.
const Visor: React.FC = () => {
  const f = useCurrentFrame();
  const andar = Math.min(5, 1 + Math.floor(f / 14));
  return (
    <Tela>
      <VisorElevador andar={String(andar)} subindo={andar < 5} />
    </Tela>
  );
};

// 7. A porta do 501.
const Tania: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 130], [1, 1.07]);
  return (
    <Tela>
      <g transform={`translate(0,-80) translate(270,520) scale(${zoom}) translate(-270,-520)`}>
        <Porta501 />
      </g>
      <Etiqueta texto="5º ANDAR" />
    </Tela>
  );
};

// Rodnei segurando o bilhete no corredor.
const RodneiComBilhete: React.FC<{f: number; olhar: [number, number]; boca?: 'o' | 'fechada'}> = ({f, olhar, boca = 'fechada'}) => (
  <Rodnei x={250} y={880} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={olhar} boca={boca} medo />
);

// 8. A dúvida: devolver o quê?
const Duvida: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={f < 55 ? [-0.4, 1] : [0, -0.4]} />
    </Tela>
  );
};

// 9. Quando ele voltou, tinha outro.
const Voltou: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={[-1, 1]} boca="o" />
    </Tela>
  );
};

const Bilhete2: React.FC = () => (
  <BilheteClose linhas={['Se contar pra alguém,', 'eu conto', 'o seu segredo.']} de={6} ate={86} fundo="corredor" />
);

// 10. Placar.
const PERGUNTAS = ['Quem escreve?', 'O que é "meu"?'];
const PlacarCena: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 6, fps, config: {damping: 12}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={[-0.4, 1]} />
      <Placar noite="1/30" chaves={12} entrada={entrada} perguntas={PERGUNTAS} />
    </Tela>
  );
};

// 11. Voto.
const Voto: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 6, fps, config: {damping: 11}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f + 90} olhar={f < 60 ? [-0.4, 1] : [0, 0]} />
      <Placar noite="1/30" chaves={12} entrada={1} perguntas={PERGUNTAS} />
      <g transform={`translate(270,250) scale(${entrada}) translate(-270,-250)`} fontFamily="Inter, Arial, sans-serif">
        <rect x={40} y={150} width={460} height={190} rx={22} fill={C.hud} opacity={0.94} />
        <text x={270} y={190} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          Ele conta pra síndica ou esconde?
        </text>
        <rect x={62} y={212} width={176} height={62} rx={31} fill={C.acento} />
        <text x={150} y={254} fontSize={30} fontWeight="900" textAnchor="middle" fill={C.hud}>
          CONTAR
        </text>
        <text x={270} y={252} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          ou
        </text>
        <rect x={302} y={212} width={176} height={62} rx={31} fill="#fff" />
        <text x={390} y={254} fontSize={28} fontWeight="900" textAnchor="middle" fill={C.hud}>
          ESCONDER
        </text>
        <text x={270} y={316} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.acento}>
          Comente aqui embaixo 👇
        </text>
      </g>
    </Tela>
  );
};

// ---------- linha do tempo (acertada pela narração) ----------
// Cada parte: cena, duração em quadros, trecho da narração [de, até] em segundos do áudio,
// quando a fala começa dentro da cena (s), legendas com os tempos do áudio, e posição da legenda.
// Nos closes dos bilhetes não tem legenda: o texto já está na tela.
type Parte = {
  nome: string;
  Cena: React.FC;
  dur: number;
  fala: [number, number];
  atraso: number;
  legendas: [number, number, string][];
  pos?: 'alto' | 'baixo';
};
export const PARTES: Parte[] = [
  {nome: 'quem', Cena: QuemE, dur: 152, fala: [0, 4.65], atraso: 0.1,
    legendas: [[0, 1.23, 'Esse é o Rodnei.'], [1.74, 2.83, 'Técnico de elevador.'], [3.25, 4.65, 'Mora no térreo deste prédio.']]},
  {nome: 'aviso', Cena: Aviso, dur: 147, fala: [5.27, 9.66], atraso: 0.2,
    legendas: [[5.27, 7.68, 'Daqui a trinta dias, ele vai embora daqui.'], [8.35, 9.66, 'Hoje, colou o aviso.']]},
  {nome: 'sala', Cena: Sala, dur: 125, fala: [10.12, 13.69], atraso: 0.2, pos: 'alto',
    legendas: [[10.12, 13.69, 'Às onze da noite, alguém passou isto por baixo da porta dele.']]},
  {nome: 'bilhete1', Cena: Bilhete1, dur: 106, fala: [14.32, 17.16], atraso: 0.3, legendas: []},
  {nome: 'sombra', Cena: Sombra, dur: 129, fala: [17.86, 21.62], atraso: 0.2,
    legendas: [[17.86, 19.2, 'Quando ele abriu a porta,'], [19.2, 21.62, 'só deu tempo de ver alguém entrando no elevador.']]},
  {nome: 'visor', Cena: Visor, dur: 108, fala: [22.3, 25.28], atraso: 0.1,
    legendas: [[22.3, 23.6, 'O elevador subiu...'], [24.03, 25.28, '...e parou no quinto andar.']]},
  {nome: 'tania', Cena: Tania, dur: 129, fala: [25.91, 29.68], atraso: 0.2,
    legendas: [[25.91, 27.51, 'No quinto andar mora a Tânia.'], [27.85, 29.68, 'Ela se mudou pra cá faz uma semana.']]},
  {nome: 'duvida', Cena: Duvida, dur: 111, fala: [30.25, 33.39], atraso: 0.2,
    legendas: [[30.25, 31.25, 'Devolver o quê?'], [31.55, 33.39, 'O Rodnei nunca pegou nada de ninguém.']]},
  {nome: 'voltou', Cena: Voltou, dur: 63, fala: [33.98, 35.68], atraso: 0.1,
    legendas: [[33.98, 35.68, 'Quando ele voltou, tinha outro.']]},
  {nome: 'bilhete2', Cena: Bilhete2, dur: 99, fala: [36.21, 38.88], atraso: 0.2, legendas: []},
  {nome: 'placar', Cena: PlacarCena, dur: 90, fala: [39.56, 41.83], atraso: 0.3,
    legendas: [[39.56, 41.83, 'Noite um. Faltam vinte e nove.']]},
  {nome: 'voto', Cena: Voto, dur: 179, fala: [42.34, 47.39], atraso: 0.3,
    legendas: [[42.34, 43.71, 'Ele conta pra síndica...'], [44.1, 44.74, '...ou esconde?'], [45.22, 47.39, 'Comente: contar ou esconder.']]},
];

const INICIOS = PARTES.reduce<number[]>((acc, _p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + PARTES[i - 1].dur], []);
export const DURACAO_EP01 = INICIOS[INICIOS.length - 1] + PARTES[PARTES.length - 1].dur;
const inicio = (nome: string) => INICIOS[PARTES.findIndex((p) => p.nome === nome)];

// legenda: [quadro inicial, quadro final, texto, posição em px]
const LEGENDAS: [number, number, string, number][] = PARTES.flatMap((p, i) =>
  p.legendas.map(([a, b, txt]) => {
    const base = INICIOS[i] + s(p.atraso) - s(p.fala[0]);
    return [base + s(a), base + s(b) + 4, txt, p.pos === 'alto' ? 640 : 1640] as [number, number, string, number];
  }),
);

const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const atual = LEGENDAS.find(([a, b]) => f >= a && f < b);
  if (!atual) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: atual[3],
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

// Efeitos pontuais e fundo baixo: [arquivo, quadro em que entra, volume, duração máxima em quadros]
const EFEITOS: [string, number, number, number?][] = [
  ['papel', inicio('aviso') + 10, 0.25],
  ['suspense_longo', inicio('sala'), 0.16, inicio('voto') + 179 - inicio('sala')],
  ['papel', inicio('sala') + 45, 0.55],
  ['papel', inicio('bilhete1') + 2, 0.35],
  ['clique', inicio('sombra') + 2, 0.5],
  ['luz_volta', inicio('sombra') + 60, 0.25],
  ['bip', inicio('visor') + 0, 0.3],
  ['bip', inicio('visor') + 14, 0.3],
  ['bip', inicio('visor') + 28, 0.3],
  ['bip', inicio('visor') + 42, 0.3],
  ['luz_volta', inicio('visor') + 56, 0.35],
  ['impacto', inicio('voltou'), 0.6],
  ['papel', inicio('bilhete2') + 2, 0.35],
  ['uuush', inicio('voto') + 4, 0.3],
];

const Sons: React.FC = () => (
  <>
    {PARTES.map((p, i) => (
      <Sequence key={`fala${i}`} from={INICIOS[i] + s(p.atraso)} durationInFrames={s(p.fala[1] - p.fala[0]) + 6}>
        <Audio src={staticFile('ep01-narracao.mp3')} trimBefore={s(p.fala[0])} />
      </Sequence>
    ))}
    {EFEITOS.map(([arq, em, vol, max], i) => (
      <Sequence key={`efeito${i}`} from={em} durationInFrames={max}>
        <Audio src={staticFile(`sfx/${arq}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);

export const Ep01: React.FC<{semLegenda?: boolean}> = ({semLegenda = false}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {PARTES.map(({nome, Cena, dur}, i) => (
      <Sequence key={nome} from={INICIOS[i]} durationInFrames={dur}>
        <Cena />
        {i > 0 && <Entrada />}
      </Sequence>
    ))}
    {!semLegenda && <Legenda />}
    <Sons />
  </AbsoluteFill>
);
