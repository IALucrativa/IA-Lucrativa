import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Estilo, Peca, texturaCanvas, useMaterial, aleatorio} from '../bisnaga/Cena3D';

// Série "1 Seu Casco contra 10.000": o Seu Casco, os jabutis do exército e as lesmas.
// Todo jabuti olha para +z (a cabeça fica em z positivo).

export type TipoJabuti = 'COMUM' | 'ACADEMIA' | 'CROCHE' | 'PATINETE' | 'OBRA' | 'HEROI';
type Vec = [number, number, number];

const PELE = '#8f9a5c';
const PELE_HEROI = '#7d8458';

// casco em placas: hexágonos desenhados numa textura
const texCasco = (base: string, linha: string, semente: number) =>
  texturaCanvas(256, 128, (c) => {
    c.fillStyle = base;
    c.fillRect(0, 0, 256, 128);
    const r = aleatorio(semente);
    c.strokeStyle = linha;
    c.lineWidth = 5;
    const R = 22;
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 8; col++) {
        const cx = col * 36 + (row % 2) * 18;
        const cy = row * 30 + 6;
        c.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 3) * k + Math.PI / 6;
          c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.8);
        }
        c.closePath();
        c.fillStyle = `rgba(255,230,160,${0.05 + r() * 0.12})`;
        c.fill();
        c.stroke();
      }
  });

// capinha de crochê: quadradinhos coloridos
const texCroche = () =>
  texturaCanvas(256, 128, (c) => {
    const cores = ['#e8577a', '#f4c430', '#5bb6e0', '#8bd16a', '#b07ad8', '#ff8c42'];
    for (let i = 0; i < 16; i++)
      for (let j = 0; j < 8; j++) {
        c.fillStyle = '#fbf3e4';
        c.fillRect(i * 16, j * 16, 16, 16);
        c.fillStyle = cores[(i * 3 + j * 5) % cores.length];
        c.fillRect(i * 16 + 3, j * 16 + 3, 10, 10);
        c.fillStyle = cores[(i + j * 2 + 2) % cores.length];
        c.fillRect(i * 16 + 6, j * 16 + 6, 4, 4);
      }
  });

export const useMatsJabuti = (estilo: Estilo) => {
  const m = useMaterial(estilo);
  const t = useMemo(
    () => ({
      comum: texCasco('#6b5a32', '#3c2f17', 3),
      heroi: texCasco('#4a3f2c', '#241c10', 9),
      croche: texCroche(),
    }),
    [],
  );
  return {
    m,
    cascoComum: m('#ffffff', {mapa: t.comum}),
    cascoHeroi: m('#ffffff', {mapa: t.heroi}),
    cascoCroche: m('#ffffff', {mapa: t.croche}),
    borda: m('#3a2e18'),
    bordaHeroi: m('#2c2416'),
    plastrao: m('#d8c27a'),
    pele: m(PELE),
    peleHeroi: m(PELE_HEROI),
    olho: m('#141010'),
    brilho: m('#ffffff'),
    esparadrapo: m('#f3ead2'),
    alface: m('#7fcf4a'),
    faixa: m('#e8333a'),
    capacete: m('#f6c21c', {brilho: 0.5}),
    deck: m('#29a3d9'),
    roda: m('#222428'),
    cano: m('#c9ced6', {brilho: 0.7}),
  };
};
export type MatsJabuti = ReturnType<typeof useMatsJabuti>;

