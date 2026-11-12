import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rodnei} from './Rodnei';
import {Marlene} from './Marlene';
import {Tania} from './Tania';

// Folha de poses para conferir os bonecos (não vai para o episódio).
export const RigTeste: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#efe9dc'}}>
      <svg viewBox="0 0 540 960" width={1080} height={1920}>
        <Rodnei x={110} y={440} frame={frame} medo={false} boca="aliviada" />
        <Tania x={280} y={440} frame={frame} roupa="plantao" cara="seria" />
        <Marlene x={440} y={440} frame={frame} cara="seria" />
        <Tania x={110} y={900} frame={frame} roupa="casa" cara="assustada" />
        <Tania x={280} y={900} frame={frame} roupa="casa" maoE="bilhete" bracoE={{ombro: -15, cotovelo: -95}} cara="fala" olhar={[1, 0]} />
        <Tania x={440} y={900} frame={frame} roupa="plantao" cara="sorriso" olhar={[-1, 0]} />
      </svg>
    </AbsoluteFill>
  );
};
