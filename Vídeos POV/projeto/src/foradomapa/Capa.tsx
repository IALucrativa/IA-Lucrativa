import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {OlhoDePeixe} from './Cena3D';
import {Ambiente, Camera} from './ep01/kit';
import {Casa, Menino} from './ep01/lugares';

// Molde da capa da série Fora do Mapa (1080×1920).
// Nas próximas partes, troque só os textos e a cena (props).
export type PropsCapa = {parte: number; titulo: string; gancho: string; cena: 'menino'};

const CenaMenino: React.FC = () => (
  <>
    <Camera pos={[0, 1.55, -3.1]} olha={[0, 1.25, -4.6]} fov={96} />
    <Casa abertura={1} luzVaranda />
    <pointLight position={[0.3, 1.5, -3.3]} intensity={2.5} distance={3} color="#ffd2a0" />
    <Menino pos={[0, 0.15, -4.1]} />
  </>
);

const CONTORNO = '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 6px 16px rgba(0,0,0,0.8)';

export const CapaForaDoMapa: React.FC<PropsCapa> = ({parte, titulo, gancho}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, sans-serif'}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1}>
        <OlhoDePeixe forca={0.32} />
        <Ambiente luz={0.9} neblina={[10, 40]} />
        <CenaMenino />
      </ThreeCanvas>
      {/* escurece em cima e embaixo para o texto ler bem */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.8) 88%)'}} />
      {/* tudo o que importa fica entre 240 e 1680 px (recorte da grade do perfil) */}
      <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <div style={{background: '#ffcc33', color: '#0f1420', fontWeight: 900, fontSize: 44, padding: '10px 28px', borderRadius: 12, letterSpacing: 3}}>FORA DO MAPA</div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 150, lineHeight: 1, textShadow: CONTORNO, marginTop: 10}}>
          PARTE <span style={{color: '#ffcc33'}}>{parte}</span>
        </div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 84, textShadow: CONTORNO, letterSpacing: 2}}>{titulo}</div>
      </div>
      <div style={{position: 'absolute', top: 1400, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(10,12,18,0.85)', border: '4px solid #ff5a4f', color: '#fff', fontWeight: 800, fontSize: 56, padding: '20px 36px', borderRadius: 18, textAlign: 'center', maxWidth: 900}}>{gancho}</div>
      </div>
    </AbsoluteFill>
  );
};

export const capaParte1: PropsCapa = {parte: 1, titulo: 'O AVISO', gancho: 'Ele sabia o meu nome.', cena: 'menino'};
