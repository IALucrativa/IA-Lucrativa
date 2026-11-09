import React, {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Easing, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {OlhoDePeixe} from '../Cena3D';
import {Ambiente, Camera, Rua} from './kit';
import {Celular, MaoLivre, MotoComMotoca} from './corpo';
import {Casa, Lanchonete, Menino, Nota, NOTAS, Quarto, Salgado} from './lugares';
import tempos from './tempos.json';

// Fora do Mapa · Parte 1: "O aviso". Uma voz só (o Motoca narra). Estilo noturno realista.

const FPS = 30;
type V3 = [number, number, number];
type Bloco = {bloco: string; duracao: number; legendas: {texto: string; de: number; ate: number}[]};
const B = tempos as Bloco[];

// Cada cena: pausa antes da voz, bloco de narração, folga depois
const CENAS: {id: string; antes: number; depois: number; legendaTopo: number}[] = [
  {id: 'abertura', antes: 0.3, depois: 0.6, legendaTopo: 900},
  {id: 'prazo', antes: 0.4, depois: 0.5, legendaTopo: 380},
  {id: 'rotina', antes: 0.4, depois: 0.5, legendaTopo: 560},
  {id: 'pedido', antes: 0.3, depois: 0.7, legendaTopo: 380},
  {id: 'caminho', antes: 0.3, depois: 0.8, legendaTopo: 900},
  {id: 'cliente', antes: 0.4, depois: 0.3, legendaTopo: 1220},
  {id: 'pagamento', antes: 0.2, depois: 0.9, legendaTopo: 1220},
  {id: 'volta', antes: 0.4, depois: 0.6, legendaTopo: 900},
  {id: 'ameaca', antes: 0.4, depois: 0.6, legendaTopo: 560},
  {id: 'voto', antes: 0.4, depois: 2.5, legendaTopo: 1480},
];
const CARTAO = 1.8; // "Três horas antes", depois da abertura

const duracaoCena = (i: number) => CENAS[i].antes + B[i].duracao + CENAS[i].depois;
const inicioCena = (i: number) => {
  let t = 0;
  for (let k = 0; k < i; k++) t += duracaoCena(k) + (k === 0 ? CARTAO : 0);
  return t;
};
export const DURACAO_PARTE1 = Math.ceil((inicioCena(CENAS.length - 1) + duracaoCena(CENAS.length - 1)) * FPS);

// Momento (no tempo da cena) em que começa a legenda que contém um trecho
const quando = (i: number, trecho: string) => {
  const l = B[i].legendas.find((x) => x.texto.includes(trecho));
  if (!l) throw new Error('Trecho não achado: ' + trecho);
  return CENAS[i].antes + l.de;
};

const suave = Easing.inOut(Easing.cubic);
const lerp = (t: number, ts: number[], vs: number[]) => interpolate(t, ts, vs, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave});
const lerp3 = (t: number, ts: number[], vs: V3[]): V3 => [0, 1, 2].map((k) => lerp(t, ts, vs.map((v) => v[k]))) as V3;
const somaV = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const useT = () => {
  const f = useCurrentFrame();
  return f / FPS;
};

// Respiração e balanço leve da cabeça
const respiro = (t: number, forca = 1): V3 => [Math.sin(t * 0.9) * 0.006 * forca, Math.sin(t * 1.7) * 0.008 * forca, 0];

const Palco: React.FC<{children: React.ReactNode; luz?: number; neblina?: [number, number]}> = ({children, luz, neblina}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1}>
      <OlhoDePeixe forca={0.32} />
      <Ambiente luz={luz} neblina={neblina} />
      {children}
    </ThreeCanvas>
  );
};

// Farol da moto, que anda junto com ela
const Farol: React.FC<{base: V3}> = ({base}) => {
  const luz = useMemo(() => new THREE.SpotLight('#fff4d6', 60, 30, 0.5, 0.6, 1.4), []);
  luz.position.set(base[0], 0.9, base[2] - 0.9);
  luz.target.position.set(base[0], 0, base[2] - 12);
  luz.target.updateMatrixWorld();
  return (
    <>
      <primitive object={luz} />
      <primitive object={luz.target} />
    </>
  );
};

