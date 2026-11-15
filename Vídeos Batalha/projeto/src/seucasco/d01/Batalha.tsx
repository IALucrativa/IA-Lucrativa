import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Peca, useMaterial, aleatorio, Vec} from '../../bisnaga/Cena3D';
import {Etiqueta, NumeroGrande} from '../../bisnaga/d01/Convocacao';
import {Selo} from '../../bisnaga/d01/Batalha';
import {Quintal, ParamsQuintal, JabutiNaCena} from '../Quintal';
import {Lesma, useMatsLesma, useMatsJabuti} from '../Jabutis';
import {PlacarJabutis, Respingos} from './Convocacao';
import {BATALHA_SC_D01, ConfigBatalhaSC, BlocoBat} from './batalha';

// Seu Casco · Desafio 1 · Batalha: "As lesmas da horta". Roteiro: series/seucasco/d01/batalha/roteiro.md
// Tudo o que acontece no quintal é função do tempo global T (s): cada cena só escolhe a câmera e a interface.

const FPS = 30;
const AMARELO = '#ffd23f';
const SOMBRA = '0 4px 14px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)';
const ESTILO = 'cartoon' as const;
const SO_AUDIO = Boolean((getInputProps() as {soAudio?: boolean}).soAudio);
const ESC = 0.8; // tamanho dos soldados

const lerp = (a: Vec, b: Vec, k: number): Vec => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const suave = (k: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, k)));
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const salta = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : Easing.out(Easing.back(2.2))(k));
type Cam = {pos: Vec; alvo: Vec; fov: number};
const camMove = (de: {pos: Vec; alvo: Vec}, para: {pos: Vec; alvo: Vec}, k: number, fov = 50): Cam => ({pos: lerp(de.pos, para.pos, suave(k)), alvo: lerp(de.alvo, para.alvo, suave(k)), fov});

// ---------- O exército: 209 lugares em fileiras (a ACADEMIA na frente) ----------
const C = BATALHA_SC_D01.contagem;
const TOTAL = C.comuns + C.ACADEMIA + C.CROCHE + C.PATINETE + C.OBRA; // 209

type Slot = {x: number; z: number; giro: number};
const fora = (x: number, z: number) =>
  (x > -0.88 && x < 0.0 && z > 0.1 && z < 1.34) || // o canteiro
  (x > -0.02 && x < 0.8 && z > 0.33 && z < 1.3) || // o caminho do Seu Casco
  (x > 1.1 && x < 1.92 && z > 0.98 && z < 1.82) || // a capinha e o capacete largados
  (x < -1.8 && z > -1.85 && z < -0.5) || // o degrau da cozinha
  (x > -1.74 && x < -1.26 && z > -0.74 && z < -0.26) || // o vaso
  (x > 0.6 && x < 1.45 && z > 1.75 && z < 2.95); // onde fica a câmera da capinha
const SLOTS: Slot[] = (() => {
  const r = aleatorio(77);
  const l: Slot[] = [];
  for (let row = 0; row < 24 && l.length < TOTAL; row++)
    for (let c = 0; c < 19 && l.length < TOTAL; c++) {
      const x = -2.1 + c * 0.2333 + (row % 2) * 0.06 + (r() - 0.5) * 0.03;
      const z = -0.95 + row * 0.34 + (r() - 0.5) * 0.03;
      const g = Math.PI + (r() - 0.5) * 0.3;
      if (!fora(x, z)) l.push({x, z, giro: g});
    }
  return l;
})();
// ordem dos lugares: ACADEMIA (frente), comuns (em volta da horta), PATINETE (atrás)
const IA = 0;
const IC = C.ACADEMIA;
const IP = C.ACADEMIA + C.comuns;

// quando cada um aparece na contagem (a narração diz comuns, academia, patinete)
const tPop = (i: number) => (i < IC ? 5.3 + (i / C.ACADEMIA) * 1.9 : i < IP ? 3.62 + ((i - IC) / C.comuns) * 1.45 : 7.53 + ((i - IP) / C.PATINETE) * 1.8);
const presente = (i: number, T: number) => (T < 3.4 ? 1 : salta((T - tPop(i)) / 0.18));
const contados = (T: number) => (T < 3.4 ? TOTAL : SLOTS.reduce((n, _, i) => n + (T >= tPop(i) ? 1 : 0), 0));

