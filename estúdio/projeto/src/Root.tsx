import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Ola"
      component={Ola}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
