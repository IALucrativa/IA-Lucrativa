import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Quintal} from './Quintal';
import {TipoJabuti} from './Jabutis';

const AMARELO = '#ffd23f';
const sombra = '0 4px 14px rgba(0,0,0,0.75)';

// Prancha: o quadro de abertura da Convocação (título, placar e legenda).
export const PranchaSeuCasco: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1} shadows>
        <Quintal estilo="cartoon" t={1.3} heroi={{pos: [0.18, 0, 0.62], giro: -1.0, pataNoAr: 1}} />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', lineHeight: 1.0, textShadow: sombra}}>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 104, letterSpacing: 2}}>1 SEU CASCO</div>
        <div style={{color: AMARELO, fontWeight: 900, fontSize: 104, letterSpacing: 2}}>CONTRA 10.000</div>
      </div>
      <div style={{position: 'absolute', top: 520, width: '100%', display: 'flex', justifyContent: 'center', gap: 60, textShadow: sombra}}>
        <div style={{textAlign: 'center'}}>
          <div style={{color: AMARELO, fontWeight: 800, fontSize: 30, letterSpacing: 3}}>JABUTIS</div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 64}}>1</div>
        </div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 40, alignSelf: 'center', opacity: 0.8}}>×</div>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#c9e88f', fontWeight: 800, fontSize: 30, letterSpacing: 3}}>LESMAS</div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 64}}>10.000</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1440, width: '100%', textAlign: 'center', textShadow: sombra}}>
        <span style={{color: '#fff', fontWeight: 800, fontSize: 54}}>
          Esse é o <span style={{color: AMARELO}}>Seu Casco.</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Elenco: o Seu Casco, o jabuti comum, os 4 tipos e uma lesma, lado a lado.
const FILA: {tipo: TipoJabuti; nome: string}[] = [
  {tipo: 'HEROI', nome: 'SEU CASCO'},
  {tipo: 'COMUM', nome: 'COMUM'},
  {tipo: 'ACADEMIA', nome: 'ACADEMIA'},
  {tipo: 'CROCHE', nome: 'CROCHÊ'},
  {tipo: 'PATINETE', nome: 'PATINETE'},
  {tipo: 'OBRA', nome: 'OBRA'},
];
export const ElencoSeuCasco: React.FC = () => {
  const {width, height} = useVideoConfig();
  const POS: [number, number, number][] = [[0.45, 0, 0.4], [0.8, 0, 0.4], [0.1, 0, 0.0], [0.45, 0, 0.0], [0.8, 0, 0.0]];
  const jabutis = FILA.slice(1).map((f, i) => ({tipo: f.tipo, pos: POS[i], giro: 0.3}));
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}} dpr={1} shadows>
        <Quintal
          estilo="cartoon"
          t={0.5}
          cam={{pos: [0.45, 0.95, 2.2], alvo: [0.45, 0.05, 0.15], fov: 46}}
          lesmasVisiveis={0.35}
          heroi={{pos: [0.1, 0, 0.4], giro: 0.3}}
          jabutis={jabutis}
        />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 1560, width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, padding: '0 60px', boxSizing: 'border-box'}}>
        {FILA.map((f) => (
          <div key={f.nome} style={{background: '#fff', color: '#141018', fontWeight: 900, fontSize: 34, padding: '8px 14px', borderRadius: 6}}>
            {f.nome}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
