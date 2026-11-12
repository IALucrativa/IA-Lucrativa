import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

// Montagem dos episódios (mesma do Bilhete na Porta).

export const s = (seg: number) => Math.round(seg * 30);

export const Tela: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 540 960" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

export const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 4], [1, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', opacity: op}} />;
};

// Zoom de câmera em volta de um ponto.
export const Camera: React.FC<{x: number; y: number; z: number; children: React.ReactNode}> = ({x, y, z, children}) => (
  <g transform={`translate(${x},${y}) scale(${z}) translate(${-x},${-y})`}>{children}</g>
);

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
        fontFamily: "Inter, 'Liberation Sans', Arial, sans-serif",
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
