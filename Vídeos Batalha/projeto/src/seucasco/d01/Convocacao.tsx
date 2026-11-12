import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Peca, texturaCanvas, useMaterial, Vec} from '../../bisnaga/Cena3D';
import {Etiqueta, NumeroGrande} from '../../bisnaga/d01/Convocacao';
import {Quintal, ParamsQuintal, JabutiNaCena, CAM_QUINTAL} from '../Quintal';
import {Lesma, useMatsLesma} from '../Jabutis';
import {CONVOCACAO_D01, ConfigConvocacao, BlocoConv} from './tempos';

// Seu Casco · Desafio 1 · Convocação: "As lesmas da horta". Roteiro: series/seucasco/d01/convocacao/roteiro.md

const FPS = 30;
const AMARELO = '#ffd23f';
const SOMBRA = '0 4px 14px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)';
const ESTILO = 'cartoon' as const;
const SO_AUDIO = Boolean((getInputProps() as {soAudio?: boolean}).soAudio);

const lerp = (a: Vec, b: Vec, k: number): Vec => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const suave = (k: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, k)));
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const camMove = (de: {pos: Vec; alvo: Vec}, para: {pos: Vec; alvo: Vec}, k: number, fov = 50) => ({pos: lerp(de.pos, para.pos, suave(k)), alvo: lerp(de.alvo, para.alvo, suave(k)), fov});

const HEROI: Vec = [0.18, 0, 0.62];
const GIRO_HEROI = -1.0;
const SPOT: Vec = [0.62, 0, 0.18]; // onde cada tipo se apresenta
const CAM_TIPO = {pos: [1.05, 0.42, 1.2] as Vec, alvo: [0.5, 0.1, 0.05] as Vec, fov: 50};
const CAM_HEROI = {pos: [0.05, 0.2, 1.4] as Vec, alvo: [0.1, 0.08, 0.55] as Vec, fov: 44};

// ---------- Objetos de cena ----------
const Papelao: React.FC<{pos: Vec; giro: number}> = ({pos, giro}) => {
  const m = useMaterial(ESTILO);
  const tex = useMemo(
    () =>
      texturaCanvas(512, 360, (c) => {
        c.fillStyle = '#c99a5b';
        c.fillRect(0, 0, 512, 360);
        c.strokeStyle = 'rgba(90,60,20,0.35)';
        for (let y = 10; y < 360; y += 14) {
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(512, y);
          c.stroke();
        }
        c.fillStyle = '#1d1a16';
        c.textAlign = 'center';
        c.font = 'bold 86px Arial';
        c.fillText('COMENTOU', 256, 150);
        c.fillStyle = '#b3261e';
        c.font = 'bold 76px Arial';
        c.fillText('= +1 JABUTI', 256, 270);
      }),
    [],
  );
  return (
    <group position={pos} rotation={[0, giro, 0]}>
      {/* encostado num tijolo */}
      <Peca forma={{tipo: 'caixa', d: [0.2, 0.06, 0.09]}} pos={[0, 0.03, -0.08]} mat={m('#b0553a')} estilo={ESTILO} />
      <group position={[0, 0.17, -0.02]} rotation={[-0.22, 0, 0]}>
        <Peca forma={{tipo: 'caixa', d: [0.46, 0.33, 0.012]}} mat={m('#a97a42')} estilo={ESTILO} contorno={0.006} />
        <mesh position={[0, 0, 0.007]} material={m('#ffffff', {mapa: tex})}>
          <planeGeometry args={[0.44, 0.31]} />
        </mesh>
      </group>
    </group>
  );
};

const Vaso: React.FC<{pos: Vec; cai: number}> = ({pos, cai}) => {
  const m = useMaterial(ESTILO);
  const k = suave(cai);
  return (
    <group position={[pos[0], pos[1], pos[2] - k * 0.08]} rotation={[-k * 1.45, 0, 0]}>
      <Peca forma={{tipo: 'cilindro', r: 0.055, r2: 0.07, h: 0.12}} pos={[0, 0.06, 0]} mat={m('#c0603a')} estilo={ESTILO} />
      <Peca forma={{tipo: 'esfera', r: 0.07}} pos={[0, 0.15, 0]} mat={m('#3c8a2a')} estilo={ESTILO} contorno={0.02} />
    </group>
  );
};

