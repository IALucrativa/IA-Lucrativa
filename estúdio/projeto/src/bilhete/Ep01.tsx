import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, T} from './cores';
import {Rodnei, Braco} from './Rodnei';
import {Corredor, HallDia, Placar, Porta501, SalaNoite, VisorElevador} from './cenarios';

// Bilhete na Porta · Ep. 1 "O que é meu" (roteiro v2).
// Medo do Rodnei só no rosto: sem tremor no corpo.

const s = (seg: number) => Math.round(seg * 30);

// ---------- peças comuns ----------
const Tela: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 540 960" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5], [1, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', opacity: op}} />;
};

const Etiqueta: React.FC<{texto: string}> = ({texto}) => (
  <g fontFamily="Inter, Arial, sans-serif">
    <rect x={18} y={22} width={texto.length * 11 + 34} height={40} rx={20} fill={C.hud} opacity={0.88} />
    <text x={35} y={48} fontSize={18} fontWeight="bold" fill={C.acento}>
      {texto}
    </text>
  </g>
);

const misturar = (a: Braco, b: Braco, t: number): Braco => ({
  ombro: a.ombro + (b.ombro - a.ombro) * t,
  cotovelo: a.cotovelo + (b.cotovelo - a.cotovelo) * t,
});
const SOLTO_D: Braco = {ombro: -12, cotovelo: 10};
const SEGURA_BILHETE: Braco = {ombro: 20, cotovelo: 100};

// Close de um bilhete, com o texto aparecendo no ritmo da leitura.
const BilheteClose: React.FC<{linhas: string[]; de: number; ate: number; fundo: 'sala' | 'corredor'}> = ({linhas, de, ate, fundo}) => {
  const f = useCurrentFrame();
  const total = linhas.join('').length;
  const letras = Math.floor(interpolate(f, [de, ate], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const flutua = Math.sin(f / 18) * 2;
  let usadas = 0;
  return (
    <Tela>
      <defs>
        <filter id="desfoque">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g filter="url(#desfoque)">
        {fundo === 'sala' ? <SalaNoite papel={0} /> : <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />}
      </g>
      <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.55} />
      <g transform={`translate(0,${flutua}) rotate(-3 270 470)`}>
        <rect x={70} y={300} width={400} height={300} fill={C.papel} {...T} />
        <line x1={70} y1={400} x2={470} y2={400} stroke="#e6dfc8" strokeWidth={2} />
        <line x1={70} y1={500} x2={470} y2={500} stroke="#e6dfc8" strokeWidth={2} />
        {linhas.map((linha, i) => {
          const vis = Math.max(0, Math.min(linha.length, letras - usadas));
          usadas += linha.length;
          return (
            <text key={i} x={100} y={370 + i * 70} fontSize={33} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              {linha.slice(0, vis)}
            </text>
          );
        })}
        {/* mão do Rodnei segurando o papel */}
        <g transform="translate(440,590) rotate(-25)">
          <rect x={-34} y={20} width={68} height={260} rx={30} fill={C.macacao} {...T} />
          <ellipse cx={0} cy={18} rx={42} ry={36} fill={C.pele} {...T} />
          <ellipse cx={-30} cy={-6} rx={14} ry={24} fill={C.pele} transform="rotate(35 -30 -6)" {...T} />
        </g>
      </g>
    </Tela>
  );
};

// ---------- cenas ----------

// 1. Quem é.
const QuemE: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const cartao = spring({frame: f - 8, fps, config: {damping: 14}});
  return (
    <Tela>
      <HallDia avisoColado={false} />
      <Rodnei x={240} y={880} escala={1.15} frame={f} medo={false} boca="aliviada" />
      <g transform={`translate(0,${(1 - cartao) * -120})`} opacity={cartao} fontFamily="Inter, Arial, sans-serif">
        <rect x={110} y={200} width={320} height={86} rx={16} fill={C.hud} opacity={0.92} />
        <text x={270} y={240} fontSize={32} fontWeight="900" textAnchor="middle" fill="#fff">
          RODNEI
        </text>
        <text x={270} y={270} fontSize={17} fontWeight="bold" textAnchor="middle" fill={C.acento}>
          técnico de elevador · térreo
        </text>
      </g>
    </Tela>
  );
};