// ---------- Os patinetes: corredor pelas lesmas e o monte no tanque ----------
const TANQUE: Vec = [2.15, 0, -1.6];
const LANE0: Vec = [-2.3, 0, -2.15];
const LANE1: Vec = [1.55, 0, -1.95];
const T_PAT = 31.0;
const tSai = (k: number) => T_PAT + k * 0.06;
const PILHA: {p: Vec; giro: number; costas: number}[] = (() => {
  const r = aleatorio(91);
  return Array.from({length: C.PATINETE}, (_, k) => {
    if (k < 12) {
      const L = Math.floor(k / 4);
      const q = k % 4;
      return {p: [TANQUE[0] + (q % 2 ? 0.1 : -0.1) + (r() - 0.5) * 0.04, 0.78 + L * 0.085, TANQUE[2] + (q < 2 ? 0.09 : -0.09) + (r() - 0.5) * 0.04] as Vec, giro: r() * 6.28, costas: 0};
    }
    // em volta do tanque, para o fundo e para a direita (longe da ACADEMIA)
    const j = k - 12;
    const a = -Math.PI * 0.95 + (j / 41) * Math.PI * 1.15 * 2.4;
    const anel = 0.48 + Math.floor(j / 17) * 0.24;
    const aa = -Math.PI + ((a + Math.PI) % (Math.PI * 1.15));
    return {p: [TANQUE[0] + Math.cos(aa) * anel + (r() - 0.5) * 0.06, 0, TANQUE[2] + Math.sin(aa) * anel * 0.95 + (r() - 0.5) * 0.06] as Vec, giro: r() * 6.28, costas: r() < 0.25 ? 1 : 0};
  });
})();

const patinete = (k: number, T: number): JabutiNaCena | null => {
  const s = SLOTS[IP + k];
  if (T < 30.3) return {tipo: 'PATINETE', pos: [s.x, 0, s.z], giro: s.giro, esc: ESC * presente(IP + k, T)};
  const u = T - tSai(k);
  if (u < 0) return null;
  if (u < 1.0) return {tipo: 'PATINETE', pos: lerp(LANE0, LANE1, u), giro: Math.atan2(LANE1[0] - LANE0[0], LANE1[2] - LANE0[2]), esc: ESC};
  const pl = PILHA[k];
  if (u < 1.3) {
    const sk = (u - 1) / 0.3;
    const p = lerp(LANE1, pl.p, sk);
    p[1] += Math.sin(sk * Math.PI) * 0.45;
    return {tipo: 'PATINETE', pos: p, giro: Math.atan2(LANE1[0] - LANE0[0], LANE1[2] - LANE0[2]) + sk * 3, esc: ESC, escondido: sk};
  }
  return {tipo: 'PATINETE', pos: pl.p, giro: pl.giro, esc: ESC, escondido: 1, costas: pl.costas};
};

// ---------- ACADEMIA e comuns ----------
const avancoAcademia = (T: number) => 0.16 * suave((T - 41.9) / 0.4) + 0.1 * suave((T - 44.9) / 0.4);
const academia = (k: number, T: number): JabutiNaCena => {
  const s = SLOTS[IA + k];
  const empurrando = (T > 41.5 && T < 42.4) || (T > 44.5 && T < 45.4);
  return {
    tipo: 'ACADEMIA',
    pos: [s.x, 0, s.z - avancoAcademia(T)],
    giro: s.giro,
    esc: ESC * presente(IA + k, T),
    andando: empurrando ? 1 : 0,
    costas: suave((T - (47.3 + (k / C.ACADEMIA) * 2.4)) / 0.35),
  };
};
const comum = (k: number, T: number): JabutiNaCena => {
  const s = SLOTS[IC + k];
  const entra = suave((T - (55.9 + (k / C.comuns) * 1.3)) / 0.2);
  const sai = suave((T - (76.3 + k * 0.012)) / 0.3);
  return {tipo: 'COMUM', pos: [s.x, 0, s.z], giro: s.giro, esc: ESC * presente(IC + k, T), escondido: entra * (1 - sai)};
};

