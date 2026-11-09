import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, T, Tf} from '../bilhete/cores';
import {Rodnei} from '../bilhete/Rodnei';

// Peças do perfil do Instagram "Você Decide Aí": carrossel "Como funciona" (1080×1350)
// e capas de destaque (1080×1920, o ícone fica dentro do círculo central).

const F = 'Inter, Arial, sans-serif';

const Fundo: React.FC<{h: number}> = ({h}) => (
  <g>
    <defs>
      <radialGradient id="fundoPerfil" cx="0.5" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#4a4270" />
        <stop offset="1" stopColor="#1b1830" />
      </radialGradient>
    </defs>
    <rect width={540} height={h} fill="url(#fundoPerfil)" />
    {/* lua e janelas do prédio ao fundo, para não ficar fundo liso */}
    <circle cx={470} cy={70} r={22} fill="#f3efd6" opacity={0.9} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={30 + i * 130} y={h - 70} width={60} height={70} fill="#2a2440" opacity={0.7} />
    ))}
  </g>
);

const Selo: React.FC<{y: number; texto: string}> = ({y, texto}) => (
  <g fontFamily={F}>
    <rect x={270 - (texto.length * 9.5 + 30) / 2} y={y} width={texto.length * 9.5 + 30} height={30} rx={15} fill="#fff" {...Tf} />
    <text x={270} y={y + 20.5} fontSize={13} fontWeight="900" textAnchor="middle" fill={C.hud}>
      {texto}
    </text>
  </g>
);

const Titulo: React.FC<{y: number; linhas: (string | [string, string])[]; tam?: number}> = ({y, linhas, tam = 40}) => (
  <g fontFamily={F} fontWeight="900" textAnchor="middle" stroke="#000" strokeWidth={7} paintOrder="stroke">
    {linhas.map((l, i) => (
      <text key={i} x={270} y={y + i * (tam + 8)} fontSize={tam}>
        {typeof l === 'string' ? <tspan fill="#fff">{l}</tspan> : (
          <>
            <tspan fill="#fff">{l[0]}</tspan>
            <tspan fill={C.acento}>{l[1]}</tspan>
          </>
        )}
      </text>
    ))}
  </g>
);

const Texto: React.FC<{y: number; linhas: string[]; tam?: number; cor?: string}> = ({y, linhas, tam = 19, cor = '#e9e6f5'}) => (
  <g fontFamily={F} fontWeight="bold" textAnchor="middle" fill={cor}>
    {linhas.map((l, i) => (
      <text key={i} x={270} y={y + i * (tam + 8)} fontSize={tam}>
        {l}
      </text>
    ))}
  </g>
);

const Pagina: React.FC<{n: number}> = ({n}) => (
  <g fontFamily={F}>
    {[1, 2, 3, 4].map((i) => (
      <circle key={i} cx={240 + (i - 1) * 20} cy={652} r={5} fill={i === n ? C.acento : '#ffffff55'} />
    ))}
  </g>
);

const Deslize: React.FC = () => (
  <text x={505} y={630} fontSize={15} fontWeight="900" textAnchor="end" fill={C.acento} fontFamily={F}>
    deslize →
  </text>
);

// Balão de comentário (como o público vota).
const Comentario: React.FC<{y: number; nome: string; texto: string}> = ({y, nome, texto}) => (
  <g fontFamily={F}>
    <rect x={80} y={y} width={380} height={64} rx={16} fill="#fff" {...T} />
    <circle cx={114} cy={y + 32} r={18} fill={C.acento} {...Tf} />
    <text x={142} y={y + 26} fontSize={14} fontWeight="bold" fill="#666">
      {nome}
    </text>
    <text x={142} y={y + 50} fontSize={22} fontWeight="900" fill={C.hud}>
      {texto}
    </text>
  </g>
);

