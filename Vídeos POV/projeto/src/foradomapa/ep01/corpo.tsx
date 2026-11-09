import React from 'react';
import * as THREE from 'three';
import {P, Peca, basico, entre, mat, textura} from './kit';
import {desenhaTela, Tela} from './telas';
import {texturaEspelho} from '../texturas';

type V3 = [number, number, number];

// O Motoca: luvas (a direita com o dedo médio rasgado), mangas da jaqueta, moto e celular.
const LUVA = '#2e2e33';

// Luva vista de cima: costas da mão + 4 dedos dobrados. Origem no centro da mão.
export const Luva: React.FC<{lado: 1 | -1; rasgada?: boolean; esc?: number; dedoApontando?: number}> = ({lado, rasgada, esc = 1.7, dedoApontando = 0}) => {
  const mL = mat(LUVA);
  const mP = mat(P.pele);
  return (
    <group scale={esc}>
      <Peca forma={{tipo: 'esfera', r: 0.06}} material={mL} esc={[1, 0.5, 1.15]} />
      {[0, 1, 2, 3].map((i) => {
        const fx = -lado * 0.036 + lado * i * 0.024;
        const ponta = rasgada && i === 1;
        // o indicador (i = 0) pode esticar para apertar a tela
        const estica = i === 0 ? dedoApontando : 0;
        return (
          <group key={i} position={[fx, 0, 0]}>
            <Peca forma={{tipo: 'esfera', r: 0.014}} material={mL} pos={[0, 0.01, -0.045]} />
            <group position={[0, 0.003, -0.065 - estica * 0.03]} rotation={[Math.PI / 2.2 - estica * 1.2, 0, 0]}>
              <Peca forma={{tipo: 'cilindro', r: 0.012, h: 0.04 + estica * 0.03}} material={mL} />
            </group>
            <Peca forma={{tipo: 'esfera', r: 0.0125}} material={ponta ? mP : mL} pos={[0, -0.005 + estica * 0.012, -0.085 - estica * 0.05]} />
          </group>
        );
      })}
      <Peca forma={{tipo: 'cilindro', r: 0.012, h: 0.05}} material={mL} pos={[-lado * 0.06, -0.01, 0.03]} rot={[0.6, 0, lado * 1.1]} />
      <Peca forma={{tipo: 'cilindro', r: 0.045, h: 0.06}} material={mat(P.jaqueta)} pos={[0, 0.02, 0.07]} rot={[1.25, 0, lado * 0.15]} />
    </group>
  );
};

// Manga ligando o ombro (perto da câmera) até a mão
export const Braco: React.FC<{ombro: THREE.Vector3; mao: THREE.Vector3}> = ({ombro, mao}) => {
  const b = entre(ombro, mao.clone().add(new THREE.Vector3(0, 0.03, 0.1)));
  return <Peca forma={{tipo: 'cilindro', r: 0.06, r2: 0.048, h: b.comp}} material={mat(P.jaqueta)} pos={b.pos} rot={b.rot} />;
};

export const Celular: React.FC<{tela: Tela; pos: V3; rot: V3; esc?: number}> = ({tela, pos, rot, esc = 1}) => (
  <group position={pos} rotation={rot} scale={esc}>
    <Peca forma={{tipo: 'caixa', d: [0.085, 0.165, 0.012]}} material={mat('#141518')} />
    <Peca forma={{tipo: 'plano', d: [0.077, 0.152]}} material={basico('#ffffff', textura('tela-' + tela, () => desenhaTela(tela)), 'tela-' + tela)} pos={[0, 0, 0.0065]} />
  </group>
);

