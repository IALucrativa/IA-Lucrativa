import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {PALETAS, texturaCanvas, useMaterial} from './Cena3D';
import {GatoProps, GatoSentado} from './Gatos';

// Folha de elenco (1920×1080): o Bisnaga acordado e os 4 gatos do comércio do Desafio 1.

const ESTILO = 'cartoon' as const;

export const ELENCO: {nome: string; linha: string; x: number; props: Omit<GatoProps, 'estilo' | 'pos'>}[] = [
  {
    nome: 'AÇOUGUE',
    linha: 'forte · só luta depois de comer',
    x: -1.49,
    props: {pelagem: {tipo: 'liso', base: '#7d6a5a'}, peito: '#d8c8b4', gordura: 1.35, tamanho: 1.12, olhos: 'meio', corOlho: '#e0b23a', acessorio: 'acougue'},
  },
  {
    nome: 'FEIRANTE',
    linha: 'grita alto · fica rouco',
    x: -0.744,
    props: {pelagem: {tipo: 'manchas', base: '#f7f3ea', manchas: ['#222222']}, peito: '#ffffff', olhos: 'abertos', boca: 'aberta', corOlho: '#f0c419', acessorio: 'feirante'},
  },
  {
    nome: 'BISNAGA',
    linha: 'o herói · dorminhoco',
    x: 0,
    props: {pelagem: {tipo: 'listrado', base: '#f08a2c', listra: '#b8561a'}, peito: '#fde3c4', gordura: 1.3, tamanho: 1.15, olhos: 'meio', corOlho: '#9bd44a', acessorio: 'farinha'},
  },
  {
    nome: 'LOTÉRICA',
    linha: 'acerta sem querer · erra quando tenta',
    x: 0.744,
    props: {pelagem: {tipo: 'manchas', base: '#fbf6ee', manchas: ['#e0892e', '#2b2420']}, peito: '#ffffff', olhos: 'abertos', corOlho: '#5fb7e8', acessorio: 'loterica'},
  },
  {
    nome: 'SALÃO',
    linha: 'luta com estilo · foge se despentear',
    x: 1.49,
    props: {pelagem: {tipo: 'liso', base: '#c9c3d6'}, peito: '#f4f0fa', olhos: 'abertos', corOlho: '#f2a33a', acessorio: 'salao'},
  },
];

const Camera: React.FC = () => {
  const {camera} = useThree();
  camera.position.set(0, 0.8, 3.9);
  camera.lookAt(0, 0.38, 0);
  (camera as THREE.PerspectiveCamera).fov = 30;
  camera.updateProjectionMatrix();
  return null;
};

const Palco: React.FC = () => {
  const p = PALETAS[ESTILO];
  const m = useMaterial(ESTILO);
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
        [12, 4],
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
        [10, 4],
      ),
    [p],
  );
  return (
    <>
      <Camera />
      <color attach="background" args={[p.fundo]} />
      <ambientLight intensity={1.0} color="#c9d6ff" />
      <directionalLight position={[1.5, 3, 3]} intensity={2.2} color="#ffe2b0" castShadow shadow-bias={-0.002} shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-3, 2, -1]} intensity={0.7} color={p.luzFria} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={m(p.piso1, {mapa: piso})} receiveShadow>
        <planeGeometry args={[10, 10]} />
      </mesh>
      <mesh position={[0, 1.5, -1.2]} material={m(p.parede, {mapa: azulejos})} receiveShadow>
        <planeGeometry args={[8, 3]} />
      </mesh>
      {ELENCO.map((g) => (
        <GatoSentado key={g.nome} estilo={ESTILO} pos={[g.x, 0, 0]} {...g.props} />
      ))}
    </>
  );
};

export const Elenco: React.FC = () => {
  const sombra = '0 3px 10px rgba(0,0,0,0.7)';
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas width={1920} height={1080} gl={{antialias: true}} dpr={1} shadows>
        <Palco />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 54, textShadow: sombra}}>
        ELENCO · DESAFIO 1
      </div>
      <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, display: 'flex'}}>
        {ELENCO.map((g) => (
          <div key={g.nome} style={{flex: 1, textAlign: 'center'}}>
            <div
              style={{
                display: 'inline-block',
                background: g.nome === 'BISNAGA' ? '#ffd23f' : '#fff',
                color: '#141018',
                fontWeight: 900,
                fontSize: 36,
                padding: '6px 18px',
                borderRadius: 8,
                boxShadow: '0 3px 0 #141018',
              }}
            >
              {g.nome}
            </div>
            <div style={{color: '#fff', fontWeight: 700, fontSize: 21, marginTop: 10, textShadow: sombra}}>{g.linha}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
