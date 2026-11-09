import React from 'react';
import * as THREE from 'three';
import {P, Peca, basico, mat, textura} from './kit';
import {texturaJanelas} from '../texturas';

type V3 = [number, number, number];

const canvasTex = (w: number, h: number, desenha: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  desenha(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

// ========== Lanchonete ==========
const quadroMenu = () =>
  canvasTex(512, 256, (g) => {
    g.fillStyle = '#1d1a16';
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#ffcc33';
    g.font = '900 40px Inter, sans-serif';
    g.textAlign = 'center';
    g.fillText('LANCHES DA ESQUINA', 256, 52);
    g.font = '700 30px Inter, sans-serif';
    g.textAlign = 'left';
    g.fillStyle = '#f2e6d0';
    [['Coxinha', '7,00'], ['Pastel', '8,00'], ['Pão de queijo', '4,00'], ['Café', '3,00']].forEach(([n, v], i) => {
      g.fillText(n, 40, 108 + i * 40);
      g.textAlign = 'right';
      g.fillText('R$ ' + v, 472, 108 + i * 40);
      g.textAlign = 'left';
    });
  });

export const Lanchonete: React.FC<{maoPegouSalgado: boolean; moedasMovidas: number}> = ({maoPegouSalgado, moedasMovidas}) => {
  const parede = mat('#6b5a45');
  return (
    <>
      <Peca forma={{tipo: 'caixa', d: [6, 0.1, 6]}} material={mat('#3a332c')} pos={[0, -0.05, -1]} />
      <Peca forma={{tipo: 'caixa', d: [6, 3, 0.1]}} material={parede} pos={[0, 1.5, -2.4]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 3, 6]}} material={parede} pos={[-2.6, 1.5, -1]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 3, 6]}} material={parede} pos={[2.6, 1.5, -1]} />
      <Peca forma={{tipo: 'caixa', d: [6, 0.1, 6]}} material={mat('#2a2622')} pos={[0, 3, -1]} />
      {/* quadro de preços */}
      <Peca forma={{tipo: 'plano', d: [1.8, 0.9]}} material={basico('#ffffff', textura('menu', quadroMenu), 'menu')} pos={[0, 2.15, -2.34]} />
      {/* geladeira acesa */}
      <Peca forma={{tipo: 'caixa', d: [0.9, 1.9, 0.6]}} material={mat('#c8c8c8')} pos={[-1.8, 0.95, -2.0]} />
      <Peca forma={{tipo: 'plano', d: [0.75, 1.6]}} material={basico('#cfe8ff')} pos={[-1.8, 1.0, -1.69]} />
      {/* luz fria do teto */}
      <Peca forma={{tipo: 'caixa', d: [1.2, 0.04, 0.2]}} material={basico('#eaf4ff')} pos={[0, 2.95, -1]} />
      <pointLight position={[0, 2.7, -0.8]} intensity={18} distance={7} color="#e6f0ff" />
      {/* balcão */}
      <Peca forma={{tipo: 'caixa', d: [3.2, 1.0, 0.6]}} material={mat('#5c4632')} pos={[0, 0.5, -0.75]} />
      <Peca forma={{tipo: 'caixa', d: [3.3, 0.05, 0.7]}} material={mat('#8a8578', {rugosidade: 0.4})} pos={[0, 1.025, -0.75]} />
      {/* estufa de salgados */}
      <Peca forma={{tipo: 'caixa', d: [0.8, 0.35, 0.45]}} material={mat('#cfe6ff', {transparente: 0.25, rugosidade: 0.1})} pos={[-0.75, 1.23, -0.8]} />
      {[-0.95, -0.8, -0.65, -0.5].map((x, i) => (
        <Peca key={i} forma={{tipo: 'esfera', r: 0.05}} material={mat('#c07a2c')} pos={[x, 1.1, -0.8]} esc={[1, 0.8, 1.3]} />
      ))}
      <pointLight position={[-0.75, 1.3, -0.8]} intensity={1.5} distance={1} color="#ffcf8a" />
      {/* porta-guardanapo */}
      <Peca forma={{tipo: 'caixa', d: [0.12, 0.1, 0.06]}} material={mat('#9aa0a8', {metal: 0.6})} pos={[0.6, 1.1, -0.85]} />
      {/* moedas */}
      {[0, 1, 2, 3, 4].map((i) => {
        const anda = i < moedasMovidas ? 0.12 : 0;
        return (
          <Peca
            key={i}
            forma={{tipo: 'cilindro', r: 0.013, h: 0.003}}
            material={mat(i % 2 ? '#c9a24a' : '#b8bcc4', {metal: 0.8, rugosidade: 0.3})}
            pos={[0.18 + (i % 3) * 0.032 - anda, 1.052, -0.58 + Math.floor(i / 3) * 0.03 - anda * 0.5]}
          />
        );
      })}
      {/* o salgado no guardanapo */}
      <Peca forma={{tipo: 'plano', d: [0.14, 0.14]}} material={mat('#f2f0ea')} pos={[0.02, 1.051, -0.62]} rot={[-Math.PI / 2, 0, 0.3]} />
      {!maoPegouSalgado && <Peca forma={{tipo: 'esfera', r: 0.045}} material={mat('#c07a2c')} pos={[0.02, 1.075, -0.62]} esc={[1, 0.75, 1.4]} />}
    </>
  );
};