// o pano de prato preso nos fiozinhos do crochê, puxando outro jabuti
const Pano: React.FC<{de: Vec; ate: Vec}> = ({de, ate}) => {
  const m = useMaterial(ESTILO);
  const meio: Vec = [(de[0] + ate[0]) / 2, 0.05, (de[2] + ate[2]) / 2];
  const dx = ate[0] - de[0];
  const dz = ate[2] - de[2];
  const comp = Math.hypot(dx, dz);
  const tex = useMemo(
    () =>
      texturaCanvas(64, 64, (c) => {
        c.fillStyle = '#f4f1e8';
        c.fillRect(0, 0, 64, 64);
        c.fillStyle = '#d23c3c';
        for (let i = 0; i < 4; i++) c.fillRect(i * 16, 0, 6, 64);
        for (let i = 0; i < 4; i++) c.fillRect(0, i * 16, 64, 6);
      }),
    [],
  );
  return (
    <group position={meio} rotation={[0, Math.atan2(dx, dz), 0]}>
      <Peca forma={{tipo: 'caixa', d: [0.16, 0.008, comp]}} rot={[0.25, 0, 0]} mat={m('#ffffff', {mapa: tex})} estilo={ESTILO} contorno={0.004} />
    </group>
  );
};

const Buraco: React.FC<{pos: Vec; k: number}> = ({pos, k}) => {
  const m = useMaterial(ESTILO);
  const r = 0.16 * suave(k);
  if (r <= 0.005) return null;
  return (
    <group position={pos}>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r, 28]} />
        <meshBasicMaterial color="#1a0d08" />
      </mesh>
      {/* monte de cimento e terra do lado */}
      <Peca forma={{tipo: 'cone', r: r * 0.9, h: r * 0.8}} pos={[0.24, r * 0.4, -0.05]} mat={m('#5b3a22')} estilo={ESTILO} />
      {[0, 1, 2, 3].map((i) => (
        <Peca key={i} forma={{tipo: 'caixa', d: [0.04, 0.02, 0.03]}} pos={[0.18 + i * 0.04, 0.01, 0.06 - i * 0.05]} rot={[0, i, 0]} mat={m('#93402f')} estilo={ESTILO} contorno={0.004} />
      ))}
    </group>
  );
};

const Respingos: React.FC<{pos: Vec; k: number}> = ({pos, k}) => {
  const m = useMaterial(ESTILO);
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({length: 16}, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const v = 0.25 + (i % 3) * 0.08;
        const x = pos[0] + Math.cos(a) * v * k;
        const z = pos[2] + Math.sin(a) * v * k * 0.6;
        const y = pos[1] + 1.2 * k - 2.2 * k * k;
        return <Peca key={i} forma={{tipo: 'esfera', r: 0.022}} pos={[x, y, z]} mat={m('#8fc8ff', {brilho: 1})} estilo={ESTILO} contorno={0} />;
      })}
    </>
  );
};

const LesmasExtra: React.FC<{lista: {pos: Vec; giro: number; esc: number}[]; t: number}> = ({lista, t}) => {
  const ml = useMatsLesma(ESTILO);
  return (
    <>
      {lista.map((l, i) => (
        <Lesma key={i} estilo={ESTILO} mats={ml} pos={l.pos} giro={l.giro} esc={l.esc} t={t} fase={i * 1.3} />
      ))}
    </>
  );
};

// ---------- Interface na tela ----------
const Titulo: React.FC<{f: number}> = ({f}) => {
  const k = interpolate(f, [0, 6], [1.4, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: SOMBRA, transform: `scale(${k})`}}>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>1 SEU CASCO</div>
      <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
    </div>
  );
};

