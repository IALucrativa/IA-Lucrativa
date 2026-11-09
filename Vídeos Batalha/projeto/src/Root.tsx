import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {PranchaEstilo} from './bisnaga/Prancha';
import {Elenco} from './bisnaga/Elenco';
import {Convocacao, DURACAO_CONVOCACAO} from './bisnaga/d01/Convocacao';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Ola" component={Ola} durationInFrames={150} fps={30} width={1080} height={1920} />
      {(['cartoon', 'lowpoly', 'noturno'] as const).map((estilo) => (
        <Composition
          key={estilo}
          id={`Bisnaga-Prancha-${estilo}`}
          component={PranchaEstilo}
          defaultProps={{estilo}}
          durationInFrames={1}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      <Composition id="Bisnaga-D01-Convocacao" component={Convocacao} durationInFrames={DURACAO_CONVOCACAO} fps={30} width={1080} height={1920} />
      <Composition id="Bisnaga-Elenco" component={Elenco} durationInFrames={1} fps={30} width={1920} height={1080} />
    </>
  );
};
