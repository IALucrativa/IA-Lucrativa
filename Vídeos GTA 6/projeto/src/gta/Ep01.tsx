import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './cores';
import {Kaique} from './Kaique';
import {Assistencia, Celular, EtiquetaW, Flashback, Moto, Quarto, Rua} from './cenarios';
import {CartaoNome, CartaoVoto, Conta, Contador, Desbloqueados, MetaCartao, Pilulas, Velocimetro} from './hud';
import {Camera, Episodio, Parte, Tela, montar, s} from './comum';

// Ep. 1 "Fumaça" — roteiro aprovado em 2026-11-12.
// Narração do ElevenLabs (public/gta-ep01-narracao.mp3, 73,1 s). As cenas emendam sem corte no áudio:
// cada parte cobre o trecho [fala[0], fala[1]] da narração, e as legendas usam o tempo do áudio.

const CONTADOR = 'FALTAM 6 DIAS';
const lerp = (f: number, a: number, b: number, de: number, para: number) =>
  interpolate(f, [a, b], [de, para], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// 1. Impacto: close do videogame pegando fogo.
const Impacto: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, s(6.3), 2.2, 2.6);
  return (
    <Tela>
      <Camera x={250} y={625} z={z}>
        <Quarto frame={f} fumaca={1.1} brilho={0.45} />
      </Camera>
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 2. Quem é: o Kaique abana a fumaça com o boné.
const QuemE: React.FC = () => {
  const f = useCurrentFrame();
  const abana = Math.sin(f / 3) * 22;
  return (
    <Tela>
      <Quarto frame={f} fumaca={1} />
      <Kaique x={392} y={900} frame={f} bracoE={{ombro: 140 + abana, cotovelo: -30}} maoE="bone" boca="o" susto suor olhar={[-1, 0]} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="QUEIMADO" />
      <CartaoNome nome="KAIQUE" linha2="ENTREGADOR · ESPERA DESDE 2013" />
    </Tela>
  );
};

// 3. A aposta (flashback 2018).
const Aposta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Flashback frame={f} aperto={Math.min(1, f / 30) * 3 + Math.sin(f / 4) * (f > 30 ? 1 : 0)} />
    </Tela>
  );
};