// 2. O que ele quer: cola o aviso da mudança.
const Aviso: React.FC = () => {
  const f = useCurrentFrame();
  const baixar = interpolate(f, [70, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <HallDia avisoColado />
      <Rodnei
        x={150}
        y={900}
        escala={1.1}
        frame={f}
        bracoD={misturar({ombro: -148, cotovelo: 30}, SOLTO_D, baixar)}
        medo={false}
        boca="aliviada"
        olhar={f < 80 ? [1, -0.6] : [0.3, 0]}
      />
    </Tela>
  );
};

// 3. Às 23h, um papel desliza por baixo da porta.
const Sala: React.FC = () => {
  const f = useCurrentFrame();
  const PAPEL = 45;
  const papel = interpolate(f, [PAPEL, PAPEL + 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const viu = f > PAPEL + 8;
  return (
    <Tela>
      <SalaNoite papel={papel} />
      <Rodnei
        x={225}
        y={905}
        escala={1.1}
        frame={f}
        medo={viu}
        boca={viu ? 'o' : 'fechada'}
        olhar={viu ? [1, 0.6] : [-0.6, 0.3]}
        cabeca={viu ? 4 : 0}
        suor={viu}
      />
      <Etiqueta texto="23h00" />
    </Tela>
  );
};

// 4. O primeiro bilhete.
const Bilhete1: React.FC = () => (
  <BilheteClose linhas={['Você não vai embora', 'antes de devolver', 'o que é meu.']} de={8} ate={95} fundo="sala" />
);

// 5. Ele abre a porta; alguém entra no elevador.
const Sombra: React.FC = () => {
  const f = useCurrentFrame();
  const abertura = interpolate(f, [55, 95], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta aberturaElevador={abertura} sombraElevador={0.9} />
      <Rodnei
        x={205}
        y={885}
        frame={f}
        maoD="bilhete"
        bracoD={SEGURA_BILHETE}
        medo
        boca="o"
        olhar={[1, -0.1]}
        cabeca={5}
        suor
      />
    </Tela>
  );
};

// 6. O visor sobe e para no 5.
const Visor: React.FC = () => {
  const f = useCurrentFrame();
  const andar = Math.min(5, 1 + Math.floor(f / 14));
  return (
    <Tela>
      <VisorElevador andar={String(andar)} subindo={andar < 5} />
    </Tela>
  );
};

// 7. A porta do 501.
const Tania: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 130], [1, 1.07]);
  return (
    <Tela>
      <g transform={`translate(0,-80) translate(270,520) scale(${zoom}) translate(-270,-520)`}>
        <Porta501 />
      </g>
      <Etiqueta texto="5º ANDAR" />
    </Tela>
  );
};

// Rodnei segurando o bilhete no corredor.
const RodneiComBilhete: React.FC<{f: number; olhar: [number, number]; boca?: 'o' | 'fechada'}> = ({f, olhar, boca = 'fechada'}) => (
  <Rodnei x={250} y={880} frame={f} maoD="bilhete" bracoD={SEGURA_BILHETE} olhar={olhar} boca={boca} medo />
);

// 8. A dúvida: devolver o quê?
const Duvida: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={f < 55 ? [-0.4, 1] : [0, -0.4]} />
    </Tela>
  );
};

// 9. Quando ele voltou, tinha outro.
const Voltou: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={[-1, 1]} boca="o" />
    </Tela>
  );
};

const Bilhete2: React.FC = () => (
  <BilheteClose linhas={['Se contar pra alguém,', 'eu conto', 'o seu segredo.']} de={6} ate={85} fundo="corredor" />
);

// 10. Placar.
const PERGUNTAS = ['Quem escreve?', 'O que é "meu"?'];
const PlacarCena: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 6, fps, config: {damping: 12}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f} olhar={[-0.4, 1]} />
      <Placar noite="1/30" chaves={12} entrada={entrada} perguntas={PERGUNTAS} />
    </Tela>
  );
};

// 11. Voto.
const Voto: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const entrada = spring({frame: f - 6, fps, config: {damping: 11}});
  return (
    <Tela>
      <Corredor sombraOp={0} bilheteNoChao={false} feixe={false} portaAberta />
      <RodneiComBilhete f={f + 90} olhar={f < 60 ? [-0.4, 1] : [0, 0]} />
      <Placar noite="1/30" chaves={12} entrada={1} perguntas={PERGUNTAS} />
      <g transform={`translate(270,250) scale(${entrada}) translate(-270,-250)`} fontFamily="Inter, Arial, sans-serif">
        <rect x={40} y={150} width={460} height={190} rx={22} fill={C.hud} opacity={0.94} />
        <text x={270} y={190} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          Ele conta pra síndica ou esconde?
        </text>
        <rect x={62} y={212} width={176} height={62} rx={31} fill={C.acento} />
        <text x={150} y={254} fontSize={30} fontWeight="900" textAnchor="middle" fill={C.hud}>
          CONTAR
        </text>
        <text x={270} y={252} fontSize={22} fontWeight="bold" textAnchor="middle" fill="#fff">
          ou
        </text>
        <rect x={302} y={212} width={176} height={62} rx={31} fill="#fff" />
        <text x={390} y={254} fontSize={28} fontWeight="900" textAnchor="middle" fill={C.hud}>
          ESCONDER
        </text>
        <text x={270} y={316} fontSize={20} fontWeight="bold" textAnchor="middle" fill={C.acento}>
          Comente aqui embaixo 👇
        </text>
      </g>
    </Tela>
  );
};

