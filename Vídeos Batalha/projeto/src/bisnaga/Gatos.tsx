import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Estilo, Peca, texturaCanvas, useMaterial} from './Cena3D';

// Gato sentado, de frente para a câmera. Serve para o Bisnaga acordado e para os soldados.
// Medidas em metros; o gato cabe em ~0,7 m de altura com as orelhas.

export type Pelagem =
  | {tipo: 'listrado'; base: string; listra: string}
  | {tipo: 'manchas'; base: string; manchas: string[]}
  | {tipo: 'liso'; base: string};

export type Acessorio = 'farinha' | 'acougue' | 'feirante' | 'loterica' | 'salao' | 'nenhum';

export type GatoProps = {
  estilo: Estilo;
  pelagem: Pelagem;
  peito?: string; // cor do peito e do focinho
  gordura?: number; // 1 = normal
  tamanho?: number;
  olhos?: 'abertos' | 'fechados' | 'meio';
  boca?: 'fechada' | 'aberta';
  corOlho?: string;
  acessorio?: Acessorio;
  pos?: [number, number, number];
  giro?: number;
};

const texturaPelagem = (p: Pelagem) =>
  texturaCanvas(256, 128, (c) => {
    c.fillStyle = p.base;
    c.fillRect(0, 0, 256, 128);
    if (p.tipo === 'listrado') {
      c.fillStyle = p.listra;
      for (let i = 0; i < 10; i++) {
        c.beginPath();
        c.ellipse(i * 26 + 10, 64, 6, 70, 0.15, 0, Math.PI * 2);
        c.fill();
      }
    }
    if (p.tipo === 'manchas') {
      p.manchas.forEach((cor, k) => {
        c.fillStyle = cor;
        for (let i = 0; i < 4; i++) {
          c.beginPath();
          c.ellipse(((i * 67 + k * 31) % 256) + 10, ((i * 41 + k * 53) % 110) + 10, 30, 22, i, 0, Math.PI * 2);
          c.fill();
        }
      });
    }
  });