// 4. O rival: o Story do Wesley.
const Rival: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Celular frame={f} tipo="story" fundo={<Quarto frame={f} fumaca={0.6} />} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 5. Tentativa 1: assoprar.
const Assoprar: React.FC = () => {
  const f = useCurrentFrame();
  const sopro = f < s(3.2);
  const nuvem = lerp(f, s(3.2), s(3.8), 0, 1);
  return (
    <Tela>
      <Camera x={300} y={600} z={1.45}>
        <Quarto frame={f} fumaca={0.5} fogo={false} brilho={0} />
        <Kaique
          x={334}
          y={900}
          frame={f}
          cabeca={-14}
          bracoE={{ombro: -30, cotovelo: -60}}
          boca={sopro ? 'assopro' : 'o'}
          olhosFechados={!sopro}
          fuligem={!sopro}
          susto={!sopro}
          olhar={[-1, 0.3]}
        />
        {nuvem > 0 && (
          <g opacity={1 - lerp(f, s(4.2), s(5), 0, 1)}>
            <circle cx={320} cy={600} r={20 + nuvem * 26} fill={C.fumaca} stroke={C.linha} strokeWidth={2} />
            <circle cx={350} cy={584} r={14 + nuvem * 20} fill={C.fumaca} stroke={C.linha} strokeWidth={2} />
          </g>
        )}
      </Camera>
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 6. De moto até a assistência, devagar.
const DeMoto: React.FC = () => {
  const f = useCurrentFrame();
  const anda = f < s(3) ? f * 2 : s(3) * 2; // para no amarelo
  const ciclista = lerp(f, s(3.2), s(6.5), -150, 720);
  return (
    <Tela>
      <Rua frame={f} andar={anda} semaforo="amarelo" ciclistaX={ciclista} />
      <Moto x={250} y={790} frame={f} tremido={f < s(3) ? 1.2 : 0} />
      <Velocimetro kmh={f < s(3) ? 30 : 0} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 7. O preço: o Josué cheira o aparelho (e a etiqueta "W." aparece sem ninguém comentar).
const Preco: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tag = spring({frame: f - s(3.8), fps, config: {damping: 10}});
  return (
    <Tela>
      <Assistencia frame={f} cheirando={f < s(3.4)} segurando={f < s(3.4) ? 'virado' : 'videogame'} preco={f > s(3.8) ? tag : 0} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 8. A conta.
const ContaCena: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Assistencia frame={f} segurando="videogame" />
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.45} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="QUEIMADO" />
      <Conta
        jogoEm={s(4.8)}
        linhas={[
          {txt: 'R$ 620', em: s(0.2)},
          {txt: '− R$ 480', cor: C.vermelho, em: s(2.0)},
          {txt: 'R$ 140', cor: C.acento, em: s(3.1)},
        ]}
      />
    </Tela>
  );
};

// 9. Segundo gancho: zoom lento no rosto do Kaique.
const SegundoGancho: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, s(3), 2.6, 3.1);
  return (
    <Tela>
      <rect x={0} y={0} width={540} height={960} fill="#3f7a78" />
      <Camera x={270} y={330} z={z}>
        <Kaique x={270} y={620} frame={f} boca="preocupada" suor olhar={[0.6, 0]} />
      </Camera>
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={lerp(f, 0, s(3), 0, 0.25)} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 10. A ameaça: a mensagem do primo e a etiqueta "W.".
const Ameaca: React.FC = () => {
  const f = useCurrentFrame();
  const letras = Math.floor(lerp(f, s(0.2), s(2.9), 0, 60));
  return (
    <Tela>
      {f < s(3.55) ? (
        <Celular frame={f} tipo="mensagem" letras={letras} fundo={<Assistencia frame={f} segurando="videogame" />} />
      ) : (
        <EtiquetaW frame={f} zoom={lerp(f, s(3.55), s(6.6), 1, 1.25)} />
      )}
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 11. A meta dos seguidores.
const Meta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Quarto frame={f} fumaca={0.6} fogo={false} brilho={0} />
      <Kaique x={392} y={900} frame={f} boca="preocupada" bracoE={{ombro: 10, cotovelo: -8}} maoE="bone" olhar={[0, -0.5]} />
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.4} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={620} videogame="QUEIMADO" />
      <Desbloqueados feitos={0} y={140} />
      <MetaCartao meta={100} item="PEÇA DE BRINDE" efeito="conserto: R$ 480 → R$ 300" />
    </Tela>
  );
};

// 12. O voto: tela dividida.
const Voto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <defs>
        <clipPath id="esq">
          <rect x={0} y={0} width={270} height={960} />
        </clipPath>
        <clipPath id="dir">
          <rect x={270} y={0} width={270} height={960} />
        </clipPath>
      </defs>
      {/* CONSERTAR: esconde o videogame no baú */}
      <g clipPath="url(#esq)">
        <Camera x={135} y={700} z={1.05}>
          <Quarto frame={f} fumaca={0} fogo={false} brilho={0} semVideogame />
          <Kaique x={160} y={900} frame={f} bracoE={{ombro: 0, cotovelo: -40}} bracoD={{ombro: 0, cotovelo: 40}} maoE="videogame" boca="fechada" olhar={[-1, 0.4]} cabeca={-6} />
        </Camera>
      </g>
      {/* CONTAR: liga pro primo, suando */}
      <g clipPath="url(#dir)">
        <g transform="translate(270,0)">
          <Camera x={135} y={700} z={1.05}>
            <rect x={0} y={0} width={540} height={960} fill={C.parede} />
            <rect x={0} y={650} width={540} height={310} fill={C.chao} />
            <Kaique x={150} y={900} frame={f} bracoD={{ombro: -20, cotovelo: 170}} maoD="celular" boca="preocupada" suor susto />
          </Camera>
        </g>
      </g>
      <line x1={270} y1={0} x2={270} y2={960} stroke="#111" strokeWidth={6} />
      <Contador texto={CONTADOR} />
      <CartaoVoto pergunta="Conserta escondido ou conta a verdade?" opcoes={['CONSERTAR', 'CONTAR']} y={300} />
    </Tela>
  );
};

// 13. Emenda: volta pra fumaça do começo.
const Emenda: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Camera x={250} y={625} z={2.2}>
        <Quarto frame={f + 90} fumaca={1.1} brilho={0.45} />
      </Camera>
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// Cortes de cena no tempo da narração (s).
const CORTES = [0, 6.3, 10.45, 16.25, 21.2, 26.2, 33.5, 39.5, 46.7, 49.7, 56.3, 65.2, 73.6];
const parte = (i: number, nome: string, Cena: React.FC, legendas: [number, number, string][]): Parte => ({
  nome,
  Cena,
  dur: s(CORTES[i + 1]) - s(CORTES[i]),
  fala: [CORTES[i], CORTES[i + 1]],
  legendas,
});

