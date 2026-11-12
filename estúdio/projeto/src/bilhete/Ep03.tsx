import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Rodnei} from './Rodnei';
import {Tania} from './Tania';
import {Corredor, ElevadorInterior, Placar, PortaFrente, PortaLateral, TelaGravacao, VultoMacacao} from './cenarios';
import {BilheteClose, CartaoNome, CartaoVoto, Episodio, Escolheram, Etiqueta, Parte, SEGURA_BILHETE, Tela, montar} from './comum';

// Bilhete na Porta · Ep. 3, em duas linhas:
//  - IG+YT: ele bateu na porta da Tânia.  - TT: ele foi direto falar com a Tânia.
// Medo só no rosto, sem tremor.

const NOME_LINHA2 = 'técnico de elevador · térreo · muda em 28 dias';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Rodnei batendo numa porta à esquerda (mão esquerda batendo, bilhete na direita).
const RodneiBatendo: React.FC<{f: number; de: number; ate: number; bilhete?: boolean}> = ({f, de, ate, bilhete = false}) => {
  const bate = f > de && f < ate ? Math.sin((f - de) * 0.7) * 14 : 0;
  return (
    <Rodnei
      x={410}
      y={900}
      escala={1.1}
      frame={f}
      maoD={bilhete ? 'bilhete' : 'nada'}
      bracoD={bilhete ? SEGURA_BILHETE : undefined}
      bracoE={{ombro: 75, cotovelo: 40 + bate}}
      olhar={[-1, 0]}
      medo
      boca="fechada"
    />
  );
};

// Porta do 501 aberta, Tânia no vão, Rodnei de frente para ela.
const NaPorta501: React.FC<{
  f: number;
  roupa: 'casa' | 'plantao';
  dia?: boolean;
  caraT?: 'seria' | 'assustada' | 'fala' | 'sorriso';
  maoT?: 'nada' | 'bilhete';
  caraR?: 'o' | 'fechada' | 'aliviada';
  medoR?: boolean;
}> = ({f, roupa, dia = false, caraT = 'seria', maoT = 'nada', caraR = 'fechada', medoR = true}) => (
  <>
    <PortaLateral numero="501" aberta dia={dia} luzEmbaixo={!dia} />
    <Tania
      x={160}
      y={800}
      escala={1.12}
      frame={f}
      roupa={roupa}
      cara={caraT}
      olhar={[1, 0]}
      maoE={maoT}
      bracoE={maoT === 'bilhete' ? {ombro: -15, cotovelo: -95} : undefined}
    />
    <Rodnei x={410} y={900} escala={1.1} frame={f} olhar={[-1, 0]} medo={medoR} boca={caraR} />
  </>
);

// Sépia para lembranças.
const Lembranca: React.FC<{texto: string}> = ({texto}) => (
  <>
    <rect x={0} y={0} width={540} height={960} fill="#7a5a2a" opacity={0.28} />
    <Etiqueta texto={texto} />
  </>
);

// ================= Linha IG+YT: "Você também recebeu?" =================

const IgImpacto: React.FC = () => {
  const f = useCurrentFrame();
  const abriu = f > 190;
  return (
    <Tela>
      {abriu ? (
        <NaPorta501 f={f} roupa="casa" caraT="seria" medoR caraR="o" />
      ) : (
        <>
          <PortaLateral numero="501" placaTorta luzEmbaixo />
          <RodneiBatendo f={f} de={95} ate={130} />
        </>
      )}
      <Etiqueta texto="00h00 · 5º ANDAR" />
      <g opacity={interpolate(f, [70, 85], [1, 0], clamp)}>
        <Escolheram opcao="BATER" />
      </g>
    </Tela>
  );
};

const IgQuem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="casa" caraT="seria" />
      <CartaoNome linha2={NOME_LINHA2} />
    </Tela>
  );
};

const IgPergunta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="casa" caraT={f > 130 && f < 200 ? 'fala' : 'seria'} caraR={f > 200 ? 'o' : 'fechada'} />
    </Tela>
  );
};

