import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Cena3D, ParamsCena, Peca, Pinguim, texturaCanvas, useMaterial, Vec} from '../Cena3D';
import {GatoSentado, Pelagem} from '../Gatos';
import {ELENCO} from '../Elenco';
import {Etiqueta, Farinha, NumeroGrande, Placar, queda} from './Convocacao';
import {Capa, CapaProps} from '../Capa';
import {Bloco, CenaBatalha, ConfigBatalha, soldados, Tipo} from './batalhas';

// Desafio 1 · Batalha: o exército real de cada plataforma contra os pinguins.
// Roteiros: series/bisnaga/d01/batalha-<plataforma>/roteiro.md

const FPS = 30;
const AMARELO = '#ffd23f';
const SOMBRA = '0 4px 14px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)';
const ESTILO = 'cartoon' as const;
const YB = 0.92; // tampo do balcão
const GIRO_FRENTE = 2.45; // olhando para os pinguins (e um pouco para a câmera)

const lerp = (a: Vec, b: Vec, k: number): Vec => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const lim = (k: number) => Math.max(0, Math.min(1, k));
const suave = (k: number) => Easing.inOut(Easing.cubic)(lim(k));
const camMove = (de: {pos: Vec; alvo: Vec}, para: {pos: Vec; alvo: Vec}, k: number, fov = 52) => ({
  pos: lerp(de.pos, para.pos, suave(k)),
  alvo: lerp(de.alvo, para.alvo, suave(k)),
  fov,
});

const TIPOS = Object.fromEntries(ELENCO.map((e) => [e.nome, e]));
const MULTIDAO: Pelagem[] = [
  {tipo: 'liso', base: '#9a9a9a'},
  {tipo: 'liso', base: '#2b2b2b'},
  {tipo: 'listrado', base: '#c98a4a', listra: '#7a4a1e'},
  {tipo: 'manchas', base: '#f7f3ea', manchas: ['#222222']},
  {tipo: 'liso', base: '#e8e2d6'},
  {tipo: 'listrado', base: '#8c8c8c', listra: '#4a4a4a'},
];
const NOMES_TIPO: Tipo[] = ['AÇOUGUE', 'FEIRANTE', 'LOTÉRICA', 'SALÃO'];

// ---------- O exército: quem é quem e onde fica ----------
type Soldado = {tipo: Tipo | 'COMUM'; n: number; k: number};
type Pose = {pos: Vec; giro: number; rx?: number; esc?: Vec; olhos?: 'abertos' | 'fechados' | 'meio'; boca?: 'aberta' | 'fechada'; oculto?: boolean};

const montaExercito = (cfg: ConfigBatalha) => {
  const c = cfg.contagem;
  const tipos = [cfg.frente, ...NOMES_TIPO.filter((t) => t !== cfg.frente).sort((a, b) => c[b] - c[a])];
  const lista: Soldado[] = [];
  for (const t of tipos) for (let k = 0; k < c[t]; k++) lista.push({tipo: t, n: lista.length, k});
  for (let k = 0; k < c.comuns; k++) lista.push({tipo: 'COMUM', n: lista.length, k});
  const N = lista.length;
  const capBalcao = N > 30 ? 20 : 16;
  const noBalcao = Math.min(N, capBalcao);
  const linhas = Math.ceil(noBalcao / 4);
  const frenteZ = -0.75 - (linhas - 1) * 0.3;
  const vagas: Vec[] = [];
  const xs = [-0.1, 0.1, -0.3, 0.3];
  for (let r = 0; r < linhas; r++) for (const x of xs) vagas.push([x, YB, frenteZ + r * 0.3]);
  let fundoChao = 0.2;
  for (let r = 0; vagas.length < N; r++)
    for (let col = 0; col < 3; col++)
      for (const lado of [1, -1]) {
        const z = 0.15 - r * 0.34;
        vagas.push([lado * (0.85 + col * 0.27), 0, z]);
        fundoChao = Math.min(fundoChao, z);
      }
  // a ordem da "muralha": os comuns na frente
  const muralha = [...lista.filter((s) => s.tipo === 'COMUM'), ...lista.filter((s) => s.tipo !== 'COMUM')];
  const vagaMuralha = new Map(muralha.map((s, i) => [s.n, vagas[i]]));
  return {lista, vagas, vagaMuralha, frenteZ, fundoChao, N};
};
type Exercito = ReturnType<typeof montaExercito>;

const SoldadoGato: React.FC<{s: Soldado; pose: Pose}> = ({s, pose}) => {
  if (pose.oculto) return null;
  const tipo = s.tipo === 'COMUM' ? null : TIPOS[s.tipo];
  const props = tipo ? tipo.props : {pelagem: MULTIDAO[s.k % MULTIDAO.length], olhos: 'abertos' as const};
  return (
    <group position={pose.pos} rotation={[pose.rx ?? 0, 0, 0]} scale={pose.esc ?? [1, 1, 1]}>
      <GatoSentado
        estilo={ESTILO}
        {...props}
        olhos={pose.olhos ?? props.olhos}
        boca={pose.boca ?? (tipo ? tipo.props.boca : undefined)}
        giro={pose.giro}
        tamanho={0.5 * ((tipo?.props.tamanho as number | undefined) ?? 1)}
      />
    </group>
  );
};

// ---------- Objetos de cena ----------
const POS_BANDEJA: Vec = [0.1, YB, -0.32];
const Bandeja: React.FC = () => {
  const m = useMaterial(ESTILO);
  return (
    <group position={POS_BANDEJA}>
      <Peca forma={{tipo: 'caixa', d: [0.5, 0.02, 0.36]}} pos={[0, 0.01, 0]} mat={m('#9aa3ad', {brilho: 0.6})} estilo={ESTILO} contorno={0.005} />
      {Array.from({length: 8}, (_, i) => (
        <Peca
          key={i}
          forma={{tipo: 'esfera', r: 1}}
          esc={[0.1, 0.04, 0.05]}
          pos={[-0.17 + (i % 4) * 0.115, 0.045, i < 4 ? -0.08 : 0.08]}
          rot={[0, 0.15 * ((i % 3) - 1), 0]}
          mat={m('#e0a458')}
          estilo={ESTILO}
          contorno={0.1}
        />
      ))}
    </group>
  );
};

