import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {PranchaEstilo} from './foradomapa/Prancha';
import {Parte1, DURACAO_PARTE1} from './foradomapa/ep01/Parte1';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition id="ForaDoMapaParte1" component={Parte1} durationInFrames={DURACAO_PARTE1} fps={30} width={1080} height={1920} />
    <Composition id="PranchaForaDoMapa" component={PranchaEstilo} defaultProps={{estilo: 'cartoon' as const}} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition
      id="Ola"
      component={Ola}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
    </>
  );
};