export const ComoFunciona: React.FC<{slide: number}> = ({slide}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 675" width={1080} height={1350}>
      <Fundo h={675} />
      {slide === 1 && (
        <g>
          <Selo y={36} texto="VOCÊ DECIDE AÍ" />
          <Titulo y={130} linhas={['AQUI, QUEM', 'DECIDE O PRÓXIMO', ['EPISÓDIO É ', 'VOCÊ']]} tam={40} />
          <Texto y={290} linhas={['Séries curtas, um episódio por dia.', 'No fim de cada um, o público vota.']} />
          <Rodnei x={140} y={760} escala={0.92} frame={0} maoD="bilhete" bracoD={{ombro: 20, cotovelo: 100}} olhar={[0.6, 0]} boca="o" medo />
          <g transform="rotate(6 410 450)" fontFamily={F}>
            <rect x={335} y={395} width={160} height={92} rx={8} fill={C.acento} {...T} />
            <text x={415} y={433} fontSize={17} fontWeight="900" textAnchor="middle" fill={C.hud}>
              O FINAL
            </text>
            <text x={415} y={458} fontSize={17} fontWeight="900" textAnchor="middle" fill={C.hud}>
              É SEU
            </text>
          </g>
          <Deslize />
          <Pagina n={1} />
        </g>
      )}
      {slide === 2 && (
        <g>
          <Selo y={36} texto="COMO VOTAR" />
          <Titulo y={130} linhas={['COMENTE', ['UMA ', 'PALAVRA']]} tam={46} />
          <Texto y={240} linhas={['No fim de cada episódio', 'aparecem 2 opções. Por exemplo:']} />
          <g fontFamily={F}>
            <rect x={60} y={300} width={190} height={50} rx={25} fill={C.acento} {...Tf} />
            <text x={155} y={333} fontSize={24} fontWeight="900" textAnchor="middle" fill={C.hud}>
              CONTAR
            </text>
            <text x={270} y={332} fontSize={18} fontWeight="bold" textAnchor="middle" fill="#fff">
              ou
            </text>
            <rect x={290} y={300} width={190} height={50} rx={25} fill="#fff" {...Tf} />
            <text x={385} y={333} fontSize={22} fontWeight="900" textAnchor="middle" fill={C.hud}>
              ESCONDER
            </text>
          </g>
          <Texto y={400} linhas={['Escolha a sua e comente no vídeo:']} />
          <Comentario y={425} nome="você" texto="CONTAR" />
          <Comentario y={505} nome="seu amigo" texto="ESCONDER" />
          <Deslize />
          <Pagina n={2} />
        </g>
      )}
      {slide === 3 && (
        <g>
          <Selo y={36} texto="O RESULTADO" />
          <Titulo y={130} linhas={['A MAIS', ['COMENTADA ', 'VENCE']]} tam={46} />
          <Texto y={250} linhas={['E o próximo episódio é', 'o que vocês escolherem.']} tam={21} />
          {/* relógio apoiado na faixa */}
          <g fontFamily={F}>
            <rect x={70} y={330} width={400} height={150} rx={20} fill={C.hud} opacity={0.92} {...Tf} />
            <circle cx={128} cy={405} r={40} fill="#fbf7ea" {...T} />
            <line x1={128} y1={405} x2={128} y2={375} stroke={C.linha} strokeWidth={5} strokeLinecap="round" />
            <line x1={128} y1={405} x2={128} y2={378} stroke={C.linha} strokeWidth={5} strokeLinecap="round" />
            <circle cx={128} cy={405} r={4} fill={C.linha} />
            <text x={320} y={395} fontSize={22} fontWeight="900" textAnchor="middle" fill="#fff">
              EP. NOVO TODO DIA
            </text>
            <text x={320} y={440} fontSize={40} fontWeight="900" textAnchor="middle" fill={C.acento}>
              ÀS 12H
            </text>
          </g>
          <Texto y={540} linhas={['🔔 Ative as notificações', 'pra não perder o voto.']} tam={21} cor="#fff" />
          <Deslize />
          <Pagina n={3} />
        </g>
      )}
      {slide === 4 && (
        <g>
          <Selo y={36} texto="SÉRIE ATUAL" />
          <Titulo y={125} linhas={[['BILHETE ', 'NA PORTA']]} tam={42} />
          <Texto y={185} linhas={['Ele se muda em 30 dias.', 'Desde que avisou, um bilhete', 'aparece toda noite na porta dele.']} tam={19} />
          {/* bilhete apoiado na faixa de chão */}
          <g transform="rotate(-4 270 330)">
            <rect x={130} y={275} width={280} height={120} fill={C.papel} {...T} />
            <text x={150} y={318} fontSize={21} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              Você não vai embora antes
            </text>
            <text x={150} y={350} fontSize={21} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
              de devolver o que é meu.
            </text>
          </g>
          <Rodnei x={400} y={765} escala={0.78} frame={0} olhar={[0, 0]} boca="o" medo />
          <g fontFamily={F}>
            <rect x={60} y={430} width={170} height={56} rx={14} fill={C.acento} {...T} />
            <text x={145} y={455} fontSize={14} fontWeight="900" textAnchor="middle" fill={C.hud}>
              COMECE PELO
            </text>
            <text x={145} y={476} fontSize={17} fontWeight="900" textAnchor="middle" fill={C.hud}>
              EPISÓDIO 1 📌
            </text>
          </g>
          <Pagina n={4} />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

// Capa de destaque: o Instagram mostra só o círculo do meio.
export const Destaque: React.FC<{tipo: 'bilhete' | 'como'}> = ({tipo}) => (
  <AbsoluteFill style={{background: '#f2a91c'}}>
    <svg viewBox="0 0 540 960" width={1080} height={1920}>
      <rect width={540} height={960} fill="#f2a91c" />
      <circle cx={270} cy={480} r={230} fill="#ffcc33" />
      {tipo === 'bilhete' ? (
        <g transform="rotate(-6 270 480)">
          <rect x={150} y={385} width={240} height={190} rx={8} fill={C.hud} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={180} y={425 + i * 45} width={i === 2 ? 110 : 180} height={14} rx={7} fill={C.acento} />
          ))}
        </g>
      ) : (
        <g fontFamily={F}>
          <circle cx={270} cy={480} r={130} fill={C.hud} />
          <text x={270} y={545} fontSize={190} fontWeight="900" textAnchor="middle" fill={C.acento}>
            ?
          </text>
        </g>
      )}
    </svg>
  </AbsoluteFill>
);
