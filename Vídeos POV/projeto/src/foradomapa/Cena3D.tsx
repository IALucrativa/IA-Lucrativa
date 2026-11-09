import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';
import {aleatorio, texturaCelular, texturaEspelho, texturaFaixa, texturaJanelas} from './texturas';

// Cena POV da Parte 1: a moto parada em cima da faixa de pedestres, à noite.
// A câmera é o olho do Motoca. Três estilos para a prancha.

export type Estilo = 'cartoon' | 'lowpoly' | 'noturno';

type Paleta = {
  ceu: string;
  neblina: string;
  asfalto: string;
  calcada: string;
  paredes: string[];
  luzAcesa: string;
  luzApagada: string;
  poste: string;
  lampada: string;
  tanque: string;
  plastico: string;
  luva: string;
  jaqueta: string;
  pele: string;
  muro: string;
};

const PALETAS: Record<Estilo, Paleta> = {
  cartoon: {
    ceu: '#1d2b55', neblina: '#2a3566', asfalto: '#3a3f55', calcada: '#8a8fa3',
    paredes: ['#e07a5f', '#81b29a', '#f2cc8f', '#6d8bc9', '#c97bb2', '#e9e4d4'],
    luzAcesa: '#ffe08a', luzApagada: '#2b3150', poste: '#4a4f66', lampada: '#fff1b8',
    tanque: '#d63c3c', plastico: '#24262e', luva: '#4a4a55', jaqueta: '#2f5d8a', pele: '#c98a5e', muro: '#b9a58f',
  },
  lowpoly: {
    ceu: '#2b1d4a', neblina: '#3b2a66', asfalto: '#3d3a5c', calcada: '#6e6a93',
    paredes: ['#5b4b8a', '#7a5ea8', '#4a6fa5', '#9a6fb0', '#3e5c8a', '#6b5b95'],
    luzAcesa: '#ffb86b', luzApagada: '#2a2445', poste: '#2f2a4a', lampada: '#ffd59a',
    tanque: '#ff8a3d', plastico: '#1e1b33', luva: '#3a3658', jaqueta: '#3a8a7a', pele: '#c48a64', muro: '#7a6a9a',
  },
  noturno: {
    ceu: '#07090f', neblina: '#141821', asfalto: '#1c1e22', calcada: '#4a4a4c',
    paredes: ['#5a4a40', '#4b5250', '#6a5a4a', '#3f4448', '#5d534a', '#4a4038'],
    luzAcesa: '#ffb347', luzApagada: '#15171c', poste: '#2a2c30', lampada: '#ffb347',
    tanque: '#8a1f1f', plastico: '#141518', luva: '#2e2e33', jaqueta: '#2a3440', pele: '#b07a55', muro: '#5a5048',
  },
};

// Material por estilo
const useMaterial = (estilo: Estilo) => {
  const degraus = useMemo(() => {
    const dados = new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]);
    const t = new THREE.DataTexture(dados, 3, 1, THREE.RGBAFormat);
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  }, []);
  return (cor: string, mapa?: THREE.Texture, emissivo?: string): THREE.Material => {
    const base = {color: mapa ? '#ffffff' : cor, map: mapa ?? null};
    if (estilo === 'cartoon') {
      return new THREE.MeshToonMaterial({...base, gradientMap: degraus, emissive: emissivo ?? '#000000'});
    }
    if (estilo === 'lowpoly') {
      return new THREE.MeshPhongMaterial({...base, flatShading: true, shininess: 0, emissive: emissivo ?? '#000000'});
    }
    return new THREE.MeshStandardMaterial({...base, roughness: 0.85, metalness: 0.05, emissive: emissivo ?? '#000000'});
  };
};

type Forma =
  | {tipo: 'caixa'; d: [number, number, number]}
  | {tipo: 'cilindro'; r: number; h: number; r2?: number}
  | {tipo: 'esfera'; r: number; esc?: [number, number, number]};

const geometria = (f: Forma, folga = 0, lowpoly = false): THREE.BufferGeometry => {
  const seg = lowpoly ? 7 : 20;
  if (f.tipo === 'caixa') return new THREE.BoxGeometry(f.d[0] + folga * 2, f.d[1] + folga * 2, f.d[2] + folga * 2);
  if (f.tipo === 'cilindro') return new THREE.CylinderGeometry((f.r2 ?? f.r) + folga, f.r + folga, f.h + folga * 2, seg);
  return new THREE.SphereGeometry(f.r + folga, seg, lowpoly ? 6 : 16);
};

