import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, T, Tf} from './cores';
import {Kike} from './Kike';
import {Quarto} from './cenarios';

// Capa padrão dos episódios (1080×1920), mesma estrutura da capa do Bilhete na Porta.
// Tudo o que importa fica no meio (y 120–840 no desenho), que é o recorte 3:4 da grade do perfil.
export type CapaProps = {
  serie: string;
  episodio: number;
  faixa: string; // prazo, na faixa amarela inclinada
  gancho: string; // frase curta no selinho
  cartaoRemetente: string; // quem mandou a mensagem do cartão
  cartaoTexto: string[]; // a mensagem (a ameaça)
  cartaoRotulo: string[]; // rótulo vermelho do cartão
  etiqueta: string; // etiqueta do personagem
};

export const capaEp01: CapaProps = {
  serie: 'A POR EL GTA 6',
  episodio: 1,
  faixa: 'QUEDAN 6 DÍAS',
  gancho: 'SE LE QUEMÓ LA CONSOLA',
  cartaoRemetente: 'Borja (primo)',
  cartaoTexto: ['Primo, mañana', 'paso a por', 'MI consola.'],
  cartaoRotulo: ['¡Y NI SIQUIERA', 'ERA SUYA!'],
  etiqueta: 'REPARTIDOR · ESPERA DESDE 2013',
};

export const Capa: React.FC<CapaProps> = (p) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 960" width={1080} height={1920}>
      <Quarto frame={40} fumaca={1.1} brilho={0.5} />
      <rect x={0} y={0} width={540} height={960} fill="#0d0b14" opacity={0.3} />

      {/* nome da série */}
      <g fontFamily={F}>
        <rect x={160} y={128} width={220} height={32} rx={16} fill="#fff" {...Tf} />
        <text x={270} y={150} fontSize={15} fontWeight="900" textAnchor="middle" fill={C.hud}>
          {p.serie}
        </text>
      </g>

      {/* EPISÓDIO N */}
      <text x={270} y={222} fontSize={52} fontWeight="900" textAnchor="middle" fontFamily={F} stroke="#000" strokeWidth={8} paintOrder="stroke">
        <tspan fill="#fff">EPISODIO </tspan>
        <tspan fill={C.acento}>{p.episodio}</tspan>
      </text>

      {/* faixa inclinada com o prazo */}
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

      {/* o Kike no centro, abanando a fumaça com o boné */}
      <Kike x={175} y={835} escala={1.08} frame={20} bracoD={{ombro: -140, cotovelo: 30}} maoD="bone" boca="o" susto suor olhar={[1, 0]} />

      {/* etiqueta do personagem */}
      <g fontFamily={F} transform="rotate(-2 120 380)">
        <rect x={14} y={367} width={212} height={26} rx={5} fill="#fff" {...Tf} />
        <text x={120} y={385} fontSize={11.5} fontWeight="900" textAnchor="middle" fill={C.hud}>
          {p.etiqueta}
        </text>
      </g>

      {/* cartão inclinado com a mensagem e a ameaça */}
      <g transform="rotate(6 420 520)" fontFamily={F}>
        <rect x={336} y={404} width={170} height={190} rx={6} fill="#000" opacity={0.35} transform="translate(5,6)" />
        <rect x={336} y={404} width={170} height={190} rx={6} fill="#ece5dd" {...T} />
        <rect x={336} y={404} width={170} height={30} rx={6} fill="#2f6d5e" />
        <circle cx={354} cy={419} r={9} fill={BORJA_PELE} {...Tf} />
        <text x={368} y={424} fontSize={12} fontWeight="bold" fill="#fff">
          {p.cartaoRemetente}
        </text>
        <rect x={346} y={442} width={150} height={92} rx={8} fill="#fff" {...Tf} />
        {p.cartaoTexto.map((l, i) => (
          <text key={i} x={356} y={462 + i * 19} fontSize={14} fill="#111">
            {l}
          </text>
        ))}
        <rect x={344} y={544} width={154} height={46} rx={6} fill="#e0463a" stroke="#fff" strokeWidth={2} />
        {p.cartaoRotulo.map((l, i) => (
          <text key={i} x={421} y={563 + i * 17} fontSize={13} fontWeight="900" textAnchor="middle" fill="#fff">
            {l}
          </text>
        ))}
      </g>
    </svg>
  </AbsoluteFill>
);

const BORJA_PELE = '#c98a5e';
