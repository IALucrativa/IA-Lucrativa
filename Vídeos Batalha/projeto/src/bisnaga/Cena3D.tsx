import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';

// Desafio 1: a cozinha da padaria, de madrugada.
// O Bisnaga dorme em cima do balcão comprido; os pinguins de louça marcham na direção dele.
// Três estilos para a prancha.

export type Estilo = 'cartoon' | 'lowpoly' | 'noturno';

export type Paleta = {
  fundo: string;
  parede: string;
  azulejo: string;
  rejunte: string;
  piso1: string;
  piso2: string;
  balcao: string;
  tampo: string;
  geladeira: string;
  forno: string;
  madeira: string;
  pao: string;
  gato: string;
  listra: string;
  farinha: string;
  luzQuente: string;
  luzFria: string;
  ambiente: number;
  quente: number;
  fria: number;
};

export const PALETAS: Record<Estilo, Paleta> = {
  cartoon: {
    fundo: '#24304f', parede: '#f1e6cf', azulejo: '#f7f2e6', rejunte: '#c9bfa8', piso1: '#e9e2d0', piso2: '#c0533f',
    balcao: '#3f7fbf', tampo: '#d9dde3', geladeira: '#eef1f4', forno: '#3c4048', madeira: '#b5793f', pao: '#e0a458',
    gato: '#f08a2c', listra: '#b8561a', farinha: '#fffaf0', luzQuente: '#ffd79a', luzFria: '#9fb8ff',
    ambiente: 1.1, quente: 28, fria: 1.2,
  },
  lowpoly: {
    fundo: '#2a2346', parede: '#d8c7e8', azulejo: '#e6dcf0', rejunte: '#a99ac0', piso1: '#cbbfe0', piso2: '#6d5a9c',
    balcao: '#3a8a7a', tampo: '#c7c9d6', geladeira: '#dfe3ee', forno: '#3a3552', madeira: '#a0704a', pao: '#e8a860',
    gato: '#ff8f3a', listra: '#c4561e', farinha: '#ffffff', luzQuente: '#ffc27a', luzFria: '#a59cff',
    ambiente: 0.9, quente: 26, fria: 1.4,
  },
  noturno: {
    fundo: '#07080c', parede: '#7d6f5e', azulejo: '#b8ad9a', rejunte: '#6b6253', piso1: '#8a7f70', piso2: '#4a3a30',
    balcao: '#5a4636', tampo: '#9a9a96', geladeira: '#b9b7b0', forno: '#2a2b2e', madeira: '#6e4a2c', pao: '#c8853e',
    gato: '#e07b28', listra: '#9a4a14', farinha: '#f3eee4', luzQuente: '#ffae4a', luzFria: '#5d7bb8',
    ambiente: 0.4, quente: 24, fria: 0.6,
  },
};