const exercito = (T: number): JabutiNaCena[] => {
  const l: JabutiNaCena[] = [];
  for (let k = 0; k < C.ACADEMIA; k++) {
    const j = academia(k, T);
    if ((j.esc ?? 1) > 0.01) l.push(j);
  }
  for (let k = 0; k < C.comuns; k++) {
    const j = comum(k, T);
    if ((j.esc ?? 1) > 0.01) l.push(j);
  }
  for (let k = 0; k < C.PATINETE; k++) {
    const j = patinete(k, T);
    if (j && (j.esc ?? 1) > 0.01) l.push(j);
  }
  return l;
};

// ---------- As lesmas ----------
const avancoLesmas = (T: number) => -1.0 + 0.15 * suave((T - 25.6) / 4);
const mexeLesma = (T: number) => (l: {x: number; z: number; giro: number}): {x: number; z: number; giro: number; rola?: number; y?: number} | null => {
  if (T >= 69) return null;
  let {x, z, giro} = l;
  let rola = 0;
  let y = 0;
  // 1. o corredor dos patinetes
  const passa = T_PAT + (x - LANE0[0]) / (LANE1[0] - LANE0[0]);
  if (T > passa && x < LANE1[0] + 0.15) {
    const lz = LANE0[2] + ((x - LANE0[0]) / (LANE1[0] - LANE0[0])) * (LANE1[2] - LANE0[2]);
    const dz = z - lz;
    if (Math.abs(dz) < 0.32) {
      const e = suave((T - passa) / 0.25);
      const s = dz >= 0 ? 1 : -1;
      z += s * (0.32 - Math.abs(dz)) * e * 1.1;
      rola += s * e * 1.5;
    }
  }
  // 2. o monte em volta do tanque
  const dx2 = x - TANQUE[0];
  const dz2 = z - TANQUE[2];
  const d2 = Math.hypot(dx2, dz2);
  if (T > 32.2 && d2 < 1.05) {
    const e = suave((T - 32.2) / 0.6);
    const add = (1.05 - d2) * e;
    x += (dx2 / (d2 || 1)) * add;
    z += (dz2 / (d2 || 1)) * add;
    rola += e * 1.2;
  }
  // 3. os empurrões da ACADEMIA (a faixa da frente sai rolando)
  const b = clamp01((z + 2.75) / 1.35);
  if (T > 41.9 && b > 0) {
    const e = suave((T - 41.9 - (1 - b) * 0.25) / 0.6);
    z -= 0.8 * b * e;
    rola -= e * b * Math.PI * 2;
  }
  if (T > 44.9 && b > 0) {
    const e = suave((T - 44.9 - (1 - b) * 0.25) / 0.6);
    z -= 0.45 * b * e;
    rola -= e * b * Math.PI * 2;
  }
  // 4. o recuo: dão meia-volta e vão embora para baixo do muro
  if (T > 61.9) {
    const vira = suave((T - 61.9 - clamp01((z + 6.2) / 5) * 0.8) / 0.6);
    giro += Math.PI * vira;
    rola *= 1 - vira;
    const volta = 7 * Easing.in(Easing.quad)(clamp01((T - 62.6) / 6.2));
    z -= volta;
    if (z < -6.45) return null;
  }
  return {x, z, giro, rola, y};
};

// ---------- Objetos de cena ----------
const Largados: React.FC = () => {
  // a capinha de crochê dobrada e o capacete de obra, sem ninguém
  const mj = useMatsJabuti(ESTILO);
  return (
    <>
      <Peca forma={{tipo: 'cupula', r: 1}} esc={[0.12, 0.035, 0.1]} pos={[1.38, 0, 1.32]} rot={[0, 0.5, 0.06]} mat={mj.cascoCroche} estilo={ESTILO} contorno={0.06} />
      <Peca forma={{tipo: 'cupula', r: 1}} esc={[0.1, 0.03, 0.08]} pos={[1.36, 0.03, 1.3]} rot={[0, 0.9, -0.05]} mat={mj.cascoCroche} estilo={ESTILO} contorno={0.06} />
      <group position={[1.64, 0, 1.5]} rotation={[0, -0.6, 0]}>
        <Peca forma={{tipo: 'cupula', r: 0.06}} esc={[1, 0.85, 1.15]} mat={mj.capacete} estilo={ESTILO} contorno={0.004} />
        <Peca forma={{tipo: 'cilindro', r: 0.07, h: 0.008}} esc={[1, 1, 1.25]} pos={[0, 0.003, 0.01]} mat={mj.capacete} estilo={ESTILO} contorno={0.004} />
      </group>
    </>
  );
};

