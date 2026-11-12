import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Boneco, Kike, BORJA} from './Kike';

export const RigTeste: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#4d5d8f'}}>
      <svg viewBox="0 0 540 960" width={1080} height={1920}>
        <Kike x={130} y={420} frame={f} escala={0.95} />
        <Kike x={400} y={420} frame={f} escala={0.95} bracoE={{ombro: 140, cotovelo: -30}} maoE="bone" boca="o" susto suor olhar={[-1, 0]} />
        <Kike x={130} y={900} frame={f} escala={0.95} bracoD={{ombro: -150, cotovelo: -40}} maoD="celular" boca="preocupada" suor cabeca={6} />
        <Kike x={400} y={900} frame={f} escala={0.7} bracoE={{ombro: -40, cotovelo: -60}} bracoD={{ombro: 40, cotovelo: 60}} maoE="videogame" boca="assopro" fuligem />
        <Boneco x={270} y={900} frame={f} escala={0.55} visual={BORJA} boca="convencido" />
      </svg>
    </AbsoluteFill>
  );
};