export const aleatorio = (semente: number) => {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const texturaCanvas = (l: number, a: number, desenha: (c: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const canvas = document.createElement('canvas');
  canvas.width = l;
  canvas.height = a;
  desenha(canvas.getContext('2d')!);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep[0], rep[1]);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const useMaterial = (estilo: Estilo) => {
  const degraus = useMemo(() => {
    const dados = new Uint8Array([80, 80, 80, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
    const t = new THREE.DataTexture(dados, 3, 1, THREE.RGBAFormat);
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  }, []);
  return (cor: string, op: {mapa?: THREE.Texture; brilho?: number; emissivo?: string} = {}): THREE.Material => {
    const base = {color: op.mapa ? '#ffffff' : cor, map: op.mapa ?? null, emissive: op.emissivo ?? '#000000'};
    if (estilo === 'cartoon') return new THREE.MeshToonMaterial({...base, gradientMap: degraus});
    if (estilo === 'lowpoly') return new THREE.MeshPhongMaterial({...base, flatShading: true, shininess: (op.brilho ?? 0) * 60});
    return new THREE.MeshStandardMaterial({...base, roughness: 1 - (op.brilho ?? 0.1), metalness: 0.02});
  };
};

export type Forma =
  | {tipo: 'caixa'; d: [number, number, number]}
  | {tipo: 'cilindro'; r: number; h: number; r2?: number}
  | {tipo: 'cone'; r: number; h: number}
  | {tipo: 'esfera'; r: number};

const geometria = (f: Forma, folga: number, lp: boolean): THREE.BufferGeometry => {
  const seg = lp ? 7 : 22;
  if (f.tipo === 'caixa') return new THREE.BoxGeometry(f.d[0] + folga * 2, f.d[1] + folga * 2, f.d[2] + folga * 2);
  if (f.tipo === 'cilindro') return new THREE.CylinderGeometry((f.r2 ?? f.r) + folga, f.r + folga, f.h + folga * 2, seg);
  if (f.tipo === 'cone') return new THREE.ConeGeometry(f.r + folga, f.h + folga * 2, seg);
  return new THREE.SphereGeometry(f.r + folga, seg, lp ? 6 : 18);
};

export const Peca: React.FC<{
  forma: Forma;
  mat: THREE.Material;
  estilo: Estilo;
  pos?: [number, number, number];
  rot?: [number, number, number];
  esc?: [number, number, number];
  contorno?: number;
}> = ({forma, mat, estilo, pos = [0, 0, 0], rot = [0, 0, 0], esc = [1, 1, 1], contorno = 0.008}) => {
  const lp = estilo === 'lowpoly';
  const geo = useMemo(() => geometria(forma, 0, lp), [forma, lp]);
  const geoC = useMemo(() => geometria(forma, contorno, lp), [forma, contorno, lp]);
  return (
    <group position={pos} rotation={rot} scale={esc}>
      <mesh geometry={geo} material={mat} castShadow receiveShadow />
      {estilo === 'cartoon' && contorno > 0 && (
        <mesh geometry={geoC}>
          <meshBasicMaterial color="#141018" side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
};

// ---------- O Bisnaga dormindo, enrolado ----------
const Bisnaga: React.FC<{estilo: Estilo; p: Paleta; pos: [number, number, number]; giro: number}> = ({estilo, p, pos, giro}) => {
  const m = useMaterial(estilo);
  const pelo = useMemo(
    () =>
      texturaCanvas(256, 64, (c) => {
        c.fillStyle = p.gato;
        c.fillRect(0, 0, 256, 64);
        c.fillStyle = p.listra;
        for (let i = 0; i < 9; i++) c.fillRect(i * 28 + 6, 0, 11, 64);
      }),
    [p],
  );
  const corpo = m(p.gato, {mapa: pelo});
  const liso = m(p.gato);
  const branco = m(p.farinha);
  const rosa = m('#e98a9a');
  const escuro = m('#2a1a12');
  const rabo = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.26, 0.05, -0.05),
      new THREE.Vector3(-0.3, 0.04, 0.12),
      new THREE.Vector3(-0.12, 0.03, 0.22),
      new THREE.Vector3(0.1, 0.03, 0.22),
      new THREE.Vector3(0.22, 0.04, 0.16),
    ]);
    return new THREE.TubeGeometry(curva, 30, 0.035, estilo === 'lowpoly' ? 6 : 12, false);
  }, [estilo]);
  return (
    <group position={pos} rotation={[0, giro, 0]}>
      {/* corpo gordo e deitado */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.3, 0.15, 0.2]} pos={[0, 0.13, 0]} mat={corpo} estilo={estilo} contorno={0.03} />
      {/* rabo enrolado na frente */}
      <mesh geometry={rabo} material={corpo} castShadow />
      {/* patas da frente, brancas de farinha */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.06, 0.04, 0.05]} pos={[0.26, 0.04, 0.09]} mat={branco} estilo={estilo} contorno={0.08} />
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.06, 0.04, 0.05]} pos={[0.27, 0.04, -0.02]} mat={branco} estilo={estilo} contorno={0.08} />
      {/* cabeça apoiada nas patas */}
      <group position={[0.3, 0.13, 0.04]} rotation={[0, 0, -0.25]}>
        <Peca forma={{tipo: 'esfera', r: 0.13}} esc={[1, 0.88, 1.05]} mat={liso} estilo={estilo} contorno={0.01} />
        {/* orelhas */}
        <Peca forma={{tipo: 'cone', r: 0.05, h: 0.09}} pos={[-0.02, 0.12, 0.07]} rot={[0.35, 0, -0.1]} mat={liso} estilo={estilo} />
        <Peca forma={{tipo: 'cone', r: 0.05, h: 0.09}} pos={[-0.02, 0.12, -0.07]} rot={[-0.35, 0, -0.1]} mat={liso} estilo={estilo} />
        {/* focinho com farinha */}
        <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.05, 0.045, 0.07]} pos={[0.11, -0.03, 0]} mat={branco} estilo={estilo} contorno={0.1} />
        <Peca forma={{tipo: 'esfera', r: 0.016}} pos={[0.155, -0.005, 0]} mat={rosa} estilo={estilo} contorno={0} />
        {/* olhos fechados: dois risquinhos */}
        <Peca forma={{tipo: 'caixa', d: [0.012, 0.008, 0.045]}} pos={[0.115, 0.03, 0.05]} rot={[0, 0.5, 0.15]} mat={escuro} estilo={estilo} contorno={0} />
        <Peca forma={{tipo: 'caixa', d: [0.012, 0.008, 0.045]}} pos={[0.115, 0.03, -0.05]} rot={[0, -0.5, 0.15]} mat={escuro} estilo={estilo} contorno={0} />
      </group>
    </group>
  );
};

