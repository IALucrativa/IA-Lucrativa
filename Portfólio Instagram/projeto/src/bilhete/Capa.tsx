import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, T, Tf} from './cores';
import {Rodnei} from './Rodnei';
import {Corredor} from './cenarios';

// Capa padrão dos episódios (1080×1920).
// Tudo o que importa fica no meio (y 120–840 no desenho), que é o recorte 3:4 da grade do perfil.
export type CapaProps = {
  serie: string;
  episodio: number;
  faixa: string; // placar/prazo, na faixa amarela inclinada
  gancho: string; // frase curta no selinho
  cartaoTexto: string[]; // o que aparece dentro do cartão (bilhete)
  cartaoRotulo: string[]; // rótulo vermelho do cartão (a ameaça)
  etiqueta: string; // etiqueta do personagem
};

export const capaEp01: CapaProps = {
  serie: 'BILHETE NA PORTA',
  episodio: 1,
  faixa: 'FALTAM 29 NOITES',
  gancho: '2 BILHETES EM UMA NOITE',
  cartaoTexto: ['Se contar pra alguém,', 'eu conto o', 'seu segredo.'],
  cartaoRotulo: ['O SEGREDO DELE', 'ESTÁ EM JOGO 👀'],
  etiqueta: 'TÉC. DE ELEVADOR · TÉRREO',
};

const F = 'Inter, Arial, sans-serif';

export const Capa: React.FC<CapaProps> = (p) => {
  const ep = `EPISÓDIO `;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg viewBox="0 0 540 960" width={1080} height={1920}>
        <Corredor sombraOp={0.55} bilheteNoChao={false} feixe={false} portaAberta />
        <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.35} />

        {/* nome da série */}
        <g fontFamily={F}>
          <rect x={170} y={128} width={200} height={32} rx={16} fill="#fff" {...Tf} />
          <text x={270} y={150} fontSize={15} fontWeight="900" textAnchor="middle" fill={C.hud}>
            {p.serie}
          </text>
        </g>

        {/* EPISÓDIO N */}
        <text x={270} y={222} fontSize={52} fontWeight="900" textAnchor="middle" fontFamily={F} stroke="#000" strokeWidth={8} paintOrder="stroke">
          <tspan fill="#fff">{ep}</tspan>
          <tspan fill={C.acento}>{p.episodio}</tspan>
        </text>

        {/* faixa inclinada com o placar */}
        <g transform="rotate(-3 270 268)" fontFamily={F}>
          <rect x={95} y={240} width={350} height={60} rx={8} fill="#000" opacity={0.35} transform="translate(4,5)" />
          <rect x={95} y={240} width={350} height={60} rx={8} fill={C.acento} stroke={C.hud} strokeWidth={4} />
          <text x={270} y={283} fontSize={33} fontWeight="900" textAnchor="middle" fill={C.hud}>
            {p.faixa}
          </text>
        </g>

        {/* selinho com o gancho */}
        <g fontFamily={F}>
          <rect x={120} y={318} width={300} height={30} rx={15} fill={C.hud} stroke="#fff" strokeWidth={2.5} />
          <text x={270} y={338.5} fontSize={14} fontWeight="900" textAnchor="middle" fill="#fff">
            {p.gancho}
          </text>
        </g>

        {/* Rodnei no centro, segurando o bilhete */}
        <Rodnei
          x={215}
          y={835}
          escala={1.08}
          frame={20}
          maoD="bilhete"
          bracoD={{ombro: 20, cotovelo: 100}}
          olhar={[0, 0]}
          boca="o"
          medo
          suor
        />

        {/* etiqueta do personagem */}
        <g fontFamily={F} transform="rotate(-2 115 410)">
          <rect x={20} y={397} width={190} height={26} rx={5} fill="#fff" {...Tf} />
          <text x={115} y={415} fontSize={12} fontWeight="900" textAnchor="middle" fill={C.hud}>
            {p.etiqueta}
          </text>
        </g>

        {/* cartão inclinado com o bilhete e a ameaça */}
        <g transform="rotate(6 420 520)" fontFamily={F}>
          <rect x={336} y={404} width={170} height={176} rx={6} fill="#000" opacity={0.35} transform="translate(5,6)" />
          <rect x={336} y={404} width={170} height={176} rx={6} fill="#f6efdc" {...T} />
          <rect x={348} y={416} width={146} height={118} fill="#3b3550" />
          <g transform="rotate(-4 421 475)">
            <rect x={356} y={426} width={130} height={98} fill={C.papel} {...Tf} />
            {p.cartaoTexto.map((l, i) => (
              <text key={i} x={364} y={452 + i * 24} fontSize={13.5} fontStyle="italic" fontFamily="FreeSerif, 'DejaVu Serif', serif" fill="#1f2a5a">
                {l}
              </text>
            ))}
          </g>
          <rect x={344} y={542} width={154} height={46} rx={6} fill="#e0463a" stroke="#fff" strokeWidth={2} />
          {p.cartaoRotulo.map((l, i) => (
            <text key={i} x={421} y={561 + i * 17} fontSize={12.5} fontWeight="900" textAnchor="middle" fill="#fff">
              {l}
            </text>
          ))}
        </g>

      </svg>
    </AbsoluteFill>
  );
};
