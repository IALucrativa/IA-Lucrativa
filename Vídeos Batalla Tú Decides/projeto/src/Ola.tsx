import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Vídeo de teste: fundo colorido e "OLÁ" entrando com um pulinho.
export const Ola: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const escala = spring({frame, fps, config: {damping: 10}});
  const opacidade = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #ff7a59 0%, #ffb347 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 280,
          color: 'white',
          textShadow: '0 12px 0 rgba(0,0,0,0.18)',
          transform: `scale(${escala})`,
          opacity: opacidade,
        }}
      >
        OLÁ
      </div>
    </AbsoluteFill>
  );
};
