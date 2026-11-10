import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Rodnei} from './Rodnei';
import {Marlene} from './Marlene';
import {Corredor, ListaClose, LivroClose, Placar, Portaria, PortaFrente, SalaNoite} from './cenarios';
import {
  BilheteClose,
  CartaoNome,
  CartaoVoto,
  Episodio,
  Escolheram,
  Etiqueta,
  Parte,
  SEGURA_BILHETE,
  SOLTO_D,
  Tela,
  misturar,
  montar,
} from './comum';

// Bilhete na Porta · Ep. 2, em duas linhas:
//  - IG+YT (Instagram e YouTube): ele escondeu.  - TT (TikTok): ele contou.
// Medo só no rosto, sem tremor.

const NOME_LINHA2 = 'técnico de elevador · térreo · muda em 29 dias';
const BILHETE2 = ['Se contar pra alguém,', 'eu conto', 'o seu segredo.'];

// Rodnei na sala (mesma posição do Ep. 1).
const RodneiSala: React.FC<React.ComponentProps<typeof Rodnei>> = (p) => <Rodnei {...p} />;

// ================= Linha IG+YT: "Ninguém sabe" =================

const IgImpacto: React.FC = () => (
  <>
    <BilheteClose linhas={BILHETE2} de={0} ate={1} fundo={<SalaNoite papel={0} />} />
    <Tela>
      <Escolheram opcao="ESCONDER" />
    </Tela>
  </>
);

const IgBatida: React.FC = () => {
  const f = useCurrentFrame();
  const guardar = interpolate(f, [70, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ouviu = f > 30;
  return (
    <Tela>
      <SalaNoite papel={0} dia hora={7} />
      <RodneiSala
        x={225}
        y={905}
        escala={1.1}
        frame={f}
        maoD={guardar < 0.9 ? 'bilhete' : 'nada'}
        bracoD={misturar(SEGURA_BILHETE, SOLTO_D, guardar)}
        medo={ouviu}
        boca={ouviu ? 'o' : 'fechada'}
        olhar={ouviu ? [1, 0.2] : [-0.3, 1]}
        cabeca={ouviu ? 4 : 0}
      />
      <Etiqueta texto="7h00" />
    </Tela>
  );
};

const IgQuem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <Rodnei x={190} y={885} frame={f} medo={false} boca="fechada" olhar={[1, 0]} />
      <Marlene x={365} y={885} escala={0.97} frame={f} maoD="prancheta" bracoD={{ombro: 20, cotovelo: 90}} cara="desconfiada" olhar={[-1, 0]} />
      <CartaoNome linha2={NOME_LINHA2} />
    </Tela>
  );
};

const IgMarlene: React.FC = () => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [205, 265], [365, 640], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sorriu = f > 95;
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <Rodnei x={190} y={885} frame={f} medo={!sorriu} boca={sorriu ? 'aliviada' : 'fechada'} olhar={f > 210 ? [1, 0] : [1, -0.2]} />
      <Marlene
        x={sai}
        y={885}
        escala={0.97}
        frame={f}
        maoD="prancheta"
        bracoD={{ombro: 20, cotovelo: 90}}
        cara={f < 150 ? 'desconfiada' : 'seria'}
        olhar={[-1, 0]}
      />
    </Tela>
  );
};

const IgGanho: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <Rodnei x={230} y={885} frame={f} medo={false} boca="fechada" maoD="lanterna" lanternaAcesa={false} bracoD={{ombro: -25, cotovelo: -120}} olhar={[0.6, -0.6]} />
    </Tela>
  );
};

const IgQuinto: React.FC = () => (
  <Tela>
    <g transform="translate(0,-80)">
      <PortaFrente numero="501" placaTorta papelNoChao luzEmbaixo={false} dia />
    </g>
    <Etiqueta texto="5º ANDAR · 15h" />
  </Tela>
);

const IgPapel: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 110], [2.4, 2.7]);
  return (
    <Tela>
      <g transform={`translate(270,470) scale(${zoom}) translate(-330,-830)`}>
        <PortaFrente numero="501" placaTorta papelNoChao luzEmbaixo={false} dia />
      </g>
    </Tela>
  );
};