// ---------- As cenas ----------
const CenaFreio: React.FC<{espelho?: boolean}> = ({espelho}) => {
  const t = useT();
  const z = interpolate(t, [0, 1.3], [9, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const tranco = t > 1.2 && t < 1.8 ? Math.sin(((t - 1.2) / 0.6) * Math.PI) * 0.06 : 0;
  const r = respiro(t);
  let olho: V3 = [0, 1.45 + r[1], z + 0.05];
  let alvo: V3 = [r[0] * 10, 0.95 - tranco * 4, z - 6];
  let fov = 118;
  if (espelho) {
    const k = lerp(t, [2.2, 3.4], [0, 1]);
    olho = somaV(olho, [-0.12 * k, -0.05 * k, -0.15 * k]);
    alvo = [alvo[0] * (1 - k) + -0.45 * k, alvo[1] * (1 - k) + 1.27 * k, alvo[2] * (1 - k) + (z - 0.67) * k];
    fov = 118 - 48 * k;
  }
  return (
    <Palco>
      <Camera pos={olho} olha={alvo} fov={fov} />
      <Rua />
      <Farol base={[0, 0, z]} />
      <group position={[0, 0, z]}>
        <MotoComMotoca tela="placar" espelho={espelho ? 'muro' : 'poste'} />
      </group>
    </Palco>
  );
};

const PARADO: V3 = [3.0, 0, -12];
const olhoNoCelular = (k: number, t: number): {pos: V3; olha: V3} => {
  const r = respiro(t, 0.6);
  const pos: V3 = [PARADO[0] + r[0], 1.45 - 0.07 * k + r[1], PARADO[2] + 0.05 - 0.17 * k];
  const olha: V3 = [PARADO[0] + 0.3 * (1 - k), 1.0 * (1 - k) + 1.15 * k, (PARADO[2] - 6) * (1 - k) + (PARADO[2] - 0.55) * k];
  return {pos, olha};
};

const CenaPrazo: React.FC = () => {
  const t = useT();
  const k = lerp(t, [2.6, 3.8], [0, 1]);
  const cam = olhoNoCelular(k, t);
  const audio = t >= quando(1, 'Só manda') - 0.3;
  return (
    <Palco>
      <Camera pos={cam.pos} olha={cam.olha} fov={118 - 30 * k} />
      <Rua />
      <group position={PARADO}>
        <MotoComMotoca tela={audio ? 'audio' : 'placar'} />
      </group>
    </Palco>
  );
};

const CenaRotina: React.FC = () => {
  const t = useT();
  const tMoedas = quando(2, 'Eu conto');
  const tSalgado = Math.max(quando(2, 'pego o salgado'), tMoedas + 1.2);
  const tCelular = quando(2, 'Uma noite boa');
  const r = respiro(t, 0.8);
  const kc = lerp(t, [tCelular, tCelular + 1.0], [0, 1]);
  const olho: V3 = [0 + r[0] + 0.12 * kc, 1.62 + r[1] - 0.12 * kc, 0.3 - 0.25 * kc];
  const alvo: V3 = [0.05 * (1 - kc) + 0.45 * kc, 1.0 * (1 - kc) + 1.055 * kc, -0.7 * (1 - kc) + -0.5 * kc];
  const mao = lerp3(
    t,
    [tMoedas - 0.6, tMoedas, tMoedas + 0.9, tSalgado - 0.2, tSalgado + 0.3, tSalgado + 1.3],
    [[0.42, 1.0, -0.15], [0.24, 1.09, -0.52], [0.1, 1.09, -0.48], [0.03, 1.1, -0.5], [0.03, 1.1, -0.5], [0.3, 1.22, -0.2]],
  );
  const moedas = Math.floor(lerp(t, [tMoedas, tMoedas + 0.9], [0, 5]));
  const pegou = t > tSalgado + 0.3;
  return (
    <Palco neblina={[20, 60]}>
      <Camera pos={olho} olha={alvo} fov={118 - 25 * kc} />
      <Lanchonete maoPegouSalgado={pegou} moedasMovidas={moedas} />
      <Celular tela="ganhos" pos={[0.45, 1.058, -0.5]} rot={[-Math.PI / 2, 0, 0.2]} esc={1.3} />
      <MaoLivre ombro={[0.3, 1.3, 0.4]} mao={mao} segura={pegou ? <Salgado /> : null} />
    </Palco>
  );
};

const CenaPedido: React.FC = () => {
  const t = useT();
  const cam = olhoNoCelular(1, t + 20);
  const tToque = quando(3, 'Eu nunca') + 0.1;
  const ida = lerp(t, [tToque - 0.7, tToque], [0, 1]);
  const volta = lerp(t, [tToque + 0.5, tToque + 1.1], [0, 1]);
  const k = ida * (1 - volta);
  const tela = t < 0.25 ? 'placar' : t < tToque ? 'pedido' : 'aceito';
  return (
    <Palco>
      <Camera pos={cam.pos} olha={cam.olha} fov={88} />
      <Rua />
      <group position={PARADO}>
        <MotoComMotoca tela={tela} maoDireita={[-0.27 * k, 0.08 * k, 0.21 * k]} dedo={k} />
      </group>
    </Palco>
  );
};

const CenaCaminho: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const z = interpolate(t, [0, dur], [6, -62], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const tHoje = quando(4, 'Hoje');
  const tRua = quando(4, 'tinha uma rua');
  const piscada = t > tHoje && t < tHoje + 0.5 ? 0.3 : 1;
  const r = respiro(t, 1.4);
  return (
    <Palco luz={piscada}>
      <Camera pos={[r[0], 1.45 + r[1], z + 0.05]} olha={[r[0] * 8, 1.0, z - 6]} />
      <Rua muroAberto={t >= tRua - 0.4} semaforoAceso={Math.floor(t * 1.6) % 2 === 0} postesComLuz={[-22, -38, -54]} />
      <Farol base={[0, 0, z]} />
      <group position={[0, 0, z]}>
        <MotoComMotoca tela="recalculando" />
      </group>
    </Palco>
  );
};

const SACOLA = <group position={[0, -0.02, -0.16]}>{/* sacola de papel */}<mesh><boxGeometry args={[0.2, 0.24, 0.12]} /><meshStandardMaterial color="#b88a56" roughness={0.9} /></mesh></group>;

const CenaCliente: React.FC = () => {
  const t = useT();
  const abertura = lerp(t, [0.2, 1.6], [0, 1]);
  const zc = lerp(t, [1.8, 4.2], [0, -3.0]);
  const passo = t > 1.8 && t < 4.2 ? Math.abs(Math.sin((t - 1.8) * 5.2)) * 0.025 : 0;
  const r = respiro(t);
  const tEntrega = quando(5, 'Disse que');
  const ida = lerp(t, [tEntrega, tEntrega + 1.2], [0, 1]);
  const entregou = t > tEntrega + 1.4;
  const mao: V3 = lerp3(t, [tEntrega - 0.6, tEntrega, tEntrega + 1.2, tEntrega + 1.6, tEntrega + 2.4], [[0.5, 0.9, zc + 0.1], [0.32, 1.15, zc - 0.3], [0.06, 1.2, zc - 0.62], [0.06, 1.2, zc - 0.62], [0.5, 0.9, zc + 0.1]]);
  const maoVisivel = t > tEntrega - 0.6 && t < tEntrega + 2.4;
  return (
    <Palco luz={0.9} neblina={[10, 40]}>
      <Camera pos={[r[0], 1.6 + r[1] - passo, zc]} olha={[0, 1.25, -4.6]} />
      <Casa abertura={abertura} luzVaranda />
      <pointLight position={[0.3, 1.5, zc - 0.3]} intensity={2.5} distance={3} color="#ffd2a0" />
      <Menino pos={[0, 0.15, -4.1]} bracosFrente={lerp(t, [tEntrega + 0.6, tEntrega + 1.2], [0, 0.55])} />
      {entregou && <group position={[0, 0.98, -3.72]}>{SACOLA}</group>}
      {maoVisivel && <MaoLivre ombro={[0.28, 1.25, zc + 0.3]} mao={mao} segura={!entregou && ida > 0 ? SACOLA : null} />}
    </Palco>
  );
};

const CenaPagamento: React.FC = () => {
  const t = useT();
  const tPorta = quando(6, 'A porta fechou');
  const tLuz = quando(6, 'E a luz apagou');
  const zc = lerp(t, [0, tPorta], [-3.0, -3.3]);
  const recua = lerp(t, [tPorta - 0.6, tPorta], [0, 1]);
  const abertura = lerp(t, [tPorta - 0.1, tPorta + 0.4], [1, 0]);
  const apagou = t >= tLuz + 0.5;
  const r = respiro(t, 0.5);
  return (
    <Palco luz={apagou ? 0.35 : 0.9} neblina={[10, 40]}>
      <Camera pos={[r[0], 1.6 + r[1], zc]} olha={[0, 1.3, -4.6]} fov={118 - 20 * lerp(t, [0, tPorta], [0, 1])} />
      <Casa abertura={abertura} luzVaranda={!apagou} />
      <pointLight position={[0.3, 1.5, zc - 0.3]} intensity={apagou ? 0.6 : 2.5} distance={3} color="#ffd2a0" />
      <Menino pos={[0, 0.15 * (1 - recua), -4.1 - 0.7 * recua]} bracosFrente={0.55 * (1 - recua)} />
      {recua < 1 && <group position={[0, 0.98 - 0.0 * recua, -3.72 - 0.7 * recua]}>{SACOLA}</group>}
    </Palco>
  );
};

const CenaQuarto: React.FC<{voto?: boolean}> = ({voto}) => {
  const t = useT();
  const tMsg = voto ? -10 : quando(8, 'Aí chegou') + 0.5;
  const k = voto ? 1 : lerp(t, [tMsg, tMsg + 1.0], [0, 1]);
  const r = respiro(t, 0.6);
  const olho: V3 = [r[0] + 0.18 * k, 1.25 + r[1] - 0.12 * k, 0.15 - 0.3 * k];
  const alvo: V3 = [0.32 * k, 0.76, -0.5];
  // contando as notas: uma por vez, da pilha da direita para a da esquerda
  const contadas = voto ? 5 : Math.min(5, Math.max(0, Math.floor((t - 0.8) / 0.75)));
  const fase = voto ? 0 : ((t - 0.8) / 0.75) % 1;
  const contando = !voto && t > 0.8 && contadas < 5;
  const mao: V3 = contando ? lerp3(fase, [0, 0.45, 1], [[0.1, 0.82, -0.42], [-0.12, 0.82, -0.48], [0.1, 0.82, -0.42]]) : [0.28, 0.85, -0.2];
  return (
    <Palco luz={voto ? 0.7 : 1} neblina={[20, 60]}>
      <Camera pos={olho} olha={alvo} fov={110 - 28 * k} />
      <Quarto luz={voto ? 0.7 : 1} />
      {NOTAS.map((n, i) => {
        const naEsquerda = i < contadas;
        const pos: V3 = naEsquerda ? [-0.13, 0.772 + i * 0.001, -0.5] : [0.08, 0.772 + (5 - i) * 0.001, -0.45];
        return <Nota key={i} valor={n.valor} cor={n.cor} pos={pos} rot={naEsquerda ? 0.1 * i : -0.08 * i} />;
      })}
      <Celular tela={t >= tMsg ? 'mensagem' : 'final'} pos={[0.32, 0.773, -0.5]} rot={[-Math.PI / 2, 0, 0.15]} esc={1.3} />
      {contando && <MaoLivre ombro={[0.24, 1.0, 0.25]} mao={mao} />}
    </Palco>
  );
};

// ---------- Textos na tela ----------
const CONTORNO = '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 4px 12px rgba(0,0,0,0.7)';

const Legenda: React.FC<{i: number}> = ({i}) => {
  const t = useT() - CENAS[i].antes;
  const l = B[i].legendas.find((x) => t >= x.de && t < x.ate);
  if (!l) return null;
  return (
    <div style={{position: 'absolute', top: CENAS[i].legendaTopo, width: '100%', textAlign: 'center', padding: '0 80px', boxSizing: 'border-box'}}>
      <span style={{color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 56, lineHeight: 1.25, textShadow: CONTORNO}}>{l.texto}</span>
    </div>
  );
};

const Selo: React.FC = () => {
  const t = useT();
  const op = interpolate(t, [0.3, 0.6, 4.3, 4.8], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: op, fontFamily: 'Inter, sans-serif'}}>
      <div style={{background: '#ffcc33', color: '#0f1420', fontWeight: 900, fontSize: 40, padding: '10px 26px', borderRadius: 10, letterSpacing: 2}}>FORA DO MAPA · PARTE 1</div>
      <div style={{color: '#fff', fontWeight: 900, fontSize: 96, textShadow: CONTORNO, letterSpacing: 2}}>O AVISO</div>
    </div>
  );
};