export const PlacarJabutis: React.FC<{jabutis: number; pulso?: number}> = ({jabutis, pulso = 0}) => (
  <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', gap: 70, textShadow: SOMBRA}}>
    <div style={{textAlign: 'center'}}>
      <div style={{color: AMARELO, fontWeight: 800, fontSize: 32, letterSpacing: 3}}>JABUTIS</div>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 78, transform: `scale(${1 + pulso * 0.4})`}}>{jabutis}</div>
    </div>
    <div style={{color: '#fff', fontWeight: 900, fontSize: 44, alignSelf: 'center', opacity: 0.8}}>×</div>
    <div style={{textAlign: 'center'}}>
      <div style={{color: '#c9e88f', fontWeight: 800, fontSize: 32, letterSpacing: 3}}>LESMAS</div>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 78}}>10.000</div>
    </div>
  </div>
);

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
type Ctx = {bloco: BlocoConv; ini: number; dur: number};

const quadro = (f: number, c: Ctx): {p: ParamsQuintal; ui: React.ReactNode[]; sons: React.ReactNode[]} => {
  const {bloco, ini, dur} = c;
  const t = f / FPS;
  const T = ini + t;
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
  const heroi = {pos: HEROI, giro: GIRO_HEROI, pataNoAr: 1, mastiga: Math.max(0, Math.sin(T * 5)) * 0.6};
  const base: ParamsQuintal = {t: T, avanco: T * 0.008, heroi};

  switch (bloco.cena) {
    case 'abertura': {
      // impacto: voo rasante sobre o mar de lesmas até o Seu Casco
      const cam = camMove({pos: [0.3, 0.16, -3.6], alvo: [0.1, 0.08, -6]}, {pos: [0.55, 0.38, -0.4], alvo: [-0.2, 0.0, -3.8]}, k, 54);
      ui.push(<Titulo key="t" f={f} />);
      som('impacto.wav', 0, 0.7);
      som('escorregar.wav', 8, 0.35);
      return {p: {...base, cam}, ui, sons};
    }
    case 'partiu': {
      // ele levanta a pata... e a pata fica no ar
      const cam = camMove({pos: [0.12, 0.3, 1.75], alvo: [0.1, 0.08, 0.5]}, CAM_HEROI, k, 44);
      const pata = clamp01((T - leg(0) - 0.6) / 0.8);
      ui.push(<Titulo key="t" f={30} />);
      return {p: {...base, cam, heroi: {...heroi, pataNoAr: pata}}, ui, sons};
    }
    case 'seucasco': {
      const cam = camMove(CAM_HEROI, CAM_QUINTAL, k * 1.3, 50);
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      ui.push(<Etiqueta key="e" texto="SEU CASCO" x={600} y={930} linha={110} f={f - 12} amarela />);
      som('clique.wav', 12, 0.6);
      return {p: {...base, cam}, ui, sons};
    }
    case 'regra': {
      // o papelão no tijolo e o primeiro jabuti do público
      const cam = {pos: [0.95, 0.5, 1.55] as Vec, alvo: [0.25, 0.12, 0.2] as Vec, fov: 50};
      const chega = em(leg(0) + 0.9);
      const kk = suave((f - (chega - 30)) / 30);
      const jab: JabutiNaCena = {tipo: 'COMUM', pos: [0.75 - kk * 0.25, 0, 0.05 + kk * 0.15], giro: -1.8, andando: kk < 1 ? 1 : 0};
      ui.push(<PlacarJabutis key="p" jabutis={f >= chega ? 2 : 1} pulso={f >= chega && f < chega + 8 ? 1 - (f - chega) / 8 : 0} />);
      som('papel.wav', 2, 0.7);
      som('pop.wav', chega, 0.5);
      return {p: {...base, cam, jabutis: [jab], extras: <Papelao pos={[0.15, 0, 0.05]} giro={0.5} />}, ui, sons};
    }
    case 'academia': {
      // empurra o vaso... e capota
      const empurra = leg(0) + 1.5;
      const capota = leg(Math.max(0, bloco.legendas.length - 1));
      const anda = clamp01((T - leg(0)) / 1.4);
      const z = SPOT[2] - 0.35 + suave(anda) * 0.25;
      const costas = suave((T - capota - 0.2) / 0.5);
      const jab: JabutiNaCena = {tipo: 'ACADEMIA', pos: [SPOT[0], 0, z], giro: Math.PI, andando: anda < 1 ? 1 : 0, costas};
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      ui.push(<Etiqueta key="e" texto="ACADEMIA" x={560} y={500} linha={110} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      som('baque.wav', em(empurra + 0.5), 0.8);
      som('uuush.wav', em(capota + 0.15), 0.5);
      return {p: {...base, cam: CAM_TIPO, jabutis: [jab], extras: <Vaso pos={[SPOT[0], 0, SPOT[2] - 0.55]} cai={(T - empurra) / 0.5} />}, ui, sons};
    }
    case 'croche': {
      // blindado: a folha bate e volta; depois arrasta o pano de prato e mais um
      const anda = clamp01((T - leg(1)) / 2.5);
      const p0: Vec = [SPOT[0] - 0.3 + anda * 0.5, 0, SPOT[2] - 0.05];
      const p1: Vec = [p0[0] - 0.48, 0, p0[2] + 0.04];
      const folha = clamp01((T - leg(0) - 0.6) / 0.5);
      const fy = 0.6 - folha * 0.46 + (folha >= 1 ? Math.min(0.2, (T - leg(0) - 1.1) * 0.4) : 0);
      const jabs: JabutiNaCena[] = [
        {tipo: 'CROCHE', pos: p0, giro: Math.PI / 2, andando: anda > 0 && anda < 1 ? 1 : 0},
        ...(anda > 0 ? [{tipo: 'COMUM' as const, pos: p1, giro: Math.PI / 2 + 0.2, andando: anda < 1 ? 1 : 0}] : []),
      ];
      const m = <FolhaManga pos={[p0[0], fy, p0[2]]} />;
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      ui.push(<Etiqueta key="e" texto="CROCHÊ" x={560} y={500} linha={110} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      som('tlec.wav', em(leg(0) + 1.1), 0.6);
      return {p: {...base, cam: CAM_TIPO, jabutis: jabs, extras: <>{folha < 1.5 && m}{anda > 0 && <Pano de={[p0[0] - 0.14, 0, p0[2]]} ate={[p1[0] + 0.16, 0, p1[2]]} />}</>}, ui, sons};
    }
    case 'patinete': {
      // passa zunindo e cai no tanque
      const TANQUE: Vec = [2.15, 0.85, -1.6];
      const vai = clamp01((T - leg(0) - 0.3) / 1.1);
      const de: Vec = [-0.3, 0, 0.5];
      const chao = lerp(de, [1.8, 0, -1.3], Math.min(1, vai * 1.15));
      const salto = clamp01((vai - 0.87) / 0.13);
      const pos: Vec = vai < 0.87 ? chao : lerp([1.8, 0, -1.3], TANQUE, salto);
      if (salto > 0) pos[1] += Math.sin(salto * Math.PI) * 0.4;
      const splash = (T - (leg(0) + 0.3 + 1.1)) / 0.9;
      const cam = camMove({pos: [0.3, 0.4, 1.4], alvo: [0.1, 0.1, 0.3]}, {pos: [0.05, 0.55, 1.45], alvo: [1.45, 0.45, -1.1]}, vai * 1.2, 56);
      const jabs: JabutiNaCena[] = salto < 1 ? [{tipo: 'PATINETE', pos, giro: Math.atan2(2.1, -1.8)}] : [{tipo: 'PATINETE', pos: [2.12, 0.8 + Math.sin(T * 3) * 0.008, -1.6], giro: 2.4, escondido: 1}];
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      ui.push(<Etiqueta key="e" texto="PATINETE" x={540} y={500} linha={110} f={f - 4} tam={46} />);
      som('clique.wav', 4, 0.5);
      som('uuush.wav', em(leg(0) + 0.3), 0.8);
      som('tchibum.wav', em(leg(0) + 1.4), 0.9);
      return {p: {...base, cam, jabutis: jabs, extras: <Respingos pos={TANQUE} k={splash} />}, ui, sons};
    }
    case 'obra': {
      // cava no lugar errado e cai no próprio buraco
      const BUR: Vec = [SPOT[0] - 0.05, 0, SPOT[2] - 0.12];
      const cava = clamp01((T - leg(0) - 0.4) / 1.6);
      const cai = suave((T - leg(Math.max(0, bloco.legendas.length - 1)) - 0.2) / 0.6);
      const pos: Vec = [BUR[0] + 0.28 - cai * 0.28, -cai * 0.16, BUR[2] + 0.02];
      const jab: JabutiNaCena = {tipo: 'OBRA', pos, giro: -Math.PI / 2, andando: cava > 0 && cava < 1 ? 1.5 : 0};
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      ui.push(<Etiqueta key="e" texto="OBRA" x={560} y={500} linha={110} f={f - 6} tam={46} />);
      som('clique.wav', 6, 0.5);
      if (cava > 0) som('cavar.wav', em(leg(0) + 0.4), 0.8);
      som('cavar.wav', em(leg(0) + 1.0), 0.8);
      som('baque.wav', em(leg(Math.max(0, bloco.legendas.length - 1)) + 0.6), 0.8);
      return {p: {...base, cam: CAM_TIPO, jabutis: cai >= 1 ? [] : [jab], extras: <Buraco pos={BUR} k={cava} />}, ui, sons};
    }
    case 'lesmas': {
      // close na lesma; depois ela passa o Seu Casco
      const passa = clamp01((T - leg(3)) / 1.5);
      const close = T < leg(2);
      const cam = close
        ? camMove({pos: [0.9, 0.17, 0.2], alvo: [0.55, 0.04, -0.45]}, {pos: [0.95, 0.19, 0.3], alvo: [0.55, 0.04, -0.45]}, k * 2, 40)
        : {pos: [0.85, 0.28, 1.35] as Vec, alvo: [0.3, 0.05, 0.6] as Vec, fov: 46};
      const lesma = close
        ? [{pos: [0.55, 0, -0.45 + t * 0.02] as Vec, giro: 0.15, esc: 1.2}]
        : [{pos: [0.64, 0, 0.3 + passa * 0.6] as Vec, giro: 0, esc: 1.2}];
      ui.push(<NumeroGrande key="n" num="1 MM/S" rotulo="UM MILÍMETRO POR SEGUNDO" f={f} />);
      return {p: {...base, cam, heroi: {...heroi, pos: [0.38, 0, 0.62]}, extras: <LesmasExtra lista={lesma} t={T} />}, ui, sons};
    }
    case 'meta': {
      // o chão treme; a Kombi aparece no portão
      const cam = camMove({pos: [0.4, 0.3, 0.9], alvo: [0.4, 0.4, -6.5]}, {pos: [0.4, 0.42, -1.6], alvo: [0.4, 0.45, -6.5]}, k, 48);
      const treme = clamp01((T - leg(Math.min(1, bloco.legendas.length - 1))) / 0.3);
      ui.push(<NumeroGrande key="n" num="500" rotulo="COMENTÁRIOS" f={f} />);
      som('tremor.wav', em(leg(Math.min(1, bloco.legendas.length - 1))), 0.9);
      return {p: {...base, cam, treme: treme * (1 - clamp01((k - 0.92) / 0.08)), kombi: clamp01((k - 0.45) / 0.4)}, ui, sons};
    }
    case 'prazo': {
      // a multidão de jabutis pisca; no fim, os 4 tipos lado a lado
      const cam = camMove({pos: [0.75, 0.75, 2.4], alvo: [0.1, 0.05, -0.4]}, {pos: [0.6, 0.6, 2.0], alvo: [0.15, 0.08, -0.2]}, k, 52);
      const fila = k > 0.62;
      const pisca = !fila && Math.floor(f / 7) % 2 === 0 && k > 0.15;
      const jabs: JabutiNaCena[] = [];
      if (pisca)
        for (let j = 0; j < 18; j++) jabs.push({tipo: 'COMUM', pos: [-0.25 + (j % 6) * 0.3, 0, 0.05 - Math.floor(j / 6) * 0.35], giro: Math.PI + (j % 3) * 0.2 - 0.2});
      if (fila)
        (['ACADEMIA', 'CROCHE', 'PATINETE', 'OBRA'] as const).forEach((tp, j) => jabs.push({tipo: tp, pos: [-0.05 + j * 0.33, 0, 0.0], giro: 0.25}));
      ui.push(<NumeroGrande key="n" num="24" rotulo="HORAS" f={f} />);
      if (pisca && f % 14 === 0) som('pop.wav', f, 0.3);
      return {p: {...base, cam, jabutis: jabs}, ui, sons};
    }
    case 'ameaca': {
      // a pata finalmente encosta no chão; a primeira lesma sobe na alface
      const cam = camMove(CAM_QUINTAL, {pos: [0.3, 0.4, 1.6], alvo: [-0.15, 0.12, 0.5]}, k * 1.2, 50);
      const pata = 1 - suave((T - leg(Math.min(1, bloco.legendas.length - 1))) / 0.9);
      const sobe = clamp01((T - leg(bloco.legendas.length - 1)) / 1.5);
      const lesmas = [
        {pos: [-0.25, 0.18 + sobe * 0.08, 0.36 + sobe * 0.08] as Vec, giro: 0.4, esc: 1.4},
        {pos: [-0.62, 0.17, 0.36] as Vec, giro: 0.5, esc: 0.9},
      ];
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      som('suspense.wav', 0, 0.35);
      som('tlec.wav', em(leg(Math.min(1, bloco.legendas.length - 1)) + 0.9), 0.5);
      return {p: {...base, cam, heroi: {...heroi, pataNoAr: pata}, extras: <LesmasExtra lista={lesmas} t={T} />}, ui, sons};
    }
    case 'pergunta':
    default: {
      const cam = CAM_HEROI;
      ui.push(<PlacarJabutis key="p" jabutis={1} />);
      const xs = [200, 440, 670, 900];
      ['ACADEMIA', 'CROCHÊ', 'PATINETE', 'OBRA'].forEach((n, j) => ui.push(<Etiqueta key={n} texto={n} x={xs[j]} y={470} linha={0} f={f - j * 2} tam={34} />));
      som('nham.wav', 10, 0.6);
      return {p: {...base, cam, heroi: {...heroi, pataNoAr: 0, mastiga: Math.max(0, Math.sin(f * 0.25))}}, ui, sons};
    }
  }
};

const FolhaManga: React.FC<{pos: Vec}> = ({pos}) => {
  const m = useMaterial(ESTILO);
  return <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.03, 0.006, 0.07]} pos={pos} rot={[0.3, 0.6, 0.2]} mat={m('#3c8a2a')} estilo={ESTILO} contorno={0.15} />;
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

const Legendas: React.FC<{cfg: ConfigConvocacao; destaques: Set<string>}> = ({cfg, destaques}) => {
  const T = useCurrentFrame() / FPS;
  const todas = cfg.blocos.flatMap((b) => b.legendas.map(([de, texto], i) => ({de, texto, ate: i + 1 < b.legendas.length ? b.legendas[i + 1][0] : b.fim + 0.35})));
  const atual = todas.find((l) => T >= l.de && T < l.ate);
  return atual ? <Legenda texto={atual.texto} destaques={destaques} /> : null;
};

const inicioCenas = (cfg: ConfigConvocacao) => cfg.blocos.map((b, i) => (i === 0 ? 0 : Math.round((b.legendas[0][0] - 0.2) * FPS)));

export const ConvocacaoSeuCasco: React.FC<{cfg: ConfigConvocacao}> = ({cfg}) => {
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

export const DURACAO_CONV_SC = Math.round(CONVOCACAO_D01.duracao * FPS);
