import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, T} from './cores';
import {Braco} from './Rodnei';

// Peças comuns dos episódios a partir do Ep. 2.

export const s = (seg: number) => Math.round(seg * 30);

export const Tela: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 540 960" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

export const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5], [1, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', opacity: op}} />;
};

export const Etiqueta: React.FC<{texto: string}> = ({texto}) => (
  <g fontFamily="Inter, Arial, sans-serif">
    <rect x={18} y={22} width={texto.length * 11 + 34} height={40} rx={20} fill={C.hud} opacity={0.88} />
    <text x={35} y={48} fontSize={18} fontWeight="bold" fill={C.acento}>
      {texto}
    </text>
  </g>
);

export const misturar = (a: Braco, b: Braco, t: number): Braco => ({
  ombro: a.ombro + (b.ombro - a.ombro) * t,
  cotovelo: a.cotovelo + (b.cotovelo - a.cotovelo) * t,
});
export const SOLTO_E: Braco = {ombro: 12, cotovelo: -10};
export const SOLTO_D: Braco = {ombro: -12, cotovelo: 10};
export const SEGURA_BILHETE: Braco = {ombro: 20, cotovelo: 100};

// "Vocês escolheram: X" no alto da tela (sem porcentagem).
export const Escolheram: React.FC<{opcao: string}> = ({opcao}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const e = spring({frame: f - 4, fps, config: {damping: 12}});
  return (
    <g transform={`translate(270,190) scale(${e}) translate(-270,-190)`} fontFamily="Inter, Arial, sans-serif">
      <rect x={70} y={120} width={400} height={130} rx={20} fill={C.hud} opacity={0.94} {...T} />
      <text x={270} y={165} fontSize={22} fontWeight="900" textAnchor="middle" fill="#fff">
        VOCÊS ESCOLHERAM:
      </text>
      <text x={270} y={225} fontSize={50} fontWeight="900" textAnchor="middle" fill={C.acento}>
        {opcao}
      </text>
    </g>
  );
};

// Cartão "RODNEI · ..." de apresentação.
export const CartaoNome: React.FC<{linha2: string}> = ({linha2}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const c = spring({frame: f - 6, fps, config: {damping: 14}});
  return (
    <g transform={`translate(0,${(1 - c) * -120})`} opacity={c} fontFamily="Inter, Arial, sans-serif">
      <rect x={90} y={120} width={360} height={86} rx={16} fill={C.hud} opacity={0.92} />
      <text x={270} y={160} fontSize={32} fontWeight="900" textAnchor="middle" fill="#fff">
        RODNEI
      </text>
      <text x={270} y={190} fontSize={16} fontWeight="bold" textAnchor="middle" fill={C.acento}>
        {linha2}
      </text>
    </g>
  );
};