// a prateleirinha de formas da LOTÉRICA (cai para a frente, em cima dos pinguins)
const Prateleira: React.FC<{pos: Vec; cai: number}> = ({pos, cai}) => {
  const m = useMaterial(ESTILO);
  const metal = m('#b9c0c8', {brilho: 0.7});
  const madeira = m('#b5793f');
  const giro = -cai * 1.45;
  return (
    <group position={pos}>
      <group rotation={[giro, 0, 0]}>
        {[-0.13, 0.13].map((x) => (
          <Peca key={x} forma={{tipo: 'caixa', d: [0.02, 0.5, 0.02]}} pos={[x, 0.25, 0]} mat={madeira} estilo={ESTILO} />
        ))}
        {[0.12, 0.28, 0.44].map((y) => (
          <Peca key={y} forma={{tipo: 'caixa', d: [0.28, 0.015, 0.14]}} pos={[0, y, 0]} mat={madeira} estilo={ESTILO} />
        ))}
        {[0.12, 0.28, 0.44].map((y, j) =>
          [0, 1, 2].map((k) => (
            <Peca
              key={`${j}${k}`}
              forma={{tipo: 'cilindro', r: 0.055, h: 0.022}}
              pos={[-0.06 + k * 0.06, y + 0.02 + k * 0.022 + cai * k * 0.08, cai * (k - 1) * 0.12]}
              rot={[cai * k * 1.3, 0, cai * (k - 1)]}
              mat={metal}
              estilo={ESTILO}
              contorno={0.004}
            />
          )),
        )}
      </group>
    </group>
  );
};

const FormaDeBolo: React.FC<{pos: Vec}> = ({pos}) => {
  const m = useMaterial(ESTILO);
  return <Peca forma={{tipo: 'cilindro', r: 0.06, h: 0.025}} pos={pos} mat={m('#b9c0c8', {brilho: 0.7})} estilo={ESTILO} contorno={0.004} />;
};

// um rolinho de massa arremessado (e que erra)
const Rolinho: React.FC<{T: number; t0: number; de: Vec; para: Vec; dur?: number}> = ({T, t0, de, para, dur = 0.6}) => {
  const m = useMaterial(ESTILO);
  const k = (T - t0) / dur;
  if (k < 0) return null;
  const kk = Math.min(1, k);
  const pos = lerp(de, para, kk);
  pos[1] += Math.sin(kk * Math.PI) * 0.35;
  return <Peca forma={{tipo: 'cilindro', r: 0.022, h: 0.13}} pos={pos} rot={[kk < 1 ? T * 14 : Math.PI / 2, 0, kk < 1 ? T * 9 : 0.3]} mat={m('#b5793f')} estilo={ESTILO} />;
};

// pinguins empurrando o Bisnaga (não conseguem)
const Empurradores: React.FC<{t: number; z: number}> = ({t, z}) => {
  const m = useMaterial(ESTILO);
  const mats = useMemo(() => [m('#1b1d24', {brilho: 0.7}), m('#f6f4ee', {brilho: 0.7}), m('#f2902a', {brilho: 0.6}), m('#ffffff', {brilho: 0.9})], [m]);
  return (
    <>
      {[-0.12, 0.04, 0.2, 0.32].map((x, i) => (
        <Pinguim key={x} estilo={ESTILO} pos={[x, YB, z + Math.sin(t * 6 + i) * 0.015]} giro={0.1 * (i - 1.5)} mats={mats} tomba={0.14 + Math.sin(t * 6 + i) * 0.05} />
      ))}
    </>
  );
};

const SACO: Vec = [-0.3, 1.1, 0.75];
const Remendo: React.FC<{k: number}> = ({k}) => {
  const m = useMaterial(ESTILO);
  const a = 0.8;
  if (k <= 0) return null;
  const s = 0.6 + 0.4 * Math.min(1, k) + (k < 1 ? Math.sin(k * Math.PI) * 0.3 : 0);
  return (
    <group position={[SACO[0] + Math.sin(a) * 0.138, SACO[1] + 0.02, SACO[2] + Math.cos(a) * 0.138]} rotation={[0, a, 0]} scale={[s, s, 1]}>
      <Peca forma={{tipo: 'caixa', d: [0.09, 0.08, 0.008]}} rot={[0, 0, 0.12]} mat={m('#c79a5b')} estilo={ESTILO} contorno={0.004} />
      {[-0.03, 0, 0.03].map((x) => (
        <Peca key={x} forma={{tipo: 'caixa', d: [0.004, 0.11, 0.004]}} pos={[x, 0, 0.006]} rot={[0, 0, 0.12 + Math.PI / 2]} mat={m('#4a2a14')} estilo={ESTILO} contorno={0} />
      ))}
    </group>
  );
};

// ---------- O gancho: a porta de aço da padaria, lá fora ----------
const CameraLivre: React.FC<{pos: Vec; alvo: Vec; fov: number}> = ({pos, alvo, fov}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(...alvo);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.updateProjectionMatrix();
  return null;
};

