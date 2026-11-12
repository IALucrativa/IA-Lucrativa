import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Cena3D, Estilo} from './Cena3D';

const NOMES: Record<Estilo, string> = {
  cartoon: '1 · CARTOON COM CONTORNO',
  lowpoly: '2 · LOW POLY COLORIDO',
  noturno: '3 · NOTURNO REALISTA',
};

const AMARELO = '#ffd23f';
const sombra = '0 4px 14px rgba(0,0,0,0.75)';

// Um quadro da prancha: a cena da Convocação do Desafio 1 com título, placar e legenda.
export const PranchaEstilo: React.FC<{estilo: Estilo}> = ({estilo}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1} shadows>
        <Cena3D estilo={estilo} />
      </ThreeCanvas>

      {/* Título */}
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: sombra}}>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>1 BISNAGA</div>
        <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
      </div>

      {/* Placar */}
      <div style={{position: 'absolute', top: 520, width: '100%', display: 'flex', justifyContent: 'center', gap: 60, textShadow: sombra}}>
        <div style={{textAlign: 'center'}}>
          <div style={{color: AMARELO, fontWeight: 800, fontSize: 30, letterSpacing: 3}}>GATOS</div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 64}}>1</div>
        </div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 40, alignSelf: 'center', opacity: 0.8}}>×</div>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#8fd3ff', fontWeight: 800, fontSize: 30, letterSpacing: 3}}>PINGUINS</div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 64}}>10.000</div>
        </div>
      </div>

      {/* Legenda de uma linha, terço de baixo */}
      <div style={{position: 'absolute', top: 1440, width: '100%', textAlign: 'center', textShadow: sombra}}>
        <span style={{color: '#fff', fontWeight: 800, fontSize: 54}}>
          Esse é o <span style={{color: AMARELO}}>Bisnaga.</span>
        </span>
      </div>

      {/* Nome do estilo (só na prancha) */}
      <div style={{position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.78)', color: '#fff', fontWeight: 900, fontSize: 46, textAlign: 'center', padding: '26px 0'}}>
        {NOMES[estilo]}
      </div>
    </AbsoluteFill>
  );
};
