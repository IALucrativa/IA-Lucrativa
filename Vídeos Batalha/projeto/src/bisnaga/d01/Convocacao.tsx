import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CAM_PRANCHA, Cena3D, ParamsCena, Peca, texturaCanvas, useMaterial, Vec} from '../Cena3D';
import {GatoSentado, Pelagem} from '../Gatos';
import {ELENCO} from '../Elenco';
import tempos from './tempos.json';

// Desafio 1 · Convocação: "Os pinguins da geladeira". Roteiro: series/bisnaga/d01/convocacao/roteiro.md

const FPS = 30;
const AMARELO = '#ffd23f';
const SOMBRA = '0 4px 14px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)';
const ESTILO = 'cartoon' as const;

const lerp = (a: Vec, b: Vec, k: number): Vec => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const suave = (k: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, k)));
const camMove = (de: {pos: Vec; alvo: Vec}, para: {pos: Vec; alvo: Vec}, k: number, fov = 52) => ({
  pos: lerp(de.pos, para.pos, suave(k)),
  alvo: lerp(de.alvo, para.alvo, suave(k)),
  fov,
});

// queda de um gato no balcão (0 = no ar, 1 = pousou), com quiquezinho
const queda = (f: number, inicio: number) => {
  const k = Math.max(0, Math.min(1, (f - inicio) / 9));
  const y = (1 - k * k) * 0.9;
  const quique = f - inicio > 9 && f - inicio < 15 ? Math.sin(((f - inicio - 9) / 6) * Math.PI) * 0.03 : 0;
  return y + quique;
};

const TIPOS = Object.fromEntries(ELENCO.map((e) => [e.nome, e]));
const COMUM: Pelagem = {tipo: 'liso', base: '#9a9a9a'};
const MULTIDAO: Pelagem[] = [
  {tipo: 'liso', base: '#9a9a9a'},
  {tipo: 'liso', base: '#2b2b2b'},
  {tipo: 'listrado', base: '#c98a4a', listra: '#7a4a1e'},
  {tipo: 'manchas', base: '#f7f3ea', manchas: ['#222222']},
  {tipo: 'liso', base: '#e8e2d6'},
];

// ---------- Objetos de cena ----------
const Lousa: React.FC<{pos: Vec; giro: number}> = ({pos, giro}) => {
  const m = useMaterial(ESTILO);
  const tex = useMemo(
    () =>
      texturaCanvas(512, 384, (c) => {
        c.fillStyle = '#23332b';
        c.fillRect(0, 0, 512, 384);
        c.fillStyle = '#f2efe6';
        c.textAlign = 'center';
        c.font = 'bold 44px Arial';
        c.fillText('PROMOÇÃO', 256, 80);
        c.font = 'bold 70px Arial';
        c.fillText('COMENTOU', 256, 180);
        c.fillStyle = AMARELO;
        c.font = 'bold 84px Arial';
        c.fillText('= +1 GATO', 256, 290);
      }),
    [],
  );
  return (
    <group position={pos} rotation={[0, giro, 0]}>
      {/* cavalete */}
      <Peca forma={{tipo: 'caixa', d: [0.04, 0.62, 0.04]}} pos={[-0.2, 0.28, -0.08]} rot={[0.25, 0, 0]} mat={m('#8a5a2e')} estilo={ESTILO} />
      <Peca forma={{tipo: 'caixa', d: [0.04, 0.62, 0.04]}} pos={[0.2, 0.28, -0.08]} rot={[0.25, 0, 0]} mat={m('#8a5a2e')} estilo={ESTILO} />
      <Peca forma={{tipo: 'caixa', d: [0.5, 0.38, 0.03]}} pos={[0, 0.34, 0]} rot={[-0.18, 0, 0]} mat={m('#8a5a2e')} estilo={ESTILO} />
      <mesh position={[0, 0.34, 0.017]} rotation={[-0.18, 0, 0]} material={m('#ffffff', {mapa: tex})}>
        <planeGeometry args={[0.45, 0.33]} />
      </mesh>
    </group>
  );
};