const Kombi: React.FC<{x: number}> = ({x}) => {
  // a Kombi de mudança, de caçamba vazia, passando na rua
  const m = useMaterial(ESTILO);
  const azul = m('#3f7fbf');
  const branco = m('#f2efe6');
  return (
    <group position={[x, 0, -7.35]}>
      <Peca forma={{tipo: 'caixa', d: [0.8, 0.5, 0.9]}} pos={[0.65, 0.5, 0]} mat={azul} estilo={ESTILO} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [0.8, 0.45, 0.9]}} pos={[0.65, 0.97, 0]} mat={branco} estilo={ESTILO} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [0.02, 0.3, 0.75]}} pos={[1.06, 0.98, 0]} mat={m('#9fd3f0', {brilho: 1})} estilo={ESTILO} contorno={0} />
      <Peca forma={{tipo: 'caixa', d: [1.4, 0.12, 0.9]}} pos={[-0.45, 0.32, 0]} mat={azul} estilo={ESTILO} contorno={0.01} />
      {[0.42, -0.42].map((z) => (
        <Peca key={z} forma={{tipo: 'caixa', d: [1.4, 0.2, 0.04]}} pos={[-0.45, 0.48, z]} mat={azul} estilo={ESTILO} contorno={0.006} />
      ))}
      <Peca forma={{tipo: 'caixa', d: [0.04, 0.2, 0.9]}} pos={[-1.13, 0.48, 0]} mat={azul} estilo={ESTILO} contorno={0.006} />
      {[0.7, -0.8].map((wx) => [0.45, -0.45].map((wz) => (
        <Peca key={`${wx}${wz}`} forma={{tipo: 'cilindro', r: 0.17, h: 0.1}} pos={[wx, 0.17, wz]} rot={[Math.PI / 2, 0, 0]} mat={m('#1d1d22')} estilo={ESTILO} contorno={0} />
      )))}
      <Peca forma={{tipo: 'esfera', r: 0.06}} pos={[1.06, 0.55, 0.3]} mat={m('#fff6d0', {emissivo: '#fff2b0'})} estilo={ESTILO} contorno={0} />
    </group>
  );
};

const Rua: React.FC = () => {
  // a rua e as casas da frente, vistas pelo portão
  const m = useMaterial(ESTILO);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, -7.8]} material={m('#55565c')}>
        <planeGeometry args={[12, 2.3]} />
      </mesh>
      <Peca forma={{tipo: 'caixa', d: [12, 2.6, 0.1]}} pos={[0, 1.3, -9.0]} mat={m('#cdb894')} estilo={ESTILO} contorno={0} />
      {[-1.6, 0.5, 2.4].map((x, i) => (
        <Peca key={x} forma={{tipo: 'caixa', d: [0.6, 0.5, 0.04]}} pos={[x, 1.2, -8.93]} mat={m(i === 1 ? '#ffd889' : '#4b6f9a')} estilo={ESTILO} contorno={0.006} />
      ))}
    </>
  );
};

const FolhaHorta: React.FC<{mordida: number}> = ({mordida}) => {
  // a folha de alface pendurada na beira do canteiro
  const m = useMaterial(ESTILO);
  const s = 1 - mordida * 0.45;
  // caída no chão, no caminho dele
  return (
    <group position={[0.1, 0.006, 0.47]} rotation={[0, 0.7, 0]}>
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.07 * s, 0.006, 0.09 * s]} mat={m('#7fcf4a')} estilo={ESTILO} contorno={0.15} />
    </group>
  );
};

const LesmaSolta: React.FC<{pos: Vec; giro: number; t: number; esc?: number; rola?: number}> = ({pos, giro, t, esc = 1.2, rola = 0}) => {
  const ml = useMatsLesma(ESTILO);
  return (
    <group position={pos} rotation={[0, 0, rola]}>
      <Lesma estilo={ESTILO} mats={ml} pos={[0, 0, 0]} giro={giro} esc={esc} t={t} fase={0.7} />
    </group>
  );
};

