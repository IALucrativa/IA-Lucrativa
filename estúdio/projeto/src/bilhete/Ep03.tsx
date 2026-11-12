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
  const abriu = f > 240;
  return (
    <Tela>
      {abriu ? (
        <NaPorta501 f={f} roupa="casa" caraT="seria" medoR caraR="o" />
      ) : (
        <>
          <PortaLateral numero="501" placaTorta luzEmbaixo />
          <RodneiBatendo f={f} de={165} ate={200} />
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
      <NaPorta501 f={f} roupa="casa" caraT={f > 95 && f < 192 ? 'fala' : 'seria'} caraR={f > 180 ? 'o' : 'fechada'} />
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
  const BATE = 130;
  const placa = interpolate(f, [BATE, BATE + 6, BATE + 14, BATE + 22], [0, 24, 10, 14], clamp);
  const treme = f > BATE && f < BATE + 10 ? Math.sin(f * 3) * 4 : 0;
  return (
    <Tela>
      <g transform={`translate(${treme},-80)`}>
        <PortaFrente numero="501" placaAngulo={placa} papelNoChao={f > BATE} luzEmbaixo />
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
  <BilheteClose linhas={['Agora vocês são dois.', 'Devolve o que é meu', 'até a noite sete.']} de={6} ate={120} fundo={<Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />} />
);

const PERG_IG = ['Quem escreve?', 'O que é "meu"?', 'Por que a Tânia?'];

const IgPrazo: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [4, 18], [0, 1], clamp);
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={250} y={880} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={[-0.4, 1]} medo boca="fechada" />
      <Placar noite="3/30" chaves={12} entrada={e} perguntas={PERG_IG} prazo={f > 45 ? 'PRAZO: NOITE 7' : undefined} />
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

// Tempos acertados pela narração do Instagram + YouTube (ep03-igyt-narracao.mp3, 67,2 s).
export const PARTES_EP03_IGYT: Parte[] = [
  {nome: 'impacto', Cena: IgImpacto, dur: 277, fala: [0, 8.61], atraso: 0.2,
    legendas: [[2.85, 4.69, 'Meia-noite. Quinto andar.'], [5.34, 8.61, 'O Rodnei bateu na porta da Tânia... e a porta abriu.']]},
  {nome: 'quem', Cena: IgQuem, dur: 300, fala: [9.32, 18.71], atraso: 0.2,
    legendas: [[9.32, 10.74, 'Ele é técnico de elevador,'], [11.02, 13.87, 'mora no térreo e se muda em vinte e oito dias.'], [14.4, 18.71, 'Desde que avisou, um bilhete anônimo aparece toda noite na porta dele.']]},
  {nome: 'pergunta', Cena: IgPergunta, dur: 201, fala: [19.32, 25.52], atraso: 0.2,
    legendas: [[19.32, 21.88, 'A Tânia não gritou. Não fechou a porta.'], [22.34, 25.52, 'Só olhou pra ele e perguntou: você também recebeu?']]},
  {nome: 'papelDela', Cena: IgPapelDela, dur: 144, fala: [26.12, 30.4], atraso: 0.2,
    legendas: [[26.12, 27.53, 'Ela tirou um papel do bolso.'], [27.96, 30.4, 'A mesma letra. O mesmo papel.']]},
  {nome: 'bilheteDela', Cena: IgBilheteDela, dur: 64, fala: [31.03, 32.56], atraso: 0.2, legendas: []},
  {nome: 'lembranca', Cena: IgLembranca, dur: 228, fala: [33.13, 40.21], atraso: 0.2,
    legendas: [[33.13, 34.82, 'O papel no capacho era dela.'], [35.32, 40.21, 'Ela leu, levou um susto e bateu a porta com tanta força que a placa entortou.']]},
  {nome: 'juntos', Cena: IgJuntos, dur: 135, fala: [40.77, 44.77], atraso: 0.2,
    legendas: [[40.77, 41.84, 'Bater deu certo.'], [42.29, 44.77, 'Agora ele sabe: não é só com ele.']]},
  {nome: 'desceu', Cena: IgDesceu, dur: 92, fala: [45.3, 47.86], atraso: 0.2,
    legendas: [[45.3, 47.86, 'Quando ele desceu, tinha outro bilhete na porta.']]},
  {nome: 'bilhete4', Cena: IgBilhete4, dur: 140, fala: [48.41, 52.47], atraso: 0.2, legendas: []},
  {nome: 'prazo', Cena: IgPrazo, dur: 186, fala: [52.98, 58.68], atraso: 0.2,
    legendas: [[52.98, 55.55, 'Pela primeira vez, o bilhete tem um prazo.'], [56.11, 58.68, 'Noite três. Faltam vinte e sete.']]},
  {nome: 'voto', Cena: IgVoto, dur: 259, fala: [59.21, 66.93], atraso: 0.3,
    legendas: [[59.21, 61.15, 'A Tânia pediu pra ele confiar nela.'], [61.72, 63.84, 'Ele confia... ou desconfia?'], [64.42, 66.93, 'Comente: confiar ou desconfiar.']]},
];
const IG = montar(PARTES_EP03_IGYT);
const EFEITOS_IG: [string, number, number, number?][] = [
  ['batida', IG.inicio('impacto') + 165, 0.6],
  ['clique', IG.inicio('impacto') + 238, 0.4],
  ['papel', IG.inicio('papelDela') + 15, 0.3],
  ['papel', IG.inicio('bilheteDela') + 2, 0.35],
  ['impacto', IG.inicio('lembranca') + 130, 0.5],
  ['suspense_longo', IG.inicio('desceu'), 0.16, IG.duracao - IG.inicio('desceu')],
  ['papel', IG.inicio('bilhete4') + 2, 0.35],
  ['uuush', IG.inicio('voto') + 4, 0.3],
];
export const DURACAO_EP03_IGYT = montar(PARTES_EP03_IGYT).duracao;
export const Ep03IGYT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => (
  <Episodio partes={PARTES_EP03_IGYT} audio="ep03-igyt-narracao.mp3" efeitos={EFEITOS_IG} semLegenda={semLegenda} />
);

// ================= Linha TT (TikTok): "Vestido de Rodnei" =================

const TtImpacto: React.FC = () => {
  const f = useCurrentFrame();
  const abriu = f > 205;
  return (
    <Tela>
      {abriu ? (
        <NaPorta501 f={f} roupa="plantao" dia caraT="seria" caraR="fechada" />
      ) : (
        <>
          <PortaLateral numero="501" luzEmbaixo={false} dia />
          <RodneiBatendo f={f} de={160} ate={195} bilhete />
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
      <Tania x={250} y={960} escala={1.4} frame={f} roupa="plantao" cara={f > 135 ? 'fala' : 'seria'} olhar={[0.6, 0]} />
    </Tela>
  );
};

const PERG_TT_ANTES = ['Quem escreve?', 'O que é "meu"?', 'Quem é "T"?'];

const TtRisca: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <NaPorta501 f={f} roupa="plantao" dia caraT="seria" medoR={false} />
      <Placar noite="3/30" chaves={12} entrada={1} perguntas={PERG_TT_ANTES} riscada={2} risco={interpolate(f, [55, 90], [0, 1], clamp)} />
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
      <Corredor sombraOp={0} bilheteNoChao={f > 130} feixe={false} camera />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

const TtGravacao: React.FC = () => {
  const f = useCurrentFrame();
  const seg = 10 + Math.floor(f / 30);
  return (
    <Tela>
      <TelaGravacao papel={interpolate(f, [80, 87], [0, 1], clamp)} tempo={`23:00:${String(seg).padStart(2, '0')}`} />
    </Tela>
  );
};

const TtBilhete4: React.FC = () => (
  <BilheteClose linhas={['Câmera não me vê.', 'Devolve', 'o que é meu.']} de={6} ate={76} fundo={<Corredor sombraOp={0} bilheteNoChao={false} feixe={false} camera />} />
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

// Tempos acertados pela narração do TikTok (ep03-tiktok-narracao.mp3, 63,1 s).
export const PARTES_EP03_TT: Parte[] = [
  {nome: 'impacto', Cena: TtImpacto, dur: 222, fala: [0, 6.81], atraso: 0.2,
    legendas: [[2.66, 6.81, 'O Rodnei subiu direto pro quinto andar e bateu na porta do 501.']]},
  {nome: 'quem', Cena: TtQuem, dur: 282, fala: [7.4, 16.19], atraso: 0.2,
    legendas: [[7.4, 8.76, 'Ele é técnico de elevador,'], [9.01, 11.77, 'mora no térreo e se muda em vinte e oito dias.'], [12.25, 16.19, 'Desde que avisou, alguém deixa um bilhete na porta dele toda noite.']]},
  {nome: 'cracha', Cena: TtCracha, dur: 246, fala: [16.81, 24.49], atraso: 0.2,
    legendas: [[16.81, 20.82, 'A Tânia abriu de crachá no pescoço, ainda de uniforme de enfermeira.'], [21.24, 24.49, 'Na noite do primeiro bilhete? Eu tava de plantão no hospital.']]},
  {nome: 'risca', Cena: TtRisca, dur: 165, fala: [24.95, 29.95], atraso: 0.2,
    legendas: [[24.95, 28.19, 'Ir direto nela deu certo: a Tânia não era o T.'], [28.66, 29.95, 'E ela lembrou de uma coisa.']]},
  {nome: 'flash', Cena: TtFlashElevador, dur: 176, fala: [30.26, 35.6], atraso: 0.2,
    legendas: [[30.26, 33.18, 'Quando eu saí pro plantão, cruzei com alguém no elevador.'], [33.52, 35.6, 'De macacão azul. Igual ao seu.']]},
  {nome: 'vestido', Cena: TtVestido, dur: 101, fala: [36.0, 38.87], atraso: 0.2,
    legendas: [[36.0, 38.87, 'Alguém no prédio está andando vestido de Rodnei.']]},
  {nome: 'camera', Cena: TtCamera, dur: 167, fala: [39.52, 44.56], atraso: 0.2,
    legendas: [[39.52, 42.5, 'À noite, a câmera da Marlene já estava no corredor.'], [42.94, 44.56, 'Às onze, o bilhete chegou.']]},
  {nome: 'gravacao', Cena: TtGravacao, dur: 166, fala: [45.07, 50.09], atraso: 0.2,
    legendas: [[45.07, 48.68, 'Na gravação, a porta dele aparece. O bilhete aparece.'], [49.1, 50.09, 'Mas ninguém passa.']]},
  {nome: 'bilhete4', Cena: TtBilhete4, dur: 90, fala: [50.47, 52.86], atraso: 0.2, legendas: []},
  {nome: 'placar', Cena: TtPlacar, dur: 93, fala: [53.45, 56.05], atraso: 0.3,
    legendas: [[53.45, 56.05, 'Noite três. Faltam vinte e sete.']]},
  {nome: 'voto', Cena: TtVoto, dur: 223, fala: [56.45, 63.0], atraso: 0.3,
    legendas: [[56.45, 57.97, 'Ele pede ajuda pra Marlene...'], [58.28, 60.09, '...ou procura esse macacão sozinho?'], [60.58, 63.0, 'Comente: Marlene ou sozinho.']]},
];
const TT = montar(PARTES_EP03_TT);
const EFEITOS_TT: [string, number, number, number?][] = [
  ['batida', TT.inicio('impacto') + 160, 0.6],
  ['clique', TT.inicio('impacto') + 203, 0.4],
  ['suspense_longo', TT.inicio('camera'), 0.16, TT.duracao - TT.inicio('camera')],
  ['papel', TT.inicio('camera') + 130, 0.5],
  ['impacto', TT.inicio('camera') + 134, 0.4],
  ['bip', TT.inicio('gravacao') + 4, 0.25],
  ['papel', TT.inicio('bilhete4') + 2, 0.35],
  ['uuush', TT.inicio('voto') + 4, 0.3],
];
export const DURACAO_EP03_TT = montar(PARTES_EP03_TT).duracao;
export const Ep03TT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => (
  <Episodio partes={PARTES_EP03_TT} audio="ep03-tiktok-narracao.mp3" efeitos={EFEITOS_TT} semLegenda={semLegenda} />
);
