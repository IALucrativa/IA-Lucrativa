import React from 'react';
import {Composition} from 'remotion';
import {Ola} from './Ola';
import {PranchaEstilo} from './bisnaga/Prancha';
import {Elenco} from './bisnaga/Elenco';
import {Capa, CAPA_D01_CONVOCACAO} from './bisnaga/Capa';
import {Convocacao, DURACAO_CONVOCACAO} from './bisnaga/d01/Convocacao';
import {Batalha, CapaBatalha} from './bisnaga/d01/Batalha';
import {BATALHA_D01} from './bisnaga/d01/batalhas';
import {PranchaSeuCasco, ElencoSeuCasco} from './seucasco/Prancha';
import {ConvocacaoSeuCasco, DURACAO_CONV_SC} from './seucasco/d01/Convocacao';
import {CONVOCACAO_D01 as CONV_SC_D01} from './seucasco/d01/tempos';
import {CapaSeuCasco, CAPA_SC_D01_CONVOCACAO} from './seucasco/Capa';

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
      <Composition id="Bisnaga-D01-Convocacao-Capa" component={Capa} defaultProps={CAPA_D01_CONVOCACAO} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Bisnaga-D01-Batalha" component={Batalha} defaultProps={{cfg: BATALHA_D01}} durationInFrames={Math.round(BATALHA_D01.duracao * 30)} fps={30} width={1080} height={1920} />
      <Composition
        id="Bisnaga-D01-Batalha-Capa"
        component={CapaBatalha}
        defaultProps={{selo: 'BATALHA' as const, desafio: 1, linha1: '201 GATOS', linha2: 'CONTRA 10.000', inimigo: 'PINGUINS DE GELADEIRA', gancho: 'Vitória. A cozinha é dos gatos.', cfg: BATALHA_D01}}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="SeuCasco-Prancha" component={PranchaSeuCasco} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="SeuCasco-D01-Convocacao" component={ConvocacaoSeuCasco} defaultProps={{cfg: CONV_SC_D01}} durationInFrames={DURACAO_CONV_SC} fps={30} width={1080} height={1920} />
      <Composition id="SeuCasco-D01-Convocacao-Capa" component={CapaSeuCasco} defaultProps={CAPA_SC_D01_CONVOCACAO} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="SeuCasco-Elenco" component={ElencoSeuCasco} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Bisnaga-Elenco" component={Elenco} durationInFrames={1} fps={30} width={1920} height={1080} />
    </>
  );
};