const FolhaNoTronco: React.FC<{y: number; t: number}> = ({y, t}) => {
  // a folha descendo o tronco do pé de manga, com as formigas quase escondidas embaixo
  const m = useMaterial(ESTILO);
  const p: Vec = [1.83, y, -5.06];
  const balanca = Math.sin(t * 9) * 0.05;
  return (
    <group position={p} rotation={[0, -0.5, balanca]}>
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.065, 0.13, 0.008]} pos={[0, 0.06, 0.03]} rot={[0, 0, 0.45]} mat={m('#6cc23f')} estilo={ESTILO} contorno={0.15} />
      <Peca forma={{tipo: 'cilindro', r: 0.004, h: 0.25}} pos={[0, 0.05, 0.04]} rot={[0, 0, 0.45]} mat={m('#2f6e22')} estilo={ESTILO} contorno={0} />
      {[-0.025, 0.0, 0.025].map((dx, i) => (
        <Peca key={i} forma={{tipo: 'esfera', r: 0.01}} pos={[dx, -0.035 + Math.sin(t * 20 + i) * 0.003, 0.012]} mat={m('#2a160c')} estilo={ESTILO} contorno={0} />
      ))}
    </group>
  );
};

// ---------- Interface ----------
const Titulo: React.FC<{f: number}> = ({f}) => {
  const k = interpolate(f, [0, 6], [1.4, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: SOMBRA, transform: `scale(${k})`}}>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>{TOTAL + 1} JABUTIS</div>
      <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
    </div>
  );
};

const Legenda: React.FC<{texto: string; destaques: Set<string>}> = ({texto, destaques}) => (
  <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', padding: '0 70px', boxSizing: 'border-box', textShadow: SOMBRA}}>
    <span style={{color: '#fff', fontWeight: 800, fontSize: 56, lineHeight: 1.25}}>
      {texto.split(' ').map((p, i) => (
        <span key={i} style={{color: destaques.has(p.replace(/[.,:?!]+$/, '')) ? AMARELO : '#fff'}}>
          {p}{' '}
        </span>
      ))}
    </span>
  </div>
);

// ---------- As cenas ----------
type Ctx = {bloco: BlocoBat; ini: number; dur: number};