const IgNoite: React.FC = () => {
  const f = useCurrentFrame();
  const papel = interpolate(f, [10, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <SalaNoite papel={papel} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo boca="o" olhar={[1, 0.6]} cabeca={4} suor />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

const IgBilhete3: React.FC = () => (
  <BilheteClose linhas={['Eu vi você no quinto andar.', 'E eu sei em que portas', 'você entra.']} de={6} ate={125} fundo={<SalaNoite papel={0} />} />
);

const IgPeso: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <SalaNoite papel={0} />
      <RodneiSala
        x={225}
        y={905}
        escala={1.1}
        frame={f}
        chavesNaCintura={false}
        maoE="chaves"
        bracoE={{ombro: -30, cotovelo: -120}}
        olhar={[0.3, 0.8]}
        medo
        boca="fechada"
      />
    </Tela>
  );
};

const PERG_IG = ['Quem escreve?', 'O que é "meu"?', 'Quem me viu no 5º?'];

const IgPlacar: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <SalaNoite papel={0} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo boca="fechada" olhar={[0, 0]} />
      <Placar noite="2/30" chaves={12} entrada={e} perguntas={PERG_IG} />
    </Tela>
  );
};

const IgVoto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <SalaNoite papel={0} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo boca="fechada" olhar={f < 80 ? [1, 0.4] : [0, 0]} />
      <Placar noite="2/30" chaves={12} entrada={1} perguntas={PERG_IG} />
      <CartaoVoto pergunta="Ele bate na porta da Tânia ou vigia a dele?" opcoes={['BATER', 'VIGIAR']} />
    </Tela>
  );
};

export const PARTES_EP02_IGYT: Parte[] = [
  {nome: 'impacto', Cena: IgImpacto, dur: 60, legendas: []},
  {nome: 'batida', Cena: IgBatida, dur: 210, legendas: [[0.2, 2.4, 'O Rodnei não contou pra ninguém.'], [2.5, 6.6, 'Nem quando a síndica bateu na porta dele às sete da manhã.']]},
  {nome: 'quem', Cena: IgQuem, dur: 255, legendas: [[0.2, 3.2, 'Ele é técnico de elevador, mora no térreo'], [3.2, 5.0, 'e se muda em vinte e nove dias.'], [5.1, 8.3, 'E desde ontem, alguém deixa bilhetes na porta dele.']]},
  {nome: 'marlene', Cena: IgMarlene, dur: 270, legendas: [[0.2, 3.0, 'A Marlene queria saber do barulho no corredor.'], [3.1, 5.6, 'Ele sorriu, disse que foi o gato...'], [5.7, 8.8, '...e ela foi embora sem desconfiar de nada.']]},
  {nome: 'ganho', Cena: IgGanho, dur: 195, legendas: [[0.2, 1.6, 'Esconder deu certo.'], [1.7, 6.3, 'E deu mais: sem a síndica no caminho, ele podia investigar sozinho.']]},
  {nome: 'quinto', Cena: IgQuinto, dur: 270, legendas: [[0.2, 2.6, 'À tarde, ele subiu até o quinto andar.'], [2.7, 5.8, 'Na porta da Tânia, a plaquinha de boas-vindas estava torta.'], [5.9, 8.8, 'Como se alguém tivesse saído com pressa.']]},
  {nome: 'papel', Cena: IgPapel, dur: 120, legendas: [[0.2, 2.6, 'E no chão, perto do capacho, um pedaço de papel.'], [2.6, 3.9, 'Igual ao dos bilhetes.']]},
  {nome: 'noite', Cena: IgNoite, dur: 90, pos: 'alto', legendas: [[0.2, 2.9, 'Às onze da noite, chegou o terceiro.']]},
  {nome: 'bilhete3', Cena: IgBilhete3, dur: 150, legendas: []},
  {nome: 'peso', Cena: IgPeso, dur: 150, legendas: [[0.2, 2.2, 'Ele não contou nada pra ninguém.'], [2.3, 4.9, 'Mas alguém está contando os passos dele.']]},
  {nome: 'placar', Cena: IgPlacar, dur: 100, legendas: [[0.2, 3.1, 'Noite dois. Faltam vinte e oito.']]},
  {nome: 'voto', Cena: IgVoto, dur: 210, legendas: [[0.2, 3.0, 'Hoje à noite, ele bate na porta da Tânia...'], [3.1, 5.3, '...ou fica acordado vigiando a própria porta?'], [5.4, 7.0, 'Comente: bater ou vigiar.']]},
];
export const DURACAO_EP02_IGYT = montar(PARTES_EP02_IGYT).duracao;
export const Ep02IGYT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => <Episodio partes={PARTES_EP02_IGYT} semLegenda={semLegenda} />;

// ================= Linha TT (TikTok): "A letra T" =================

