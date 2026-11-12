import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Estilo, Peca, texturaCanvas, useMaterial, aleatorio} from '../bisnaga/Cena3D';
import {Jabuti, Lesma, Gosma, useMatsJabuti, useMatsLesma, TipoJabuti} from './Jabutis';

// O quintal da vó, de noite, depois da chuva.
// Eixos: o Seu Casco fica perto da câmera, na frente da horta; as lesmas vêm do fundo (z negativo).

type Vec = [number, number, number];
export const CAM_QUINTAL = {pos: [0.5, 0.52, 1.95] as Vec, alvo: [-0.12, 0.1, -0.6] as Vec, fov: 58};

const Camera: React.FC<{pos: Vec; alvo: Vec; fov: number}> = ({pos, alvo, fov}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(...alvo);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.updateProjectionMatrix();
  return null;
};

export type JabutiNaCena = {tipo: TipoJabuti; pos: Vec; giro?: number; andando?: number; escondido?: number; costas?: number; pataNoAr?: number; esc?: number};

export type ParamsQuintal = {
  cam?: {pos: Vec; alvo: Vec; fov: number};
  t?: number;
  avanco?: number; // quanto as lesmas já andaram (m)
  lesmasVisiveis?: number; // 0..1: fração da multidão que aparece
  heroi?: {pos: Vec; giro: number; pataNoAr?: number; mastiga?: number; escondido?: number; olhar?: number} | null;
  jabutis?: JabutiNaCena[];
  treme?: number; // 0..1: o chão tremendo (meta bônus)
  kombi?: number; // 0..1: o farol da Kombi no portão
  extras?: React.ReactNode;
};