const IgPapelDela: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="casa" caraT="seria" maoT={f > 15 ? 'bilhete' : 'nada'} caraR="o" />
    </Tela>
  );
};

const IgBilheteDela: React.FC = () => (
  <BilheteClose linhas={['Fique longe', 'do térreo.']} de={4} ate={50} fundo={<PortaLateral numero="501" aberta luzEmbaixo />} />
);

const IgLembranca: React.FC = () => {
  const f = useCurrentFrame();
  const BATE = 150;
  const placa = interpolate(f, [BATE, BATE + 6, BATE + 14, BATE + 22], [0, 24, 10, 14], clamp);
  const treme = f > BATE && f < BATE + 10 ? Math.sin(f * 3) * 4 : 0;
  return (
    <Tela>
      <g transform={`translate(${treme},-80)`}>
        <PortaFrente numero="501" placaAngulo={placa} papelNoChao={f > 40} luzEmbaixo />
      </g>
      <Lembranca texto="ONTEM" />
    </Tela>
  );
};

const IgJuntos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="casa" caraT="seria" caraR="fechada" medoR={false} />
    </Tela>
  );
};

const IgDesceu: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao feixe={false} />
      <Rodnei x={250} y={880} frame={f} olhar={[-1, 1]} medo boca="o" suor />
      <Etiqueta texto="00h20 · TÉRREO" />
    </Tela>
  );
};

const IgBilhete4: React.FC = () => (
  <BilheteClose linhas={['Agora vocês são dois.', 'Devolve o que é meu', 'até a noite sete.']} de={6} ate={115} fundo={<Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />} />
);

const PERG_IG = ['Quem escreve?', 'O que é "meu"?', 'Por que a Tânia?'];

const IgPrazo: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [4, 18], [0, 1], clamp);
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={250} y={880} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={[-0.4, 1]} medo boca="fechada" />
      <Placar noite="3/30" chaves={12} entrada={e} perguntas={PERG_IG} prazo={f > 20 ? 'PRAZO: NOITE 7' : undefined} />
    </Tela>
  );
};

const IgVoto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={250} y={880} frame={f + 100} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={f < 80 ? [-0.4, 1] : [0, 0]} medo boca="fechada" />
      <Placar noite="3/30" chaves={12} entrada={1} perguntas={PERG_IG} prazo="PRAZO: NOITE 7" />
      <CartaoVoto pergunta="Ele confia na Tânia ou desconfia?" opcoes={['CONFIAR', 'DESCONFIAR']} />
    </Tela>
  );
};

