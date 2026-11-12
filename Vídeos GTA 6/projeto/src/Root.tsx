import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {RigTeste} from './gta/RigTeste';
import {Ep01, DURACAO_EP01} from './gta/Ep01';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="GtaEp01" component={Ep01} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP01} fps={30} width={1080} height={1920} />
      <Composition id="RigTeste" component={RigTeste} durationInFrames={30} fps={30} width={1080} height={1920} />
      <Composition id="Ola" component={Ola} durationInFrames={150} fps={30} width={1080} height={1920} />
    </>
  );
};