const Farinha: React.FC<{f: number; centro: Vec}> = ({f, centro}) => {
  const m = useMaterial(ESTILO);
  return (
    <>
      {Array.from({length: 22}, (_, i) => {
        const x = centro[0] + Math.sin(i * 12.9) * 0.12;
        const z = centro[2] + Math.cos(i * 7.3) * 0.1;
        const y = centro[1] + 0.9 - ((f * 0.04 + i * 0.07) % 0.9);
        return <Peca key={i} forma={{tipo: 'esfera', r: 0.012}} pos={[x, y, z]} mat={m('#ffffff')} estilo={ESTILO} contorno={0} />;
      })}
    </>
  );
};

// ---------- Interface na tela ----------
const Titulo: React.FC<{f: number}> = ({f}) => {
  const k = interpolate(f, [0, 6], [1.4, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: SOMBRA, transform: `scale(${k})`}}>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>1 BISNAGA</div>
      <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
    </div>
  );
};

const Placar: React.FC<{gatos: number; pulso?: number}> = ({gatos, pulso = 0}) => (
  <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', gap: 70, textShadow: SOMBRA}}>
    <div style={{textAlign: 'center'}}>
      <div style={{color: AMARELO, fontWeight: 800, fontSize: 32, letterSpacing: 3}}>GATOS</div>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 78, transform: `scale(${1 + pulso * 0.4})`}}>{gatos}</div>
    </div>
    <div style={{color: '#fff', fontWeight: 900, fontSize: 44, alignSelf: 'center', opacity: 0.8}}>×</div>
    <div style={{textAlign: 'center'}}>
      <div style={{color: '#8fd3ff', fontWeight: 800, fontSize: 32, letterSpacing: 3}}>PINGUINS</div>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 78}}>10.000</div>
    </div>
  </div>
);

const Etiqueta: React.FC<{texto: string; x: number; y: number; linha?: number; f: number; amarela?: boolean; tam?: number}> = ({
  texto,
  x,
  y,
  linha = 70,
  f,
  amarela,
  tam = 40,
}) => {
  const k = interpolate(f, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${k})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{background: amarela ? AMARELO : '#fff', color: '#141018', fontWeight: 900, fontSize: tam, padding: '6px 18px', borderRadius: 8, boxShadow: '0 3px 0 #141018'}}>{texto}</div>
      <div style={{width: 3, height: linha, background: '#fff', boxShadow: '0 0 4px rgba(0,0,0,0.8)'}} />
    </div>
  );
};

const NumeroGrande: React.FC<{num: string; rotulo?: string; f: number}> = ({num, rotulo, f}) => {
  const k = interpolate(f, [0, 6], [1.6, 1], {extrapolateRight: 'clamp'});
  const o = interpolate(f, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', textShadow: SOMBRA, opacity: o, transform: `scale(${k})`}}>
      <div style={{color: AMARELO, fontWeight: 900, fontSize: 170, lineHeight: 1}}>{num}</div>
      {rotulo && <div style={{color: '#fff', fontWeight: 900, fontSize: 46, letterSpacing: 4}}>{rotulo}</div>}
    </div>
  );
};

const DESTAQUES = /^(dormindo\.|Bisnaga,?|Bisnaga\.|você\.|primeiro|comentário\.\.\.|AÇOUGUE,?|FEIRANTE,?|LOTÉRICA|SALÃO|vinte|centímetros|quinhentos|musiquinha\.|quatro|horas\.|convoca\?|Dez|mil)$/;

const Legenda: React.FC<{texto: string}> = ({texto}) => (
  <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', padding: '0 70px', boxSizing: 'border-box', textShadow: SOMBRA}}>
    <span style={{color: '#fff', fontWeight: 800, fontSize: 56, lineHeight: 1.25}}>
      {texto.split(' ').map((p, i) => (
        <span key={i} style={{color: DESTAQUES.test(p) ? AMARELO : '#fff'}}>
          {p}{' '}
        </span>
      ))}
    </span>
  </div>
);

// ---------- As cenas ----------
type Cena = (typeof tempos.cenas)[number];

const CAM_BALCAO = {pos: [0.3, 1.85, 1.35] as Vec, alvo: [-0.18, 1.0, -0.3] as Vec};
const POS_TIPO: Vec = [-0.22, 0.92, -0.22];