// Close de um bilhete, com o texto aparecendo no ritmo da leitura.
export const BilheteClose: React.FC<{linhas: string[]; de: number; ate: number; fundo: React.ReactNode; papel?: string}> = ({
  linhas,
  de,
  ate,
  fundo,
  papel = C.papel,
}) => {
  const f = useCurrentFrame();
  const total = linhas.join('').length;
  const letras = Math.floor(interpolate(f, [de, ate], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const flutua = Math.sin(f / 18) * 2;
  let usadas = 0;
  return (
    <Tela>
      <defs>
        <filter id="desfoqueB">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g filter="url(#desfoqueB)">{fundo}</g>
      <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.55} />
      <g transform={`translate(0,${flutua}) rotate(-3 270 470)`}>
        <rect x={70} y={300} width={400} height={300} fill={papel} {...T} />
        <line x1={70} y1={400} x2={470} y2={400} stroke="#e6dfc8" strokeWidth={2} />
        <line x1={70} y1={500} x2={470} y2={500} stroke="#e6dfc8" strokeWidth={2} />
        {linhas.map((linha, i) => {
          const vis = Math.max(0, Math.min(linha.length, letras - usadas));
          usadas += linha.length;
          return (
            <text key={i} x={100} y={370 + i * 70} fontSize={31} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              {linha.slice(0, vis)}
            </text>
          );
        })}
        <g transform="translate(440,590) rotate(-25)">
          <rect x={-34} y={20} width={68} height={260} rx={30} fill={C.macacao} {...T} />
          <ellipse cx={0} cy={18} rx={42} ry={36} fill={C.pele} {...T} />
          <ellipse cx={-30} cy={-6} rx={14} ry={24} fill={C.pele} transform="rotate(35 -30 -6)" {...T} />
        </g>
      </g>
    </Tela>
  );
};

// Cartão de voto (duas opções de uma palavra).
export const CartaoVoto: React.FC<{pergunta: string; opcoes: [string, string]}> = ({pergunta, opcoes}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const e = spring({frame: f - 6, fps, config: {damping: 11}});
  return (
    <g transform={`translate(270,250) scale(${e}) translate(-270,-250)`} fontFamily="Inter, Arial, sans-serif">
      <rect x={40} y={150} width={460} height={190} rx={22} fill={C.hud} opacity={0.94} />
      <text x={270} y={190} fontSize={pergunta.length > 34 ? 18 : 21} fontWeight="bold" textAnchor="middle" fill="#fff">
        {pergunta}
      </text>
      <rect x={62} y={212} width={176} height={62} rx={31} fill={C.acento} />
      <text x={150} y={254} fontSize={28} fontWeight="900" textAnchor="middle" fill={C.hud}>
        {opcoes[0]}
      </text>
      <text x={270} y={252} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
        ou
      </text>
      <rect x={302} y={212} width={176} height={62} rx={31} fill="#fff" />
      <text x={390} y={254} fontSize={28} fontWeight="900" textAnchor="middle" fill={C.hud}>
        {opcoes[1]}
      </text>
      <text x={270} y={316} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.acento}>
        Comente aqui embaixo 👇
      </text>
    </g>
  );
};

// ---------- montagem do episódio ----------
export type Parte = {
  nome: string;
  Cena: React.FC;
  dur: number; // quadros
  fala?: [number, number]; // trecho do áudio da narração (s)
  atraso?: number; // quando a fala começa dentro da cena (s)
  legendas: [number, number, string][]; // tempos do áudio (s) se tem fala; senão, relativos à cena
  pos?: 'alto' | 'baixo';
};

export const montar = (partes: Parte[]) => {
  const inicios = partes.reduce<number[]>((acc, _p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + partes[i - 1].dur], []);
  const duracao = inicios[inicios.length - 1] + partes[partes.length - 1].dur;
  const legendas: [number, number, string, number][] = partes.flatMap((p, i) =>
    p.legendas.map(([a, b, txt]) => {
      const base = p.fala ? inicios[i] + s(p.atraso ?? 0) - s(p.fala[0]) : inicios[i];
      return [base + s(a), base + s(b) + 4, txt, p.pos === 'alto' ? 640 : 1640] as [number, number, string, number];
    }),
  );
  const inicio = (nome: string) => inicios[partes.findIndex((p) => p.nome === nome)];
  return {inicios, duracao, legendas, inicio};
};

const Legenda: React.FC<{legendas: [number, number, string, number][]}> = ({legendas}) => {
  const f = useCurrentFrame();
  const atual = legendas.find(([a, b]) => f >= a && f < b);
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

export const Episodio: React.FC<{
  partes: Parte[];
  audio?: string; // arquivo da narração em public/
  efeitos?: [string, number, number, number?][]; // [arquivo, quadro, volume, duração máx.]
  semLegenda?: boolean;
}> = ({partes, audio, efeitos = [], semLegenda = false}) => {
  const {inicios, legendas} = montar(partes);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {partes.map(({nome, Cena, dur}, i) => (
        <Sequence key={nome} from={inicios[i]} durationInFrames={dur}>
          <Cena />
          {i > 0 && <Entrada />}
        </Sequence>
      ))}
      {!semLegenda && <Legenda legendas={legendas} />}
      {audio &&
        partes.map((p, i) =>
          p.fala ? (
            <Sequence key={`fala${i}`} from={inicios[i] + s(p.atraso ?? 0)} durationInFrames={s(p.fala[1] - p.fala[0]) + 6}>
              <Audio src={staticFile(audio)} trimBefore={s(p.fala[0])} />
            </Sequence>
          ) : null,
        )}
      {efeitos.map(([arq, em, vol, max], i) => (
        <Sequence key={`efeito${i}`} from={em} durationInFrames={max}>
          <Audio src={staticFile(`sfx/${arq}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