// A moto com o Motoca em cima. Origem = ponto no chão embaixo dos olhos.
// maoDireita: deslocamento da mão direita (para apertar o celular).
export const MotoComMotoca: React.FC<{tela: Tela; espelho?: 'poste' | 'muro'; maoDireita?: V3; dedo?: number}> = ({tela, espelho = 'poste', maoDireita = [0, 0, 0], dedo = 0}) => {
  const mPl = mat(P.plastico);
  const mMe = mat('#9aa0a8', {metal: 0.6, rugosidade: 0.4});
  const maoE = new THREE.Vector3(-0.33, 1.04, -0.53);
  const maoD = new THREE.Vector3(0.33 + maoDireita[0], 1.04 + maoDireita[1], -0.53 + maoDireita[2]);
  const haste = entre(new THREE.Vector3(-0.3, 1.0, -0.56), new THREE.Vector3(-0.44, 1.24, -0.66));
  const texEsp = textura('espelho-' + espelho, () => (espelho === 'muro' ? texturaEspelhoMuro() : texturaEspelho(P.ceu)));
  return (
    <group>
      {/* tanque, carenagem, painel */}
      <Peca forma={{tipo: 'esfera', r: 0.2}} material={mat('#4a1414', {rugosidade: 0.45, metal: 0.3})} pos={[0, 0.74, -0.36]} esc={[0.85, 0.45, 1.25]} />
      <Peca forma={{tipo: 'caixa', d: [0.34, 0.2, 0.24]}} material={mPl} pos={[0, 0.86, -0.78]} rot={[-0.35, 0, 0]} />
      <Peca forma={{tipo: 'cilindro', r: 0.06, h: 0.03}} material={mPl} pos={[0.1, 0.99, -0.66]} rot={[1.1, 0, 0]} />
      <Peca forma={{tipo: 'cilindro', r: 0.05, h: 0.004}} material={mat('#1d2a33', {emissivo: '#0c2a36'})} pos={[0.1, 1.006, -0.65]} rot={[1.1, 0, 0]} />
      {/* guidão e manoplas */}
      <Peca forma={{tipo: 'cilindro', r: 0.016, h: 0.62}} material={mMe} pos={[0, 1.0, -0.56]} rot={[0, 0, Math.PI / 2]} />
      {[-1, 1].map((l) => (
        <Peca key={l} forma={{tipo: 'cilindro', r: 0.022, h: 0.14}} material={mPl} pos={[l * 0.33, 1.0, -0.55]} rot={[0, 0, Math.PI / 2]} />
      ))}
      {/* retrovisor rachado */}
      <Peca forma={{tipo: 'cilindro', r: 0.008, h: haste.comp}} material={mMe} pos={haste.pos} rot={haste.rot} />
      <group position={[-0.45, 1.27, -0.67]} rotation={[0, 0.35, 0]}>
        <Peca forma={{tipo: 'caixa', d: [0.16, 0.11, 0.02]}} material={mPl} />
        <Peca forma={{tipo: 'plano', d: [0.14, 0.095]}} material={basico('#ffffff', texEsp, 'espelho-' + espelho)} pos={[0, 0, 0.012]} />
      </group>
      {/* suporte e celular */}
      <Peca forma={{tipo: 'cilindro', r: 0.008, h: 0.07}} material={mPl} pos={[0, 1.04, -0.58]} />
      <Celular tela={tela} pos={[0, 1.15, -0.55]} rot={[-0.5, 0, 0]} esc={1.3} />
      {/* braços e luvas */}
      <Braco ombro={new THREE.Vector3(-0.24, 1.18, 0.12)} mao={maoE} />
      <Braco ombro={new THREE.Vector3(0.24, 1.18, 0.12)} mao={maoD} />
      <group position={maoE.toArray() as V3}>
        <Luva lado={-1} />
      </group>
      <group position={maoD.toArray() as V3}>
        <Luva lado={1} rasgada dedoApontando={dedo} />
      </group>
    </group>
  );
};

// Mão direita livre (de pé, sem moto). ombro e mão em coordenadas do mundo.
export const MaoLivre: React.FC<{ombro: V3; mao: V3; rot?: V3; segura?: React.ReactNode}> = ({ombro, mao, rot = [0, 0, 0], segura}) => (
  <>
    <Braco ombro={new THREE.Vector3(...ombro)} mao={new THREE.Vector3(...mao)} />
    <group position={mao} rotation={rot}>
      <Luva lado={1} rasgada />
      {segura}
    </group>
  </>
);

// O retrovisor mostrando o muro (a rua sumiu)
const texturaEspelhoMuro = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const g = c.getContext('2d')!;
  g.fillStyle = '#07090f';
  g.fillRect(0, 0, 256, 192);
  g.fillStyle = '#5a5048';
  g.fillRect(0, 90, 256, 102);
  g.strokeStyle = 'rgba(0,0,0,0.5)';
  g.lineWidth = 2;
  for (let y = 100; y < 192; y += 16) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(256, y);
    g.stroke();
  }
  g.fillStyle = '#ffb347';
  g.beginPath();
  g.arc(200, 40, 8, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(150, 0);
  g.lineTo(140, 60);
  g.lineTo(170, 95);
  g.lineTo(150, 192);
  g.moveTo(140, 60);
  g.lineTo(100, 90);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
