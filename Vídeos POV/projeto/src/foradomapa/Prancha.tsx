import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Cena3D, Estilo} from './Cena3D';

const NOMES: Record<Estilo, string> = {
  cartoon: '1 · CARTOON COM CONTORNO',
  lowpoly: '2 · LOW POLY COLORIDO',
  noturno: '3 · NOTURNO REALISTA',
};

// Um quadro da prancha de estilos: a mesma cena POV, com o selo da série e a legenda.
export const PranchaEstilo: React.FC<{estilo: Estilo}> = ({estilo}) => {
  const {width, height} = useVideoConfig();
  const contorno = '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 4px 10px rgba(0,0,0,0.6)';
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1}>
        <Cena3D estilo={estilo} />
      </ThreeCanvas>

      {/* Selo da série */}
      <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <div style={{background: '#ffcc33', color: '#0f1420', fontWeight: 900, fontSize: 40, padding: '10px 26px', borderRadius: 10, letterSpacing: 2}}>
          FORA DO MAPA · PARTE 1
        </div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 96, textShadow: contorno, letterSpacing: 2}}>O AVISO</div>
      </div>

      {/* Legenda: a voz do menino (cor própria) */}
      <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', padding: '0 90px', boxSizing: 'border-box'}}>
        <span style={{color: '#9fe8ff', fontWeight: 800, fontSize: 52, lineHeight: 1.25, textShadow: contorno}}>
          Não passa pela avenida amanhã.
        </span>
      </div>

      {/* Nome do estilo (só na prancha) */}
      <div style={{position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.75)', color: '#fff', fontWeight: 900, fontSize: 46, textAlign: 'center', padding: '26px 0'}}>
        {NOMES[estilo]}
      </div>
    </AbsoluteFill>
  );
};