const PortaSindica: React.FC = () => (
  <g>
    {/* parede, rodapé e chão em toda a largura (a porta fica mais à esquerda) */}
    <rect x={0} y={0} width={540} height={800} fill="#5d5486" />
    <rect x={0} y={780} width={540} height={20} fill="#874f2c" />
    <rect x={0} y={800} width={540} height={160} fill="#7a5a4a" />
    <line x1={0} y1={880} x2={540} y2={880} stroke="#6a4c3e" strokeWidth={2} />
  <g transform="translate(-110,0)">
    <PortaFrente numero="102" cor="#5f7f5a" corEsc="#4a6646" placa="sindica" luzEmbaixo={false} dia />
  </g>
  </g>
);

const TtImpacto: React.FC = () => {
  const f = useCurrentFrame();
  const bate = f > 128 && f < 160 ? Math.sin((f - 128) * 0.7) * 14 : 0;
  const mostra = interpolate(f, [70, 85], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <PortaSindica />
      <Rodnei x={410} y={900} escala={1.1} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} bracoE={{ombro: 75, cotovelo: 40 + bate}} olhar={[-1, 0]} medo={false} boca="fechada" />
      <Etiqueta texto="7h00" />
      <g opacity={mostra}>
        <Escolheram opcao="CONTAR" />
      </g>
    </Tela>
  );
};

const TtQuem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={250} y={885} frame={f} medo={false} boca="fechada" maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={[0, 0]} />
      <CartaoNome linha2={NOME_LINHA2} />
    </Tela>
  );
};

const TtLeu: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <PortaSindica />
      <Marlene
        x={250}
        y={940}
        escala={1.35}
        frame={f}
        maoE="bilhete"
        bracoE={{ombro: -15, cotovelo: -95}}
        cara={f < 70 ? 'surpresa' : 'seria'}
        olhar={f < 70 ? [0.3, 1] : [1, 0]}
      />
    </Tela>
  );
};

const TtPortaria: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Portaria>
        <Marlene x={270} y={765} frame={f} maoD="aponta" bracoD={{ombro: 30, cotovelo: 40}} cara="seria" olhar={[0, 1]} />
      </Portaria>
      <Etiqueta texto="PORTARIA" />
    </Tela>
  );
};

const TtLivro: React.FC = () => {
  const f = useCurrentFrame();
  const destaque = interpolate(f, [100, 124], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <LivroClose riscado={1} destaque={destaque} />
    </Tela>
  );
};

const TtLista: React.FC = () => {
  const f = useCurrentFrame();
  const destaque = interpolate(f, [62, 92], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <ListaClose destaque={destaque} />
    </Tela>
  );
};

const TtCamera: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={190} y={885} frame={f} medo={false} boca="fechada" olhar={[1, -1]} cabeca={-4} />
      <Marlene x={350} y={885} escala={0.97} frame={f} maoD="aponta" bracoD={{ombro: -150, cotovelo: -15}} cara="seria" olhar={[1, -1]} />
    </Tela>
  );
};

const TtJunto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} />
      <Rodnei x={210} y={885} frame={f} medo={false} boca="aliviada" olhar={[1, 0]} />
      <Marlene x={340} y={885} escala={0.97} frame={f} maoD="prancheta" bracoD={{ombro: 20, cotovelo: 90}} cara="sorriso" olhar={[-1, 0]} />
    </Tela>
  );
};

const TtNoite: React.FC = () => {
  const f = useCurrentFrame();
  const papel = interpolate(f, [128, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const viu = f > 135;
  return (
    <Tela>
      <SalaNoite papel={papel} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo={viu} boca={viu ? 'o' : 'fechada'} olhar={[1, 0.6]} cabeca={viu ? 4 : 0} suor={viu} />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

const TtBilhete3: React.FC = () => (
  <BilheteClose linhas={['Você contou pra ela.', 'Agora eu também', 'vou contar.']} de={6} ate={106} fundo={<SalaNoite papel={0} />} />
);

const PERG_TT = ['Quem escreve?', 'O que é "meu"?', 'Quem é "T"?'];

const TtPlacar: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <SalaNoite papel={0} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo boca="fechada" maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={[-0.4, 1]} />
      <Placar noite="2/30" chaves={12} entrada={e} perguntas={PERG_TT} />
    </Tela>
  );
};

const TtVoto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <SalaNoite papel={0} />
      <RodneiSala x={225} y={905} escala={1.1} frame={f} medo boca="fechada" maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={f < 80 ? [-0.4, 1] : [0, 0]} />
      <Placar noite="2/30" chaves={12} entrada={1} perguntas={PERG_TT} />
      <CartaoVoto pergunta="Ele mostra pra Marlene ou fala com a Tânia?" opcoes={['MARLENE', 'TÂNIA']} />
    </Tela>
  );
};