export const Jabuti: React.FC<{
  estilo: Estilo;
  mats: MatsJabuti;
  tipo: TipoJabuti;
  pos: Vec;
  giro?: number;
  esc?: number;
  passo?: number; // fase da caminhada (rad); anda quando 'andando' > 0
  andando?: number;
  escondido?: number; // 0..1: cabeça e patas para dentro do casco
  costas?: number; // 0..1: capotado de barriga para cima
  pataNoAr?: number; // 0..1: a pata da frente levantada (o "partiu" do Seu Casco)
  mastiga?: number; // 0..1: a boca mexendo
  olhar?: number; // giro da cabeça (rad)
}> = ({estilo, mats, tipo, pos, giro = 0, esc = 1, passo = 0, andando = 0, escondido = 0, costas = 0, pataNoAr = 0, mastiga = 0, olhar = 0}) => {
  const heroi = tipo === 'HEROI';
  const pele = heroi ? mats.peleHeroi : mats.pele;
  const casco = heroi ? mats.cascoHeroi : tipo === 'CROCHE' ? mats.cascoCroche : mats.cascoComum;
  const sobe = tipo === 'PATINETE' ? 0.045 : 0;
  const dentro = Math.min(1, escondido);
  const capota = Math.min(1, costas);
  // as patas de quem capotou ficam balançando no ar
  const balanca = capota > 0 ? Math.sin(passo * 3) * 0.6 * capota : 0;
  const patas: {p: Vec; fase: number}[] = [
    {p: [0.095, 0.03, 0.09], fase: 0},
    {p: [-0.095, 0.03, 0.09], fase: Math.PI},
    {p: [0.095, 0.03, -0.09], fase: Math.PI},
    {p: [-0.095, 0.03, -0.09], fase: 0},
  ];
  const cabZ = 0.205 - 0.075 * dentro;
  const cabY = 0.075 + Math.sin(passo * 2) * 0.006 * andando;
  return (
    <group position={[pos[0], pos[1] + sobe + capota * 0.13, pos[2]]} rotation={[0, giro, Math.PI * capota]} scale={[esc, esc, esc]}>
      {/* casco */}
      <Peca forma={{tipo: 'cupula', r: 1}} esc={[0.13, 0.095, 0.16]} pos={[0, 0.045, 0]} mat={casco} estilo={estilo} contorno={0.06} />
      <Peca forma={{tipo: 'cilindro', r: 0.135, h: 0.022}} esc={[1, 1, 1.2]} pos={[0, 0.042, 0]} mat={heroi ? mats.bordaHeroi : mats.borda} estilo={estilo} contorno={0.006} />
      <Peca forma={{tipo: 'cilindro', r: 0.12, h: 0.012}} esc={[1, 1, 1.15]} pos={[0, 0.026, 0]} mat={mats.plastrao} estilo={estilo} contorno={0} />
      {/* patas */}
      {patas.map((pt, i) => {
        const lev = andando > 0 ? Math.max(0, Math.sin(passo + pt.fase)) * 0.025 * andando : 0;
        const ar = i === 0 ? pataNoAr * 0.05 : 0;
        return (
          <group key={i} position={[pt.p[0], pt.p[1] + lev + ar, pt.p[2] + (i === 0 ? pataNoAr * 0.03 : 0)]} rotation={[balanca * (i % 2 ? 1 : -1) - (i === 0 ? pataNoAr * 0.6 : 0), 0, 0]} scale={[1, 1 - dentro * 0.85, 1]}>
            <Peca forma={{tipo: 'cilindro', r: 0.03, r2: 0.026, h: 0.06}} mat={pele} estilo={estilo} contorno={0.006} />
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.034, 0.014, 0.038]} pos={[0, -0.026, 0.008]} mat={pele} estilo={estilo} contorno={0} />
          </group>
        );
      })}
      {/* rabinho */}
      <Peca forma={{tipo: 'cone', r: 0.016, h: 0.05}} pos={[0, 0.03, -0.19 + dentro * 0.03]} rot={[-Math.PI / 2 - 0.3, 0, 0]} mat={pele} estilo={estilo} contorno={0} />
      {/* pescoço e cabeça */}
      <group rotation={[0, olhar, 0]}>
        <Peca forma={{tipo: 'cilindro', r: 0.026, h: 0.08}} pos={[0, 0.06, 0.155 - 0.05 * dentro]} rot={[Math.PI / 2 - 0.35, 0, 0]} esc={[1, 1 - dentro * 0.7, 1]} mat={pele} estilo={estilo} contorno={0.006} />
        <group position={[0, cabY, cabZ]} scale={1 - dentro * 0.35}>
          <Peca forma={{tipo: 'esfera', r: 0.045}} esc={[1, 0.88, 1.25]} mat={pele} estilo={estilo} contorno={0.006} />
          {/* olhos: velhos, com a pálpebra caída */}
          {[1, -1].map((l) => (
            <group key={l} position={[l * 0.03, 0.013, 0.03]}>
              <Peca forma={{tipo: 'esfera', r: 0.011}} mat={mats.olho} estilo={estilo} contorno={0} />
              <Peca forma={{tipo: 'esfera', r: 0.0035}} pos={[l * 0.002, 0.004, 0.009]} mat={mats.brilho} estilo={estilo} contorno={0} />
              <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.014, 0.008, 0.013]} pos={[0, 0.008, 0]} mat={pele} estilo={estilo} contorno={0} />
            </group>
          ))}
          {/* boca */}
          <Peca forma={{tipo: 'caixa', d: [0.05, 0.004 + mastiga * 0.006, 0.004]}} pos={[0, -0.018, 0.05]} mat={mats.olho} estilo={estilo} contorno={0} />
          {heroi && (
            // a folha de alface no canto da boca
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.03, 0.006, 0.022]} pos={[0.038, -0.02, 0.045]} rot={[0.2, 0.6, -0.5 + mastiga * 0.2]} mat={mats.alface} estilo={estilo} contorno={0.2} />
          )}
          {tipo === 'ACADEMIA' && (
            <Peca forma={{tipo: 'cilindro', r: 0.046, h: 0.016}} esc={[1, 1, 1.22]} pos={[0, 0.018, -0.002]} rot={[0.15, 0, 0]} mat={mats.faixa} estilo={estilo} contorno={0.004} />
          )}
          {tipo === 'OBRA' && (
            <group position={[0, 0.026, -0.004]} rotation={[-0.12, 0, 0]}>
              <Peca forma={{tipo: 'cupula', r: 0.048}} esc={[1, 0.85, 1.15]} mat={mats.capacete} estilo={estilo} contorno={0.004} />
              <Peca forma={{tipo: 'cilindro', r: 0.056, h: 0.006}} esc={[1, 1, 1.25]} pos={[0, 0.002, 0.008]} mat={mats.capacete} estilo={estilo} contorno={0.004} />
            </group>
          )}
        </group>
      </group>
      {/* o esparadrapo em X no alto do casco do Seu Casco */}
      {heroi && (
        <group position={[0, 0.137, -0.005]}>
          <Peca forma={{tipo: 'caixa', d: [0.11, 0.006, 0.028]}} rot={[0, 0.65, 0]} mat={mats.esparadrapo} estilo={estilo} contorno={0.004} />
          <Peca forma={{tipo: 'caixa', d: [0.11, 0.007, 0.028]}} rot={[0, -0.65, 0]} mat={mats.esparadrapo} estilo={estilo} contorno={0.004} />
        </group>
      )}
      {tipo === 'PATINETE' && (
        <group position={[0, -0.045, 0]}>
          <Peca forma={{tipo: 'caixa', d: [0.12, 0.014, 0.38]}} pos={[0, 0.03, 0]} mat={mats.deck} estilo={estilo} contorno={0.004} />
          {[0.17, -0.17].map((z) => (
            <Peca key={z} forma={{tipo: 'cilindro', r: 0.024, h: 0.03}} pos={[0, 0.022, z]} rot={[0, 0, Math.PI / 2]} mat={mats.roda} estilo={estilo} contorno={0} />
          ))}
          <Peca forma={{tipo: 'cilindro', r: 0.008, h: 0.34}} pos={[0, 0.2, 0.2]} rot={[0.12, 0, 0]} mat={mats.cano} estilo={estilo} contorno={0.004} />
          <Peca forma={{tipo: 'cilindro', r: 0.008, h: 0.16}} pos={[0, 0.365, 0.22]} rot={[0, 0, Math.PI / 2]} mat={mats.cano} estilo={estilo} contorno={0.004} />
          {[0.07, -0.07].map((x) => (
            <Peca key={x} forma={{tipo: 'cilindro', r: 0.011, h: 0.04}} pos={[x, 0.365, 0.22]} rot={[0, 0, Math.PI / 2]} mat={mats.faixa} estilo={estilo} contorno={0} />
          ))}
        </group>
      )}
    </group>
  );
};

