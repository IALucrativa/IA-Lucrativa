import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rodnei} from './Rodnei';

// Folha de poses para conferir o boneco (não vai para o episódio).
export const RigTeste: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#efe9dc'}}>
      <svg viewBox="0 0 540 960" width={1080} height={1920}>
        <Rodnei x={130} y={440} frame={frame} />
        <Rodnei x={400} y={440} frame={frame} maoD="lanterna" bracoD={{ombro: -40, cotovelo: -140}} olhar={[1, -1]} suor />
        <Rodnei x={130} y={900} frame={frame} chavesNaCintura={false} maoE="chaves" bracoE={{ombro: -20, cotovelo: -90}} bracoD={{ombro: 20, cotovelo: 90}} />
        <Rodnei x={400} y={900} frame={frame} boca="lanterna" bracoD={{ombro: -70, cotovelo: -20}} bracoE={{ombro: -25, cotovelo: -65}} cabeca={6} olhar={[1, 0]} />
      </svg>
    </AbsoluteFill>
  );
};