const quadro = (f: number, c: Ctx): {p: ParamsQuintal; ui: React.ReactNode[]; sons: React.ReactNode[]} => {
  const {bloco, ini, dur} = c;
  const T = ini + f / FPS;
  const em = (s: number) => Math.round((s - ini) * FPS);
  const leg = (i: number) => bloco.legendas[Math.min(i, bloco.legendas.length - 1)][0];
  const k = f / dur;
  const ui: React.ReactNode[] = [];
  const sons: React.ReactNode[] = [];
  const som = (arq: string, de: number, vol = 1) =>
    sons.push(
      <Sequence key={`${arq}${de}${sons.length}`} from={Math.max(0, de)}>
        <Audio src={staticFile(`sfx/${arq}`)} volume={Math.min(1, vol)} />
      </Sequence>,
    );
  const placar = (n = TOTAL + 1, pulso = 0) => ui.push(<PlacarJabutis key="placar" jabutis={n} pulso={pulso} />);

  // o Seu Casco só chega no fim
  const anda = clamp01((T - 69.5) / 2.7);
  const heroi = T >= 69 ? {pos: lerp([0.66, 0, 1.02], [0.3, 0, 0.66], suave(anda)), giro: -2.34, mastiga: T > 73.4 ? Math.max(0, Math.sin(T * 7)) : 0} : null;
  const amanhecer = clamp01((T - 62) / 7) * 0.75 + clamp01((T - 69) / 8) * 0.25;
  const base: ParamsQuintal = {t: T, avanco: avancoLesmas(T), heroi, jabutis: exercito(T), mexeLesma: mexeLesma(T), amanhecer};

  switch (bloco.cena) {
    case 'abertura': {
      const cam = camMove({pos: [0.4, 0.34, 1.3], alvo: [0.0, 0.04, -3.2]}, {pos: [0.32, 0.28, 0.5], alvo: [0.0, 0.04, -3.2]}, k, 56);
      ui.push(<Titulo key="t" f={f} />);
      som('impacto.wav', 0, 0.7);
      return {p: {...base, cam}, ui, sons};
    }
    case 'chegada': {
      const cam = camMove({pos: [0.4, 1.75, 3.95], alvo: [0, 0, -0.1]}, {pos: [0.35, 1.6, 3.7], alvo: [0, 0, -0.1]}, k, 56);
      const n = contados(T) + 1;
      const ultimo = SLOTS.reduce((m, _, i) => (T >= tPop(i) ? Math.max(m, tPop(i)) : m), 0);
      placar(n, T - ultimo < 0.15 ? 0.3 : 0);
      if (T >= leg(0)) ui.push(<Etiqueta key="c" texto={`${C.comuns} COMUNS`} x={330} y={820} linha={120} f={f - em(leg(0))} tam={40} />);
      if (T >= leg(1)) ui.push(<Etiqueta key="a" texto={`ACADEMIA ×${C.ACADEMIA}`} x={700} y={600} linha={110} f={f - em(leg(1))} tam={40} />);
      if (T >= leg(2)) ui.push(<Etiqueta key="p" texto={`PATINETE ×${C.PATINETE}`} x={680} y={1060} linha={90} f={f - em(leg(2))} tam={40} />);
      if (T >= leg(3)) placar(TOTAL + 1, f - em(leg(3)) < 8 ? 1 - (f - em(leg(3))) / 8 : 0);
      for (let s = em(3.62); s < em(9.4); s += 4) som('pop.wav', s, 0.22);
      [0, 1, 2].forEach((i) => som('clique.wav', em(leg(i)), 0.5));
      return {p: {...base, cam}, ui, sons};
    }
    case 'ausentes': {
      const cam = camMove({pos: [0.98, 0.5, 2.5], alvo: [1.5, 0.02, 1.4]}, {pos: [1.05, 0.44, 2.35], alvo: [1.5, 0.02, 1.4]}, k, 46);
      placar();
      ui.push(<Etiqueta key="c" texto="CROCHÊ ×0" x={330} y={760} linha={150} f={f - 6} tam={44} />);
      ui.push(<Etiqueta key="o" texto="OBRA ×0" x={760} y={700} linha={150} f={f - 14} tam={44} />);
      som('clique.wav', 6, 0.5);
      som('clique.wav', 14, 0.5);
      return {p: {...base, cam, extras: <Largados />}, ui, sons};
    }
    case 'frente': {
      const cam = camMove({pos: [-0.7, 0.2, -1.42], alvo: [0.2, 0.07, -0.55]}, {pos: [0.75, 0.2, -1.42], alvo: [-0.2, 0.07, -0.55]}, k, 52);
      placar();
      ui.push(<Etiqueta key="a" texto={`ACADEMIA ×${C.ACADEMIA}`} x={540} y={560} linha={120} f={f - em(leg(0) + 1.9)} tam={46} />);
      som('clique.wav', em(leg(0) + 1.9), 0.5);
      return {p: {...base, cam}, ui, sons};
    }
    case 'avanco': {
      const cam = camMove({pos: [0.25, 0.34, -0.15], alvo: [0, 0.02, -2.6]}, {pos: [0.2, 0.26, -0.5], alvo: [0, 0.02, -2.6]}, k, 52);
      placar();
      if (T >= leg(1)) ui.push(<NumeroGrande key="n" num="10.000" rotulo="LESMAS" f={f - em(leg(1))} />);
      som('escorregar.wav', 6, 0.4);
      return {p: {...base, cam}, ui, sons};
    }
    case 'patinete': {
      const pilha = T >= 37.4;
      const cam = pilha
        ? camMove({pos: [0.15, 1.05, 0.95], alvo: [1.95, 0.45, -1.7]}, {pos: [0.3, 0.95, 0.75], alvo: [2.0, 0.45, -1.7]}, (T - 37.4) / 2, 50)
        : camMove({pos: [-1.05, 0.78, -0.55], alvo: [-0.6, 0.05, -2.1]}, {pos: [-0.3, 0.95, 0.2], alvo: [1.5, 0.3, -1.9]}, (T - 31.0) / 4.5, 55);
      placar();
      ui.push(<Etiqueta key="e" texto={`PATINETE ×${C.PATINETE}`} x={540} y={520} linha={90} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      for (let i = 0; i < 6; i++) som('uuush.wav', em(T_PAT + i * 0.55), 0.6);
      [32.3, 33.0, 33.8, 34.6, 35.3].forEach((s) => som('tchibum.wav', em(s), 0.7));
      const splash = [0, 4, 8, 11].map((kk) => <Respingos key={kk} pos={[TANQUE[0], 0.85, TANQUE[2]]} k={(T - tSai(kk) - 1.3) / 0.8} />);
      return {p: {...base, cam, extras: <>{splash}</>}, ui, sons};
    }
    case 'empurrao': {
      const cam = camMove({pos: [1.95, 0.45, -0.3], alvo: [0.3, 0.04, -1.5]}, {pos: [1.8, 0.42, -0.45], alvo: [0.2, 0.04, -1.6]}, k, 52);
      placar();
      ui.push(<Etiqueta key="a" texto={`ACADEMIA ×${C.ACADEMIA}`} x={540} y={560} linha={90} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      som('baque.wav', em(41.95), 0.9);
      som('escorregar.wav', em(42.2), 0.5);
      return {p: {...base, cam}, ui, sons};
    }
    case 'capota': {
      const cam = camMove({pos: [1.35, 0.38, -0.3], alvo: [0.3, 0.05, -1.05]}, {pos: [1.2, 0.33, -0.15], alvo: [0.25, 0.05, -0.95]}, k, 50);
      placar();
      som('baque.wav', em(44.95), 0.8);
      som('escorregar.wav', em(47.3), 0.6);
      som('tlec_varios.wav', em(47.6), 0.6);
      som('escorregar.wav', em(48.6), 0.5);
      return {p: {...base, cam}, ui, sons};
    }
    case 'comuns': {
      const perto = T >= 59.9;
      const cam = camMove({pos: [0.75, 0.68, -1.05], alvo: [0.0, 0.03, 0.6]}, {pos: [0.6, 0.6, -0.95], alvo: [0.15, 0.03, 0.35]}, (T - 51.7) / 9, 54);
      placar();
      if (!perto) ui.push(<Etiqueta key="c" texto={`${C.comuns} COMUNS`} x={540} y={560} linha={90} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      som('tlec_varios.wav', em(55.9), 0.7);
      som('tlec.wav', em(60.5), 0.6);
      // as lesmas que tentam passar e voltam
      const bate = clamp01((T - 59.9) / 0.7);
      const volta = suave((T - 60.7) / 0.5);
      const extras = perto ? (
        <>
          {[0.3, 0.58, 0.05].map((x, i) => (
            <LesmaSolta key={i} pos={[x, 0, -0.2 + bate * 0.12 - volta * 0.15]} giro={Math.PI * volta + (i - 1) * 0.2} t={T} esc={1.1} />
          ))}
        </>
      ) : null;
      return {p: {...base, cam, extras}, ui, sons};
    }
    case 'recuo': {
      const cam = camMove({pos: [0.3, 0.55, -0.7], alvo: [0, 0, -3.4]}, {pos: [0.3, 0.75, -0.9], alvo: [0, 0, -4.2]}, k, 55);
      placar();
      if (T >= leg(2)) ui.push(<NumeroGrande key="n" num="1 MM/S" rotulo="UM MILÍMETRO POR SEGUNDO" f={f - em(leg(2))} />);
      som('escorregar.wav', em(63.2), 0.4);
      return {p: {...base, cam}, ui, sons};
    }
    case 'heroi': {
      const cam = camMove({pos: [-0.24, 0.4, -0.08], alvo: [0.4, -0.04, 0.8]}, {pos: [-0.18, 0.36, -0.02], alvo: [0.27, -0.04, 0.62]}, k, 44);
      placar();
      ui.push(<Etiqueta key="h" texto="SEU CASCO" x={640} y={760} linha={120} f={f - em(leg(0))} amarela />);
      som('clique.wav', em(leg(0)), 0.5);
      som('nham.wav', em(73.45), 0.8);
      const mordida = suave((T - 73.4) / 0.3);
      const cai = suave((T - 73.6) / 0.5);
      const foge = clamp01((T - 74.1) / 2);
      const lesma: Vec = [0.1 + cai * 0.06 + foge * 0.2, 0.012 * (1 - cai), 0.47 - cai * 0.04 - foge * 0.05];
      return {
        p: {...base, cam, extras: <>
          <FolhaHorta mordida={mordida} />
          <LesmaSolta pos={lesma} giro={Math.PI / 2 + 0.3} t={T} esc={1.0} rola={cai > 0 && cai < 1 ? Math.sin(cai * Math.PI) * 0.6 : 0} />
        </>},
        ui,
        sons,
      };
    }
    case 'vitoria': {
      const cam = camMove({pos: [0.35, 0.8, 2.7], alvo: [0.3, 0.45, -6.0]}, {pos: [0.35, 0.72, 1.8], alvo: [0.35, 0.5, -6.0]}, k, 52);
      placar();
      ui.push(<Selo key="s1" texto="VITÓRIA" f={f - em(leg(0))} top={460} amarelo tam={84} />);
      if (T >= leg(2)) ui.push(<Selo key="s2" texto={`VOCÊS MANDARAM: ${TOTAL} SOLDADOS`} f={f - em(leg(2))} top={600} tam={46} />);
      if (T >= leg(3)) ui.push(<Selo key="s3" texto="COM 500: O CHÃO TREME" f={f - em(leg(3))} top={700} tam={46} />);
      som('placar.wav', 0, 0.8);
      som('motor.wav', em(77.9), 0.7);
      const kx = -4.2 + clamp01((T - 78.1) / 3.6) * 9.5;
      return {p: {...base, cam, portao: suave((T - 76.2) / 1.0), extras: <><Rua /><Kombi x={kx} /></>}, ui, sons};
    }
    case 'gancho':
    default: {
      const cam = camMove({pos: [1.0, 0.95, -3.35], alvo: [1.86, 0.78, -5.05]}, {pos: [1.08, 0.7, -3.5], alvo: [1.86, 0.55, -5.05]}, k, 38);
      const y = 1.25 - clamp01((T - 84.4) / 5.6) * 0.85;
      som('suspense.wav', 0, 0.45);
      return {p: {...base, cam, jabutis: [], heroi: null, extras: <><Rua /><FolhaNoTronco y={y} t={T} /></>}, ui, sons};
    }
  }
};

const CenaComp: React.FC<{c: Ctx}> = ({c}) => {
  const f = useCurrentFrame();
  const {p, ui, sons} = quadro(f, c);
  if (SO_AUDIO) return <AbsoluteFill>{sons}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} gl={{antialias: true}} dpr={1} shadows>
        <Quintal estilo={ESTILO} {...p} />
      </ThreeCanvas>
      {ui}
      {sons}
    </AbsoluteFill>
  );
};

const Legendas: React.FC<{cfg: ConfigBatalhaSC; destaques: Set<string>}> = ({cfg, destaques}) => {
  const T = useCurrentFrame() / FPS;
  const todas = cfg.blocos.flatMap((b) => b.legendas.map(([de, texto], i) => ({de, texto, ate: i + 1 < b.legendas.length ? b.legendas[i + 1][0] : b.fim + 0.35})));
  const atual = todas.find((l) => T >= l.de && T < l.ate);
  return atual ? <Legenda texto={atual.texto} destaques={destaques} /> : null;
};

const inicioCenas = (cfg: ConfigBatalhaSC) => cfg.blocos.map((b, i) => (i === 0 ? 0 : Math.round((b.legendas[0][0] - 0.2) * FPS)));

export const BatalhaSeuCasco: React.FC<{cfg: ConfigBatalhaSC}> = ({cfg}) => {
  const destaques = useMemo(() => new Set(cfg.destaques), [cfg]);
  const inicios = inicioCenas(cfg);
  const totalQ = Math.round(cfg.duracao * FPS);
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <Audio src={staticFile('sfx/suspense_longo.wav')} volume={0.07} />
      {cfg.audio && <Audio src={staticFile(cfg.audio)} />}
      {cfg.blocos.map((b, i) => {
        const ini = inicios[i];
        const fim = i + 1 < inicios.length ? inicios[i + 1] : totalQ;
        return (
          <Sequence key={i} from={ini} durationInFrames={fim - ini}>
            <CenaComp c={{bloco: b, ini: ini / FPS, dur: fim - ini}} />
          </Sequence>
        );
      })}
      {!SO_AUDIO && <Legendas cfg={cfg} destaques={destaques} />}
    </AbsoluteFill>
  );
};

export const DURACAO_BAT_SC = Math.round(BATALHA_SC_D01.duracao * FPS);