export const GatoSentado: React.FC<GatoProps> = ({
  estilo,
  pelagem,
  peito = '#fff8ec',
  gordura = 1,
  tamanho = 1,
  olhos = 'abertos',
  boca = 'fechada',
  corOlho = '#9bd44a',
  acessorio = 'nenhum',
  pos = [0, 0, 0],
  giro = 0,
}) => {
  const m = useMaterial(estilo);
  const tex = useMemo(() => texturaPelagem(pelagem), [pelagem]);
  const pelo = m(pelagem.base, {mapa: tex});
  const base = m(pelagem.base);
  const claro = m(peito);
  const rosa = m('#f29aa8');
  const preto = m('#1a1210');
  const branco = m('#ffffff');
  const iris = m(corOlho);
  const g = gordura;

  const rabo = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 0.06, -0.14),
      new THREE.Vector3(0.24, 0.04, -0.06),
      new THREE.Vector3(0.27, 0.04, 0.1),
      new THREE.Vector3(0.18, 0.05, 0.2),
    ]);
    return new THREE.TubeGeometry(curva, 24, 0.035, estilo === 'lowpoly' ? 6 : 12, false);
  }, [estilo]);

  const yCab = 0.5;
  return (
    <group position={pos} rotation={[0, giro, 0]} scale={[tamanho, tamanho, tamanho]}>
      {/* quadris e corpo */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.13 * g, 0.12, 0.14 * g]} pos={[0.1 * g, 0.12, -0.03]} mat={pelo} estilo={estilo} contorno={0.08} />
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.13 * g, 0.12, 0.14 * g]} pos={[-0.1 * g, 0.12, -0.03]} mat={pelo} estilo={estilo} contorno={0.08} />
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.16 * g, 0.24, 0.14 * g]} pos={[0, 0.27, 0]} mat={pelo} estilo={estilo} contorno={0.06} />
      {/* peito claro */}
      <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.09 * g, 0.15, 0.05]} pos={[0, 0.3, 0.1 * g]} mat={claro} estilo={estilo} contorno={0} />
      {/* patas da frente */}
      {[-1, 1].map((l) => (
        <group key={l}>
          <Peca forma={{tipo: 'cilindro', r: 0.035, h: 0.22}} pos={[l * 0.06 * g, 0.12, 0.09 * g]} mat={base} estilo={estilo} contorno={0.006} />
          <Peca
            forma={{tipo: 'esfera', r: 1}}
            esc={[0.045, 0.03, 0.055]}
            pos={[l * 0.06 * g, 0.02, 0.11 * g]}
            mat={acessorio === 'farinha' ? branco : claro}
            estilo={estilo}
            contorno={0.1}
          />
        </group>
      ))}
      {/* rabo */}
      <mesh geometry={rabo} material={pelo} castShadow />

      {/* cabeça */}
      <group position={[0, yCab, 0.03]}>
        <Peca forma={{tipo: 'esfera', r: 0.13}} esc={[1.08, 0.92, 0.95]} mat={pelo} estilo={estilo} contorno={0.008} />
        {/* orelhas */}
        {[-1, 1].map((l) => (
          <group key={l}>
            <Peca forma={{tipo: 'cone', r: 0.05, h: 0.1}} pos={[l * 0.08, 0.12, -0.01]} rot={[0, 0, -l * 0.35]} mat={base} estilo={estilo} />
            <Peca forma={{tipo: 'cone', r: 0.028, h: 0.06}} pos={[l * 0.078, 0.11, 0.022]} rot={[0, 0, -l * 0.35]} mat={rosa} estilo={estilo} contorno={0} />
          </group>
        ))}
        {/* bochechas (focinho) */}
        {[-1, 1].map((l) => (
          <Peca key={l} forma={{tipo: 'esfera', r: 0.045}} esc={[1, 0.85, 0.9]} pos={[l * 0.035, -0.045, 0.1]} mat={acessorio === 'farinha' ? branco : claro} estilo={estilo} contorno={0.004} />
        ))}
        <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.022, 0.016, 0.014]} pos={[0, -0.018, 0.138]} mat={rosa} estilo={estilo} contorno={0} />
        {/* farinha no focinho e na testa do Bisnaga */}
        {acessorio === 'farinha' && (
          <>
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.035, 0.015, 0.02]} pos={[0.04, 0.07, 0.11]} mat={branco} estilo={estilo} contorno={0} />
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.02, 0.012, 0.015]} pos={[-0.05, 0.085, 0.105]} mat={branco} estilo={estilo} contorno={0} />
          </>
        )}
        {/* boca aberta (grito) */}
        {boca === 'aberta' && <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.04, 0.035, 0.02]} pos={[0, -0.085, 0.115]} mat={m('#5a1a22')} estilo={estilo} contorno={0} />}
        {/* olhos */}
        {[-1, 1].map((l) =>
          olhos === 'fechados' ? (
            <Peca key={l} forma={{tipo: 'caixa', d: [0.05, 0.009, 0.01]}} pos={[l * 0.05, 0.025, 0.118]} rot={[0, 0, l * 0.15]} mat={preto} estilo={estilo} contorno={0} />
          ) : (
            <group key={l} position={[l * 0.05, 0.028, 0.112]}>
              <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.028, olhos === 'meio' ? 0.014 : 0.03, 0.012]} mat={iris} estilo={estilo} contorno={0.3} />
              <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.009, olhos === 'meio' ? 0.012 : 0.024, 0.006]} pos={[0, 0, 0.008]} mat={preto} estilo={estilo} contorno={0} />
              <Peca forma={{tipo: 'esfera', r: 0.006}} pos={[0.008, 0.008, 0.013]} mat={branco} estilo={estilo} contorno={0} />
              {olhos === 'meio' && (
                <Peca forma={{tipo: 'caixa', d: [0.06, 0.02, 0.02]}} pos={[0, 0.016, 0.004]} mat={base} estilo={estilo} contorno={0} />
              )}
            </group>
          ),
        )}

        {/* acessórios de cabeça */}
        {acessorio === 'feirante' && (
          <group position={[0, 0.1, 0]} rotation={[-0.15, 0, 0]}>
            <Peca forma={{tipo: 'esfera', r: 0.12}} esc={[1, 0.55, 1]} mat={m('#2e8b57')} estilo={estilo} />
            <Peca forma={{tipo: 'caixa', d: [0.16, 0.012, 0.12]}} pos={[0, -0.005, 0.15]} mat={m('#2e8b57')} estilo={estilo} />
          </group>
        )}
        {acessorio === 'loterica' && (
          <group position={[0, 0.07, 0]}>
            <Peca forma={{tipo: 'cilindro', r: 0.135, h: 0.03}} esc={[1.05, 1, 1]} mat={m('#1d5fbf')} estilo={estilo} contorno={0.004} />
            <Peca forma={{tipo: 'caixa', d: [0.22, 0.01, 0.12]}} pos={[0, 0, 0.17]} rot={[0.25, 0, 0]} mat={m('#3fa9f5')} estilo={estilo} />
          </group>
        )}
        {acessorio === 'salao' && (
          <>
            {/* topete arrumado e dois rolinhos cor-de-rosa */}
            <Peca forma={{tipo: 'esfera', r: 1}} esc={[0.06, 0.045, 0.06]} pos={[0, 0.12, 0.05]} rot={[0.5, 0, 0]} mat={claro} estilo={estilo} contorno={0.05} />
            {[-1, 1].map((l) => (
              <Peca key={l} forma={{tipo: 'cilindro', r: 0.026, h: 0.07}} pos={[l * 0.07, 0.115, 0.04]} rot={[0, 0, Math.PI / 2]} mat={m('#ff7eb6')} estilo={estilo} />
            ))}
          </>
        )}
      </group>

      {/* acessórios de corpo */}
      {acessorio === 'acougue' && (
        <>
          {/* avental curvo, colado no corpo, com alça no pescoço */}
          <Peca forma={{tipo: 'cilindro', r: 0.15 * g, h: 0.22}} pos={[0, 0.23, 0.005]} esc={[1.02, 1, 0.98]} mat={m('#f4f4f4')} estilo={estilo} contorno={0.004} />
          <Peca forma={{tipo: 'cilindro', r: 0.151 * g, h: 0.018}} pos={[0, 0.29, 0.005]} esc={[1.02, 1, 0.98]} mat={m('#c0392b')} estilo={estilo} contorno={0} />
          <Peca forma={{tipo: 'cilindro', r: 0.151 * g, h: 0.018}} pos={[0, 0.17, 0.005]} esc={[1.02, 1, 0.98]} mat={m('#c0392b')} estilo={estilo} contorno={0} />
          <Peca forma={{tipo: 'cilindro', r: 0.085, h: 0.02}} pos={[0, 0.42, 0.01]} mat={m('#f4f4f4')} estilo={estilo} contorno={0.004} />
          {/* linguiça entre as patas */}
          <Peca forma={{tipo: 'cilindro', r: 0.025, h: 0.2}} pos={[0, 0.06, 0.2 * g]} rot={[0, 0, Math.PI / 2]} mat={m('#9b3b2a')} estilo={estilo} />
        </>
      )}
      {acessorio === 'loterica' && (
        <Peca forma={{tipo: 'caixa', d: [0.09, 0.005, 0.06]}} pos={[0.06, 0.045, 0.17]} rot={[0, 0.3, 0]} mat={m('#fff6c8')} estilo={estilo} />
      )}
      {acessorio === 'feirante' && (
        <Peca forma={{tipo: 'caixa', d: [0.2, 0.12, 0.14]}} pos={[-0.32, 0.06, 0.02]} mat={m('#b5793f')} estilo={estilo} />
      )}
    </group>
  );
};