// ---------- Um pinguim de louça ----------
const Pinguim: React.FC<{estilo: Estilo; pos: [number, number, number]; giro: number; esc?: number; mats: THREE.Material[]}> = ({
  estilo,
  pos,
  giro,
  esc = 1,
  mats,
}) => {
  const [preto, branco, laranja, olho] = mats;
  return (
    <group position={pos} rotation={[0, giro, 0]} scale={[esc, esc, esc]}>
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.06, 0.09, 0.055]} pos={[0, 0.095, 0]} mat={preto} estilo={estilo} contorno={0.1} />
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.045, 0.072, 0.03]} pos={[0, 0.088, 0.03]} mat={branco} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'esfera', r: 0.042}} pos={[0, 0.2, 0]} mat={preto} estilo={estilo} contorno={0.006} />
      <Peca forma={{tipo: 'esfera', r: 0.011}} pos={[0.017, 0.21, 0.034]} mat={olho} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'esfera', r: 0.011}} pos={[-0.017, 0.21, 0.034]} mat={olho} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'cone', r: 0.012, h: 0.035}} pos={[0, 0.195, 0.05]} rot={[Math.PI / 2, 0, 0]} mat={laranja} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'caixa', d: [0.03, 0.01, 0.035]}} pos={[0.022, 0.005, 0.015]} mat={laranja} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'caixa', d: [0.03, 0.01, 0.035]}} pos={[-0.022, 0.005, 0.015]} mat={laranja} estilo={estilo} contorno={0} />
      {/* asinhas abertas, em marcha */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.012, 0.06, 0.03]} pos={[0.062, 0.1, 0]} rot={[0, 0, 0.45]} mat={preto} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.012, 0.06, 0.03]} pos={[-0.062, 0.1, 0]} rot={[0, 0, -0.45]} mat={preto} estilo={estilo} contorno={0} />
    </group>
  );
};

// ---------- A cozinha ----------
const Camera: React.FC = () => {
  const {camera} = useThree();
  camera.position.set(0.85, 1.5, 2.55);
  camera.lookAt(-0.1, 0.85, -1.4);
  (camera as THREE.PerspectiveCamera).fov = 52;
  camera.updateProjectionMatrix();
  return null;
};

