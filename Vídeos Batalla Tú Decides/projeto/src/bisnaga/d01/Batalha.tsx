import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

// Com --props='{"soAudio":true}', renderiza só os sons (sem o 3D): o áudio sai em minutos.
const SO_AUDIO = Boolean((getInputProps() as {soAudio?: boolean}).soAudio);
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Cena3D, ParamsCena, Peca, Pinguim, texturaCanvas, useMaterial, Vec} from '../Cena3D';
import {GatoSentado, Pelagem} from '../Gatos';
import {ELENCO} from '../Elenco';
import {Etiqueta, Farinha, NumeroGrande, Placar, queda} from './Convocacao';
import {Capa, CapaProps} from '../Capa';
import {Bloco, CenaBatalha, ConfigBatalha, soldados, Tipo} from './batalhas';

// Desafio 1 · Batalha: o exército real (soma das três plataformas) contra os pinguins.
// Roteiro: series/bisnaga/d01/batalha/roteiro.md

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
// O tipo da frente ocupa o balcão (5 por fila). O resto fica no chão, dos dois lados do balcão,
// 12 por fila: os comuns na frente (a muralha), depois os outros tipos, do mais pedido ao menos pedido.
type Soldado = {tipo: Tipo | 'COMUM'; n: number; k: number};
type Pose = {pos: Vec; giro: number; rx?: number; esc?: Vec; olhos?: 'abertos' | 'fechados' | 'meio'; boca?: 'aberta' | 'fechada'; oculto?: boolean};

const DZ = 0.27;
const XB = [0, -0.18, 0.18, -0.36, 0.36];
const XC = [0.75, 0.96, 1.17, 1.38, 1.59, 1.8].flatMap((x) => [x, -x]);

