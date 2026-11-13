import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './cores';
import {Boneco, Kaique, RUI, TIAO, WESLEY} from './Kaique';
import {Assistencia, Celular, Moto, Quarto, Rua} from './cenarios';
import {Central, Corredor, OlhoMagico} from './cenarios2';
import {Balao, Carimbo, CartaoVoto, Contador, Desbloqueados, Escolheram, MetaProgresso, Pilulas} from './hud';
import {Camera, Episodio, Parte, Tela, montar, s} from './comum';

// Ep. 2 "Tô numa entrega" — roteiro aprovado em 2026-11-13. Linha única (IG, TT e YT).
// Narração: public/gta-ep02-narracao.mp3. Tempos tirados da transcrição (faster-whisper).

const CONTADOR = 'FALTAM 6 DIAS';
const lerp = (f: number, a: number, b: number, de: number, para: number) =>
  interpolate(f, [a, b], [de, para], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// O Wesley apertando a campainha (visto de fora).
const WesleyNaPorta: React.FC<{f: number; x?: number}> = ({f, x = 330}) => (
  <Boneco x={x} y={770} frame={f} escala={1.05} visual={WESLEY} boca="convencido" bracoE={{ombro: 115, cotovelo: -20 + Math.sin(f / 4) * 6}} olhar={[-0.6, 0]} />
);

// 1. Impacto: pelo olho mágico, o primo na porta.
const Impacto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <OlhoMagico frame={f}>
        <WesleyNaPorta f={f} />
      </OlhoMagico>
      <text x={430} y={760} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={34} fill={C.acento} stroke="#000" strokeWidth={6} paintOrder="stroke" transform="rotate(8 430 760)" opacity={f % 30 < 18 ? 1 : 0}>
        DING-DONG!
      </text>
      <Contador texto={CONTADOR} />
      <Escolheram opcao="CONSERTAR" y={128} />
    </Tela>
  );
};

// 2. Quem é: dentro do quarto, o rack vazio, o Kaique suando.
const QuemE: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Quarto frame={f} fumaca={0} fogo={false} brilho={0} semVideogame />
      <Kaique x={392} y={900} frame={f} boca="o" susto suor olhar={[1, 0]} bracoE={{ombro: 10, cotovelo: -8}} />
      <text x={470} y={520} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={28} fill={C.acento} stroke="#000" strokeWidth={6} paintOrder="stroke" transform="rotate(10 470 520)" opacity={f % 40 < 22 ? 1 : 0}>
        DING-DONG!
      </text>
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="QUEIMADO" />
    </Tela>
  );
};