// Uma peça da cena. No estilo cartoon ganha contorno escuro.
const Peca: React.FC<{
  forma: Forma;
  material: THREE.Material;
  pos?: [number, number, number];
  rot?: [number, number, number];
  estilo: Estilo;
  contorno?: number;
}> = ({forma, material, pos = [0, 0, 0], rot = [0, 0, 0], estilo, contorno = 0.012}) => {
  const lp = estilo === 'lowpoly';
  const geo = useMemo(() => geometria(forma, 0, lp), [forma, lp]);
  const geoContorno = useMemo(() => geometria(forma, contorno, lp), [forma, contorno, lp]);
  const esc = forma.tipo === 'esfera' ? forma.esc : undefined;
  return (
    <group position={pos} rotation={rot} scale={esc ?? [1, 1, 1]}>
      <mesh geometry={geo} material={material} />
      {estilo === 'cartoon' && (
        <mesh geometry={geoContorno}>
          <meshBasicMaterial color="#0b0d14" side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
};

// Cilindro ligando dois pontos (braços, hastes)
const entre = (a: THREE.Vector3, b: THREE.Vector3) => {
  const meio = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const comp = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  return {pos: [meio.x, meio.y, meio.z] as [number, number, number], rot: [e.x, e.y, e.z] as [number, number, number], comp};
};

// Lente olho de peixe: desenha a cena numa imagem e curva as bordas.
const OlhoDePeixe: React.FC<{forca: number}> = ({forca}) => {
  const {gl, size, scene, camera} = useThree();
  const alvo = useMemo(() => {
    const t = new THREE.WebGLRenderTarget(size.width * 1.25, size.height * 1.25, {samples: 4});
    t.texture.colorSpace = THREE.LinearSRGBColorSpace;
    return t;
  }, [size.width, size.height]);
  const {cenaTela, camTela} = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {imagem: {value: alvo.texture}, k: {value: forca}, aspecto: {value: size.width / size.height}},
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `
        uniform sampler2D imagem; uniform float k; uniform float aspecto; varying vec2 vUv;
        void main(){
          vec2 p = vUv * 2.0 - 1.0;
          vec2 q = vec2(p.x * aspecto, p.y);
          float r2 = dot(q, q);
          float rmax = aspecto * aspecto + 1.0;
          float escala = 1.0 / (1.0 + k * rmax);
          vec2 s = p * (1.0 + k * r2) * escala;
          vec4 cor = texture2D(imagem, s * 0.5 + 0.5);
          float vinheta = smoothstep(1.25, 0.55, length(q));
          gl_FragColor = vec4(cor.rgb * mix(0.55, 1.0, vinheta), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      depthTest: false,
      depthWrite: false,
    });
    const cena = new THREE.Scene();
    cena.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return {cenaTela: cena, camTela: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)};
  }, [alvo, forca, size.width, size.height]);

  useFrame(() => {
    gl.setRenderTarget(alvo);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.clear();
    gl.render(cenaTela, camTela);
  }, 1);
  return null;
};

export const Cena3D: React.FC<{estilo: Estilo}> = ({estilo}) => {
  const p = PALETAS[estilo];
  const mat = useMaterial(estilo);
  const {camera, scene} = useThree();

  useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 118;
    cam.near = 0.05;
    cam.far = 200;
    cam.position.set(0, 1.45, 0.05);
    cam.lookAt(0, 0.95, -6);
    cam.updateProjectionMatrix();
    scene.background = new THREE.Color(p.ceu);
    scene.fog = new THREE.Fog(p.neblina, 18, estilo === 'noturno' ? 55 : 75);
  }, [camera, scene, p, estilo]);

  // Prédios dos dois lados da rua
  const predios = useMemo(() => {
    const r = aleatorio(estilo === 'cartoon' ? 7 : estilo === 'lowpoly' ? 11 : 19);
    const lista: {x: number; z: number; w: number; h: number; d: number; mat: THREE.Material}[] = [];
    for (const lado of [-1, 1]) {
      let z = 2;
      let i = 0;
      while (z > -70) {
        const d = 5 + r() * 5;
        const h = 6 + r() * 12;
        const w = 7;
        const cor = p.paredes[Math.floor(r() * p.paredes.length)];
        const tex = texturaJanelas(Math.floor(r() * 9999), cor, p.luzAcesa, p.luzApagada, 4, Math.max(3, Math.round(h / 3)));
        lista.push({x: lado * (6.6 + w / 2), z: z - d / 2, w, h, d, mat: mat(cor, tex)});
        z -= d + 0.3;
        i++;
      }
    }
    return lista;
  }, [estilo]); // eslint-disable-line react-hooks/exhaustive-deps

  const farol = useMemo(() => {
    const s = new THREE.SpotLight('#fff4d6', estilo === 'noturno' ? 60 : 40, 30, 0.5, 0.6, 1.4);
    s.position.set(0, 0.9, -0.9);
    s.target.position.set(0, 0, -12);
    return s;
  }, [estilo]);
  const faixa = useMemo(() => texturaFaixa(), []);
  const celular = useMemo(() => texturaCelular(), []);
  const espelho = useMemo(() => texturaEspelho(p.ceu), [p.ceu]);

  // Moto e braços (posições em metros; a câmera está em y = 1.45)
  const ombroE = new THREE.Vector3(-0.24, 1.18, 0.12);
  const ombroD = new THREE.Vector3(0.24, 1.18, 0.12);
  const maoE = new THREE.Vector3(-0.33, 1.02, -0.52);
  const maoD = new THREE.Vector3(0.33, 1.02, -0.52);
  const bracoE = entre(ombroE, maoE);
  const bracoD = entre(ombroD, maoD);
  const hasteEsp = entre(new THREE.Vector3(-0.3, 1.0, -0.56), new THREE.Vector3(-0.44, 1.24, -0.66));

  const mLuva = mat(p.luva);
  const mPele = mat(p.pele);
  const mJaqueta = mat(p.jaqueta);
  const mPlastico = mat(p.plastico);
  const mMetal = mat('#9aa0a8');

  const Luva: React.FC<{lado: 1 | -1; rasgada?: boolean}> = ({lado, rasgada}) => {
    const x = lado * 0.33;
    return (
      <group position={[x, 1.04, -0.53]} scale={1.7}>
      <group position={[-x, -1.04, 0.53]}>
        {/* costas da mão, arredondada, por cima da manopla */}
        <Peca estilo={estilo} forma={{tipo: 'esfera', r: 0.06, esc: [1, 0.5, 1.15]}} material={mLuva} pos={[x, 1.04, -0.52]} contorno={0.006} />
        {/* quatro dedos: saem das costas da mão e dobram por cima da manopla */}
        {[0, 1, 2, 3].map((i) => {
          const fx = x - lado * 0.036 + lado * i * 0.024;
          const ponta = rasgada && i === 1;
          return (
            <group key={i}>
              <Peca estilo={estilo} forma={{tipo: 'esfera', r: 0.014}} material={mLuva} pos={[fx, 1.05, -0.565]} contorno={0.004} />
              <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.012, h: 0.04}} material={mLuva} pos={[fx, 1.043, -0.585]} rot={[Math.PI / 2.2, 0, 0]} contorno={0.004} />
              <Peca estilo={estilo} forma={{tipo: 'esfera', r: 0.0125}} material={ponta ? mPele : mLuva} pos={[fx, 1.035, -0.605]} contorno={0.004} />
            </group>
          );
        })}
        {/* polegar */}
        <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.012, h: 0.05}} material={mLuva} pos={[x - lado * 0.06, 1.03, -0.5]} rot={[0.6, 0, lado * 1.1]} />
        {/* punho da jaqueta */}
        <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.045, h: 0.06}} material={mJaqueta} pos={[x - lado * 0.005, 1.06, -0.46]} rot={[1.25, 0, lado * 0.15]} />
      </group>
      </group>
    );
  };

  const postes = [-1, 1].flatMap((lado) => [-6, -22, -38, -54].map((z, i) => ({x: lado * 4.7, z: z - (lado > 0 ? 7 : 0), i})));

  return (
    <>
      <OlhoDePeixe forca={0.32} />

      {/* Luz geral */}
      <hemisphereLight args={[p.ceu, '#0a0a0a', estilo === 'noturno' ? 0.5 : 1.6]} />
      <directionalLight position={[-8, 20, 10]} intensity={estilo === 'noturno' ? 0.25 : 0.9} color="#b9c8ff" />
      {/* Farol da moto */}
      <primitive object={farol} />
      <primitive object={farol.target} />

      {/* Lua */}
      <mesh position={[-25, 40, -120]}>
        <sphereGeometry args={[4, 24, 16]} />
        <meshBasicMaterial color="#f4f0dc" fog={false} />
      </mesh>

      {/* Rua e calçadas */}
      <Peca estilo={estilo} contorno={0} forma={{tipo: 'caixa', d: [9.4, 0.1, 160]}} material={mat(p.asfalto)} pos={[0, -0.05, -60]} />
      {[-1, 1].map((lado) => (
        <group key={lado}>
          <Peca estilo={estilo} contorno={0.02} forma={{tipo: 'caixa', d: [2.2, 0.18, 160]}} material={mat(p.calcada)} pos={[lado * 5.6, 0.09, -60]} />
        </group>
      ))}
      {/* Faixa do meio, tracejada */}
      {Array.from({length: 14}).map((_, i) => (
        <mesh key={i} position={[0, 0.006, -9 - i * 6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 2.4]} />
          <meshBasicMaterial color="#e8c547" />
        </mesh>
      ))}
      {/* Faixa de pedestres, embaixo e à frente da moto */}
      <mesh position={[0, 0.008, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 3.4]} />
        <meshStandardMaterial map={faixa} transparent roughness={0.9} />
      </mesh>

      {/* Prédios */}
      {predios.map((b, i) => (
        <Peca key={i} estilo={estilo} contorno={0.06} forma={{tipo: 'caixa', d: [b.w, b.h, b.d]}} material={b.mat} pos={[b.x, b.h / 2, b.z]} />
      ))}
      {/* O muro no fim da rua */}
      <Peca estilo={estilo} contorno={0.05} forma={{tipo: 'caixa', d: [9.4, 3, 0.4]}} material={mat(p.muro)} pos={[0, 1.5, -72]} />

      {/* Postes com luz */}
      {postes.map((s, i) => {
        const dentro = -Math.sign(s.x);
        return (
          <group key={i}>
            <Peca estilo={estilo} contorno={0.03} forma={{tipo: 'cilindro', r: 0.09, h: 6}} material={mat(p.poste)} pos={[s.x, 3, s.z]} />
            <Peca estilo={estilo} contorno={0.03} forma={{tipo: 'caixa', d: [1.4, 0.1, 0.12]}} material={mat(p.poste)} pos={[s.x + dentro * 0.7, 5.95, s.z]} />
            <mesh position={[s.x + dentro * 1.3, 5.82, s.z]}>
              <boxGeometry args={[0.5, 0.12, 0.25]} />
              <meshBasicMaterial color={p.lampada} />
            </mesh>
            {s.i < 2 && <pointLight position={[s.x + dentro * 1.3, 5.5, s.z]} intensity={estilo === 'noturno' ? 45 : 25} distance={16} decay={1.6} color={p.lampada} />}
          </group>
        );
      })}

      {/* ===== A moto ===== */}
      {/* Tanque */}
      <Peca estilo={estilo} forma={{tipo: 'esfera', r: 0.2, esc: [1.1, 0.55, 1.6]}} material={mat(p.tanque)} pos={[0, 0.82, -0.32]} />
      {/* Carenagem do farol */}
      <Peca estilo={estilo} forma={{tipo: 'caixa', d: [0.34, 0.2, 0.24]}} material={mPlastico} pos={[0, 0.86, -0.78]} rot={[-0.35, 0, 0]} />
      {/* Painel (velocímetro) */}
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.06, h: 0.03}} material={mPlastico} pos={[0.1, 0.99, -0.66]} rot={[1.1, 0, 0]} />
      <mesh position={[0.1, 1.003, -0.65]} rotation={[-0.47, 0, 0]}>
        <circleGeometry args={[0.048, 24]} />
        <meshBasicMaterial color="#d9f2ff" />
      </mesh>
      {/* Guidão */}
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.016, h: 0.62}} material={mMetal} pos={[0, 1.0, -0.56]} rot={[0, 0, Math.PI / 2]} />
      {[-1, 1].map((l) => (
        <Peca key={l} estilo={estilo} forma={{tipo: 'cilindro', r: 0.022, h: 0.14}} material={mPlastico} pos={[l * 0.33, 1.0, -0.55]} rot={[0, 0, Math.PI / 2]} />
      ))}
      {/* Espelho rachado */}
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.008, h: hasteEsp.comp}} material={mMetal} pos={hasteEsp.pos} rot={hasteEsp.rot} />
      <group position={[-0.45, 1.27, -0.67]} rotation={[0, 0.35, 0]}>
        <Peca estilo={estilo} forma={{tipo: 'caixa', d: [0.16, 0.11, 0.02]}} material={mPlastico} />
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.14, 0.095]} />
          <meshBasicMaterial map={espelho} />
        </mesh>
      </group>
      {/* Suporte e celular */}
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.008, h: 0.07}} material={mPlastico} pos={[0, 1.04, -0.58]} />
      <group position={[0, 1.15, -0.55]} rotation={[-0.5, 0, 0]} scale={1.3}>
        <Peca estilo={estilo} forma={{tipo: 'caixa', d: [0.085, 0.165, 0.012]}} material={mPlastico} contorno={0.004} />
        <mesh position={[0, 0, 0.007]}>
          <planeGeometry args={[0.075, 0.15]} />
          <meshBasicMaterial map={celular} toneMapped={false} />
        </mesh>
      </group>

      {/* ===== Braços e luvas ===== */}
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.055, r2: 0.045, h: bracoE.comp}} material={mJaqueta} pos={bracoE.pos} rot={bracoE.rot} />
      <Peca estilo={estilo} forma={{tipo: 'cilindro', r: 0.055, r2: 0.045, h: bracoD.comp}} material={mJaqueta} pos={bracoD.pos} rot={bracoD.rot} />
      <Luva lado={-1} />
      <Luva lado={1} rasgada />
    </>
  );
};