const PortaDeAco: React.FC<{T: number; rato: number; treme: number; cam: {pos: Vec; alvo: Vec; fov: number}}> = ({T, rato, treme, cam}) => {
  const m = useMaterial(ESTILO);
  const porta = useMemo(
    () =>
      texturaCanvas(64, 256, (c) => {
        for (let y = 0; y < 256; y += 16) {
          c.fillStyle = '#9aa1a8';
          c.fillRect(0, y, 64, 10);
          c.fillStyle = '#6c737b';
          c.fillRect(0, y + 10, 64, 6);
        }
      }, [1, 1]),
    [],
  );
  const placa = useMemo(
    () =>
      texturaCanvas(512, 128, (c) => {
        c.fillStyle = '#9c2b1f';
        c.fillRect(0, 0, 512, 128);
        c.fillStyle = '#fff3d6';
        c.font = 'bold 84px Arial';
        c.textAlign = 'center';
        c.fillText('PADARIA', 256, 96);
      }),
    [],
  );
  const calcada = useMemo(
    () =>
      texturaCanvas(128, 128, (c) => {
        c.fillStyle = '#8d8a84';
        c.fillRect(0, 0, 128, 128);
        c.fillStyle = '#76736d';
        c.fillRect(0, 62, 128, 4);
        c.fillRect(62, 0, 4, 128);
      }, [8, 4]),
    [],
  );
  const cinza = m('#8b8f99');
  const rosa = m('#f29aa8');
  const preto = m('#141018');
  const vib = Math.sin(T * 70) * 0.004 * treme;
  const zr = -0.12 + rato * 0.2;
  return (
    <>
      <CameraLivre {...cam} />
      <color attach="background" args={['#0d1226']} />
      <fog attach="fog" args={['#0d1226', 4, 10]} />
      <ambientLight intensity={0.75} color="#8ea2ff" />
      <pointLight position={[1.6, 2.6, 1.4]} intensity={6} distance={7} decay={1.3} color="#ffb860" castShadow shadow-bias={-0.003} />
      {/* calçada e rua */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]} material={m('#ffffff', {mapa: calcada})} receiveShadow>
        <planeGeometry args={[8, 4]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 5]} material={m('#2a2c33')}>
        <planeGeometry args={[12, 4]} />
      </mesh>
      {/* fachada */}
      <mesh position={[0, 1.6, -0.08]} material={m('#d8c3a0')} receiveShadow>
        <planeGeometry args={[8, 3.4]} />
      </mesh>
      <mesh position={[0, 2.6, -0.02]} material={m('#ffffff', {mapa: placa})}>
        <planeGeometry args={[1.6, 0.4]} />
      </mesh>
      {/* a porta de aço, meio levantada embaixo */}
      <group position={[vib, 0, 0]}>
        <mesh position={[0, 1.16 + 0.1, -0.03]} material={m('#ffffff', {mapa: porta, brilho: 0.5})} castShadow receiveShadow>
          <boxGeometry args={[2.1, 2.1, 0.04]} />
        </mesh>
        <Peca forma={{tipo: 'caixa', d: [2.12, 0.04, 0.07]}} pos={[0, 0.21, -0.02]} mat={m('#5b6168')} estilo={ESTILO} />
      </group>
      {[-1.08, 1.08].map((x) => (
        <Peca key={x} forma={{tipo: 'caixa', d: [0.07, 2.4, 0.1]}} pos={[x, 1.2, -0.03]} mat={m('#4a4f56')} estilo={ESTILO} />
      ))}
      {/* o rato espiando pela fresta */}
      <group position={[0.32, 0.08, zr]} rotation={[0, -0.25, 0]}>
        <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.075, 0.06, 0.1]} mat={cinza} estilo={ESTILO} contorno={0.08} />
        <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.035, 0.03, 0.05]} pos={[0, -0.01, 0.08]} mat={cinza} estilo={ESTILO} contorno={0.1} />
        <Peca forma={{tipo: 'esfera', r: 0.013}} pos={[0, 0.0, 0.13]} mat={rosa} estilo={ESTILO} contorno={0} />
        {[-1, 1].map((l) => (
          <group key={l}>
            <Peca forma={{tipo: 'esfera', r: 0.012}} pos={[l * 0.035, 0.03, 0.07]} mat={preto} estilo={ESTILO} contorno={0} />
            <Peca forma={{tipo: 'esfera', r: 0.004}} pos={[l * 0.035 + 0.004, 0.035, 0.081]} mat={m('#ffffff')} estilo={ESTILO} contorno={0} />
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.03, 0.035, 0.01]} pos={[l * 0.055, 0.065, 0.0]} rot={[0, 0, l * 0.4]} mat={rosa} estilo={ESTILO} contorno={0.1} />
            {[-0.012, 0.004].map((y) => (
              <Peca key={y} forma={{tipo: 'caixa', d: [0.09, 0.002, 0.002]}} pos={[l * 0.05, y, 0.11]} rot={[0, l * 0.3, y * 10 * l]} mat={preto} estilo={ESTILO} contorno={0} />
            ))}
          </group>
        ))}
        {/* dentões */}
        <Peca forma={{tipo: 'caixa', d: [0.018, 0.016, 0.004]}} pos={[0, -0.04, 0.115]} mat={m('#fff8e0')} estilo={ESTILO} contorno={0.003} />
      </group>
    </>
  );
};

// ---------- Interface na tela ----------
const Titulo: React.FC<{f: number; gatos: number}> = ({f, gatos}) => {
  const k = interpolate(f, [0, 6], [1.4, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: SOMBRA, transform: `scale(${k})`}}>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>{gatos} {gatos === 1 ? 'GATO' : 'GATOS'}</div>
      <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
    </div>
  );
};