export const Cena3D: React.FC<{estilo: Estilo}> = ({estilo}) => {
  const p = PALETAS[estilo];
  const m = useMaterial(estilo);

  const azulejos = useMemo(
    () =>
      texturaCanvas(
        128,
        128,
        (c) => {
          c.fillStyle = p.rejunte;
          c.fillRect(0, 0, 128, 128);
          c.fillStyle = p.azulejo;
          for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) c.fillRect(i * 64 + 3, j * 64 + 3, 58, 58);
        },
        [10, 4],
      ),
    [p],
  );
  const piso = useMemo(
    () =>
      texturaCanvas(
        128,
        128,
        (c) => {
          for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++) {
              c.fillStyle = (i + j) % 2 ? p.piso2 : p.piso1;
              c.fillRect(i * 64, j * 64, 64, 64);
            }
        },
        [8, 12],
      ),
    [p],
  );

  const matsPinguim = useMemo(
    () => [m('#1b1d24', {brilho: 0.7}), m('#f6f4ee', {brilho: 0.7}), m('#f2902a', {brilho: 0.6}), m('#ffffff', {brilho: 0.9})],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [estilo],
  );

  // posições dos pinguins: em cima do balcão (marchando), no chão dos dois lados e em cima das geladeiras
  const pinguins = useMemo(() => {
    const r = aleatorio(7);
    const lista: {pos: [number, number, number]; giro: number; esc: number}[] = [];
    for (let z = -0.45; z > -5.6; z -= 0.17) {
      for (let x = -0.36; x <= 0.37; x += 0.16) {
        if (r() < 0.12) continue;
        lista.push({pos: [x + (r() - 0.5) * 0.06, 0.92, z + (r() - 0.5) * 0.06], giro: (r() - 0.5) * 0.5, esc: 1 + (r() - 0.5) * 0.15});
      }
    }
    for (const lado of [-1, 1]) {
      for (let z = 0.2; z > -5.6; z -= 0.2) {
        for (let k = 0; k < 6; k++) {
          if (r() < 0.2) continue;
          const x = lado * (0.75 + k * 0.2 + r() * 0.06);
          lista.push({pos: [x, 0, z + (r() - 0.5) * 0.08], giro: (r() - 0.5) * 0.6, esc: 1 + (r() - 0.5) * 0.15});
        }
      }
    }
    for (const gx of [-1.75, -1.05, 1.05, 1.75]) {
      for (let k = 0; k < 4; k++) lista.push({pos: [gx - 0.24 + k * 0.16, 1.85, -5.55], giro: 0, esc: 1});
    }
    return lista;
  }, []);

  const r = aleatorio(3);
  const paes = Array.from({length: 14}, (_, i) => ({x: -2.45 + (i % 2) * 0.12, y: 1.26 + Math.floor(i / 7) * 0.45, z: -1.2 - (i % 7) * 0.45, s: 0.8 + r() * 0.3}));

  return (
    <>
      <Camera />
      <color attach="background" args={[p.fundo]} />
      <fog attach="fog" args={[p.fundo, 4.5, 11]} />
      <ambientLight intensity={p.ambiente} color={p.luzFria} />
      {/* luminária pendurada em cima do Bisnaga */}
      <pointLight position={[0.45, 1.85, 1.1]} intensity={p.quente * 0.12} distance={4} decay={1.6} color={p.luzQuente} castShadow shadow-bias={-0.003} shadow-mapSize={[2048, 2048]} />
      {/* luz da geladeira aberta lá no fundo */}
      <pointLight position={[1.4, 1.0, -5.0]} intensity={p.quente * 0.08} distance={4} decay={1.5} color="#cfe8ff" />
      {/* luar pela janela */}
      <directionalLight position={[-3, 4, -2]} intensity={p.fria} color={p.luzFria} />

      {/* piso e paredes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.5]} material={m(p.piso1, {mapa: piso})} receiveShadow>
        <planeGeometry args={[6, 9]} />
      </mesh>
      <mesh position={[0, 1.6, -5.9]} material={m(p.parede, {mapa: azulejos})}>
        <planeGeometry args={[6, 3.2]} />
      </mesh>
      <mesh position={[-2.9, 1.6, -2.5]} rotation={[0, Math.PI / 2, 0]} material={m(p.parede, {mapa: azulejos})}>
        <planeGeometry args={[9, 3.2]} />
      </mesh>
      <mesh position={[2.9, 1.6, -2.5]} rotation={[0, -Math.PI / 2, 0]} material={m(p.parede, {mapa: azulejos})}>
        <planeGeometry args={[9, 3.2]} />
      </mesh>
      {/* janela com luar na parede da direita */}
      <Peca forma={{tipo: 'caixa', d: [0.04, 0.8, 1.1]}} pos={[2.87, 1.9, -3.2]} mat={m('#1d2a4a', {emissivo: estilo === 'noturno' ? '#1a2850' : '#2a3a70'})} estilo={estilo} />
      <Peca forma={{tipo: 'caixa', d: [0.06, 0.05, 1.15]}} pos={[2.85, 1.9, -3.2]} mat={m(p.madeira)} estilo={estilo} contorno={0} />

      {/* o balcão comprido */}
      <Peca forma={{tipo: 'caixa', d: [0.9, 0.86, 6.2]}} pos={[0, 0.43, -2.3]} mat={m(p.balcao)} estilo={estilo} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [1.0, 0.06, 6.3]}} pos={[0, 0.89, -2.3]} mat={m(p.tampo, {brilho: 0.5})} estilo={estilo} contorno={0.01} />
      {/* saco de farinha, rolo de massa e farinha derramada perto do Bisnaga */}
      <Peca forma={{tipo: 'cilindro', r: 0.15, r2: 0.12, h: 0.36}} pos={[-0.3, 1.1, 0.75]} mat={m('#e8dcc0')} estilo={estilo} />
      <Peca forma={{tipo: 'cilindro', r: 0.025, h: 0.4}} pos={[0.33, 0.95, 0.15]} rot={[Math.PI / 2, 0, 0.3]} mat={m(p.madeira)} estilo={estilo} />
      <Peca forma={{tipo: 'cilindro', r: 0.18, h: 0.006}} pos={[0.12, 0.925, 0.6]} esc={[1.3, 1, 0.8]} mat={m(p.farinha)} estilo={estilo} contorno={0} />

      <Bisnaga estilo={estilo} p={p} pos={[0.14, 0.92, 0.5]} giro={-0.95} />

      {/* geladeiras no fundo, a da direita aberta */}
      {[-1.4, 1.4].map((x) => (
        <group key={x}>
          <Peca forma={{tipo: 'caixa', d: [1.25, 1.8, 0.65]}} pos={[x, 0.9, -5.5]} mat={m(p.geladeira, {brilho: 0.6})} estilo={estilo} contorno={0.012} />
          <Peca forma={{tipo: 'caixa', d: [0.04, 0.5, 0.04]}} pos={[x + (x < 0 ? 0.5 : -0.5), 1.2, -5.15]} mat={m('#777')} estilo={estilo} contorno={0} />
        </group>
      ))}
      <Peca forma={{tipo: 'caixa', d: [0.05, 1.7, 0.6]}} pos={[2.06, 0.9, -4.9]} rot={[0, -0.9, 0]} mat={m(p.geladeira, {brilho: 0.6})} estilo={estilo} />

      {/* forno e prateleiras de pão na parede da esquerda */}
      <Peca forma={{tipo: 'caixa', d: [0.7, 1.2, 1.2]}} pos={[-2.5, 0.6, -4.2]} mat={m(p.forno, {brilho: 0.5})} estilo={estilo} />
      <Peca forma={{tipo: 'caixa', d: [0.04, 0.4, 0.8]}} pos={[-2.14, 0.7, -4.2]} mat={m('#ff7a2a', {emissivo: '#7a2a05'})} estilo={estilo} contorno={0} />
      {[1.1, 1.55].map((y) => (
        <Peca key={y} forma={{tipo: 'caixa', d: [0.45, 0.04, 3.4]}} pos={[-2.65, y, -2.6]} mat={m(p.madeira)} estilo={estilo} />
      ))}
      {paes.map((b, i) => (
        <Peca key={i} forma={{tipo: 'esfera', r: 1}} esc={[0.07 * b.s, 0.06 * b.s, 0.18 * b.s]} pos={[b.x, b.y + 0.06, b.z]} mat={m(p.pao)} estilo={estilo} contorno={0.1} />
      ))}

      {/* o exército de pinguins */}
      {pinguins.map((pg, i) => (
        <Pinguim key={i} estilo={estilo} pos={pg.pos} giro={pg.giro} esc={pg.esc} mats={matsPinguim} />
      ))}
    </>
  );
};