export const Salgado: React.FC = () => <Peca forma={{tipo: 'esfera', r: 0.045}} material={mat('#c07a2c')} pos={[0, -0.03, -0.11]} esc={[1, 0.75, 1.4]} />;

// ========== A casa do menino ==========
export const Casa: React.FC<{abertura: number; luzVaranda: boolean}> = ({abertura, luzVaranda}) => {
  const parede = mat('#6a5a4a');
  const z = -4.5;
  return (
    <>
      {/* chão: calçada e rua */}
      <Peca forma={{tipo: 'caixa', d: [30, 0.1, 30]}} material={mat(P.calcada)} pos={[0, -0.05, -2]} />
      {/* fachada com o vão da porta */}
      <Peca forma={{tipo: 'caixa', d: [3.0, 3.2, 0.3]}} material={parede} pos={[-2.0, 1.6, z]} />
      <Peca forma={{tipo: 'caixa', d: [3.0, 3.2, 0.3]}} material={parede} pos={[2.0, 1.6, z]} />
      <Peca forma={{tipo: 'caixa', d: [1.0, 1.1, 0.3]}} material={parede} pos={[0, 2.65, z]} />
      <Peca forma={{tipo: 'caixa', d: [7.4, 0.25, 1.2]}} material={mat('#3a2f28')} pos={[0, 3.3, z + 0.3]} />
      {/* degrau */}
      <Peca forma={{tipo: 'caixa', d: [1.6, 0.15, 0.5]}} material={mat('#5a5552')} pos={[0, 0.075, z + 0.4]} />
      {/* janela com cortina, luz fraca */}
      <Peca forma={{tipo: 'plano', d: [1.0, 0.9]}} material={basico('#3a2a1c')} pos={[-2.0, 1.6, z + 0.16]} />
      <Peca forma={{tipo: 'caixa', d: [1.1, 0.06, 0.1]}} material={mat('#2a2420')} pos={[-2.0, 1.12, z + 0.2]} />
      {/* o lado de dentro: escuro, com luz quente lá no fundo */}
      <Peca forma={{tipo: 'caixa', d: [2.4, 2.6, 0.1]}} material={mat('#2a2018')} pos={[0, 1.3, z - 2.4]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 2.6, 2.4]}} material={mat('#2a2018')} pos={[-1.2, 1.3, z - 1.2]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 2.6, 2.4]}} material={mat('#2a2018')} pos={[1.2, 1.3, z - 1.2]} />
      <Peca forma={{tipo: 'caixa', d: [2.4, 0.1, 2.4]}} material={mat('#2a2018')} pos={[0, 2.6, z - 1.2]} />
      <pointLight position={[0.6, 1.8, z - 1.8]} intensity={abertura > 0.05 ? 3 : 0} distance={4} color="#ffb070" />
      {/* a porta (dobradiça na esquerda) */}
      <group position={[-0.5, 1.05, z + 0.1]} rotation={[0, -abertura * 1.6, 0]}>
        <Peca forma={{tipo: 'caixa', d: [0.98, 2.08, 0.05]}} material={mat('#4a3020')} pos={[0.49, 0, 0]} />
        <Peca forma={{tipo: 'esfera', r: 0.03}} material={mat('#c9a24a', {metal: 0.8})} pos={[0.88, 0, 0.05]} />
      </group>
      {/* luz da varanda */}
      <Peca forma={{tipo: 'caixa', d: [0.22, 0.14, 0.12]}} material={luzVaranda ? basico('#ffd8a0') : mat('#2a2622')} pos={[0, 2.85, z + 0.25]} />
      {luzVaranda && <pointLight position={[0, 2.7, z + 0.7]} intensity={14} distance={7} decay={1.6} color="#ffc98a" />}
      {/* vizinhos */}
      {[-1, 1].map((l) => (
        <Peca
          key={l}
          forma={{tipo: 'caixa', d: [6, 6, 4]}}
          material={mat('#3f4448', {mapa: textura('viz' + l, () => texturaJanelas(l > 0 ? 31 : 47, '#3f4448', P.luzAcesa, P.luzApagada, 3, 2)), chaveMapa: 'viz' + l})}
          pos={[l * 6.6, 3, z - 1]}
        />
      ))}
      {/* poste ao longe */}
      <pointLight position={[-4, 5, 1]} intensity={20} distance={14} color={P.lampada} />
    </>
  );
};