// ---------- linha do tempo ----------
// [nome, cena, duração em quadros, legendas (segundos relativos ao começo da cena)]
// Nos closes dos bilhetes não tem legenda: o texto já está na tela.
type Parte = [string, React.FC, number, [number, number, string][], ('alto' | 'baixo')?];
export const PARTES: Parte[] = [
  ['quem', QuemE, 144, [[0.2, 1.4, 'Esse é o Rodnei.'], [1.4, 2.8, 'Técnico de elevador.'], [2.8, 4.6, 'Mora no térreo deste prédio.']]],
  ['aviso', Aviso, 126, [[0.1, 2.6, 'Daqui a trinta dias, ele vai embora daqui.'], [2.6, 4.1, 'Hoje, colou o aviso.']]],
  ['sala', Sala, 126, [[0.2, 4.0, 'Às onze da noite, alguém passou isto por baixo da porta dele.']], 'alto'],
  ['bilhete1', Bilhete1, 114, []],
  ['sombra', Sombra, 138, [[0.2, 2.0, 'Quando ele abriu a porta,'], [2.0, 4.4, 'só deu tempo de ver alguém entrando no elevador.']]],
  ['visor', Visor, 108, [[0.2, 1.6, 'O elevador subiu...'], [1.8, 3.4, '...e parou no quinto andar.']]],
  ['tania', Tania, 132, [[0.2, 2.0, 'No quinto andar mora a Tânia.'], [2.1, 4.2, 'Ela se mudou pra cá faz uma semana.']]],
  ['duvida', Duvida, 114, [[0.2, 1.4, 'Devolver o quê?'], [1.5, 3.7, 'O Rodnei nunca pegou nada de ninguém.']]],
  ['voltou', Voltou, 66, [[0.1, 2.1, 'Quando ele voltou, tinha outro.']]],
  ['bilhete2', Bilhete2, 114, []],
  ['placar', PlacarCena, 90, [[0.2, 2.8, 'Noite um. Faltam vinte e nove.']]],
  ['voto', Voto, 168, [[0.2, 2.2, 'Ele conta pra síndica...'], [2.3, 3.3, '...ou esconde?'], [3.5, 5.5, 'Comente: contar ou esconder.']]],
];

const INICIOS = PARTES.reduce<number[]>((acc, _p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + PARTES[i - 1][2]], []);
export const DURACAO_EP01 = INICIOS[INICIOS.length - 1] + PARTES[PARTES.length - 1][2];

const LEGENDAS: [number, number, string, number][] = PARTES.flatMap((p, i) =>
  p[3].map(([a, b, txt]) => [INICIOS[i] + s(a), INICIOS[i] + s(b), txt, p[4] === 'alto' ? 640 : 1640] as [number, number, string, number]),
);

const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const atual = LEGENDAS.find(([a, b]) => f >= a && f < b);
  if (!atual) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: atual[3],
        textAlign: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: 900,
        fontSize: 56,
        lineHeight: 1.15,
        color: '#fff',
        textShadow:
          '0 0 2px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 4px 0 0 #000, -4px 0 0 #000',
      }}
    >
      {atual[2]}
    </div>
  );
};

// Áudio: preenchido quando a narração nova chegar.
// Fala: [início no áudio (s), fim no áudio (s), quando entra no vídeo (quadro)].
export const FALAS: [number, number, number][] = [];
export const EFEITOS: [string, number, number, number?][] = [];

const Sons: React.FC = () => (
  <>
    {FALAS.map(([de, ate, em], i) => (
      <Sequence key={`fala${i}`} from={em} durationInFrames={s(ate - de)}>
        <Audio src={staticFile('ep01-narracao.mp3')} trimBefore={s(de)} />
      </Sequence>
    ))}
    {EFEITOS.map(([arq, em, vol, max], i) => (
      <Sequence key={`efeito${i}`} from={em} durationInFrames={max}>
        <Audio src={staticFile(`sfx/${arq}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);

export const Ep01: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {PARTES.map(([nome, Cena, dur], i) => (
      <Sequence key={nome} from={INICIOS[i]} durationInFrames={dur}>
        <Cena />
        {i > 0 && <Entrada />}
      </Sequence>
    ))}
    <Legenda />
    <Sons />
  </AbsoluteFill>
);