// ---------- Uma lesma ----------
export const useMatsLesma = (estilo: Estilo) => {
  const m = useMaterial(estilo);
  const pintas = useMemo(
    () =>
      texturaCanvas(128, 64, (c) => {
        c.fillStyle = '#a58a62';
        c.fillRect(0, 0, 128, 64);
        const r = aleatorio(21);
        c.fillStyle = '#6f5636';
        for (let i = 0; i < 40; i++) {
          c.beginPath();
          c.arc(r() * 128, r() * 64, 2 + r() * 4, 0, Math.PI * 2);
          c.fill();
        }
      }),
    [],
  );
  return {corpo: m('#ffffff', {mapa: pintas, brilho: 0.8}), pe: m('#c9b48e', {brilho: 0.8}), olho: m('#2a2018'), gosma: m('#c4705e', {brilho: 1})};
};
export type MatsLesma = ReturnType<typeof useMatsLesma>;

export const Lesma: React.FC<{estilo: Estilo; mats: MatsLesma; pos: Vec; giro?: number; esc?: number; t?: number; fase?: number; anda?: number; contorno?: boolean}> = ({
  estilo,
  mats,
  pos,
  giro = 0,
  esc = 1,
  t = 0,
  fase = 0,
  anda = 1,
  contorno = true,
}) => {
  const estica = 1 + Math.sin(t * 2.2 + fase) * 0.08 * anda;
  const ant = Math.sin(t * 1.7 + fase) * 0.25;
  return (
    <group position={pos} rotation={[0, giro, 0]} scale={[esc, esc, esc]}>
      {/* pé (a parte que encosta no chão) */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.03, 0.012, 0.09 * estica]} pos={[0, 0.01, 0]} mat={mats.pe} estilo={estilo} contorno={0} />
      {/* corpo com o manto */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.027, 0.026, 0.075 * estica]} pos={[0, 0.022, 0.012]} mat={mats.corpo} estilo={estilo} contorno={contorno ? 0.12 : 0} />
      {/* antenas com os olhos na ponta */}
      {[1, -1].map((l) => (
        <group key={l} position={[l * 0.01, 0.03, 0.075 * estica]} rotation={[0.55 + ant * 0.3, 0, l * (0.35 + ant * 0.2)]}>
          <Peca forma={{tipo: 'cilindro', r: 0.0035, h: 0.04}} pos={[0, 0.02, 0]} mat={mats.pe} estilo={estilo} contorno={0} />
          <Peca forma={{tipo: 'esfera', r: 0.0065}} pos={[0, 0.041, 0]} mat={mats.olho} estilo={estilo} contorno={0} />
        </group>
      ))}
    </group>
  );
};

// ---------- O rastro de gosma de uma lesma ----------
export const Gosma: React.FC<{mats: MatsLesma; pos: Vec; giro?: number; comp: number}> = ({mats, pos, giro = 0, comp}) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(0.035, 1), []);
  return (
    <mesh geometry={geo} material={mats.gosma} position={[pos[0], 0.002, pos[2]]} rotation={[-Math.PI / 2, 0, giro]} scale={[1, comp, 1]} />
  );
};