// O menino de pijama, olhando para a câmera
export const Menino: React.FC<{pos: V3; bracosFrente?: number}> = ({pos, bracosFrente = 0}) => {
  const pijama = mat('#3d5a80');
  const pele = mat('#b98260');
  return (
    <group position={pos}>
      {[-1, 1].map((l) => (
        <Peca key={l} forma={{tipo: 'cilindro', r: 0.055, h: 0.55}} material={pijama} pos={[l * 0.07, 0.275, 0]} />
      ))}
      <Peca forma={{tipo: 'cilindro', r: 0.14, r2: 0.12, h: 0.48}} material={pijama} pos={[0, 0.78, 0]} />
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 0.16, 0.98, 0]} rotation={[-bracosFrente * 1.2, 0, l * 0.12]}>
          <Peca forma={{tipo: 'cilindro', r: 0.04, h: 0.42}} material={pijama} pos={[0, -0.21, 0]} />
          <Peca forma={{tipo: 'esfera', r: 0.04}} material={pele} pos={[0, -0.44, 0]} />
        </group>
      ))}
      <Peca forma={{tipo: 'cilindro', r: 0.045, h: 0.08}} material={pele} pos={[0, 1.05, 0]} />
      <Peca forma={{tipo: 'esfera', r: 0.13}} material={pele} pos={[0, 1.2, 0]} esc={[1, 1.08, 1]} />
      <Peca forma={{tipo: 'esfera', r: 0.137}} material={mat('#1a1410')} pos={[0, 1.27, -0.03]} esc={[1.02, 0.75, 1]} />
      {[-1, 1].map((l) => (
        <group key={l}>
          <Peca forma={{tipo: 'esfera', r: 0.022}} material={mat('#f2efe8', {rugosidade: 0.3})} pos={[l * 0.048, 1.2, 0.112]} />
          <Peca forma={{tipo: 'esfera', r: 0.012}} material={basico('#0b0b0b')} pos={[l * 0.048, 1.2, 0.13]} />
        </group>
      ))}
      <Peca forma={{tipo: 'caixa', d: [0.05, 0.008, 0.01]}} material={mat('#6a3a30')} pos={[0, 1.13, 0.125]} />
    </group>
  );
};

// ========== O quarto alugado ==========
const cedula = (valor: string, cor: string) =>
  canvasTex(256, 128, (g) => {
    g.fillStyle = cor;
    g.fillRect(0, 0, 256, 128);
    g.strokeStyle = 'rgba(0,0,0,0.25)';
    g.lineWidth = 6;
    g.strokeRect(8, 8, 240, 112);
    g.fillStyle = 'rgba(0,0,0,0.55)';
    g.font = '900 52px Inter, sans-serif';
    g.textAlign = 'right';
    g.fillText(valor, 236, 82);
    g.beginPath();
    g.arc(70, 64, 34, 0, Math.PI * 2);
    g.fillStyle = 'rgba(255,255,255,0.25)';
    g.fill();
  });