const Selo: React.FC<{texto: string; f: number; top: number; amarelo?: boolean; tam?: number}> = ({texto, f, top, amarelo, tam = 54}) => {
  const k = interpolate(f, [0, 6], [1.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(f, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top, width: '100%', textAlign: 'center', opacity: o, transform: `scale(${k})`}}>
      <span
        style={{
          background: amarelo ? AMARELO : '#141018',
          color: amarelo ? '#141018' : '#fff',
          fontWeight: 900,
          fontSize: tam,
          padding: '10px 26px',
          borderRadius: 12,
          boxShadow: `0 4px 0 ${amarelo ? '#141018' : AMARELO}`,
          letterSpacing: 1,
        }}
      >
        {texto}
      </span>
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
type Ctx = {cfg: ConfigBatalha; ex: Exercito; bloco: Bloco; ini: number; dur: number};

const quadro = (cena: CenaBatalha, f: number, c: Ctx): {p: ParamsCena; ui: React.ReactNode[]; sons: React.ReactNode[]; gancho?: React.ReactNode} => {
  const {cfg, ex, bloco, ini, dur} = c;
  const t = f / FPS;
  const T = ini + t; // segundo da narração
  const em = (s: number) => Math.round((s - ini) * FPS); // quadro local de um segundo da narração
  const leg = (i: number) => bloco.legendas[Math.min(i, bloco.legendas.length - 1)][0];
  const achar = (trecho: string) => bloco.legendas.find(([, x]) => x.toLowerCase().includes(trecho.toLowerCase()));
  const quando = (trecho: string, senao: number) => achar(trecho)?.[0] ?? senao;
  const k = f / dur;
  const total = soldados(cfg.contagem);
  const ui: React.ReactNode[] = [];
  const sons: React.ReactNode[] = [];
  const som = (arq: string, de: number, vol = 1) =>
    sons.push(
      <Sequence key={`${arq}${de}${sons.length}`} from={Math.max(0, de)}>
        <Audio src={staticFile(`sfx/${arq}`)} volume={vol} />
      </Sequence>,
    );

  const recuoBase = 0.1 - ex.frenteZ;
  const recuoChaoBase = 0.2 - (ex.fundoChao - 0.55);
  const base: ParamsCena = {t, respira: Math.sin(t * 2.2) * 0.5 + 0.5, recuo: recuoBase, recuoChao: recuoChaoBase};
  const bob = (s: Soldado) => Math.sin(t * 2 + s.n * 1.7) * 0.004;
  const poseVaga = (s: Soldado): Pose => {
    const v = ex.vagas[s.n];
    return {pos: [v[0], v[1] + bob(s), v[2]], giro: GIRO_FRENTE + Math.sin(s.n * 2.3) * 0.15};
  };
  const doTipo = (tp: Tipo) => ex.lista.filter((s) => s.tipo === tp);
  const fila = (n: number, j: number, z: number): Vec => [(j - (n - 1) / 2) * 0.17 + 0.02, YB, z];
  const FOCO_Z = ex.frenteZ - 0.3;
  const placar = (g = total + 1, pulso = 0) => ui.push(<Placar key="placar" gatos={g} pulso={pulso} />);
  const exercito = (pose: (s: Soldado) => Pose) => ex.lista.map((s) => <SoldadoGato key={s.n} s={s} pose={pose(s)} />);
  const marchaParada = (m: number) => ({marcha: m, recuo: recuoBase + m, recuoChao: recuoChaoBase + m * 0.8});
  const bandeja = <Bandeja key="bandeja" />;
  // câmera de lado do balcão, olhando a linha de frente (gatos à direita, pinguins ao fundo)
  const camLado = (z: number, kk: number, dz = 0) =>
    camMove({pos: [1.85, 1.62, z + 0.75 + dz], alvo: [-0.05, 1.22, z - 0.3]}, {pos: [1.7, 1.57, z + 0.6 + dz], alvo: [-0.05, 1.2, z - 0.32]}, kk, 40);

  switch (cena) {
    case 'chamado': {
      const cam =
        ex.N <= 4
          ? camMove({pos: [1.2, 1.25, ex.frenteZ + 1.2], alvo: [-0.1, 1.0, ex.frenteZ - 1.0]}, {pos: [1.05, 1.2, ex.frenteZ + 0.95], alvo: [-0.1, 1.0, ex.frenteZ - 1.1]}, k, 50)
          : camMove({pos: [1.35, 1.2, 0.7], alvo: [-0.2, 0.95, -2.2]}, {pos: [1.15, 1.15, 0.2], alvo: [-0.2, 0.95, -2.4]}, k, 50);
      ui.push(<Titulo key="t" f={f} gatos={total + 1} />);
      som('impacto.wav', 0, 0.7);
      return {p: {...base, ...marchaParada(t * 0.05), cam, extras: [bandeja, ...exercito(poseVaga)]}, ui, sons};
    }
    case 'contagem': {
      const cam = camMove({pos: [1.7, 2.2, 1.5], alvo: [-0.1, 0.7, -1.3]}, {pos: [1.5, 2.0, 1.1], alvo: [-0.1, 0.7, -1.4]}, k, 52);
      const passo = (dur * 0.72) / ex.N;
      const chega = (s: Soldado) => 4 + Math.round(s.n * passo);
      const chegaram = ex.lista.filter((s) => f >= chega(s) + 9).length;
      const ultimo = ex.lista.filter((s) => f >= chega(s) + 9).map(chega).pop() ?? -99;
      placar(1 + chegaram, f - ultimo - 9 < 6 ? 1 - (f - ultimo - 9) / 6 : 0);
      ex.lista.forEach((s, i) => {
        if (ex.N <= 30 || i % 2 === 0) som('pop.wav', chega(s) + 9, 0.35);
      });
      const comercio = total - cfg.contagem.comuns;
      if (T >= leg(0)) ui.push(<Selo key="c1" texto={cfg.contagem.comuns === 1 ? '1 COMUM' : `${cfg.contagem.comuns} COMUNS`} f={f - em(leg(0))} top={480} />);
      if (T >= leg(1)) ui.push(<Selo key="c2" texto={`${comercio} DO COMÉRCIO`} f={f - em(leg(1))} top={580} amarelo />);
      return {
        p: {
          ...base,
          cam,
          extras: [
            bandeja,
            ...exercito((s) => {
              const pz = poseVaga(s);
              if (f < chega(s)) return {...pz, oculto: true};
              return {...pz, pos: [pz.pos[0], pz.pos[1] + queda(f, chega(s)), pz.pos[2]]};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'frente': {
      const cam = camLado(ex.frenteZ, k);
      placar();
      const n = cfg.contagem[cfg.frente];
      if (T >= leg(1)) {
        ui.push(<Etiqueta key="e" texto={`${cfg.frente} ×${n}`} x={540} y={430} linha={60} f={f - em(leg(1))} amarela tam={50} />);
      }
      som('clique.wav', em(leg(1)), 0.6);
      const passo = suave((f - em(leg(1))) / 15) * 0.1;
      return {
        p: {...base, ...marchaParada(t * 0.04), cam, extras: [bandeja, ...exercito((s) => (s.tipo === cfg.frente ? {...poseVaga(s), pos: [ex.vagas[s.n][0], YB, ex.vagas[s.n][2] - passo]} : poseVaga(s)))]},
        ui,
        sons,
      };
    }
    case 'barriga': {
      const cam = camLado(ex.frenteZ, k, 0.1);
      placar();
      const anda = suave((T - leg(0)) / 1.2) * 0.12;
      const vira = suave((T - leg(2) + 0.2) / 0.5);
      som('nham.wav', em(leg(2)) + 10, 0.7);
      som('nham.wav', em(leg(2)) + 55, 0.5);
      return {
        p: {
          ...base,
          ...marchaParada(t * 0.04),
          cam,
          extras: [
            bandeja,
            ...exercito((s) => {
              if (s.tipo !== cfg.frente) return poseVaga(s);
              const v = ex.vagas[s.n];
              const come = vira > 0.99 ? Math.abs(Math.sin(t * 9 + s.k)) * 0.018 : 0;
              return {pos: [v[0], YB + come, v[2] - 0.1 - anda + vira * 0.12], giro: GIRO_FRENTE - vira * Math.PI + Math.sin(t * 9 + s.k) * 0.05 * vira, olhos: vira > 0.5 ? 'fechados' : undefined};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'pinguins': {
      const cam = camMove({pos: [1.3, 0.45, ex.fundoChao - 0.15], alvo: [1.1, 0.12, ex.fundoChao - 3.0]}, {pos: [1.3, 0.5, ex.fundoChao], alvo: [1.1, 0.1, ex.fundoChao - 3.0]}, k, 52);
      placar();
      const desl = suave((T - leg(1)) / 2.5);
      if (T >= leg(1)) ui.push(<NumeroGrande key="n" num="1.000" rotulo="ESCORREGANDO" f={f - em(leg(1))} />);
      som('escorregar.wav', em(leg(1)), 0.8);
      som('escorregar.wav', em(leg(1)) + 25, 0.6);
      return {p: {...base, cam, marcha: desl > 0 ? 0 : t * 0.08, escorregando: desl * 0.17, extras: [bandeja, ...exercito(poseVaga)]}, ui, sons};
    }
    case 'feirante':
    case 'loterica':
    case 'salao': {
      const tp: Tipo = cena === 'feirante' ? 'FEIRANTE' : cena === 'loterica' ? 'LOTÉRICA' : 'SALÃO';
      const grupo = doTipo(tp);
      const n = grupo.length;
      const cam = camLado(FOCO_Z, k);
      placar();
      ui.push(<Etiqueta key="e" texto={n > 1 ? `${tp} ×${n}` : tp} x={540} y={430} linha={60} f={f - 4} tam={50} />);
      som('clique.wav', 4, 0.5);
      let marcha = t * 0.05;
      let derrubados = 0;
      const tTrope = achar('tropeça') ? quando('tropeça', 0) + (achar('tropeça')![1].startsWith('A LOTÉRICA') ? 1.0 : 0.4) : 0;
      const tCai = achar('prateleira') ? quando('prateleira', 0) + (achar('prateleira')![1].startsWith('E derruba') ? 0.6 : 0.1) : 0;
      const outros: React.ReactNode[] = [];
      const pose = (s: Soldado): Pose => {
        if (s.tipo === cfg.frente) {
          // o açougue continua comendo, de costas para a guerra
          const v = ex.vagas[s.n];
          return {pos: [v[0], YB + Math.abs(Math.sin(t * 9 + s.k)) * 0.018, v[2] + 0.02], giro: GIRO_FRENTE - Math.PI, olhos: 'fechados'};
        }
        if (s.tipo !== tp) return poseVaga(s);
        const j = grupo.indexOf(s);
        const p0 = fila(n, j, FOCO_Z);
        if (tp === 'FEIRANTE') {
          const rouco = T >= leg(2) + 0.3;
          return {pos: p0, giro: 2.2 + (rouco ? 0 : Math.sin(f * 2.1 + j) * 0.07), boca: T >= leg(0) + 0.3 && !rouco ? 'aberta' : 'fechada', olhos: rouco ? 'meio' : 'abertos'};
        }
        if (tp === 'LOTÉRICA') {
          const trope = T - tTrope;
          const rx = trope > 0 && trope < 0.9 ? -Math.sin((trope / 0.9) * Math.PI) * 0.55 : 0;
          const mira = achar('miram') && T < tTrope - 0.3 ? Math.sin(t * 3 + j) * 0.25 : 0;
          return {pos: [p0[0], p0[1], p0[2] - (trope > 0 ? Math.min(trope, 0.4) * 0.15 : 0)], giro: 2.2 + mira, rx: j === 0 ? rx : 0, olhos: trope > 0 && trope < 1.5 && j === 0 ? 'fechados' : 'abertos'};
        }
        // SALÃO: desfile no chão encerado, depois a farinha e a fuga
        const fuga = T - (leg(1) + 0.9);
        const desfile = Math.min(T - leg(0), leg(1) + 0.9 - leg(0));
        const z = p0[2] - desfile * 0.06;
        const x = p0[0] + Math.sin(desfile * 2.4 + j) * 0.05;
        if (fuga > 0) {
          const kk = fuga / 0.5;
          return {pos: [x + kk * kk * 1.6, YB, z + kk * 0.3], giro: 1.4};
        }
        return {pos: [x, YB, z], giro: 2.0 + Math.sin(desfile * 2.4 + j) * 0.4, olhos: 'meio'};
      };
      if (tp === 'FEIRANTE') {
        marcha = T < leg(0) + 0.3 ? t * 0.05 : (em(leg(0) + 0.3) / FPS) * 0.05;
        som('grito.wav', em(leg(0) + 0.3), 0.55);
        som('grito.wav', em(leg(1) + 0.2), 0.45);
        som('miadinho.wav', em(leg(2) + 0.4), 0.7);
      }
      if (tp === 'LOTÉRICA') {
        const cai = suave((T - tCai) / 0.5);
        derrubados = cai > 0.6 ? Math.min(16, Math.round((T - tCai - 0.25) * 40)) : 0;
        outros.push(<Prateleira key="prat" pos={[0.3, YB, FOCO_Z - 0.05]} cai={cai} />);
        if (achar('miram'))
          grupo.forEach((_, j) => {
            const t0 = leg(0) + 0.6 + j * 0.35;
            outros.push(<Rolinho key={`r${j}`} T={T} t0={t0} de={[fila(n, j, FOCO_Z)[0], YB + 0.25, FOCO_Z]} para={[fila(n, j, FOCO_Z)[0] + (j % 2 ? 0.75 : -0.7), 0.05, FOCO_Z - 0.6 - j * 0.1]} />);
            som('uuush.wav', em(t0), 0.35);
          });
        som('baque.wav', em(tTrope + 0.1), 0.6);
        som('clang.wav', em(tCai + 0.2), 0.6);
        som('tlec_varios.wav', em(tCai + 0.3), 0.8);
      }
      if (tp === 'SALÃO') {
        if (T > leg(1)) outros.push(<Farinha key="far" f={f - em(leg(1)) + 20} centro={[fila(n, 0, FOCO_Z)[0], YB, FOCO_Z - (leg(1) + 0.9 - leg(0)) * 0.06]} />);
        som('escorregar.wav', 6, 0.5);
        som('uuush.wav', em(leg(1) + 0.9), 0.7);
      }
      return {p: {...base, ...marchaParada(marcha), cam, derrubados, extras: [bandeja, ...outros, ...exercito(pose)]}, ui, sons};
    }
    case 'porta':
    case 'mira':
    case 'tropeca':
    case 'prateleira':
    case 'silencio': {
      // TikTok: um gato comum na porta e uma LOTÉRICA
      placar();
      const outros: React.ReactNode[] = [];
      let cam = camLado(FOCO_Z + (cena === 'tropeca' ? 0.42 : 0.22), k);
      let marcha = t * 0.05;
      let derrubados = 0;
      let solo: Vec | null = null;
      let poseLot: Pose = {pos: [0.12, YB, FOCO_Z + 0.2], giro: 2.2};
      const poseComum: Pose = {pos: [-0.08, YB, FOCO_Z - 0.1], giro: 2.45, olhos: 'meio'};
      if (cena === 'porta') {
        if (T >= leg(0)) ui.push(<Etiqueta key="e" texto="GATO COMUM" x={540} y={430} linha={60} f={f - em(leg(0))} tam={50} />);
        const para = leg(0) + 1.4;
        marcha = Math.min(t, para - ini) * 0.05;
        solo = [-0.02, YB, FOCO_Z - 0.75 + suave((T - leg(0)) / 1.3) * 0.45];
        som('escorregar.wav', em(leg(0)), 0.5);
        som('tlec.wav', em(leg(0) + 1.3), 0.6);
      }
      if (cena === 'mira') {
        ui.push(<Etiqueta key="e" texto="LOTÉRICA" x={540} y={430} linha={60} f={f - 4} tam={50} />);
        const primeiro = !!achar('primeiro');
        const t0 = leg(0) + (primeiro ? 2.3 : 0.5);
        const para: Vec = primeiro ? [-1.0, 0.05, FOCO_Z - 0.2] : [-0.7, 1.5, FOCO_Z - 2.6];
        poseLot = {pos: [0.12, YB, FOCO_Z + 0.2], giro: 2.2 + (T < t0 ? Math.sin(t * 2) * 0.12 : -0.3), olhos: T < t0 ? 'meio' : 'abertos'};
        outros.push(<Rolinho key="r" T={T} t0={t0} de={[0.12, YB + 0.25, FOCO_Z + 0.2]} para={para} dur={primeiro ? 0.6 : 0.8} />);
        som('uuush.wav', em(t0), 0.5);
        som('baque.wav', em(t0 + (primeiro ? 0.6 : 0.8)), 0.35);
      }
      if (cena === 'tropeca') {
        const vira = suave((T - leg(0)) / 0.6);
        const passo = suave((T - leg(1) - 0.3) / 0.5) * 0.12;
        const tTr = quando('tropeça', leg(2)) + 0.5;
        const tr = T - tTr;
        const rx = tr > 0 ? Math.min(1, tr / 0.35) * 0.9 : 0;
        poseLot = {pos: [0.12, YB + (tr > 0 ? -Math.min(1, tr / 0.35) * 0.02 : 0), FOCO_Z + 0.2 + passo], giro: 2.2 - vira * 2.4, rx, olhos: tr > 0 ? 'fechados' : 'meio'};
        outros.push(<FormaDeBolo key="forma" pos={[0.1, YB + 0.013, FOCO_Z + 0.44]} />);
        som('baque.wav', em(tTr + 0.3), 0.7);
        som('clang.wav', em(tTr + 0.25), 0.25);
      }
      if (cena === 'prateleira' || cena === 'silencio') {
        const tCai = cena === 'prateleira' ? leg(0) + 0.2 : -99;
        const cai = cena === 'prateleira' ? suave((T - tCai) / 0.5) : 1;
        derrubados = cena === 'prateleira' ? (cai > 0.6 ? Math.min(140, Math.round((T - tCai - 0.25) * 70)) : 0) : 140;
        marcha = cena === 'prateleira' ? Math.min(t, tCai - ini + 0.3) * 0.05 : 0.02;
        outros.push(<Prateleira key="prat" pos={[0.3, YB, FOCO_Z - 0.05]} cai={cai} />);
        poseLot = cena === 'prateleira' ? {pos: [0.05, YB - 0.02, FOCO_Z + 0.5], giro: -0.2, rx: 0.9, olhos: 'fechados'} : {pos: [0.05, YB, FOCO_Z + 0.5], giro: 2.0 + Math.sin(t * 1.2) * 0.4, olhos: 'abertos'};
        const largo = {pos: [1.1, 2.1, FOCO_Z + 1.3] as Vec, alvo: [0, 0.75, FOCO_Z - 2.4] as Vec};
        cam = cena === 'prateleira' ? camMove({pos: cam.pos, alvo: cam.alvo}, largo, (T - leg(1) + 0.4) / 1.2, 46) : camMove(largo, {pos: [1.0, 1.95, FOCO_Z + 1.0], alvo: [0, 0.75, FOCO_Z - 2.4]}, k, 46);
        if (cena === 'prateleira') {
          if (T >= leg(1)) ui.push(<NumeroGrande key="n" num="200" rotulo="PINGUINS NO CHÃO" f={f - em(leg(1))} />);
          som('clang.wav', em(tCai + 0.2), 0.7);
          som('tlec_varios.wav', em(tCai + 0.3), 0.9);
          som('tlec_varios.wav', em(tCai + 1.1), 0.8);
          som('tlec_varios.wav', em(tCai + 1.9), 0.6);
        }
      }
      return {
        p: {
          ...base,
          ...marchaParada(marcha),
          cam,
          derrubados,
          solo,
          extras: [bandeja, ...outros, ...exercito((s) => (s.tipo === 'COMUM' ? {...poseComum, pos: [poseComum.pos[0], YB + bob(s), poseComum.pos[2]]} : poseLot))],
        },
        ui,
        sons,
      };
    }
    case 'comuns': {
      const cam = camLado(ex.frenteZ, k, 0.15);
      placar();
      if (T >= leg(1)) ui.push(<Etiqueta key="e" texto={`${cfg.contagem.comuns} COMUNS`} x={540} y={430} linha={60} f={f - em(leg(1))} tam={50} />);
      // um pinguim escorrega até a muralha e volta
      const ciclo = (t % 1.6) / 1.6;
      const solo: Vec = [0.02, YB, ex.frenteZ - 0.75 + Math.sin(ciclo * Math.PI) * 0.45];
      som('escorregar.wav', 0, 0.5);
      som('tlec.wav', 24, 0.7);
      som('tlec.wav', 72, 0.7);
      som('tlec.wav', 120, 0.7);
      const deita = suave((T - leg(1)) / 0.4);
      return {
        p: {
          ...base,
          ...marchaParada(t * 0.04),
          cam,
          solo,
          extras: [
            bandeja,
            ...exercito((s) => {
              const v = ex.vagaMuralha.get(s.n)!;
              const comum = s.tipo === 'COMUM';
              return {
                pos: [v[0], v[1] + bob(s), v[2]],
                giro: GIRO_FRENTE + Math.sin(s.n * 2.3) * 0.15,
                esc: comum ? [1 + deita * 0.3, 1 - deita * 0.35, 1 + deita * 0.15] : undefined,
                olhos: comum && deita > 0.5 ? 'meio' : undefined,
              };
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'patada': {
      const cam = camLado(ex.frenteZ, k);
      placar();
      const n = cfg.contagem[cfg.frente];
      const tGolpe = quando('patada', leg(3));
      const golpe = T - tGolpe - 0.35;
      const queda1 = golpe > 0 ? Math.min(n * 5 + 4, Math.round(golpe * 45)) : 0;
      if (T >= leg(0)) ui.push(<Etiqueta key="e" texto={`${cfg.frente} ×${n}`} x={540} y={430} linha={60} f={f - em(leg(0))} amarela tam={50} />);
      som('nham.wav', em(leg(1)), 0.5);
      som('uuush.wav', em(tGolpe + 0.2), 0.6);
      som('baque.wav', em(tGolpe + 0.35), 0.9);
      som('tlec_varios.wav', em(tGolpe + 0.4), 0.9);
      return {
        p: {
          ...base,
          ...marchaParada(golpe > 0 ? 0 : t * 0.04),
          cam,
          derrubados: queda1,
          extras: [
            bandeja,
            ...exercito((s) => {
              if (s.tipo !== cfg.frente) return poseVaga(s);
              const v = ex.vagas[s.n];
              const lunge = golpe > 0 && golpe < 0.6 ? Math.sin((golpe / 0.6) * Math.PI) : 0;
              const lambe = T < tGolpe - 1.2 ? 'fechados' : 'abertos';
              return {pos: [v[0], YB + lunge * 0.05, v[2] - 0.1 - lunge * 0.14], giro: GIRO_FRENTE, rx: -lunge * 0.3, olhos: lambe};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'dezmil': {
      const cam = camMove({pos: [0.7, 2.3, 2.2], alvo: [0, 0.7, -2.4]}, {pos: [0.55, 2.6, 2.6], alvo: [0, 0.6, -2.8]}, k, 52);
      placar();
      const tDez = quando('dez mil', leg(0));
      if (T >= tDez) ui.push(<NumeroGrande key="n" num="10.000" rotulo="PINGUINS" f={f - em(tDez)} />);
      const avanco = suave(k) * 0.45;
      const atras = achar('seguram') ? suave((T - quando('seguram', 0)) / 1.5) * 0.3 : 0;
      som('tlec_varios.wav', 10, 0.5);
      som('tlec_varios.wav', 70, 0.5);
      som('suspense.wav', em(leg(1)), 0.4);
      return {
        p: {...base, marcha: t * 0.08, recuo: recuoBase + t * 0.08 - avanco, recuoChao: recuoChaoBase + t * 0.064 - avanco, cam, extras: [bandeja, ...exercito((s) => {
          const pz = poseVaga(s);
          return {...pz, pos: [pz.pos[0], pz.pos[1], pz.pos[2] + atras]};
        })]},
        ui,
        sons,
      };
    }
    case 'rola': {
      const cam = camMove({pos: [1.0, 1.45, 1.05], alvo: [0.05, 0.95, -0.2]}, {pos: [0.9, 1.35, 0.85], alvo: [0.08, 0.98, -0.25]}, k, 50);
      placar();
      const rolar = suave((T - leg(0) - 1.6) / 1.4);
      const bpos: Vec = [0.14 - rolar * 0.04, YB + rolar * 0.035 + Math.sin(rolar * Math.PI) * 0.12, 0.22 - rolar * 0.52];
      som('ronco.wav', 0, 0.5);
      som('baque.wav', em(leg(0) + 3.0), 0.5);
      return {
        p: {...base, cam, marcha: t * 0.06, recuo: 0.35 + t * 0.06, recuoChao: 0.6, bisnaga: {pos: bpos, giro: -0.95 + rolar * 0.5}, extras: [bandeja]},
        ui,
        sons,
      };
    }
    case 'pao': {
      const cam = camMove({pos: [1.25, 1.4, 0.75], alvo: [0.15, 1.12, -0.35]}, {pos: [1.1, 1.32, 0.6], alvo: [0.18, 1.14, -0.33]}, k, 50);
      placar();
      if (T >= leg(0)) ui.push(<NumeroGrande key="n" num="6 KG" rotulo="DE GATO" f={f - em(leg(0))} />);
      if (T >= leg(2)) ui.push(<Selo key="s" texto="O PÃO ESTÁ SALVO" f={f - em(leg(2))} top={760} amarelo />);
      som('ronco.wav', 10, 0.5);
      som('ronco.wav', 100, 0.4);
      som('clique.wav', em(leg(2)), 0.6);
      return {
        p: {...base, cam, marcha: 0.6, recuo: 0.95 + 0.6, recuoChao: 0.6, bisnaga: {pos: [0.1, YB + 0.035, -0.3], giro: -0.45}, extras: [bandeja, <Empurradores key="emp" t={t} z={-0.62} />]},
        ui,
        sons,
      };
    }
    case 'placar': {
      const remendo = T >= leg(4) - 0.1;
      const cam = remendo
        ? {pos: [0.45, 1.3, 1.75] as Vec, alvo: [-0.28, 1.02, 0.75] as Vec, fov: 46}
        : camMove({pos: [0.75, 2.0, 1.9], alvo: [0, 0.8, -2.0]}, {pos: [0.6, 2.25, 2.3], alvo: [0, 0.8, -2.6]}, (T - leg(0)) / 7, 52);
      placar();
      ui.push(<Selo key="s1" texto="RECUARAM COM HONRA" f={f} top={460} amarelo />);
      if (T >= leg(3)) ui.push(<Selo key="s2" texto={`VOCÊS MANDARAM: ${total} SOLDADOS`} f={f - em(leg(3))} top={570} tam={46} />);
      if (T >= leg(4)) ui.push(<Selo key="s3" texto={`FALTARAM ${cfg.faltaram}`} f={f - em(leg(4))} top={670} tam={46} />);
      som('placar.wav', em(leg(3)), 0.5);
      som('tlec_varios.wav', em(leg(1)), 0.6);
      som('pop.wav', em(leg(4) + 0.5), 0.7);
      const sai = suave((T - leg(0)) / 2.5);
      return {
        p: {
          ...base,
          cam,
          marcha: 0.3,
          recuo: 0.75,
          recuoChao: 0.3,
          pulando: T >= leg(1) ? 1 : 0,
          bisnaga: {pos: [0.1, YB + 0.035, -0.3], giro: -0.45},
          extras: [
            bandeja,
            <Remendo key="rem" k={remendo ? (T - leg(4) - 0.5) / 0.25 : 0} />,
            ...exercito((s) => {
              const v = ex.vagas[s.n];
              if (v[1] > 0.5 && !remendo) return {pos: v, giro: 0, oculto: true};
              // os do chão voltam para casa, de cabeça erguida
              return {pos: [v[0] * 1.1, 0, v[2] + 0.4 + sai * 1.6], giro: 0.05 * Math.sin(s.n), oculto: remendo};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'gancho':
    default: {
      const rato = suave((T - leg(1) - 0.1) / 0.6);
      const cam = camMove({pos: [0, 1.25, 4.4], alvo: [0, 1.45, 0]}, {pos: [0.62, 0.3, 1.05], alvo: [0.32, 0.12, 0]}, (T - leg(0)) / 2.4, 50);
      som('roer.wav', 0, 0.8);
      som('roer.wav', 85, 0.8);
      som('suspense.wav', em(leg(1)), 0.4);
      return {p: base, ui, sons, gancho: <PortaDeAco T={T} rato={rato} treme={T < leg(1) + 0.2 ? 1 : 0.3} cam={cam} />};
    }
  }
};

const CenaComp: React.FC<{c: Ctx; destaques: Set<string>}> = ({c, destaques}) => {
  const f = useCurrentFrame();
  const {p, ui, sons, gancho} = quadro(c.bloco.cena, f, c);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} gl={{antialias: true}} dpr={1} shadows>
        {gancho ?? <Cena3D estilo={ESTILO} {...p} />}
      </ThreeCanvas>
      {ui}
      {sons}
    </AbsoluteFill>
  );
};

const Legendas: React.FC<{cfg: ConfigBatalha; destaques: Set<string>}> = ({cfg, destaques}) => {
  const T = useCurrentFrame() / FPS;
  const todas = cfg.blocos.flatMap((b) => b.legendas.map(([de, texto], i) => ({de, texto, ate: i + 1 < b.legendas.length ? b.legendas[i + 1][0] : b.fim + 0.35})));
  const atual = todas.find((l) => T >= l.de && T < l.ate);
  return atual ? <Legenda texto={atual.texto} destaques={destaques} /> : null;
};

export const inicioCenas = (cfg: ConfigBatalha) => cfg.blocos.map((b, i) => (i === 0 ? 0 : Math.round((b.legendas[0][0] - 0.2) * FPS)));

export const Batalha: React.FC<{cfg: ConfigBatalha}> = ({cfg}) => {
  const ex = useMemo(() => montaExercito(cfg), [cfg]);
  const destaques = useMemo(() => new Set(cfg.destaques.map((d) => d.replace(/[.,:?!]+$/, ''))), [cfg]);
  const inicios = inicioCenas(cfg);
  const totalQ = Math.round(cfg.duracao * FPS);
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <Audio src={staticFile('sfx/suspense_longo.wav')} volume={0.07} />
      <Audio src={staticFile(cfg.audio)} />
      {cfg.blocos.map((b, i) => {
        const ini = inicios[i];
        const fim = i + 1 < inicios.length ? inicios[i + 1] : totalQ;
        return (
          <Sequence key={i} from={ini} durationInFrames={fim - ini}>
            <CenaComp c={{cfg, ex, bloco: b, ini: ini / FPS, dur: fim - ini}} destaques={destaques} />
          </Sequence>
        );
      })}
      <Legendas cfg={cfg} destaques={destaques} />
    </AbsoluteFill>
  );
};

// ---------- A cena da capa: o Bisnaga dormindo em cima da fornada, os pinguins empurrando ----------
export const cenaCapaBatalha = (cfg: ConfigBatalha): ParamsCena => ({
  cam: {pos: [1.15, 1.45, 0.9], alvo: [0.1, 1.2, -0.45], fov: 50},
  marcha: 0.6,
  recuo: 1.55,
  recuoChao: 0.6,
  bisnaga: {pos: [0.1, YB + 0.035, -0.3], giro: -0.45},
  extras: [<Bandeja key="bandeja" />, <Empurradores key="emp" t={0.3} z={-0.62} />],
});

export const CapaBatalha: React.FC<Omit<CapaProps, 'cena'> & {cfg: ConfigBatalha}> = ({cfg, ...textos}) => <Capa {...textos} cena={cenaCapaBatalha(cfg)} />;
