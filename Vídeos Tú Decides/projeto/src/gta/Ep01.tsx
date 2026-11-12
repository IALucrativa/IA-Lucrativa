import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './cores';
import {Kike} from './Kike';
import {Assistencia, Celular, EtiquetaB, Flashback, Moto, Quarto, Rua} from './cenarios';
import {CartaoNome, CartaoVoto, Conta, Contador, Desbloqueados, MetaCartao, Pilulas, Velocimetro} from './hud';
import {Camera, Episodio, Parte, Tela, montar, s} from './comum';

// Ep. 1 "Humo" — versão em espanhol (Espanha) do Ep. 1 "Fumaça".
// Narração do ElevenLabs (voz Jaime, public/tu-decides-ep01-narracion.mp3, 68,6 s), recebida em 2026-11-12.
// Tempos tirados da transcrição do áudio. As cenas emendam sem corte no áudio:
// cada parte cobre o trecho [fala[0], fala[1]] da narração, e as legendas usam o tempo do áudio.

const CONTADOR = 'QUEDAN 6 DÍAS';
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

// 2. Quem é: o Kike abana a fumaça com o boné.
const QuemE: React.FC = () => {
  const f = useCurrentFrame();
  const abana = Math.sin(f / 3) * 22;
  return (
    <Tela>
      <Quarto frame={f} fumaca={1} />
      <Kike x={392} y={900} frame={f} bracoE={{ombro: 140 + abana, cotovelo: -30}} maoE="bone" boca="o" susto suor olhar={[-1, 0]} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={240} videogame="QUEMADA" />
      <CartaoNome nome="KIKE" linha2="REPARTIDOR · ESPERA DESDE 2013" />
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

// 4. O rival: o Story do Borja.
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
  const sopro = f < s(2.9);
  const nuvem = lerp(f, s(2.9), s(3.5), 0, 1);
  return (
    <Tela>
      <Camera x={300} y={600} z={1.45}>
        <Quarto frame={f} fumaca={0.5} fogo={false} brilho={0} />
        <Kike
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
          <g opacity={1 - lerp(f, s(3.8), s(4.5), 0, 1)}>
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

// 7. O preço: o Paco cheira o aparelho (e a etiqueta "W." aparece sem ninguém comentar).
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
      <Pilulas dinheiro={240} videogame="QUEMADA" />
      <Conta
        jogoEm={s(4.5)}
        linhas={[
          {txt: '240 €', em: s(0.4)},
          {txt: '− 190 €', cor: C.vermelho, em: s(1.9)},
          {txt: '50 €', cor: C.acento, em: s(3.35)},
        ]}
      />
    </Tela>
  );
};

// 9. Segundo gancho: zoom lento no rosto do Kike.
const SegundoGancho: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, s(3), 2.6, 3.1);
  return (
    <Tela>
      <rect x={0} y={0} width={540} height={960} fill="#3f7a78" />
      <Camera x={270} y={330} z={z}>
        <Kike x={270} y={620} frame={f} boca="preocupada" suor olhar={[0.6, 0]} />
      </Camera>
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={lerp(f, 0, s(3), 0, 0.25)} />
      <Contador texto={CONTADOR} />
    </Tela>
  );
};