export const NOTAS: {valor: string; cor: string}[] = [
  {valor: '50', cor: '#d2a85a'},
  {valor: '50', cor: '#d2a85a'},
  {valor: '20', cor: '#e2c36a'},
  {valor: '20', cor: '#e2c36a'},
  {valor: '10', cor: '#b58ab8'},
];

export const Nota: React.FC<{valor: string; cor: string; pos: V3; rot?: number}> = ({valor, cor, pos, rot = 0}) => (
  <Peca forma={{tipo: 'plano', d: [0.15, 0.072]}} material={mat('#ffffff', {mapa: textura('nota' + valor, () => cedula(valor, cor)), chaveMapa: 'nota' + valor})} pos={pos} rot={[-Math.PI / 2, 0, rot]} />
);

export const Quarto: React.FC<{luz: number}> = ({luz}) => {
  const parede = mat('#4a4238');
  return (
    <>
      <Peca forma={{tipo: 'caixa', d: [4, 0.1, 4]}} material={mat('#3a3028')} pos={[0, -0.05, -1]} />
      <Peca forma={{tipo: 'caixa', d: [4, 2.7, 0.1]}} material={parede} pos={[0, 1.35, -2.0]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 2.7, 4]}} material={parede} pos={[-1.6, 1.35, -1]} />
      <Peca forma={{tipo: 'caixa', d: [0.1, 2.7, 4]}} material={parede} pos={[1.6, 1.35, -1]} />
      <Peca forma={{tipo: 'caixa', d: [4, 0.1, 4]}} material={mat('#2e2822')} pos={[0, 2.7, -1]} />
      {/* janela com a cidade */}
      <Peca forma={{tipo: 'plano', d: [1.0, 0.8]}} material={basico('#ffffff', textura('janelaq', () => texturaJanelas(77, '#101318', '#ffb347', '#141820', 6, 4)), 'janelaq')} pos={[-0.4, 1.6, -1.94]} />
      <Peca forma={{tipo: 'caixa', d: [1.1, 0.06, 0.08]}} material={mat('#2a2420')} pos={[-0.4, 1.17, -1.92]} />
      {/* cama */}
      <Peca forma={{tipo: 'caixa', d: [0.95, 0.4, 1.9]}} material={mat('#3a3a40')} pos={[1.05, 0.2, -1.0]} />
      <Peca forma={{tipo: 'caixa', d: [0.97, 0.08, 1.4]}} material={mat('#5a3a3a')} pos={[1.05, 0.44, -0.75]} />
      <Peca forma={{tipo: 'caixa', d: [0.6, 0.12, 0.35]}} material={mat('#c8c0b0')} pos={[1.05, 0.46, -1.7]} />
      {/* mesa */}
      <Peca forma={{tipo: 'caixa', d: [1.1, 0.04, 0.7]}} material={mat('#6a4a30')} pos={[0, 0.75, -0.55]} />
      {[[-0.5, -0.25], [0.5, -0.25], [-0.5, -0.85], [0.5, -0.85]].map(([x, z], i) => (
        <Peca key={i} forma={{tipo: 'caixa', d: [0.04, 0.73, 0.04]}} material={mat('#4a3420')} pos={[x, 0.365, z]} />
      ))}
      {/* luminária */}
      <Peca forma={{tipo: 'cilindro', r: 0.06, h: 0.02}} material={mat('#222')} pos={[-0.38, 0.78, -0.75]} />
      <Peca forma={{tipo: 'cilindro', r: 0.01, h: 0.3}} material={mat('#222')} pos={[-0.38, 0.93, -0.75]} />
      <Peca forma={{tipo: 'cilindro', r: 0.11, r2: 0.05, h: 0.12}} material={mat('#8a6a3a')} pos={[-0.38, 1.1, -0.75]} />
      <pointLight position={[-0.38, 1.02, -0.72]} intensity={4 * luz} distance={3.5} decay={1.5} color="#ffb870" />
      <pointLight position={[-0.4, 1.6, -1.6]} intensity={1.2 * luz} distance={3} color="#7088c0" />
    </>
  );
};