const montaExercito = (cfg: ConfigBatalha) => {
  const c = cfg.contagem;
  const outros = NOMES_TIPO.filter((t) => t !== cfg.frente).sort((a, b) => c[b] - c[a]);
  const lista: Soldado[] = [];
  const add = (tipo: Tipo | 'COMUM', n: number) => {
    for (let k = 0; k < n; k++) lista.push({tipo, n: lista.length, k});
  };
  add(cfg.frente, c[cfg.frente]);
  add('COMUM', c.comuns);
  outros.forEach((t) => add(t, c[t]));
  const N = lista.length;
  const nB = Math.min(c[cfg.frente], 50);
  const frenteZ = -0.7 - (Math.max(1, Math.ceil(nB / 5)) - 1) * DZ;
  const vagas: Vec[] = [];
  for (let i = 0; i < nB; i++) vagas.push([XB[i % 5], YB, frenteZ + Math.floor(i / 5) * DZ]);
  for (let i = 0; vagas.length < N; i++) {
    const r = Math.floor(i / XC.length);
    vagas.push([XC[i % XC.length] + (r % 2) * 0.05, 0, frenteZ + r * DZ]);
  }
  // o meio de cada grupo no chão (para a câmera)
  const zGrupo = (tp: Tipo | 'COMUM') => {
    const zs = lista.filter((s) => s.tipo === tp && vagas[s.n][1] === 0).map((s) => vagas[s.n][2]);
    return zs.length ? (Math.min(...zs) + Math.max(...zs)) / 2 : frenteZ;
  };
  return {lista, vagas, frenteZ, N, zGrupo};
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

// as prateleiras de formas, em pé na frente do exército (caem em cima dos pinguins)
const PRATELEIRAS = (frenteZ: number): {pos: Vec; esc: number}[] => [
  {pos: [0, YB, frenteZ - 0.2], esc: 1},
  ...[0.95, 1.5, -0.95, -1.5].map((x) => ({pos: [x, 0, frenteZ - 0.2] as Vec, esc: 1.5})),
];
const Prateleiras: React.FC<{frenteZ: number; cai: (i: number) => number}> = ({frenteZ, cai}) => (
  <>
    {PRATELEIRAS(frenteZ).map((p, i) => (
      <group key={i} position={p.pos} scale={p.esc}>
        <Prateleira pos={[0, 0, 0]} cai={cai(i)} />
      </group>
    ))}
  </>
);

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

// o que já aconteceu antes de cada cena (as prateleiras caídas, os pinguins no chão)
const ORDEM: CenaBatalha[] = ['chamado', 'contagem', 'frente', 'barriga', 'pinguins', 'feirante', 'loterica', 'salao', 'comuns', 'patada', 'recuam', 'acorda', 'vitoria', 'gancho'];
const depois = (cena: CenaBatalha, de: CenaBatalha) => ORDEM.indexOf(cena) > ORDEM.indexOf(de);

const quadro = (cena: CenaBatalha, f: number, c: Ctx): {p: ParamsCena; ui: React.ReactNode[]; sons: React.ReactNode[]; gancho?: React.ReactNode} => {
  const {cfg, ex, bloco, ini, dur} = c;
  const t = f / FPS;
  const T = ini + t; // segundo da narração
  const em = (s: number) => Math.round((s - ini) * FPS); // quadro local de um segundo da narração
  const leg = (i: number) => bloco.legendas[Math.min(i, bloco.legendas.length - 1)][0];
  const k = f / dur;
  const total = soldados(cfg.contagem);
  const ui: React.ReactNode[] = [];
  const sons: React.ReactNode[] = [];
  const som = (arq: string, de: number, vol = 1) =>
    sons.push(
      <Sequence key={`${arq}${de}${sons.length}`} from={Math.max(0, de)}>
        <Audio src={staticFile(`sfx/${arq}`)} volume={Math.min(1, vol)} />
      </Sequence>,
    );

  const recuoBase = 0.1 - ex.frenteZ;
  const recuoChaoBase = 0.55 - ex.frenteZ;
  // depois da LOTÉRICA, as prateleiras e os pinguins da frente ficam no chão
  const caidas = depois(cena, 'loterica') && !depois(cena, 'patada');
  const base: ParamsCena = {
    t,
    respira: Math.sin(t * 2.2) * 0.5 + 0.5,
    recuo: recuoBase,
    recuoChao: recuoChaoBase,
    derrubados: caidas ? 25 : 0,
    tombaChao: caidas ? 1.4 : 0,
  };
  const bob = (s: Soldado) => Math.sin(t * 2 + s.n * 1.7) * 0.004;
  const poseVaga = (s: Soldado): Pose => {
    const v = ex.vagas[s.n];
    return {pos: [v[0], v[1] + bob(s), v[2]], giro: GIRO_FRENTE + Math.sin(s.n * 2.3) * 0.15};
  };
  const doTipo = (tp: Tipo | 'COMUM') => ex.lista.filter((s) => s.tipo === tp);
  const placar = (g = total + 1, pulso = 0) => ui.push(<Placar key="placar" gatos={g} pulso={pulso} />);
  const exercito = (pose: (s: Soldado) => Pose) => ex.lista.map((s) => <SoldadoGato key={s.n} s={s} pose={pose(s)} />);
  const marchaParada = (m: number) => ({marcha: m, recuo: recuoBase + m, recuoChao: recuoChaoBase + m * 0.8});
  const prateleiras = (cai: (i: number) => number) => <Prateleiras key="prats" frenteZ={ex.frenteZ} cai={cai} />;
  const pratsAntes = prateleiras(() => (depois(cena, 'loterica') ? 1 : 0));
  // câmera de lado do balcão, olhando a linha de frente (gatos à direita, pinguins ao fundo)
  const camLado = (z: number, kk: number, dz = 0) =>
    camMove({pos: [1.85, 1.62, z + 0.75 + dz], alvo: [-0.05, 1.22, z - 0.3]}, {pos: [1.7, 1.57, z + 0.6 + dz], alvo: [-0.05, 1.2, z - 0.32]}, kk, 40);
  // câmera de um grupo no chão (do lado direito, de cima, olhando para a frente)
  const camGrupo = (z: number, kk: number) =>
    camMove({pos: [2.6, 1.75, z + 0.75], alvo: [0.7, 0.15, z - 1.75]}, {pos: [2.5, 1.68, z + 0.6], alvo: [0.7, 0.15, z - 1.8]}, kk, 50);
  const etiqueta = (texto: string, de: number, amarela = false) => {
    if (T >= de) ui.push(<Etiqueta key="e" texto={texto} x={540} y={430} linha={60} f={f - em(de)} amarela={amarela} tam={50} />);
  };

  switch (cena) {
    case 'chamado': {
      const cam = camMove({pos: [1.6, 1.3, 0.95], alvo: [-0.2, 0.75, -3.0]}, {pos: [1.45, 1.25, 0.55], alvo: [-0.2, 0.75, -3.2]}, k, 52);
      ui.push(<Titulo key="t" f={f} gatos={total + 1} />);
      som('impacto.wav', 0, 0.7);
      return {p: {...base, ...marchaParada(t * 0.05), cam, extras: [pratsAntes, ...exercito(poseVaga)]}, ui, sons};
    }
    case 'contagem': {
      const cam = camMove({pos: [1.8, 2.5, 1.6], alvo: [-0.1, 0.3, -1.9]}, {pos: [1.6, 2.35, 1.25], alvo: [-0.1, 0.3, -2.0]}, k, 54);
      const passo = (dur * 0.72) / ex.N;
      const chega = (s: Soldado) => 4 + Math.round(s.n * passo);
      const chegaram = ex.lista.filter((s) => f >= chega(s) + 9).length;
      const ultimo = ex.lista.filter((s) => f >= chega(s) + 9).map(chega).pop() ?? -99;
      placar(1 + chegaram, f - ultimo - 9 < 6 ? 1 - (f - ultimo - 9) / 6 : 0);
      for (let q = 6; q < dur * 0.8; q += 3) som('pop.wav', q, 0.3);
      if (T >= leg(0)) ui.push(<Selo key="c1" texto={`${cfg.contagem.comuns} COMUNS`} f={f - em(leg(0))} top={480} />);
      if (T >= leg(1)) ui.push(<Selo key="c2" texto={`${total - cfg.contagem.comuns} DO COMÉRCIO`} f={f - em(leg(1))} top={580} amarelo />);
      return {
        p: {
          ...base,
          cam,
          extras: [
            pratsAntes,
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
      etiqueta(`${cfg.frente} ×${cfg.contagem[cfg.frente]}`, leg(1), true);
      som('clique.wav', em(leg(1)), 0.6);
      const passo = suave((f - em(leg(1))) / 15) * 0.08;
      return {
        p: {...base, ...marchaParada(t * 0.04), cam, extras: [pratsAntes, ...exercito((s) => (s.tipo === cfg.frente ? {...poseVaga(s), pos: [ex.vagas[s.n][0], YB, ex.vagas[s.n][2] - passo]} : poseVaga(s)))]},
        ui,
        sons,
      };
    }
    case 'barriga': {
      const cam = camLado(ex.frenteZ, k, 0.1);
      placar();
      const anda = suave((T - leg(0)) / 1.2) * 0.1;
      const vira = suave((T - leg(2) + 0.2) / 0.5);
      som('nham.wav', em(leg(2)) + 10, 0.8);
      som('nham.wav', em(leg(2)) + 40, 0.6);
      return {
        p: {
          ...base,
          ...marchaParada(t * 0.04),
          cam,
          extras: [
            pratsAntes,
            ...exercito((s) => {
              if (s.tipo !== cfg.frente) return poseVaga(s);
              const v = ex.vagas[s.n];
              const come = vira > 0.99 ? Math.abs(Math.sin(t * 9 + s.k)) * 0.018 : 0;
              return {pos: [v[0], YB + come, v[2] - 0.08 - anda + vira * 0.1], giro: GIRO_FRENTE - vira * Math.PI + Math.sin(t * 9 + s.k) * 0.05 * vira, olhos: vira > 0.5 ? 'fechados' : undefined};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'pinguins': {
      const z0 = ex.frenteZ;
      const cam = camMove({pos: [2.35, 0.5, z0 + 0.1], alvo: [1.3, 0.12, z0 - 3.0]}, {pos: [2.35, 0.55, z0 + 0.25], alvo: [1.3, 0.1, z0 - 3.0]}, k, 52);
      placar();
      const desl = suave((T - leg(1)) / 2.5);
      if (T >= leg(1)) ui.push(<NumeroGrande key="n" num="1.000" rotulo="ESCORREGANDO" f={f - em(leg(1))} />);
      som('escorregar.wav', em(leg(1)), 0.8);
      som('escorregar.wav', em(leg(1)) + 25, 0.6);
      // (o comer do AÇOUGUE continua: eles estão de costas)
      return {
        p: {...base, cam, marcha: desl > 0 ? 0 : t * 0.08, recuo: recuoBase, recuoChao: recuoChaoBase, escorregando: desl * 0.1, extras: [pratsAntes, ...exercito(poseVaga)]},
        ui,
        sons,
      };
    }
    case 'feirante':
    case 'loterica':
    case 'salao': {
      const tp: Tipo = cena === 'feirante' ? 'FEIRANTE' : cena === 'loterica' ? 'LOTÉRICA' : 'SALÃO';
      const grupo = doTipo(tp);
      const zg = ex.zGrupo(tp);
      let cam = camGrupo(zg, k);
      // na queda das prateleiras, a câmera abre para mostrar a frente inteira
      if (tp === 'LOTÉRICA') cam = camMove(cam, {pos: [2.45, 2.25, ex.frenteZ + 1.0], alvo: [0.7, 0.05, ex.frenteZ - 1.3]}, (T - leg(4) - 0.1) / 0.8, 52);
      placar();
      etiqueta(`${tp} ×${grupo.length}`, ini + 4 / FPS);
      som('clique.wav', 4, 0.5);
      let marcha = t * 0.05;
      let derrubados = base.derrubados ?? 0;
      let tombaChao = base.tombaChao ?? 0;
      let escorregando = 0;
      const outros: React.ReactNode[] = [];
      let prats = pratsAntes;
      // o tempo do tropeço e da queda das prateleiras
      const tTrope = leg(4) + 0.25;
      const tCai = leg(4) + 0.6;
      const pose = (s: Soldado): Pose => {
        const v = ex.vagas[s.n];
        if (s.tipo === cfg.frente) {
          // o açougue continua comendo, de costas para a guerra
          return {pos: [v[0], YB + Math.abs(Math.sin(t * 9 + s.k)) * 0.018, v[2] + 0.02], giro: GIRO_FRENTE - Math.PI, olhos: 'fechados'};
        }
        if (s.tipo !== tp) return poseVaga(s);
        const j = s.k;
        if (tp === 'FEIRANTE') {
          const grita = T >= leg(0) + 0.3;
          const rouco = T >= leg(2) + 0.3;
          return {pos: [v[0], 0, v[2]], giro: GIRO_FRENTE + (grita && !rouco ? Math.sin(f * 2.1 + j) * 0.07 : 0), boca: grita && !rouco ? 'aberta' : 'fechada', olhos: rouco ? 'meio' : 'abertos'};
        }
        if (tp === 'LOTÉRICA') {
          const mira = T < leg(2) ? Math.sin(t * 3 + j) * 0.25 : 0;
          const vira = suave((T - leg(3)) / 0.6);
          const tr = T - tTrope - (j % 5) * 0.04;
          const rx = tr > 0 ? Math.min(1, tr / 0.35) * 0.9 : 0;
          return {pos: [v[0], tr > 0 ? -Math.min(1, tr / 0.35) * 0.02 : 0, v[2] + suave((T - leg(3) - 0.4) / 0.5) * 0.06], giro: GIRO_FRENTE + mira - vira * Math.PI, rx, olhos: tr > 0 ? 'fechados' : vira > 0.5 ? 'meio' : 'abertos'};
        }
        // SALÃO: desfile no chão encerado, depois a farinha e a fuga
        const fuga = T - (leg(1) + 0.9);
        const desfile = Math.min(T - leg(0), leg(1) + 0.9 - leg(0));
        const z = v[2] - Math.max(0, desfile) * 0.05;
        const x = v[0] + Math.sin(Math.max(0, desfile) * 2.4 + j) * 0.04;
        if (fuga > 0) {
          const kk = fuga / 0.6;
          return {pos: [x, 0, z + kk * kk * 2.5], giro: Math.PI * 0.05, olhos: 'abertos'};
        }
        return {pos: [x, 0, z], giro: 2.0 + Math.sin(Math.max(0, desfile) * 2.4 + j) * 0.4, olhos: 'meio'};
      };
      if (tp === 'FEIRANTE') {
        const trava = leg(0) + 0.3;
        marcha = T < trava ? t * 0.05 : 0;
        if (T >= trava) Object.assign(base, {recuo: recuoBase, recuoChao: recuoChaoBase});
        som('grito.wav', em(trava), 1);
        som('grito.wav', em(trava) + 4, 0.8);
        som('grito.wav', em(leg(1) + 0.2), 0.9);
        som('miadinho.wav', em(leg(2) + 0.4), 0.8);
        som('miadinho.wav', em(leg(2) + 0.55), 0.6);
        som('miadinho.wav', em(leg(2) + 0.75), 0.5);
      }
      if (tp === 'LOTÉRICA') {
        const caiPrat = (i: number) => suave((T - tCai - i * 0.12) / 0.5);
        prats = prateleiras(caiPrat);
        const cai = caiPrat(0);
        derrubados = cai > 0.6 ? Math.min(25, Math.round((T - tCai - 0.25) * 40)) : 0;
        tombaChao = caiPrat(2) > 0.6 ? Math.min(1.4, (T - tCai - 0.4) * 2) : 0;
        marcha = Math.min(t, tCai - ini) * 0.05;
        // a chuva de rolinhos (que não acerta nada)
        for (let j = 0; j < 14; j++) {
          const t0 = leg(0) + 0.8 + j * 0.13;
          const x0 = (j % 2 ? 1 : -1) * (0.8 + (j % 5) * 0.2);
          outros.push(<Rolinho key={`r${j}`} T={T} t0={t0} de={[x0, 0.3, zg]} para={[x0 + (j % 3 - 1) * 0.6, 0.02, ex.frenteZ - 0.6 - (j % 4) * 0.35]} dur={0.7} />);
          if (j % 3 === 0) som('uuush.wav', em(t0), 0.35);
        }
        som('baque.wav', em(tTrope + 0.1), 0.9);
        som('baque.wav', em(tTrope + 0.25), 0.7);
        for (let i = 0; i < 5; i++) som('clang.wav', em(tCai + 0.2 + i * 0.12), 0.5);
        som('tlec_varios.wav', em(tCai + 0.3), 0.9);
        som('tlec_varios.wav', em(tCai + 0.9), 0.7);
      }
      if (tp === 'SALÃO') {
        if (T > leg(1)) outros.push(<Farinha key="far" f={f - em(leg(1)) + 20} centro={[1.2, 0, zg - (leg(1) + 0.9 - leg(0)) * 0.05]} />);
        som('escorregar.wav', 6, 0.5);
        som('uuush.wav', em(leg(1) + 0.9), 0.8);
      }
      return {p: {...base, ...marchaParada(marcha), cam, derrubados, tombaChao, escorregando, extras: [prats, ...outros, ...exercito(pose)]}, ui, sons};
    }
    case 'comuns': {
      const zg = ex.zGrupo('COMUM');
      const cam = camGrupo(zg - 0.1, k);
      placar();
      etiqueta(`${cfg.contagem.comuns} COMUNS`, leg(1));
      const deita = suave((T - leg(1)) / 0.4);
      // a multidão empurra e volta, empurra e volta
      const empurra = T > leg(1) + 0.4 ? Math.abs(Math.sin((T - leg(1) - 0.4) * 2.2)) * 0.12 : 0;
      som('escorregar.wav', 0, 0.5);
      for (let q = em(leg(1) + 0.4) + 20; q < dur; q += 43) som('tlec.wav', q, 0.7);
      return {
        p: {
          ...base,
          ...marchaParada(t * 0.04),
          recuoChao: recuoChaoBase + t * 0.032 - empurra,
          cam,
          extras: [
            pratsAntes,
            ...exercito((s) => {
              const pz = poseVaga(s);
              if (s.tipo !== 'COMUM') return pz;
              return {...pz, esc: [1 + deita * 0.3, 1 - deita * 0.35, 1 + deita * 0.15], olhos: deita > 0.5 ? 'meio' : undefined};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'patada': {
      const tGolpe = leg(2);
      const golpe = T - tGolpe - 0.35;
      const cam = camMove(camLado(ex.frenteZ, 0), {pos: [0.9, 2.5, ex.frenteZ + 2.2], alvo: [0, 0.4, ex.frenteZ - 2.4]}, (T - tGolpe - 0.2) / 1.6, 48);
      placar();
      const n = cfg.contagem[cfg.frente];
      etiqueta(`${cfg.frente} ×${n}`, leg(0), true);
      som('nham.wav', em(leg(1)), 0.6);
      som('uuush.wav', em(tGolpe + 0.2), 0.8);
      som('baque.wav', em(tGolpe + 0.35), 1);
      for (let i = 0; i < 4; i++) som('tlec_varios.wav', em(tGolpe + 0.4 + i * 0.7), 0.9 - i * 0.1);
      return {
        p: {
          ...base,
          ...marchaParada(golpe > 0 ? 0 : t * 0.04),
          cam,
          derrubados: golpe > 0 ? Math.round(golpe * 80) : 0,
          tombaChao: golpe > 0 ? golpe * 2.6 : 0,
          extras: [
            prateleiras(() => 1),
            ...exercito((s) => {
              if (s.tipo !== cfg.frente) return poseVaga(s);
              const v = ex.vagas[s.n];
              const lunge = golpe > 0 && golpe < 0.6 ? Math.sin((golpe / 0.6) * Math.PI) : 0;
              return {pos: [v[0], YB + lunge * 0.05, v[2] - 0.08 - lunge * 0.14], giro: GIRO_FRENTE, rx: -lunge * 0.3, olhos: T < tGolpe - 1.2 ? 'fechados' : 'abertos'};
            }),
          ],
        },
        ui,
        sons,
      };
    }
    case 'recuam': {
      // "Um." um pinguim dá um passo atrás; "Depois cem." o balcão; "Depois todos": o chão também
      const um = suave((T - leg(2)) / 0.5);
      const cem = suave((T - leg(3)) / 1.2);
      const todos = suave((T - leg(4)) / 2.2);
      const fecha = suave((T - leg(4) - 2.2) / 0.5);
      const cam = camMove({pos: [0.95, 2.1, ex.frenteZ + 2.0], alvo: [0.1, 0.55, ex.frenteZ - 1.8]}, {pos: [1.0, 2.0, ex.frenteZ + 1.1], alvo: [1.0, 0.9, -5.3]}, (T - leg(4) - 0.6) / 2.4, 48);
      placar();
      if (T >= leg(3) && T < leg(4)) ui.push(<NumeroGrande key="n" num="100" rotulo="RECUANDO" f={f - em(leg(3))} />);
      som('escorregar.wav', em(leg(2)), 0.5);
      som('escorregar.wav', em(leg(3)), 0.7);
      som('tlec_varios.wav', em(leg(4)), 0.6);
      som('escorregar.wav', em(leg(4) + 0.3), 0.8);
      som('clang.wav', em(leg(4) + 2.6), 0.6);
      return {
        p: {
          ...base,
          derrubados: 0,
          tombaChao: 0,
          cam,
          marcha: 0.3,
          recuo: recuoBase + 0.3 + cem * 0.9 + todos * 5,
          recuoChao: recuoChaoBase + 0.24 + todos * 6,
          solo: um < 1 || cem < 0.05 ? [0, YB, ex.frenteZ - 0.32 - um * 0.25] : null,
          pulando: todos,
          portaGeladeira: fecha,
          extras: [prateleiras(() => 1), ...exercito(poseVaga)],
        },
        ui,
        sons,
      };
    }
    case 'acorda': {
      const cam = camMove({pos: [1.05, 1.42, 1.3], alvo: [-0.2, 0.98, -0.05]}, {pos: [0.92, 1.36, 1.15], alvo: [-0.18, 0.98, -0.05]}, k, 48);
      placar();
      const abre = suave((T - leg(1)) / 0.3) * (1 - suave((T - leg(3) - 0.2) / 0.5));
      const olha = suave((T - leg(2)) / 0.5) * (1 - suave((T - leg(3)) / 0.6));
      som('ronco.wav', 0, 0.5);
      som('clique.wav', em(leg(1)), 0.4);
      som('ronco.wav', em(leg(3) + 0.6), 0.6);
      return {
        p: {...base, derrubados: 0, tombaChao: 0, cam, marcha: 0, recuo: 9, recuoChao: 9, portaGeladeira: 1, olhoAberto: abre, bisnaga: {pos: [0.14, YB, 0.22], giro: -0.95 + olha * 0.6}, extras: [prateleiras(() => 1), ...exercito(poseVaga)]},
        ui,
        sons,
      };
    }
    case 'vitoria': {
      const cam = camMove({pos: [1.5, 2.1, 1.3], alvo: [-0.1, 0.45, -2.0]}, {pos: [1.35, 2.45, 1.8], alvo: [-0.1, 0.4, -2.3]}, k, 52);
      placar(total + 1, T - leg(0) < 0.3 ? 1 : 0);
      ui.push(<Selo key="s1" texto="VITÓRIA" f={f - em(leg(0))} top={460} amarelo tam={84} />);
      if (T >= leg(2)) ui.push(<Selo key="s2" texto={`VOCÊS MANDARAM: ${total} SOLDADOS`} f={f - em(leg(2))} top={600} tam={46} />);
      if (T >= leg(3)) ui.push(<Selo key="s3" texto="COM 500: A MUSIQUINHA" f={f - em(leg(3))} top={700} tam={46} />);
      som('placar.wav', em(leg(0)), 0.7);
      som('pop.wav', em(leg(2)), 0.7);
      som('pop.wav', em(leg(3)), 0.7);
      return {
        p: {
          ...base,
          derrubados: 0,
          tombaChao: 0,
          cam,
          marcha: 0,
          recuo: 9,
          recuoChao: 9,
          portaGeladeira: 1,
          extras: [
            prateleiras(() => 1),
            ...exercito((s) => {
              // a cozinha é dos gatos: uns deitam, uns dormem, uns se lambem
              const pz = poseVaga(s);
              const jeito = (s.n * 7) % 5;
              if (jeito === 0) return {...pz, esc: [1.3, 0.65, 1.15], olhos: 'fechados'};
              if (jeito === 1) return {...pz, giro: pz.giro + Math.sin(s.n) * 1.5, olhos: 'meio'};
              if (jeito === 2) return {...pz, olhos: 'fechados'};
              if (s.tipo === cfg.frente) return {...pz, pos: [pz.pos[0], pz.pos[1] + Math.abs(Math.sin(t * 8 + s.k)) * 0.012, pz.pos[2]], olhos: 'fechados'};
              return pz;
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
  if (SO_AUDIO) return <AbsoluteFill>{sons}</AbsoluteFill>;
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

// ---------- A cena da capa: os 200 gatos de frente para o mar de pinguins ----------
const CenaCapa: React.FC<{cfg: ConfigBatalha}> = ({cfg}) => {
  const ex = montaExercito(cfg);
  return (
    <>
      {ex.lista.map((s) => (
        <SoldadoGato key={s.n} s={s} pose={{pos: ex.vagas[s.n], giro: GIRO_FRENTE + Math.sin(s.n * 2.3) * 0.15, boca: s.tipo === 'FEIRANTE' ? 'aberta' : undefined}} />
      ))}
    </>
  );
};

export const cenaCapaBatalha = (cfg: ConfigBatalha): ParamsCena => {
  const ex = montaExercito(cfg);
  return {
    cam: {pos: [2.35, 2.35, ex.frenteZ + 2.3], alvo: [0.3, 0.25, ex.frenteZ - 0.75], fov: 56},
    marcha: 0.3,
    recuo: 0.1 - ex.frenteZ + 0.3,
    recuoChao: 0.55 - ex.frenteZ + 0.24,
    t: 0.4,
    extras: <CenaCapa cfg={cfg} />,
  };
};

export const CapaBatalha: React.FC<Omit<CapaProps, 'cena'> & {cfg: ConfigBatalha}> = ({cfg, ...textos}) => <Capa {...textos} cena={cenaCapaBatalha(cfg)} />;