const quadroCena = (i: number, f: number, dur: number): {p: ParamsCena; ui: React.ReactNode; sons: React.ReactNode} => {
  const k = f / dur;
  const t = f / FPS;
  const base: ParamsCena = {t, respira: Math.sin(t * 2.2) * 0.5 + 0.5};
  const ui: React.ReactNode[] = [];
  const sons: React.ReactNode[] = [];
  const som = (arq: string, de: number, vol = 1) =>
    sons.push(
      <Sequence key={`${arq}${de}`} from={de}>
        <Audio src={staticFile(`sfx/${arq}`)} volume={vol} />
      </Sequence>,
    );

  switch (i) {
    case 0: {
      // impacto: os pinguins de cima da geladeira ganham vida
      const cam = camMove({pos: [-1.35, 2.02, -4.95], alvo: [-1.4, 1.95, -5.55]}, {pos: [-0.9, 2.05, -3.7], alvo: [-1.3, 1.85, -5.55]}, (f - 12) / 100, 50);
      ui.push(<Titulo key="t" f={f} />);
      som('impacto.wav', 0, 0.7);
      som('tlec_varios.wav', 14, 0.8);
      return {p: {...base, cam, pulando: f < 12 ? 0 : 1, marcha: t * 0.1}, ui, sons};
    }
    case 1: {
      const cam = camMove({pos: [0.9, 1.9, -1.4], alvo: [-0.1, 0.9, -3.4]}, CAM_PRANCHA, k);
      ui.push(<Titulo key="t" f={30} />);
      som('ronco.wav', Math.round(dur * 0.45), 0.5);
      return {p: {...base, cam, marcha: 0.35 + t * 0.06}, ui, sons};
    }
    case 2: {
      const cam = camMove(CAM_PRANCHA, {pos: [0.72, 1.42, 2.25], alvo: [-0.05, 0.88, -1.2]}, k);
      ui.push(<Placar key="p" gatos={1} />);
      ui.push(<Etiqueta key="e" texto="BISNAGA" x={380} y={880} linha={90} f={f - 10} amarela />);
      som('clique.wav', 10, 0.6);
      return {p: {...base, cam: {...cam, fov: 52}, marcha: 0.6 + t * 0.04}, ui, sons};
    }
    case 3: {
      // um pinguim sozinho escorrega até o focinho; ele nem acorda
      const cam = {pos: [0.95, 1.2, 1.25] as Vec, alvo: [0.25, 1.0, 0.25] as Vec, fov: 50};
      const ks = suave((f - 6) / (dur * 0.55));
      const solo: Vec = [0.44, 0.92, -0.9 + ks * 1.45];
      ui.push(<Placar key="p" gatos={1} />);
      som('escorregar.wav', 6, 0.6);
      som('tlec.wav', 6 + Math.round(dur * 0.55), 0.8);
      return {p: {...base, cam, solo, marcha: 0, recuo: 0.5}, ui, sons};
    }
    case 4: {
      // a lousa e o primeiro gato do público
      const cam = {pos: [0.55, 1.85, 1.5] as Vec, alvo: [0.0, 1.0, -0.4] as Vec, fov: 50};
      const cai = Math.round(dur * 0.5);
      const extras = (
        <>
          <Lousa pos={[0.24, 0.92, -0.55]} giro={0.45} />
          {f >= cai - 9 && <GatoSentado estilo={ESTILO} pelagem={COMUM} pos={[-0.2, 0.92 + queda(f, cai - 9), -0.25]} giro={0.5} tamanho={0.75} olhos="abertos" />}
        </>
      );
      ui.push(<Placar key="p" gatos={f >= cai ? 2 : 1} pulso={f >= cai && f < cai + 8 ? 1 - (f - cai) / 8 : 0} />);
      som('papel.wav', 2, 0.7);
      som('baque.wav', cai, 0.8);
      som('pop.wav', cai, 0.5);
      return {p: {...base, cam, recuo: 0.9, extras}, ui, sons};
    }
    case 5:
    case 6:
    case 7:
    case 8: {
      const nome = ['AÇOUGUE', 'FEIRANTE', 'LOTÉRICA', 'SALÃO'][i - 5];
      const tipo = TIPOS[nome];
      const cai = 6;
      let pos: Vec = [POS_TIPO[0], POS_TIPO[1] + queda(f, cai), POS_TIPO[2]];
      let giro = 0.45;
      let boca = tipo.props.boca;
      let extraCena: React.ReactNode = null;
      let derrubados = 0;
      if (nome === 'AÇOUGUE') pos = [pos[0], pos[1] + (f > 25 ? Math.abs(Math.sin(f * 0.5)) * 0.01 : 0), pos[2]];
      if (nome === 'FEIRANTE') {
        const rouco = f > dur * 0.72;
        giro += rouco ? 0 : Math.sin(f * 2.1) * 0.06;
        boca = rouco ? 'fechada' : 'aberta';
      }
      if (nome === 'LOTÉRICA') {
        giro += f > 30 && f < 40 ? Math.sin(((f - 30) / 10) * Math.PI) * 0.6 : 0;
        derrubados = f > 36 ? 10 : 0;
      }
      if (nome === 'SALÃO') {
        const sai = dur * 0.62;
        if (f > dur * 0.4) extraCena = <Farinha f={f} centro={POS_TIPO} />;
        if (f > sai) {
          const kk = (f - sai) / 12;
          pos = [pos[0] - kk * kk * 1.6, pos[1], pos[2] + kk * 0.3];
          giro = -1.2;
        }
      }
      const extras = (
        <>
          <GatoSentado estilo={ESTILO} {...tipo.props} boca={boca} pos={pos} giro={giro} tamanho={(tipo.props.tamanho ?? 1) * 0.82} />
          {extraCena}
        </>
      );
      ui.push(<Placar key="p" gatos={1} />);
      ui.push(<Etiqueta key="e" texto={nome} x={400} y={430} linha={70} f={f - cai - 4} tam={46} />);
      som('baque.wav', cai + 9, 0.7);
      som('clique.wav', cai + 6, 0.5);
      if (nome === 'LOTÉRICA') som('tlec_varios.wav', 34, 0.7);
      if (nome === 'SALÃO') som('uuush.wav', Math.round(dur * 0.62), 0.7);
      return {p: {...base, cam: {...CAM_BALCAO, fov: 50}, recuo: 0.9, extras, derrubados}, ui, sons};
    }
    case 9: {
      // os pinguins: 20 cm de louça; depois deslizam de barriga
      const cam = camMove({pos: [1.25, 0.32, 1.75], alvo: [1.25, 0.16, -0.4]}, {pos: [1.3, 0.42, 2.2], alvo: [1.2, 0.12, -0.6]}, k, 50);
      const desl = Math.max(0, (k - 0.45) / 0.55);
      ui.push(<NumeroGrande key="n" num="20 CM" rotulo="DE LOUÇA" f={f} />);
      if (desl > 0) som('escorregar.wav', Math.round(dur * 0.45), 0.8);
      return {p: {...base, cam, marcha: desl > 0 ? 0 : t * 0.1, escorregando: desl * 0.5}, ui, sons};
    }
    case 10: {
      // meta: a musiquinha do caminhão de gás; a luz da rua acende pela janela
      const cam = camMove({pos: [0.2, 1.6, 0.2], alvo: [2.87, 1.8, -3.2]}, {pos: [0.9, 1.75, -0.9], alvo: [2.87, 1.85, -3.2]}, k, 50);
      ui.push(<NumeroGrande key="n" num="500" rotulo="COMENTÁRIOS" f={f} />);
      som('caixinha.wav', Math.round(dur * 0.25), 0.55);
      return {p: {...base, cam, janela: suave((k - 0.3) / 0.6), recuo: 0.9}, ui, sons};
    }
    case 11: {
      // 24 horas: a multidão de gatos pisca; no fim, os 4 tipos lado a lado
      const cam = camMove({pos: [1.1, 1.85, 3.0], alvo: [0, 0.9, -1.2]}, {pos: [0.85, 1.6, 2.4], alvo: [0, 1.0, -0.6]}, k, 52);
      const fila = k > 0.62;
      const pisca = !fila && Math.floor(f / 7) % 2 === 0 && k > 0.2;
      const extras = (
        <>
          {pisca &&
            Array.from({length: 22}, (_, j) => (
              <GatoSentado
                key={j}
                estilo={ESTILO}
                pelagem={MULTIDAO[j % MULTIDAO.length]}
                pos={j < 10 ? [-0.36 + (j % 4) * 0.24, 0.92, -0.4 - Math.floor(j / 4) * 0.35] : [-0.85 - (j % 3) * 0.32, 0, 0.6 - Math.floor((j - 10) / 3) * 0.4]}
                giro={0.4}
                tamanho={0.55}
                olhos="abertos"
              />
            ))}
          {fila &&
            ['AÇOUGUE', 'FEIRANTE', 'LOTÉRICA', 'SALÃO'].map((n, j) => (
              <GatoSentado key={n} estilo={ESTILO} {...TIPOS[n].props} pos={[-0.36 + j * 0.24, 0.92, -0.42]} giro={0.25} tamanho={0.6} />
            ))}
        </>
      );
      ui.push(<NumeroGrande key="n" num="24" rotulo="HORAS" f={f} />);
      if (pisca) som('pop.wav', f, 0.3);
      return {p: {...base, cam, recuo: 1.6, extras}, ui, sons};
    }
    case 12: {
      // ameaça: o primeiro pinguim encosta na pata dele
      const cam = camMove(CAM_PRANCHA, {pos: [0.78, 1.3, 1.55], alvo: [0.2, 0.98, 0.1]}, k * 1.2);
      const solo: Vec = [0.44, 0.92, -0.9 + suave(k * 1.3) * 1.45];
      ui.push(<Placar key="p" gatos={1} />);
      som('suspense.wav', 0, 0.35);
      return {p: {...base, cam, solo, marcha: 0.2 + t * 0.12}, ui, sons};
    }
    default: {
      // pergunta: placar + os 4 tipos; ele abre um olho
      const cam = {pos: [0.7, 1.24, 1.38] as Vec, alvo: [0.22, 0.98, 0.15] as Vec, fov: 52};
      ui.push(<Placar key="p" gatos={1} />);
      const xs = [190, 420, 660, 890];
      ['AÇOUGUE', 'FEIRANTE', 'LOTÉRICA', 'SALÃO'].forEach((n, j) =>
        ui.push(<Etiqueta key={n} texto={n} x={xs[j]} y={470} linha={0} f={f - j * 2} tam={36} />),
      );
      return {p: {...base, cam, solo: [0.44, 0.92, 0.55], marcha: 1.2, olhoAberto: interpolate(f, [20, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}, ui, sons};
    }
  }
};

const CenaComp: React.FC<{i: number; cena: Cena}> = ({i, cena}) => {
  const f = useCurrentFrame();
  const {p, ui, sons} = quadroCena(i, f, cena.duracao);
  const leg = [...cena.legendas].reverse().find((l) => f >= l.de);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} gl={{antialias: true}} dpr={1} shadows>
        <Cena3D estilo={ESTILO} {...p} />
      </ThreeCanvas>
      {ui}
      {leg && f < cena.audio * FPS + 8 && <Legenda texto={leg.texto} />}
      <Audio src={staticFile(`bisnaga/d01/${cena.nome}.mp3`)} />
      {sons}
    </AbsoluteFill>
  );
};

export const DURACAO_CONVOCACAO = tempos.total;

export const Convocacao: React.FC = () => {
  const ultima = tempos.cenas[tempos.cenas.length - 1];
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      {/* fundo baixo, sem loop */}
      <Audio src={staticFile('sfx/suspense_longo.wav')} volume={0.08} />
      {tempos.cenas.map((c, i) => (
        <Sequence key={c.nome} from={c.inicio} durationInFrames={i === tempos.cenas.length - 1 ? tempos.total - c.inicio : c.duracao}>
          <CenaComp i={i} cena={i === tempos.cenas.length - 1 ? {...ultima, duracao: tempos.total - ultima.inicio} : c} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