export const partesEp01: Parte[] = [
  parte(0, 'impacto', Impacto, [[0, 2.6, 'Faltam seis dias pro GTA 6...'], [2.94, 5.9, 'e o videogame do Kaique acabou de pegar fogo.']]),
  parte(1, 'quem', QuemE, [[6.46, 8.2, 'O Kaique é entregador'], [8.2, 10.2, 'e espera esse jogo há treze anos.']]),
  parte(2, 'aposta', Aposta, [[10.62, 11.8, 'Ele apostou com o primo:'], [12.22, 15.95, 'quem jogar primeiro, à meia-noite do dia 19, ganha.']]),
  parte(3, 'rival', Rival, [[16.44, 19.05, 'O primo, Wesley, já postou a pré-venda.'], [19.36, 20.9, 'E já está contando vitória.']]),
  parte(4, 'assoprar', Assoprar, [[21.4, 24.45, 'O Kaique tentou o conserto universal: assoprar.'], [25.0, 25.9, 'Não funcionou.']]),
  parte(5, 'moto', DeMoto, [[26.42, 28.7, 'Foi de moto até a assistência do Seu Josué.'], [29.16, 29.7, 'Devagar:'], [30.2, 33.2, 'ele dirige como se levasse um bolo de casamento na garupa.']]),
  parte(6, 'preco', Preco, [[33.8, 36.9, 'O Seu Josué olhou, cheirou e deu o preço:'], [37.34, 39.3, 'quatrocentos e oitenta reais.']]),
  parte(7, 'conta', ContaCena, [[39.74, 41.2, 'Ele tem seiscentos e vinte.'], [41.54, 43.9, 'Se consertar, sobram cento e quarenta.'], [44.3, 46.4, 'E o jogo custa bem mais que isso.']]),
  parte(8, 'gancho', SegundoGancho, [[46.96, 49.3, 'Mas o pior ainda nem tinha chegado.']]),
  parte(9, 'ameaca', Ameaca, [[49.94, 52.7, '"Primo, amanhã eu passo aí pra buscar o MEU videogame."'], [53.28, 54.6, 'O videogame que queimou...'], [54.88, 56.0, 'nunca foi dele.']]),
  parte(10, 'meta', Meta, [[56.58, 57.7, 'Agora é com vocês.'], [57.98, 61.5, 'Se esse perfil ganhar cem seguidores até amanhã ao meio-dia,'], [61.7, 63.5, 'o conserto cai pra trezentos.'], [63.72, 64.9, 'Segue pra desbloquear.']]),
  parte(11, 'voto', Voto, [[65.38, 68.8, 'E o Kaique... conserta escondido antes do primo chegar,'], [69.12, 70.15, 'ou conta a verdade?'], [70.58, 73.3, 'Comente: CONSERTAR ou CONTAR.']]),
  {nome: 'emenda', Cena: Emenda, dur: s(2), legendas: []},
];

export const DURACAO_EP01 = montar(partesEp01).duracao;

// Efeitos pontuais: [arquivo, quadro, volume, duração máx. em quadros]. Sem nada em loop.
const efeitosEp01: [string, number, number, number?][] = [
  ['impacto', 0, 0.55, s(2)],
  ['luz_piscando', s(0.2), 0.35, s(1.7)],
  ['uuush', s(10.35), 0.5, s(0.8)],
  ['uuush', s(16.15), 0.4, s(0.8)],
  ['bip', s(16.6), 0.6, s(0.2)],
  ['uuush', s(24.4), 0.6, s(0.8)],
  ['clique', s(39.7), 0.5, s(0.6)],
  ['clique', s(41.5), 0.5, s(0.6)],
  ['clique', s(42.6), 0.5, s(0.6)],
  ['batida', s(44.3), 0.55, s(1)],
  ['suspense', s(46.7), 0.3, s(3)],
  ['bip', s(49.75), 0.7, s(0.2)],
  ['bip', s(50.0), 0.7, s(0.2)],
  ['impacto', s(53.25), 0.6, s(2)],
  ['clique', s(56.5), 0.5, s(0.6)],
  ['batida', s(65.3), 0.4, s(1)],
  ['impacto', s(73.6), 0.4, s(2)],
];

export const Ep01: React.FC<{semLegenda?: boolean}> = ({semLegenda = false}) => (
  <Episodio partes={partesEp01} semLegenda={semLegenda} audioUnico="gta-ep01-narracao.mp3" efeitos={efeitosEp01} />
);
