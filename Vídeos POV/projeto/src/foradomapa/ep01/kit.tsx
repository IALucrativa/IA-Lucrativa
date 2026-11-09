import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {aleatorio, texturaFaixa, texturaJanelas} from '../texturas';
import {PALETAS} from '../Cena3D';

// Peças reaproveitadas em todas as cenas da série, no estilo "noturno realista".
// Materiais, formas e texturas ficam guardados (cache) para não serem recriados a cada quadro.

export const P = PALETAS.noturno;

const cacheMat = new Map<string, THREE.Material>();
export const mat = (cor: string, opts: {mapa?: THREE.Texture; chaveMapa?: string; emissivo?: string; rugosidade?: number; metal?: number; transparente?: number} = {}) => {
  const chave = [cor, opts.chaveMapa ?? '', opts.emissivo ?? '', opts.rugosidade ?? '', opts.metal ?? '', opts.transparente ?? ''].join('|');
  let m = cacheMat.get(chave);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: opts.mapa ? '#ffffff' : cor,
      map: opts.mapa ?? null,
      roughness: opts.rugosidade ?? 0.85,
      metalness: opts.metal ?? 0.05,
      emissive: opts.emissivo ?? '#000000',
      transparent: opts.transparente !== undefined,
      opacity: opts.transparente ?? 1,
    });
    cacheMat.set(chave, m);
  }
  return m;
};

const cacheBasico = new Map<string, THREE.Material>();
export const basico = (cor: string, mapa?: THREE.Texture, chaveMapa = '') => {
  const chave = cor + '|' + chaveMapa;
  let m = cacheBasico.get(chave);
  if (!m) {
    m = new THREE.MeshBasicMaterial({color: mapa ? '#ffffff' : cor, map: mapa ?? null, toneMapped: false});
    cacheBasico.set(chave, m);
  }
  return m;
};

const cacheTex = new Map<string, THREE.Texture>();
export const textura = (chave: string, criar: () => THREE.Texture) => {
  let t = cacheTex.get(chave);
  if (!t) {
    t = criar();
    cacheTex.set(chave, t);
  }
  return t;
};

export type Forma =
  | {tipo: 'caixa'; d: [number, number, number]}
  | {tipo: 'cilindro'; r: number; h: number; r2?: number}
  | {tipo: 'esfera'; r: number}
  | {tipo: 'plano'; d: [number, number]};

const cacheGeo = new Map<string, THREE.BufferGeometry>();
const geo = (f: Forma) => {
  const chave = JSON.stringify(f);
  let g = cacheGeo.get(chave);
  if (!g) {
    if (f.tipo === 'caixa') g = new THREE.BoxGeometry(...f.d);
    else if (f.tipo === 'cilindro') g = new THREE.CylinderGeometry(f.r2 ?? f.r, f.r, f.h, 20);
    else if (f.tipo === 'esfera') g = new THREE.SphereGeometry(f.r, 20, 16);
    else g = new THREE.PlaneGeometry(...f.d);
    cacheGeo.set(chave, g);
  }
  return g;
};

type V3 = [number, number, number];

export const Peca: React.FC<{forma: Forma; material: THREE.Material; pos?: V3; rot?: V3; esc?: V3}> = ({forma, material, pos = [0, 0, 0], rot = [0, 0, 0], esc = [1, 1, 1]}) => (
  <mesh geometry={geo(forma)} material={material} position={pos} rotation={rot} scale={esc} />
);

// Cilindro entre dois pontos (braços, hastes)
export const entre = (a: THREE.Vector3, b: THREE.Vector3) => {
  const meio = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const comp = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  return {pos: [meio.x, meio.y, meio.z] as V3, rot: [e.x, e.y, e.z] as V3, comp};
};

// Câmera: posição dos olhos e para onde olha
export const Camera: React.FC<{pos: V3; olha: V3; fov?: number}> = ({pos, olha, fov = 118}) => {
  const {camera} = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = fov;
  cam.near = 0.03;
  cam.far = 220;
  cam.position.set(...pos);
  cam.lookAt(...olha);
  cam.updateProjectionMatrix();
  return null;
};

export const Ambiente: React.FC<{ceu?: string; neblina?: [number, number]; luz?: number}> = ({ceu = P.ceu, neblina = [16, 55], luz = 1}) => {
  const {scene} = useThree();
  scene.background = useMemo(() => new THREE.Color(ceu), [ceu]);
  scene.fog = useMemo(() => new THREE.Fog(P.neblina, neblina[0], neblina[1]), [neblina]);
  return (
    <>
      <hemisphereLight args={[P.ceu, '#0a0a0a', 0.5 * luz]} />
      <directionalLight position={[-8, 20, 10]} intensity={0.25 * luz} color="#b9c8ff" />
    </>
  );
};

// ========== A rua ==========
const PREDIOS = (() => {
  const r = aleatorio(19);
  const lista: {x: number; z: number; w: number; h: number; d: number; cor: string; semente: number; andares: number}[] = [];
  for (const lado of [-1, 1]) {
    let z = 14;
    while (z > -70) {
      const d = 5 + r() * 5;
      const h = 6 + r() * 12;
      const w = 7;
      const cor = P.paredes[Math.floor(r() * P.paredes.length)];
      lista.push({x: lado * (6.6 + w / 2), z: z - d / 2, w, h, d, cor, semente: Math.floor(r() * 9999), andares: Math.max(3, Math.round(h / 3))});
      z -= d + 0.3;
    }
  }
  return lista;
})();

