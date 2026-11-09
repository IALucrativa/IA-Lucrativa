import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rodnei} from './Rodnei';
import {Marlene} from './Marlene';

// Folha de poses para conferir os bonecos (não vai para o episódio).
export const RigTeste: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#efe9dc'}}>
      <svg viewBox="0 0 540 960" width={1080} height={1920}>
        <Rodnei x={140} y={440} frame={frame} medo={false} boca="aliviada" />
        <Marlene x={390} y={440} frame={frame} maoD="prancheta" bracoD={{ombro: 20, cotovelo: 90}} cara="desconfiada" olhar={[-1, 0]} />
        <Marlene x={120} y={900} frame={frame} maoE="bilhete" bracoE={{ombro: -15, cotovelo: -95}} cara="surpresa" />
        <Marlene x={300} y={900} frame={frame} maoD="aponta" bracoD={{ombro: -150, cotovelo: -20}} cara="seria" olhar={[1, -1]} />
        <Marlene x={460} y={900} frame={frame} cara="sorriso" />
      </svg>
    </AbsoluteFill>
  );
};
