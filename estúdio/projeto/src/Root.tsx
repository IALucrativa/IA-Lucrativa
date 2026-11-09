import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {RigTeste} from './bilhete/RigTeste';
import {Ep01, DURACAO_EP01} from './bilhete/Ep01';
import {Capa, capaEp01} from './bilhete/Capa';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition id="CapaBilhete" component={Capa} defaultProps={capaEp01} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="BilheteEp01" component={Ep01} durationInFrames={DURACAO_EP01} fps={30} width={1080} height={1920} />
    <Composition id="RigTeste" component={RigTeste} durationInFrames={30} fps={30} width={1080} height={1920} />
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