// 3. O plano: capacete, baú, e sai correndo pelo corredor.
const Plano: React.FC = () => {
  const f = useCurrentFrame();
  const capacete = f >= s(3.3);
  const bau = f >= s(4.6);
  if (f < s(5.6)) {
    return (
      <Tela>
        <Quarto frame={f} fumaca={0} fogo={false} brilho={0} semVideogame />
        <Kaique
          x={300}
          y={900}
          frame={f}
          capacete={capacete}
          boca="fechada"
          olhar={[1, 0]}
          bracoE={bau ? {ombro: 0, cotovelo: -40} : {ombro: 10, cotovelo: -8}}
          bracoD={bau ? {ombro: 0, cotovelo: 40} : {ombro: -10, cotovelo: 8}}
          maoE={bau ? 'bau' : 'nada'}
        />
        <Contador texto={CONTADOR} />
      </Tela>
    );
  }
  const corre = lerp(f, s(5.6), s(6.6), 150, 640);
  return (
    <Tela>
      <Corredor frame={f} portaAberta />
      <Boneco x={430} y={900} frame={f} escala={1} visual={WESLEY} boca="o" olhar={[-1, 0]} />
      <g transform={`rotate(8 ${corre} 900)`}>
        <Kaique x={corre} y={900} frame={f} capacete boca="fechada" olhar={[1, 0]} bracoE={{ombro: 0, cotovelo: -40}} bracoD={{ombro: 0, cotovelo: 40}} maoE="bau" pulo={Math.abs(Math.sin(f / 2)) * 14} />
      </g>
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 4. A fala: na moto, "tô numa entrega!".
const Fala: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Rua frame={f} andar={f * 2} semaforo="verde" />
      <Moto x={250} y={790} frame={f} tremido={1.2} />
      <Balao x={290} y={540} linhas={['PRIMO, TÔ NUMA ENTREGA!', 'VOLTA AMANHÃ!']} de={4} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 5. Vitória: o Wesley olha o celular (semente: pedido em 31/11), dá de ombros e vai embora.
const Vitoria: React.FC = () => {
  const f = useCurrentFrame();
  if (f < s(1.9)) {
    return (
      <Tela>
        <Celular frame={f + 40} tipo="story" dataPedido="31/11" fundo={<Corredor frame={f} />} />
        <Contador texto={CONTADOR} />
      </Tela>
    );
  }
  const x = lerp(f, s(2.6), s(4.5), 300, 640);
  const ombros = f < s(2.6);
  return (
    <Tela>
      <Corredor frame={f} />
      <Boneco
        x={x}
        y={900}
        frame={f}
        visual={WESLEY}
        boca="fechada"
        olhar={[1, 0]}
        bracoE={ombros ? {ombro: 40, cotovelo: 120} : {ombro: 10, cotovelo: -8}}
        bracoD={ombros ? {ombro: -40, cotovelo: -120} : {ombro: -10, cotovelo: 8}}
        pulo={ombros ? 0 : Math.abs(Math.sin(f / 4)) * 6}
      />
      <Carimbo texto="CONSERTAR ✓ DEU CERTO" de={s(4.6)} y={300} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// Etiqueta amarela pendurada (ex.: "PRONTO AMANHÃ").
const Etiqueta: React.FC<{x: number; y: number; linhas: string[]; de: number; cor?: string}> = ({x, y, linhas, de, cor = C.acento}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: f - de, fps, config: {damping: 10}});
  if (f < de) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${e}) rotate(-6)`} fontFamily={F}>
      <path d="M-130,-40 L110,-40 L140,0 L110,40 L-130,40 Z" fill={cor} stroke={C.linha} strokeWidth={3} />
      <circle cx={114} cy={0} r={7} fill="#fff" stroke={C.linha} strokeWidth={2} />
      {linhas.map((l, i) => (
        <text key={i} x={-8} y={(linhas.length === 1 ? 12 : -4) + i * 28} textAnchor="middle" fontSize={linhas.length === 1 ? 28 : 24} textLength={linhas.length === 1 ? 210 : undefined} lengthAdjust="spacingAndGlyphs" fontWeight="900" fill={C.hud}>
          {l}
        </text>
      ))}
    </g>
  );
};

// 6. O conserto: fica pronto amanhã.
const Conserto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Assistencia frame={f} segurando="videogame" />
      <Etiqueta x={385} y={385} linhas={['PRONTO AMANHÃ']} de={s(3.4)} />
      <Etiqueta x={400} y={650} linhas={['R$ 480', 'NA RETIRADA']} de={s(4.8)} cor="#ffffff" />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 7. A conta: ainda tem R$ 620... por enquanto.
const ContaCena: React.FC = () => {
  const f = useCurrentFrame();
  const op = (t: number) => lerp(f, s(t), s(t) + 6, 0, 1);
  return (
    <Tela>
      <Assistencia frame={f} segurando="videogame" />
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.45} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="NO CONSERTO" />
      <g fontFamily={F} fontWeight="900">
        <rect x={70} y={300} width={400} height={260} rx={24} fill={C.hud} opacity={0.95} />
        <text x={270} y={350} textAnchor="middle" fontSize={22} fill={C.acento} opacity={op(0.1)}>
          NA LATA
        </text>
        <text x={270} y={410} textAnchor="middle" fontSize={56} fill="#fff" opacity={op(0.2)}>
          R$ 620
        </text>
        <text x={270} y={470} textAnchor="middle" fontSize={20} fill="#cfd3e0" opacity={op(0.8)}>
          A PAGAR AMANHÃ:
        </text>
        <text x={270} y={520} textAnchor="middle" fontSize={40} fill={C.vermelho} opacity={op(0.8)}>
          R$ 480
        </text>
      </g>
      <Carimbo texto="POR ENQUANTO..." de={s(2.6)} y={640} />
    </Tela>
  );
};

// 8. Segundo gancho: o sorriso e o celular vibrando.
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const vibra = f > s(1.2);
  return (
    <Tela>
      <Camera x={250} y={620} z={lerp(f, 0, s(2.6), 2.2, 2.6)}>
        <Rua frame={f} andar={0} semaforo="vermelho" />
        <Moto x={250} y={790} frame={f} />
      </Camera>
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={lerp(f, 0, s(2.6), 0, 0.25)} />
      {vibra && (
        <text x={400} y={760} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={36} fill="#fff" stroke="#000" strokeWidth={6} paintOrder="stroke" transform={`rotate(${Math.sin(f) * 6} 400 760)`}>
          BZZZ
        </text>
      )}
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 9. A ameaça: a mensagem do chefe e o quadro de escala.
const Ameaca: React.FC = () => {
  const f = useCurrentFrame();
  const msg = 'Kaique, escala da semana: dia 19 você pega das 18h à 1h.';
  const letras = Math.floor(lerp(f, s(1.8), s(5.9), 0, msg.length));
  return (
    <Tela>
      {f < s(6.2) ? (
        <Celular frame={f} tipo="mensagem" letras={letras} remetente="Rui (chefe)" avatar="#f08a24" hora="18:02" mensagem={msg} fundo={<Rua frame={f} andar={0} semaforo="vermelho" />} />
      ) : (
        <Camera x={275} y={380} z={lerp(f, s(6.2), s(8.7), 1.35, 1.5)}>
          <Central frame={f} />
        </Camera>
      )}
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 10. A meta: 53 de 100, faltam só 47.
const Meta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Quarto frame={f} fumaca={0} fogo={false} brilho={0} semVideogame />
      <Kaique x={392} y={900} frame={f} boca="preocupada" olhar={[0, -0.5]} />
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.4} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="NO CONSERTO" />
      <Desbloqueados feitos={0} y={140} />
      <MetaProgresso atual={53} total={100} item="PEÇA DE BRINDE" efeito="conserto: R$ 480 → R$ 300" />
    </Tela>
  );
};

// 11. O voto: PEDIR (ao Rui) ou TROCAR (com o Tião).
const Voto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <defs>
        <clipPath id="esq2">
          <rect x={0} y={0} width={270} height={960} />
        </clipPath>
        <clipPath id="dir2">
          <rect x={270} y={0} width={270} height={960} />
        </clipPath>
      </defs>
      <g clipPath="url(#esq2)">
        <Camera x={135} y={700} z={1.0}>
          <Central frame={f} />
          <Kaique x={80} y={900} frame={f} escala={0.85} boca="preocupada" olhar={[1, 0]} bracoE={{ombro: -10, cotovelo: -70}} bracoD={{ombro: 10, cotovelo: 70}} />
          <Boneco x={205} y={900} frame={f} escala={0.85} visual={RUI} boca="fechada" olhar={[-1, 0]} bracoE={{ombro: -20, cotovelo: -100}} bracoD={{ombro: 20, cotovelo: 100}} />
        </Camera>
      </g>
      <g clipPath="url(#dir2)">
        <g transform="translate(270,0)">
          <Camera x={135} y={700} z={1.0}>
            <g transform="translate(-270,0)">
              <Central frame={f} />
            </g>
            <Kaique x={80} y={900} frame={f} escala={0.85} boca="sorriso" olhar={[1, 0]} bracoD={{ombro: -75, cotovelo: -15 + Math.sin(f / 3) * 5}} />
            <Boneco x={200} y={900} frame={f} escala={0.85} visual={TIAO} boca="fechada" olhar={[-1, 0]} bracoE={{ombro: 75, cotovelo: 15 + Math.sin(f / 3) * 5}} />
          </Camera>
        </g>
      </g>
      <line x1={270} y1={0} x2={270} y2={960} stroke="#111" strokeWidth={6} />
      <Contador texto={CONTADOR} />
      <CartaoVoto pergunta="Pede folga ou troca o turno?" opcoes={['PEDIR', 'TROCAR']} y={290} />
    </Tela>
  );
};

// 12. Emenda: o olho mágico, agora com o corredor vazio.
const Emenda: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <OlhoMagico frame={f} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// ---------- tempos ----------
// Trecho da meta: no áudio final ele é trocado pela versão "53 de 100".
// META_INI/META_FIM = onde ele começa e termina no áudio final; DESLOC = quanto o resto andou.
const META_INI = 51.2;
const META_FIM = 60.9;
const DESLOC = 3.92; // o trecho novo da meta é 3,9 s mais longo que o antigo
const d = (t: number) => t + DESLOC;

const CORTES = [0, 4.45, 13.0, 19.75, 22.4, 28.9, 36.4, 39.9, 42.5, META_INI, d(META_FIM), d(69.5)];
const parte = (i: number, nome: string, Cena: React.FC, legendas: [number, number, string][]): Parte => ({
  nome,
  Cena,
  dur: s(CORTES[i + 1]) - s(CORTES[i]),
  fala: [CORTES[i], CORTES[i + 1]],
  legendas,
});

const LEGENDAS_META: [number, number, string][] = [
  [51.42, 53.95, 'Vocês trouxeram 53 seguidores.'],
  [54.48, 56.4, 'A peça de brinde está quase saindo:'],
  [56.84, 57.95, 'faltam só 47.'],
  [58.66, 61.2, 'Se o perfil chegar lá até amanhã ao meio-dia,'],
  [61.5, 62.85, 'o conserto cai pra trezentos.'],
  [63.6, 64.7, 'Segue pra desbloquear.'],
];

export const partesEp02: Parte[] = [
  parte(0, 'impacto', Impacto, [[0, 2.2, 'Vocês escolheram: CONSERTAR.'], [2.54, 4.1, 'Só que o primo chegou antes.']]),
  parte(1, 'quem', QuemE, [[4.7, 6.95, 'Faltam seis dias pro GTA 6.'], [7.52, 9.5, 'O videogame que pegou fogo é do Wesley...'], [10.08, 12.7, 'e agora ele está do outro lado da porta.']]),
  parte(2, 'plano', Plano, [[13.32, 15.9, 'O Kaique fez o que todo entregador sabe fazer:'], [16.34, 19.55, 'botou o capacete, pegou o baú e saiu correndo.']]),
  parte(3, 'fala', Fala, [[19.98, 22.15, '"Primo, tô numa entrega! Volta amanhã!"']]),
  parte(4, 'vitoria', Vitoria, [[22.64, 24.4, 'E o Wesley... foi embora.'], [24.86, 26.45, 'Sem desconfiar de nada.'], [26.98, 28.7, 'Consertar escondido deu certo.']]),
  parte(5, 'conserto', Conserto, [[29.18, 31.9, 'Na assistência, o Seu Josué deu a notícia boa:'], [32.34, 33.35, 'fica pronto amanhã.'], [33.66, 36.15, 'Quatrocentos e oitenta, pagos na retirada.']]),
  parte(6, 'conta', ContaCena, [[36.62, 38.3, 'O Kaique ainda tem seiscentos e vinte.'], [39.02, 39.6, 'Por enquanto.']]),
  parte(7, 'gancho', Gancho, [[40.18, 42.2, 'Mas tinha um detalhe que ele esqueceu.']]),
  parte(8, 'ameaca', Ameaca, [[42.74, 43.9, 'Mensagem do chefe:'], [44.36, 48.5, '"Kaique, dia 19 você pega das 18h à 1h."'], [48.74, 50.95, 'Bem na meia-noite do lançamento.']]),
  parte(9, 'meta', Meta, LEGENDAS_META),
  parte(10, 'voto', Voto, [[d(61.08), d(61.5), 'E agora:'], [d(62.0), d(63.85), 'o Kaique pede folga pro chefe...'], [d(63.84), d(66.2), 'ou troca o turno com outro entregador?'], [d(66.68), d(68.75), 'Comente: PEDIR ou TROCAR.']]),
  {nome: 'emenda', Cena: Emenda, dur: s(2), legendas: []},
];

export const DURACAO_EP02 = montar(partesEp02).duracao;

const efeitosEp02: [string, number, number, number?][] = [
  ['bip', 0, 0.7, s(0.2)],
  ['bip', s(0.25), 0.7, s(0.2)],
  ['impacto', s(1.2), 0.45, s(2)],
  ['bip', s(5), 0.5, s(0.2)],
  ['bip', s(5.25), 0.5, s(0.2)],
  ['clique', s(16.3), 0.5, s(0.6)],
  ['uuush', s(18.7), 0.6, s(0.8)],
  ['uuush', s(22.3), 0.4, s(0.8)],
  ['batida', s(27.0), 0.5, s(1)],
  ['clique', s(32.3), 0.5, s(0.6)],
  ['clique', s(33.6), 0.5, s(0.6)],
  ['batida', s(39.0), 0.45, s(1)],
  ['suspense', s(39.9), 0.3, s(3)],
  ['bip', s(41.2), 0.7, s(0.2)],
  ['bip', s(41.45), 0.7, s(0.2)],
  ['impacto', s(48.7), 0.55, s(2)],
  ['clique', s(META_INI + 0.2), 0.5, s(0.6)],
  ['batida', s(d(60.95)), 0.4, s(1)],
  ['impacto', s(d(69.5)), 0.4, s(2)],
];

export const Ep02: React.FC<{semLegenda?: boolean}> = ({semLegenda = false}) => (
  <Episodio partes={partesEp02} semLegenda={semLegenda} audioUnico="gta-ep02-narracao.mp3" efeitos={efeitosEp02} />
);