const Cartao: React.FC = () => {
  const t = useT();
  const op = interpolate(t, [0, 0.3, CARTAO - 0.3, CARTAO], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{color: '#fff', opacity: op, fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 64, letterSpacing: 1}}>Três horas antes</div>
    </AbsoluteFill>
  );
};

const Voto: React.FC = () => {
  const t = useT();
  const entra = interpolate(t, [0.2, 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
  const opcao = (destaque: string, resto: string, cor: string, atraso: number) => {
    const k = interpolate(t, [0.6 + atraso, 1.0 + atraso], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <div style={{opacity: k, transform: `translateX(${(1 - k) * 60}px)`, border: `5px solid ${cor}`, background: 'rgba(10,12,18,0.82)', borderRadius: 22, padding: '26px 30px', color: '#fff', fontSize: 50, fontWeight: 700, width: 820, boxSizing: 'border-box'}}>
        <span style={{color: cor, fontWeight: 900}}>{destaque}</span> {resto}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif', background: `rgba(0,0,0,${0.45 * entra})`}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, marginTop: -260}}>
        <div style={{transform: `scale(${entra})`, color: '#fff', fontWeight: 900, fontSize: 92, textAlign: 'center', lineHeight: 1.05, textShadow: CONTORNO}}>
          O QUE VOCÊ
          <br />
          FARIA?
        </div>
        {opcao('OBEDECER', 'o menino', '#ffcc33', 0)}
        {opcao('IR', 'ao encontro do Seu Vando', '#ff5a4f', 0.3)}
        <div style={{opacity: interpolate(t, [1.6, 2.0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), color: '#fff', fontSize: 44, fontWeight: 800, textShadow: CONTORNO}}>Comenta a palavra 👇</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Som ----------
const Som: React.FC<{arquivo: string; de: number; dur?: number; volume?: number; fade?: number}> = ({arquivo, de, dur, volume = 1, fade = 0}) => (
  <Sequence from={Math.round(de * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined} layout="none">
    <Html5Audio
      src={staticFile(arquivo)}
      volume={(f) => (fade && dur ? volume * interpolate(f, [0, fade * FPS, (dur - fade) * FPS, dur * FPS], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : volume)}
    />
  </Sequence>
);

const CENA_COMPONENTE = (i: number) => {
  switch (i) {
    case 0: return <CenaFreio />;
    case 1: return <CenaPrazo />;
    case 2: return <CenaRotina />;
    case 3: return <CenaPedido />;
    case 4: return <CenaCaminho dur={duracaoCena(4)} />;
    case 5: return <CenaCliente />;
    case 6: return <CenaPagamento />;
    case 7: return <CenaFreio espelho />;
    case 8: return <CenaQuarto />;
    default: return <CenaQuarto voto />;
  }
};

export const Parte1: React.FC = () => {
  const ini = CENAS.map((_, i) => inicioCena(i));
  const f = (s: number) => Math.round(s * FPS);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {CENAS.map((c, i) => (
        <Sequence key={c.id} from={f(ini[i])} durationInFrames={f(duracaoCena(i)) + 1} name={c.id}>
          {CENA_COMPONENTE(i)}
          <Legenda i={i} />
          {i === 0 && <Selo />}
          {i === 9 && <Voto />}
          <Som arquivo={`foradomapa/ep01/${B[i].bloco}.mp3`} de={c.antes} />
        </Sequence>
      ))}
      <Sequence from={f(duracaoCena(0))} durationInFrames={f(CARTAO)} name="tres-horas-antes">
        <Cartao />
        <Som arquivo="sfx/uuush.wav" de={0} volume={0.5} />
      </Sequence>

      {/* efeitos e ambiente */}
      <Som arquivo="sfx/moto_motor.wav" de={0} dur={2.2} volume={0.5} fade={0.3} />
      <Som arquivo="sfx/freio.wav" de={0.7} volume={0.45} />
      <Som arquivo="sfx/rua_noite.wav" de={ini[1]} dur={Math.min(39.5, ini[4] - ini[1])} volume={0.35} fade={0.8} />
      <Som arquivo="sfx/notificacao.wav" de={ini[1] + quando(1, 'Só manda') - 0.3} volume={0.5} />
      <Som arquivo="sfx/pedido_estranho.wav" de={ini[3] + 0.2} volume={0.55} />
      <Som arquivo="sfx/clique.wav" de={ini[3] + quando(3, 'Eu nunca') + 0.1} volume={0.6} />
      <Som arquivo="sfx/moto_motor.wav" de={ini[4]} dur={duracaoCena(4)} volume={0.45} fade={0.6} />
      <Som arquivo="sfx/suspense_longo.wav" de={ini[4]} dur={ini[7] - ini[4]} volume={0.16} fade={1.5} />
      <Som arquivo="sfx/clique.wav" de={ini[5] + 0.2} volume={0.4} />
      <Som arquivo="sfx/impacto.wav" de={ini[6] + quando(6, 'A porta fechou') + 0.3} volume={0.35} />
      <Som arquivo="sfx/luz_piscando.wav" de={ini[6] + quando(6, 'E a luz apagou') + 0.3} volume={0.35} />
      <Som arquivo="sfx/moto_motor.wav" de={ini[7]} dur={2.2} volume={0.5} fade={0.3} />
      <Som arquivo="sfx/freio.wav" de={ini[7] + 0.7} volume={0.45} />
      <Som arquivo="sfx/notificacao.wav" de={ini[8] + quando(8, 'Aí chegou') + 0.5} volume={0.5} />
      <Som arquivo="sfx/suspense.wav" de={ini[9] + duracaoCena(9) - 14} dur={14} volume={0.18} fade={1.5} />
    </AbsoluteFill>
  );
};