export const PARTES_EP03_IGYT: Parte[] = [
  {nome: 'impacto', Cena: IgImpacto, dur: 225, legendas: [[2.6, 4.6, 'Meia-noite. Quinto andar.'], [4.7, 7.3, 'O Rodnei bateu na porta da Tânia... e a porta abriu.']]},
  {nome: 'quem', Cena: IgQuem, dur: 285, legendas: [[0.2, 3.0, 'Ele é técnico de elevador, mora no térreo'], [3.0, 5.0, 'e se muda em vinte e oito dias.'], [5.1, 9.2, 'Desde que avisou, um bilhete anônimo aparece toda noite na porta dele.']]},
  {nome: 'pergunta', Cena: IgPergunta, dur: 225, legendas: [[0.2, 3.6, 'A Tânia não gritou. Não fechou a porta.'], [3.7, 7.3, 'Só olhou pra ele e perguntou: você também recebeu?']]},
  {nome: 'papelDela', Cena: IgPapelDela, dur: 135, legendas: [[0.2, 2.4, 'Ela tirou um papel do bolso.'], [2.5, 4.4, 'A mesma letra. O mesmo papel.']]},
  {nome: 'bilheteDela', Cena: IgBilheteDela, dur: 90, legendas: []},
  {nome: 'lembranca', Cena: IgLembranca, dur: 270, legendas: [[0.2, 2.2, 'O papel no capacho era dela.'], [2.3, 8.8, 'Ela leu, levou um susto e bateu a porta com tanta força que a placa entortou.']]},
  {nome: 'juntos', Cena: IgJuntos, dur: 135, legendas: [[0.2, 1.8, 'Bater deu certo.'], [1.9, 4.4, 'Agora ele sabe: não é só com ele.']]},
  {nome: 'desceu', Cena: IgDesceu, dur: 105, legendas: [[0.2, 3.3, 'Quando ele desceu, tinha outro bilhete na porta.']]},
  {nome: 'bilhete4', Cena: IgBilhete4, dur: 135, legendas: []},
  {nome: 'prazo', Cena: IgPrazo, dur: 190, legendas: [[0.2, 2.8, 'Pela primeira vez, o bilhete tem um prazo.'], [3.4, 6.0, 'Noite três. Faltam vinte e sete.']]},
  {nome: 'voto', Cena: IgVoto, dur: 225, legendas: [[0.2, 2.8, 'A Tânia pediu pra ele confiar nela.'], [2.9, 4.8, 'Ele confia... ou desconfia?'], [4.9, 7.2, 'Comente: confiar ou desconfiar.']]},
];
export const DURACAO_EP03_IGYT = montar(PARTES_EP03_IGYT).duracao;
export const Ep03IGYT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => <Episodio partes={PARTES_EP03_IGYT} semLegenda={semLegenda} />;

// ================= Linha TT (TikTok): "Vestido de Rodnei" =================

const TtImpacto: React.FC = () => {
  const f = useCurrentFrame();
  const abriu = f > 165;
  return (
    <Tela>
      {abriu ? (
        <NaPorta501 f={f} roupa="plantao" dia caraT="seria" caraR="fechada" />
      ) : (
        <>
          <PortaLateral numero="501" luzEmbaixo={false} dia />
          <RodneiBatendo f={f} de={95} ate={130} bilhete />
        </>
      )}
      <Etiqueta texto="7h00 · 5º ANDAR" />
      <g opacity={interpolate(f, [70, 85], [1, 0], clamp)}>
        <Escolheram opcao="TÂNIA" />
      </g>
    </Tela>
  );
};

const TtQuem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="plantao" dia caraT="seria" />
      <CartaoNome linha2={NOME_LINHA2} />
    </Tela>
  );
};

const TtCracha: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <PortaLateral numero="501" aberta dia luzEmbaixo={false} />
      <Tania x={250} y={960} escala={1.4} frame={f} roupa="plantao" cara={f > 140 ? 'fala' : 'seria'} olhar={[0.6, 0]} />
    </Tela>
  );
};

const PERG_TT_ANTES = ['Quem escreve?', 'O que é "meu"?', 'Quem é "T"?'];

const TtRisca: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="plantao" dia caraT="seria" medoR={false} />
      <Placar noite="3/30" chaves={12} entrada={1} perguntas={PERG_TT_ANTES} riscada={2} risco={interpolate(f, [30, 70], [0, 1], clamp)} />
    </Tela>
  );
};

const TtFlashElevador: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <ElevadorInterior display="5" />
      <Tania x={150} y={1000} escala={1.3} frame={f} roupa="plantao" cara="seria" olhar={[1, 0]} />
      <VultoMacacao x={380} y={1000} escala={1.3} />
      <Lembranca texto="NOITE 1 · 22h50" />
    </Tela>
  );
};

const TtVestido: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={250} y={880} frame={f} olhar={[0, 1]} medo boca="o" suor />
    </Tela>
  );
};

const TtCamera: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={f > 125} feixe={false} camera />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

const TtGravacao: React.FC = () => {
  const f = useCurrentFrame();
  const seg = 10 + Math.floor(f / 30);
  return (
    <Tela>
      <TelaGravacao papel={interpolate(f, [85, 92], [0, 1], clamp)} tempo={`23:00:${String(seg).padStart(2, '0')}`} />
    </Tela>
  );
};

