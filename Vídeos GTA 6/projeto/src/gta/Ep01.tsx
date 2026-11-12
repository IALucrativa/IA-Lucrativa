import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './cores';
import {Kaique} from './Kaique';
import {Assistencia, Celular, EtiquetaW, Flashback, Moto, Quarto, Rua} from './cenarios';
import {CartaoNome, CartaoVoto, Conta, Contador, Desbloqueados, MetaCartao, Pilulas, Velocimetro} from './hud';
import {Camera, Episodio, Parte, Tela, montar, s} from './comum';

// Ep. 1 "Fumaça" — roteiro aprovado em 2026-11-12.
// Sem narração ainda: os tempos são estimados. Quando o áudio chegar, cada parte ganha `fala` e os tempos reais.

const CONTADOR = 'FALTAM 6 DIAS';
const lerp = (f: number, a: number, b: number, de: number, para: number) =>
  interpolate(f, [a, b], [de, para], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// 1. Impacto: close do videogame pegando fogo.
const Impacto: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, s(3.5), 2.2, 2.45);
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
  const sopro = f < s(2);
  const nuvem = lerp(f, s(2), s(2.6), 0, 1);
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
          <g opacity={1 - lerp(f, s(3), s(4), 0, 1)}>
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
  const tag = spring({frame: f - s(2.6), fps, config: {damping: 10}});
  return (
    <Tela>
      <Assistencia frame={f} cheirando={f < s(2.4)} segurando={f < s(2.4) ? 'virado' : 'videogame'} preco={f > s(2.6) ? tag : 0} />
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
        jogoEm={s(4.2)}
        linhas={[
          {txt: 'R$ 620', em: s(0.2)},
          {txt: '− R$ 480', cor: C.vermelho, em: s(1.6)},
          {txt: 'R$ 140', cor: C.acento, em: s(2.8)},
        ]}
      />
    </Tela>
  );
};

// 9. Segundo gancho: zoom lento no rosto do Kaique.
const SegundoGancho: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, s(2.5), 2.6, 3.1);
  return (
    <Tela>
      <rect x={0} y={0} width={540} height={960} fill="#3f7a78" />
      <Camera x={270} y={330} z={z}>
        <Kaique x={270} y={620} frame={f} boca="preocupada" suor olhar={[0.6, 0]} />
      </Camera>
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={lerp(f, 0, s(2.5), 0, 0.25)} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 10. A ameaça: a mensagem do primo e a etiqueta "W.".
const Ameaca: React.FC = () => {
  const f = useCurrentFrame();
  const letras = Math.floor(lerp(f, s(0.6), s(4), 0, 60));
  return (
    <Tela>
      {f < s(4.6) ? (
        <Celular frame={f} tipo="mensagem" letras={letras} fundo={<Assistencia frame={f} segurando="videogame" />} />
      ) : (
        <EtiquetaW frame={f} zoom={lerp(f, s(4.6), s(7), 1, 1.25)} />
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

export const partesEp01: Parte[] = [
  {nome: 'impacto', Cena: Impacto, dur: s(3.5), legendas: [[0, 1.6, 'Faltam seis dias pro GTA 6...'], [1.6, 3.4, 'e o videogame do Kaique acabou de pegar fogo.']]},
  {nome: 'quem', Cena: QuemE, dur: s(4.5), legendas: [[0.2, 2, 'O Kaique é entregador'], [2, 4.3, 'e espera esse jogo há treze anos.']]},
  {nome: 'aposta', Cena: Aposta, dur: s(5.5), legendas: [[0.2, 2, 'Ele apostou com o primo:'], [2, 5.3, 'quem jogar primeiro, à meia-noite do dia 19, ganha.']]},
  {nome: 'rival', Cena: Rival, dur: s(4.5), legendas: [[0.2, 2.4, 'O primo, Wesley, já postou a pré-venda.'], [2.4, 4.3, 'E já está contando vitória.']]},
  {nome: 'assoprar', Cena: Assoprar, dur: s(4), legendas: [[0.2, 2.6, 'O Kaique tentou o conserto universal: assoprar.'], [2.8, 3.9, 'Não funcionou.']]},
  {nome: 'moto', Cena: DeMoto, dur: s(7), legendas: [[0.2, 2.4, 'Foi de moto até a assistência do Seu Josué.'], [2.6, 3.6, 'Devagar:'], [3.6, 6.8, 'ele dirige como se levasse um bolo de casamento na garupa.']]},
  {nome: 'preco', Cena: Preco, dur: s(5), legendas: [[0.2, 2.4, 'O Seu Josué olhou, cheirou...'], [2.4, 4.8, 'e deu o preço: quatrocentos e oitenta reais.']]},
  {nome: 'conta', Cena: ContaCena, dur: s(6), legendas: [[0.2, 1.6, 'Ele tem seiscentos e vinte.'], [1.6, 4, 'Se consertar, sobram cento e quarenta.'], [4, 5.8, 'E o jogo custa bem mais que isso.']]},
  {nome: 'gancho', Cena: SegundoGancho, dur: s(2.5), legendas: [[0.1, 2.4, 'Mas o pior ainda nem tinha chegado.']]},
  {nome: 'ameaca', Cena: Ameaca, dur: s(7), legendas: [[0.6, 4.4, '"Primo, amanhã eu passo aí pra buscar o MEU videogame."'], [4.6, 5.8, 'O videogame que queimou...'], [5.8, 6.9, 'nunca foi dele.']]},
  {nome: 'meta', Cena: Meta, dur: s(9), legendas: [[0.2, 1.6, 'Agora é com vocês.'], [1.6, 5, 'Se esse perfil ganhar cem seguidores até amanhã ao meio-dia,'], [5, 7, 'o conserto cai pra trezentos.'], [7, 8.8, 'Segue pra desbloquear.']]},
  {nome: 'voto', Cena: Voto, dur: s(8), legendas: [[0.2, 3.4, 'E o Kaique... conserta escondido antes do primo chegar,'], [3.4, 5, 'ou conta a verdade?'], [5, 7.8, 'Comente: CONSERTAR ou CONTAR.']]},
  {nome: 'emenda', Cena: Emenda, dur: s(2), legendas: []},
];

export const DURACAO_EP01 = montar(partesEp01).duracao;

export const Ep01: React.FC<{semLegenda?: boolean}> = ({semLegenda = false}) => <Episodio partes={partesEp01} semLegenda={semLegenda} />;

