import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {RigTeste} from './bilhete/RigTeste';
import {Ep01, DURACAO_EP01} from './bilhete/Ep01';
import {Capa, capaEp01} from './bilhete/Capa';
import {Ep02IGYT, DURACAO_EP02_IGYT, Ep02TT, DURACAO_EP02_TT} from './bilhete/Ep02';
import {Ep03IGYT, DURACAO_EP03_IGYT, Ep03TT, DURACAO_EP03_TT} from './bilhete/Ep03';
import {ComoFunciona, Destaque} from './perfil/Perfil';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition id="ComoFunciona" component={ComoFunciona} defaultProps={{slide: 1}} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Destaque" component={Destaque} defaultProps={{tipo: 'bilhete' as const}} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="BilheteEp02IGYT" component={Ep02IGYT} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP02_IGYT} fps={30} width={1080} height={1920} />
    <Composition id="BilheteEp02TT" component={Ep02TT} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP02_TT} fps={30} width={1080} height={1920} />
    <Composition id="BilheteEp03IGYT" component={Ep03IGYT} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP03_IGYT} fps={30} width={1080} height={1920} />
    <Composition id="BilheteEp03TT" component={Ep03TT} defaultProps={{semLegenda: false}} durationInFrames={DURACAO_EP03_TT} fps={30} width={1080} height={1920} />
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
