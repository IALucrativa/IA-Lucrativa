import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {RigTeste} from './bilhete/RigTeste';
import {Ep01, DURACAO_EP01} from './bilhete/Ep01';
import {Capa, capaEp01} from './bilhete/Capa';
import {ComoFunciona, Destaque} from './perfil/Perfil';
import {DestaqueNovo, ArquivoDoCaso, QuemEORodnei, Story} from './perfil/Portfolio';

// Formato do estúdio: vertical 1080×1920, 30 fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
    {/* Portfólio do Instagram */}
    <Composition id="DestaqueNovo" component={DestaqueNovo} defaultProps={{tipo: 'vote' as const}} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ArquivoDoCaso" component={ArquivoDoCaso} defaultProps={{slide: 1}} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="QuemEORodnei" component={QuemEORodnei} defaultProps={{slide: 1}} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Story" component={Story} defaultProps={{tipo: 'votacao' as const, ep: 1, escolha: 'CONTAR'}} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ComoFunciona" component={ComoFunciona} defaultProps={{slide: 1}} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Destaque" component={Destaque} defaultProps={{tipo: 'bilhete' as const}} durationInFrames={1} fps={30} width={1080} height={1920} />
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
