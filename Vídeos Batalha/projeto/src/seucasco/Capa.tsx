import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Quintal, ParamsQuintal} from './Quintal';

// Molde da capa (1080×1920). Em cada desafio troque só os textos e a cena.
// Tudo o que importa fica entre 240 e 1680 px (recorte da grade do perfil).

export type CapaSCProps = {
  selo: 'CONVOCAÇÃO' | 'BATALHA';
  desafio: number;
  linha1: string; // ex.: "1 SEU CASCO"
  linha2: string; // ex.: "CONTRA 10.000"
  inimigo: string; // ex.: "LESMAS"
  gancho: string;
  cena: ParamsQuintal;
};

const AMARELO = '#ffd23f';
const SOMBRA = '0 5px 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)';

export const CapaSeuCasco: React.FC<CapaSCProps> = ({selo, desafio, linha1, linha2, inimigo, gancho, cena}) => (
  <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Inter, Arial, sans-serif'}}>
    <ThreeCanvas width={1080} height={1920} gl={{antialias: true}} dpr={1} shadows>
      <Quintal estilo="cartoon" {...cena} />
    </ThreeCanvas>
    {/* escurece o alto para o título ler bem */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)'}} />
    <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <div style={{display: 'flex', gap: 14}}>
        <div style={{background: AMARELO, color: '#141018', fontWeight: 900, fontSize: 40, padding: '8px 22px', borderRadius: 10, letterSpacing: 2}}>{selo}</div>
        <div style={{background: '#141018', color: '#fff', fontWeight: 900, fontSize: 40, padding: '8px 22px', borderRadius: 10, letterSpacing: 2}}>DESAFIO {desafio}</div>
      </div>
      <div style={{textAlign: 'center', lineHeight: 0.98, textShadow: SOMBRA}}>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 120, whiteSpace: 'nowrap'}}>{linha1}</div>
        <div style={{color: AMARELO, fontWeight: 900, fontSize: 120, whiteSpace: 'nowrap'}}>{linha2}</div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 56, marginTop: 10, letterSpacing: 2}}>{inimigo}</div>
      </div>
    </div>
    <div style={{position: 'absolute', top: 1575, width: '100%', textAlign: 'center'}}>
      <span style={{background: '#141018', color: '#fff', fontWeight: 900, fontSize: 50, padding: '12px 28px', borderRadius: 12, boxShadow: `0 4px 0 ${AMARELO}`}}>{gancho}</span>
    </div>
  </AbsoluteFill>
);

export const CAPA_SC_D01_CONVOCACAO: CapaSCProps = {
  selo: 'CONVOCAÇÃO',
  desafio: 1,
  linha1: '1 SEU CASCO',
  linha2: 'CONTRA 10.000',
  inimigo: 'LESMAS DA HORTA',
  gancho: 'Ele já partiu. Chega amanhã.',
  cena: {cam: {pos: [0.25, 0.3, 1.66], alvo: [0.1, 0.18, 0.2], fov: 50}, t: 2, heroi: {pos: [0.18, 0, 0.62], giro: -1.0, pataNoAr: 1}},
};