// Tempos acertados pela narração do TikTok (ep02-tiktok-narracao.mp3, 64,8 s).
export const PARTES_EP02_TT: Parte[] = [
  {nome: 'impacto', Cena: TtImpacto, dur: 248, fala: [0, 7.56], atraso: 0.2,
    legendas: [[2.63, 3.55, 'Sete da manhã.'], [4.18, 7.56, 'O Rodnei bateu na porta da síndica com os dois bilhetes na mão.']]},
  {nome: 'quem', Cena: TtQuem, dur: 261, fala: [8.13, 16.24], atraso: 0.2,
    legendas: [[8.13, 10.56, 'Ele é técnico de elevador, mora no térreo'], [10.77, 12.67, 'e se muda em vinte e nove dias.'], [13.14, 16.24, 'E desde ontem, alguém deixa bilhetes na porta dele.']]},
  {nome: 'leu', Cena: TtLeu, dur: 108, fala: [16.84, 19.71], atraso: 0.2,
    legendas: [[16.84, 18.09, 'A Marlene leu tudo...'], [18.69, 19.71, '...e acreditou nele.']]},
  {nome: 'portaria', Cena: TtPortaria, dur: 198, fala: [20.3, 26.23], atraso: 0.2,
    legendas: [[20.3, 21.77, 'Ela abriu o livro da portaria.'], [22.33, 26.23, 'Ontem, às onze da noite, alguém assinou a entrada pro quinto andar.']]},
  {nome: 'livro', Cena: TtLivro, dur: 141, fala: [26.67, 30.73], atraso: 0.2,
    legendas: [[26.67, 27.88, 'O nome estava riscado.'], [28.18, 30.73, 'Só dava pra ler a primeira letra: T.']]},
  {nome: 'lista', Cena: TtLista, dur: 127, fala: [31.35, 35.08], atraso: 0.2,
    legendas: [[31.35, 35.08, 'Na lista de moradores do quinto andar, só um nome começa com T.']]},
  {nome: 'camera', Cena: TtCamera, dur: 135, fala: [35.58, 39.58], atraso: 0.2,
    legendas: [[35.58, 36.64, 'E a Marlene foi além:'], [37.12, 39.58, 'amanhã, eu ponho uma câmera nesse corredor.']]},
  {nome: 'junto', Cena: TtJunto, dur: 121, fala: [40.09, 43.61], atraso: 0.2,
    legendas: [[40.09, 43.61, 'Pela primeira vez, o Rodnei não estava sozinho nessa.']]},
  {nome: 'noite', Cena: TtNoite, dur: 202, fala: [44.07, 50.3], atraso: 0.2, pos: 'alto',
    legendas: [[44.07, 48.01, 'Às onze da noite, ele esperou com a porta trancada e a luz acesa.'], [48.51, 50.3, 'O bilhete chegou mesmo assim.']]},
  {nome: 'bilhete3', Cena: TtBilhete3, dur: 118, fala: [50.9, 54.23], atraso: 0.2, legendas: []},
  {nome: 'placar', Cena: TtPlacar, dur: 93, fala: [54.84, 57.33], atraso: 0.3,
    legendas: [[54.84, 57.33, 'Noite dois. Faltam vinte e oito.']]},
  {nome: 'voto', Cena: TtVoto, dur: 231, fala: [57.88, 64.58], atraso: 0.3,
    legendas: [[57.88, 59.8, 'Ele mostra esse bilhete pra Marlene...'], [60.18, 61.88, '...ou vai direto falar com a Tânia?'], [62.42, 64.58, 'Comente: Marlene ou Tânia.']]},
];
const TT = montar(PARTES_EP02_TT);
const EFEITOS_TT: [string, number, number, number?][] = [
  ['batida', TT.inicio('impacto') + 130, 0.6],
  ['papel', TT.inicio('quem') + 10, 0.2],
  ['papel', TT.inicio('livro') + 2, 0.3],
  ['suspense_longo', TT.inicio('noite'), 0.16, TT.duracao - TT.inicio('noite')],
  ['papel', TT.inicio('noite') + 128, 0.55],
  ['impacto', TT.inicio('noite') + 134, 0.5],
  ['papel', TT.inicio('bilhete3') + 2, 0.35],
  ['uuush', TT.inicio('voto') + 4, 0.3],
];
export const DURACAO_EP02_TT = montar(PARTES_EP02_TT).duracao;
export const Ep02TT: React.FC<{semLegenda?: boolean}> = ({semLegenda}) => (
  <Episodio partes={PARTES_EP02_TT} audio="ep02-tiktok-narracao.mp3" efeitos={EFEITOS_TT} semLegenda={semLegenda} />
);