export const Rua: React.FC<{muroAberto?: boolean; semaforoAceso?: boolean; postesComLuz?: number[]}> = ({muroAberto, semaforoAceso, postesComLuz = [-6, -22]}) => {
  const faixa = textura('faixa', texturaFaixa);
  const postes = [-1, 1].flatMap((lado) => [10, -6, -22, -38, -54].map((z) => ({x: lado * 4.7, z: z - (lado > 0 ? 7 : 0)})));
  return (
    <>
      <Peca forma={{tipo: 'caixa', d: [9.4, 0.1, 180]}} material={mat(P.asfalto)} pos={[0, -0.05, -50]} />
      {[-1, 1].map((l) => (
        <Peca key={l} forma={{tipo: 'caixa', d: [2.2, 0.18, 180]}} material={mat(P.calcada)} pos={[l * 5.6, 0.09, -50]} />
      ))}
      {Array.from({length: 18}).map((_, i) => (
        <Peca key={i} forma={{tipo: 'plano', d: [0.15, 2.4]}} material={basico('#a8902f')} pos={[0, 0.006, 15 - i * 6]} rot={[-Math.PI / 2, 0, 0]} />
      ))}
      <mesh position={[0, 0.008, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 3.4]} />
        <meshStandardMaterial map={faixa} transparent roughness={0.9} />
      </mesh>
      {PREDIOS.map((b, i) => (
        <Peca
          key={i}
          forma={{tipo: 'caixa', d: [b.w, b.h, b.d]}}
          material={mat(b.cor, {mapa: textura('predio' + b.semente, () => texturaJanelas(b.semente, b.cor, P.luzAcesa, P.luzApagada, 4, b.andares)), chaveMapa: 'predio' + b.semente})}
          pos={[b.x, b.h / 2, b.z]}
        />
      ))}
      {/* O muro no fim da rua: inteiro, ou com uma rua nova no meio */}
      {muroAberto ? (
        <>
          <Peca forma={{tipo: 'caixa', d: [3.0, 3, 0.4]}} material={mat(P.muro)} pos={[-3.2, 1.5, -72]} />
          <Peca forma={{tipo: 'caixa', d: [3.0, 3, 0.4]}} material={mat(P.muro)} pos={[3.2, 1.5, -72]} />
          {/* a rua que não existia */}
          <Peca forma={{tipo: 'caixa', d: [3.4, 0.1, 40]}} material={mat('#16181c')} pos={[0, -0.04, -92]} />
          {[-1, 1].map((l) => (
            <Peca key={l} forma={{tipo: 'caixa', d: [0.5, 9, 40]}} material={mat('#24211f')} pos={[l * 2.0, 4.5, -92]} />
          ))}
          <mesh position={[0.9, 3.4, -84]}>
            <sphereGeometry args={[0.18, 16, 12]} />
            <meshBasicMaterial color="#d6e4ff" />
          </mesh>
          <pointLight position={[0.9, 3.2, -84]} intensity={30} distance={14} decay={1.5} color="#b8ccff" />
        </>
      ) : (
        <Peca forma={{tipo: 'caixa', d: [9.4, 3, 0.4]}} material={mat(P.muro)} pos={[0, 1.5, -72]} />
      )}
      {postes.map((s, i) => {
        const dentro = -Math.sign(s.x);
        const comLuz = postesComLuz.includes(s.z) || postesComLuz.includes(s.z + 7);
        return (
          <group key={i}>
            <Peca forma={{tipo: 'cilindro', r: 0.09, h: 6}} material={mat(P.poste)} pos={[s.x, 3, s.z]} />
            <Peca forma={{tipo: 'caixa', d: [1.4, 0.1, 0.12]}} material={mat(P.poste)} pos={[s.x + dentro * 0.7, 5.95, s.z]} />
            <Peca forma={{tipo: 'caixa', d: [0.5, 0.12, 0.25]}} material={basico(P.lampada)} pos={[s.x + dentro * 1.3, 5.82, s.z]} />
            {comLuz && <pointLight position={[s.x + dentro * 1.3, 5.5, s.z]} intensity={45} distance={16} decay={1.6} color={P.lampada} />}
          </group>
        );
      })}
      {/* Semáforos piscando no amarelo, na faixa */}
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 4.9, 0, -4.8]}>
          <Peca forma={{tipo: 'cilindro', r: 0.06, h: 3.2}} material={mat(P.poste)} pos={[0, 1.6, 0]} />
          <Peca forma={{tipo: 'caixa', d: [0.3, 0.8, 0.25]}} material={mat('#121316')} pos={[0, 3.4, 0]} />
          {[0.25, 0, -0.25].map((dy, k) => (
            <Peca
              key={k}
              forma={{tipo: 'esfera', r: 0.08}}
              material={k === 1 && semaforoAceso ? basico('#ffb020') : mat('#1f2024')}
              pos={[0, 3.4 + dy, 0.13]}
            />
          ))}
          {semaforoAceso && <pointLight position={[0, 3.4, 0.5]} intensity={6} distance={6} color="#ffb020" />}
        </group>
      ))}
    </>
  );
};