// 10. A ameaça: a mensagem do primo e a etiqueta "W.".
const Ameaca: React.FC = () => {
  const f = useCurrentFrame();
  const letras = Math.floor(lerp(f, s(0.2), s(2.4), 0, 60));
  return (
    <Tela>
      {f < s(2.95) ? (
        <Celular frame={f} tipo="mensagem" letras={letras} fundo={<Assistencia frame={f} segurando="videogame" />} />
      ) : (
        <EtiquetaB frame={f} zoom={lerp(f, s(2.95), s(6.35), 1, 1.25)} />
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
      <Kike x={392} y={900} frame={f} boca="preocupada" bracoE={{ombro: 10, cotovelo: -8}} maoE="bone" olhar={[0, -0.5]} />
      <rect x={0} y={0} width={540} height={960} fill="#000" opacity={0.4} />
      <Contador texto={CONTADOR} />
      <Pilulas dinheiro={240} videogame="QUEMADA" />
      <Desbloqueados feitos={0} y={140} />
      <MetaCartao meta={100} item="PIEZA DE REGALO" efeito="arreglo: 190 € → 120 €" />
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
      {/* ARREGLAR: esconde a consola no baú */}
      <g clipPath="url(#esq)">
        <Camera x={135} y={700} z={1.05}>
          <Quarto frame={f} fumaca={0} fogo={false} brilho={0} semVideogame />
          <Kike x={160} y={900} frame={f} bracoE={{ombro: 0, cotovelo: -40}} bracoD={{ombro: 0, cotovelo: 40}} maoE="videogame" boca="fechada" olhar={[-1, 0.4]} cabeca={-6} />
        </Camera>
      </g>
      {/* CONTAR: liga para o primo, suando */}
      <g clipPath="url(#dir)">
        <g transform="translate(270,0)">
          <Camera x={135} y={700} z={1.05}>
            <rect x={0} y={0} width={540} height={960} fill={C.parede} />
            <rect x={0} y={650} width={540} height={310} fill={C.chao} />
            <Kike x={150} y={900} frame={f} bracoD={{ombro: -20, cotovelo: 170}} maoD="celular" boca="preocupada" suor susto />
          </Camera>
        </g>
      </g>
      <line x1={270} y1={0} x2={270} y2={960} stroke="#111" strokeWidth={6} />
      <Contador texto={CONTADOR} />
      <CartaoVoto pergunta="¿La arregla a escondidas o cuenta la verdad?" opcoes={['ARREGLAR', 'CONTAR']} y={300} />
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
const CORTES = [0, 5.8, 9.95, 15.55, 19.6, 24.1, 30.2, 35.65, 42.0, 44.65, 51.0, 60.5, 68.9];
const parte = (i: number, nome: string, Cena: React.FC, legendas: [number, number, string][]): Parte => ({
  nome,
  Cena,
  dur: s(CORTES[i + 1]) - s(CORTES[i]),
  fala: [CORTES[i], CORTES[i + 1]],
  legendas,
});

export const partesEp01: Parte[] = [
  parte(0, 'impacto', Impacto, [[0.00, 2.16, 'Quedan seis días para el GTA 6...'], [2.54, 5.24, 'y la consola de Kike acaba de salir ardiendo.']]),
  parte(1, 'quem', QuemE, [[5.94, 7.12, 'Kike es repartidor'], [7.12, 9.58, 'y lleva trece años esperando este juego.']]),
  parte(2, 'aposta', Aposta, [[10.10, 11.16, 'Se apostó con su primo:'], [11.68, 15.14, 'el que juegue primero, a medianoche del día 19, gana.']]),
  parte(3, 'rival', Rival, [[15.70, 17.84, 'Su primo Borja ya ha subido la reserva.'], [17.84, 19.20, 'Y ya va de ganador.']]),
  parte(4, 'assoprar', Assoprar, [[19.74, 22.46, 'Kike probó el arreglo universal: soplar.'], [23.00, 23.84, 'No funcionó.']]),
  parte(5, 'moto', DeMoto, [[24.28, 26.10, 'Fue en moto hasta el taller de Paco.'], [26.56, 27.20, 'Despacito:'], [27.20, 30.18, 'conduce como si llevara una tarta de boda detrás.']]),
  parte(6, 'preco', Preco, [[30.34, 33.48, 'Paco la miró, la olió y le dio el precio:'], [34.04, 35.24, 'ciento noventa euros.']]),
  parte(7, 'conta', ContaCena, [[35.80, 36.68, 'Tiene doscientos cuarenta.'], [37.58, 39.32, 'Si la arregla, le quedan cincuenta.'], [39.94, 41.64, 'Y el juego cuesta bastante más.']]),
  parte(8, 'gancho', SegundoGancho, [[42.18, 44.34, 'Pero lo peor todavía no había llegado.']]),
  parte(9, 'ameaca', Ameaca, [[44.82, 47.12, '«Primo, mañana paso a por MI consola.»'], [47.70, 49.12, 'La consola que se ha quemado...'], [49.52, 50.62, 'nunca fue suya.']]),
  parte(10, 'meta', Meta, [[51.16, 52.52, 'Ahora os toca a vosotros.'], [52.98, 56.30, 'Si este perfil gana cien seguidores antes de mañana a mediodía,'], [56.30, 58.10, 'el arreglo baja a ciento veinte.'], [58.64, 60.16, 'Síguenos para desbloquearlo.']]),
  parte(11, 'voto', Voto, [[60.68, 64.24, 'Y Kike... ¿la arregla a escondidas antes de que llegue su primo,'], [64.24, 65.56, 'o le cuenta la verdad?'], [66.06, 68.12, 'Comenta: ARREGLAR o CONTAR.']]),
  {nome: 'emenda', Cena: Emenda, dur: s(2), legendas: []},
];

export const DURACAO_EP01 = montar(partesEp01).duracao;

// Efeitos pontuais: [arquivo, quadro, volume, duração máx. em quadros]. Sem nada em loop.
const efeitosEp01: [string, number, number, number?][] = [
  ['impacto', 0, 0.55, s(2)],
  ['luz_piscando', s(0.2), 0.35, s(1.7)],
  ['uuush', s(9.85), 0.5, s(0.8)],
  ['uuush', s(15.45), 0.4, s(0.8)],
  ['bip', s(15.9), 0.6, s(0.2)],
  ['uuush', s(22.5), 0.6, s(0.8)],
  ['clique', s(36.05), 0.5, s(0.6)],
  ['clique', s(37.55), 0.5, s(0.6)],
  ['clique', s(39.0), 0.5, s(0.6)],
  ['batida', s(40.15), 0.55, s(1)],
  ['suspense', s(42.0), 0.3, s(3)],
  ['bip', s(44.7), 0.7, s(0.2)],
  ['bip', s(44.95), 0.7, s(0.2)],
  ['impacto', s(47.6), 0.6, s(2)],
  ['clique', s(51.2), 0.5, s(0.6)],
  ['batida', s(60.4), 0.4, s(1)],
  ['impacto', s(68.9), 0.4, s(2)],
];

// semNarracao: para a prévia, enquanto a narração em espanhol não chega.
export const Ep01: React.FC<{semLegenda?: boolean; semNarracao?: boolean}> = ({semLegenda = false, semNarracao = false}) => (
  <Episodio partes={partesEp01} semLegenda={semLegenda} audioUnico={semNarracao ? undefined : 'tu-decides-ep01-narracion.mp3'} efeitos={efeitosEp01} />
);
