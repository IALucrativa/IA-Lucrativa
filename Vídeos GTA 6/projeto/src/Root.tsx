import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {RigTeste} from './gta/RigTeste';
import {Ep01, DURACAO_EP01} from './gta/Ep01';
import {Capa, capaEp01, capaEp02} from './gta/Capa';
import {Ep02, DURACAO_EP02} from './gta/Ep02';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="GtaEp02" component={Ep02} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP02} fps={30} width={1080} height={1920} />
      <Composition id="CapaGtaEp02" component={Capa} defaultProps={capaEp02} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CapaGta" component={Capa} defaultProps={capaEp01} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="GtaEp01" component={Ep01} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP01} fps={30} width={1080} height={1920} />
      <Composition id="RigTeste" component={RigTeste} durationInFrames={30} fps={30} width={1080} height={1920} />
      <Composition id="Ola" component={Ola} durationInFrames={150} fps={30} width={1080} height={1920} />
    </>
  );
};