export const Quintal: React.FC<{estilo: Estilo} & ParamsQuintal> = ({
  estilo,
  cam = CAM_QUINTAL,
  t = 0,
  avanco = 0,
  lesmasVisiveis = 1,
  heroi = {pos: [0.18, 0, 0.62], giro: -1.0},
  jabutis = [],
  treme = 0,
  kombi = 0,
  extras = null,
}) => {
  const m = useMaterial(estilo);
  const mj = useMatsJabuti(estilo);
  const ml = useMatsLesma(estilo);

  const cimento = useMemo(
    () =>
      texturaCanvas(
        256,
        256,
        (c) => {
          c.fillStyle = '#93402f';
          c.fillRect(0, 0, 256, 256);
          const r = aleatorio(5);
          for (let i = 0; i < 260; i++) {
            c.fillStyle = r() < 0.5 ? 'rgba(60,15,10,0.08)' : 'rgba(255,170,140,0.05)';
            c.beginPath();
            c.arc(r() * 256, r() * 256, 2 + r() * 10, 0, Math.PI * 2);
            c.fill();
          }
          // juntas de dilatação
          c.strokeStyle = 'rgba(40,10,8,0.55)';
          c.lineWidth = 3;
          c.strokeRect(0, 0, 256, 256);
        },
        [4, 6],
      ),
    [],
  );
  const reboco = useMemo(
    () =>
      texturaCanvas(
        256,
        128,
        (c) => {
          c.fillStyle = '#d9cfb8';
          c.fillRect(0, 0, 256, 128);
          const r = aleatorio(8);
          for (let i = 0; i < 120; i++) {
            c.fillStyle = `rgba(90,80,60,${r() * 0.12})`;
            c.fillRect(r() * 256, r() * 128, 6 + r() * 20, 3 + r() * 8);
          }
          // barra de umidade embaixo
          const g = c.createLinearGradient(0, 128, 0, 80);
          g.addColorStop(0, 'rgba(70,90,60,0.6)');
          g.addColorStop(1, 'rgba(70,90,60,0)');
          c.fillStyle = g;
          c.fillRect(0, 80, 256, 48);
        },
        [4, 1],
      ),
    [],
  );

  // poças: onde a luz da cozinha brilha
  const pocas = useMemo(() => {
    const r = aleatorio(13);
    return Array.from({length: 9}, () => ({x: -2 + r() * 4, z: 0.6 - r() * 5.8, s: 0.25 + r() * 0.45, g: r() * 3}));
  }, []);

  // a multidão de lesmas (as da frente aparecem primeiro)
  const lesmas = useMemo(() => {
    const r = aleatorio(31);
    const lista: {x: number; z: number; giro: number; esc: number; fase: number}[] = [];
    for (let z = -0.55; z > -6.2; z -= 0.2)
      for (let x = -2.3; x <= 2.3; x += 0.2) {
        if (r() < 0.15) continue;
        lista.push({x: x + (r() - 0.5) * 0.1, z: z + (r() - 0.5) * 0.1, giro: Math.PI + (r() - 0.5) * 0.7, esc: 0.85 + r() * 0.35, fase: r() * 6});
      }
    return lista;
  }, []);
  const nLesmas = Math.round(lesmas.length * Math.min(1, lesmasVisiveis));

  const alfaces = useMemo(() => {
    const r = aleatorio(17);
    const l: {x: number; z: number; s: number}[] = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) l.push({x: -0.55 + i * 0.26 + (r() - 0.5) * 0.03, z: 1.0 - j * 0.28 + (r() - 0.5) * 0.03, s: 0.85 + r() * 0.3});
    return l;
  }, []);

  const tremor = treme > 0 ? Math.sin(t * 60) * 0.004 * treme : 0;
  const verde = m('#5fb83a');
  const verdeEscuro = m('#3c8a2a');
  const couve = m('#2f6e3a');
  const terra = m('#4a3020');
  const tijolo = m('#b0553a');
  const cinza = m('#9a9a92');
  const madeira = m('#8a5a32');

  return (
    <>
      <Camera pos={[cam.pos[0] + tremor, cam.pos[1] + tremor * 0.6, cam.pos[2]]} alvo={cam.alvo} fov={cam.fov} />
      <color attach="background" args={['#141b33']} />
      <fog attach="fog" args={['#141b33', 3.5, 9]} />
      <ambientLight intensity={1.0} color="#9fb3ff" />
      {/* luz amarela da janela da cozinha */}
      <pointLight position={[-1.9, 1.3, 0.2]} intensity={5} distance={5.5} decay={1.4} color="#ffcf7a" castShadow shadow-bias={-0.003} shadow-mapSize={[2048, 2048]} />
      {/* luar */}
      <directionalLight position={[3, 5, -2]} intensity={1.1} color="#a9bfff" />
      {/* lampadinha do quintal, perto do tanque */}
      <pointLight position={[1.9, 1.6, -1.6]} intensity={2.2} distance={3.5} decay={1.6} color="#ffe2a8" />
      {kombi > 0 && <pointLight position={[0.4, 0.5, -5.8]} intensity={kombi * 6} distance={4} decay={1.4} color="#fff2c0" />}

      {/* chão de cimento queimado vermelho, molhado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.4]} material={m('#ffffff', {mapa: cimento})} receiveShadow>
        <planeGeometry args={[6, 9]} />
      </mesh>
      {pocas.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, p.g]} position={[p.x, 0.003, p.z]} scale={[p.s, p.s * 0.55, 1]} material={m('#6e2a26', {brilho: 1})}>
          <circleGeometry args={[1, 24]} />
        </mesh>
      ))}

      {/* a casa da vó, à esquerda: parede, janela acesa e o degrau da cozinha */}
      <mesh position={[-2.4, 1.4, -1.5]} rotation={[0, Math.PI / 2, 0]} material={m('#ffffff', {mapa: reboco})}>
        <planeGeometry args={[8, 2.8]} />
      </mesh>
      <mesh position={[-2.39, 1.25, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshBasicMaterial color="#ffd889" toneMapped={false} />
      </mesh>
      {[[0, 0.36], [0, -0.36]].map(([, dy], i) => (
        <Peca key={i} forma={{tipo: 'caixa', d: [0.06, 0.05, 1.0]}} pos={[-2.36, 1.25 + dy, 0.2]} mat={m('#3f6aa8')} estilo={estilo} contorno={0} />
      ))}
      <Peca forma={{tipo: 'caixa', d: [0.06, 0.7, 0.05]}} pos={[-2.36, 1.25, 0.2]} mat={m('#3f6aa8')} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'caixa', d: [0.06, 0.05, 0.9]}} pos={[-2.36, 1.25, 0.2]} mat={m('#3f6aa8')} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'caixa', d: [0.06, 1.8, 0.8]}} pos={[-2.37, 0.9, -1.2]} mat={m('#2f5a8a')} estilo={estilo} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [0.45, 0.14, 1.0]}} pos={[-2.15, 0.07, -1.2]} mat={cinza} estilo={estilo} contorno={0.008} />

      {/* o muro do fundo, com caco de vidro em cima */}
      <Peca forma={{tipo: 'caixa', d: [6, 1.5, 0.15]}} pos={[0, 0.75, -6.6]} mat={m('#ffffff', {mapa: reboco})} estilo={estilo} contorno={0.01} />
      {Array.from({length: 26}, (_, i) => (
        <Peca key={i} forma={{tipo: 'cone', r: 0.03, h: 0.09}} pos={[-2.9 + i * 0.23, 1.54, -6.6]} rot={[0, 0, (i % 3) * 0.2 - 0.2]} mat={m(['#3fae5a', '#7a4a1a', '#e9f2f0'][i % 3], {brilho: 0.9})} estilo={estilo} contorno={0} />
      ))}
      {/* portão de ferro no muro, por onde a Kombi aparece */}
      <Peca forma={{tipo: 'caixa', d: [1.1, 1.4, 0.04]}} pos={[0.4, 0.7, -6.5]} mat={m('#2d3a4a')} estilo={estilo} contorno={0.008} />
      {kombi > 0 && (
        <mesh position={[0.4, 0.5, -6.47]}>
          <circleGeometry args={[0.09 + kombi * 0.05, 20]} />
          <meshBasicMaterial color="#fff6d0" toneMapped={false} />
        </mesh>
      )}

      {/* pé de manga no fundo à direita */}
      <Peca forma={{tipo: 'cilindro', r: 0.16, r2: 0.12, h: 2.2}} pos={[1.9, 1.1, -5.2]} mat={madeira} estilo={estilo} />
      {[[1.9, 2.5, -5.2, 1.0], [1.3, 2.2, -5.0, 0.7], [2.4, 2.1, -4.8, 0.7], [1.8, 2.0, -4.6, 0.6]].map(([x, y, z, r], i) => (
        <Peca key={i} forma={{tipo: 'esfera', r}} pos={[x, y, z]} mat={i % 2 ? verdeEscuro : couve} estilo={estilo} contorno={0.02} />
      ))}

      {/* tanque e lampadinha à direita */}
      <Peca forma={{tipo: 'caixa', d: [0.6, 0.85, 0.55]}} pos={[2.15, 0.425, -1.6]} mat={cinza} estilo={estilo} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [0.5, 0.04, 0.45]}} pos={[2.15, 0.84, -1.6]} mat={m('#5d7a98', {brilho: 0.9})} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'cilindro', r: 0.015, h: 0.25}} pos={[2.35, 1.0, -1.6]} mat={m('#b8bcc2')} estilo={estilo} contorno={0} />
      <Peca forma={{tipo: 'esfera', r: 0.05}} pos={[1.9, 1.6, -1.6]} mat={m('#fff0c0', {emissivo: '#ffcc66'})} estilo={estilo} contorno={0} />

      {/* varal com roupa */}
      {[-1.2, 1.2].map((x) => (
        <Peca key={x} forma={{tipo: 'cilindro', r: 0.025, h: 1.7}} pos={[x, 0.85, -3.3]} mat={madeira} estilo={estilo} contorno={0.006} />
      ))}
      <Peca forma={{tipo: 'cilindro', r: 0.004, h: 2.4}} pos={[0, 1.62, -3.3]} rot={[0, 0, Math.PI / 2]} mat={m('#ddd')} estilo={estilo} contorno={0} />
      {[[-0.75, '#e05a4a', 0.35], [-0.25, '#f4f1e8', 0.3], [0.3, '#4a8ed0', 0.45], [0.8, '#f2c94c', 0.28]].map(([x, cor, h], i) => (
        <Peca key={i} forma={{tipo: 'caixa', d: [0.36, h as number, 0.01]}} pos={[x as number, 1.62 - (h as number) / 2, -3.3]} rot={[0, 0, Math.sin(t * 0.8 + i) * 0.04]} mat={m(cor as string)} estilo={estilo} contorno={0.004} />
      ))}

      {/* a horta: canteiro de tijolo com alface e couve, à esquerda, perto da câmera */}
      <Peca forma={{tipo: 'caixa', d: [0.62, 0.16, 0.95]}} pos={[-0.42, 0.08, 0.72]} mat={tijolo} estilo={estilo} contorno={0.01} />
      <Peca forma={{tipo: 'caixa', d: [0.54, 0.02, 0.87]}} pos={[-0.42, 0.165, 0.72]} mat={terra} estilo={estilo} contorno={0} />
      {alfaces.map((a, i) => (
        <group key={i} position={[a.x, 0.17, a.z]} scale={a.s}>
          <Peca forma={{tipo: 'esfera', r: 0.08}} esc={[1, 0.7, 1]} pos={[0, 0.04, 0]} mat={i % 4 === 3 ? couve : verde} estilo={estilo} contorno={0.02} />
          <Peca forma={{tipo: 'esfera', r: 0.05}} esc={[1, 0.8, 1]} pos={[0.03, 0.08, 0.02]} mat={verdeEscuro} estilo={estilo} contorno={0} />
        </group>
      ))}
      {/* um vaso de planta e um balde no meio do caminho */}
      <Peca forma={{tipo: 'cilindro', r: 0.11, r2: 0.14, h: 0.22}} pos={[1.1, 0.11, -0.6]} mat={m('#c0603a')} estilo={estilo} />
      <Peca forma={{tipo: 'esfera', r: 0.15}} pos={[1.1, 0.32, -0.6]} mat={verdeEscuro} estilo={estilo} contorno={0.02} />
      <Peca forma={{tipo: 'cilindro', r: 0.13, r2: 0.11, h: 0.24}} pos={[-1.6, 0.12, -2.4]} mat={m('#2f8fd0')} estilo={estilo} />

      {/* as lesmas, com o rastro de gosma */}
      {lesmas.slice(0, nLesmas).map((l, i) => {
        const z = Math.min(l.z + avanco, -0.25);
        return (
          <group key={i}>
            <Gosma mats={ml} pos={[l.x, 0, z - 0.18]} giro={l.giro - Math.PI} comp={0.28} />
            <Lesma estilo={estilo} mats={ml} pos={[l.x, 0, z]} giro={l.giro} esc={l.esc} t={t} fase={l.fase} contorno={z > -3} />
          </group>
        );
      })}

      {/* o Seu Casco */}
      {heroi && (
        <Jabuti estilo={estilo} mats={mj} tipo="HEROI" pos={heroi.pos} giro={heroi.giro} esc={1.08} pataNoAr={heroi.pataNoAr ?? 0} mastiga={heroi.mastiga ?? 0} escondido={heroi.escondido ?? 0} olhar={heroi.olhar ?? 0} />
      )}
      {jabutis.map((j, i) => (
        <Jabuti key={i} estilo={estilo} mats={mj} tipo={j.tipo} pos={j.pos} giro={j.giro ?? 0} esc={j.esc ?? 1} andando={j.andando ?? 0} passo={t * 3 + i} escondido={j.escondido ?? 0} costas={j.costas ?? 0} pataNoAr={j.pataNoAr ?? 0} />
      ))}
      {extras}
    </>
  );
};