const TtBilhete4: React.FC = () => (
  <BilheteClose linhas={['Câmera não me vê.', 'Devolve', 'o que é meu.']} de={6} ate={85} fundo={<Corredor sombraOp={0} bilheteNoChao={false} feixe={false} camera />} />
);

const PERG_TT = ['Quem escreve?', 'O que é "meu"?', 'Quem usa macacão?'];

const TtPlacar: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [4, 18], [0, 1], clamp);
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} camera />
      <Rodnei x={250} y={880} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={[-0.4, 1]} medo boca="fechada" />
      <Placar noite="3/30" chaves={12} entrada={e} perguntas={PERG_TT} />
    </Tela>
  );
};

const TtVoto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} camera />
      <Rodnei x={250} y={880} frame={f + 90} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={f < 80 ? [-0.4, 1] : [0, 0]} medo boca="fechada" />
      <Placar noite="3/30" chaves={12} entrada={1} perguntas={PERG_TT} />
      <CartaoVoto pergunta="Ele pede ajuda pra Marlene ou procura sozinho?" opcoes={['MARLENE', 'SOZINHO']} />
    </Tela>
  );
};

export const PARTES_EP03_TT: Parte[] = [
  {nome: 'impacto', Cena: TtImpacto, dur: 195, legendas: [[2.6, 6.2, 'O Rodnei subiu direto pro quinto andar e bateu na porta do 501.']]},
  {nome: 'quem', Cena: TtQuem, dur: 285, legendas: [[0.2, 3.0, 'Ele é técnico de elevador, mora no térreo'], [3.0, 5.0, 'e se muda em vinte e oito dias.'], [5.1, 9.2, 'Desde que avisou, alguém deixa um bilhete na porta dele toda noite.']]},
  {nome: 'cracha', Cena: TtCracha, dur: 285, legendas: [[0.2, 4.4, 'A Tânia abriu de crachá no pescoço, ainda de uniforme de enfermeira.'], [4.6, 9.2, 'Na noite do primeiro bilhete? Eu tava de plantão no hospital.']]},
  {nome: 'risca', Cena: TtRisca, dur: 195, legendas: [[0.2, 3.6, 'Ir direto nela deu certo: a Tânia não era o T.'], [3.7, 6.2, 'E ela lembrou de uma coisa.']]},
  {nome: 'flash', Cena: TtFlashElevador, dur: 210, legendas: [[0.2, 3.4, 'Quando eu saí pro plantão, cruzei com alguém no elevador.'], [3.5, 6.8, 'De macacão azul. Igual ao seu.']]},
  {nome: 'vestido', Cena: TtVestido, dur: 105, legendas: [[0.2, 3.3, 'Alguém no prédio está andando vestido de Rodnei.']]},
  {nome: 'camera', Cena: TtCamera, dur: 180, legendas: [[0.2, 3.4, 'À noite, a câmera da Marlene já estava no corredor.'], [3.5, 5.8, 'Às onze, o bilhete chegou.']]},
  {nome: 'gravacao', Cena: TtGravacao, dur: 180, legendas: [[0.2, 3.4, 'Na gravação, a porta dele aparece. O bilhete aparece.'], [3.5, 5.8, 'Mas ninguém passa.']]},
  {nome: 'bilhete4', Cena: TtBilhete4, dur: 105, legendas: []},
  {nome: 'placar', Cena: TtPlacar, dur: 90, legendas: [[0.2, 2.8, 'Noite três. Faltam vinte e sete.']]},
  {nome: 'voto', Cena: TtVoto, dur: 210, legendas: [[0.2, 2.6, 'Ele pede ajuda pra Marlene...'], [2.7, 4.8, '...ou procura esse macacão sozinho?'], [4.9, 6.8, 'Comente: Marlene ou sozinho.']]},
];
export const DURACAO_EP03_TT = montar(PARTES_EP03_TT).duracao;
export const Ep03TT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => <Episodio partes={PARTES_EP03_TT} semLegenda={semLegenda} />;
