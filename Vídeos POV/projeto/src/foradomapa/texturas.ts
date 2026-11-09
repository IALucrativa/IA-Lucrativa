import * as THREE from 'three';

// Texturas desenhadas em código (canvas): janelas dos prédios, tela do celular e espelho rachado.

const criarCanvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

// Pseudoaleatório fixo, para o desenho sair igual em todo quadro.
export const aleatorio = (semente: number) => {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const texturaJanelas = (
  semente: number,
  parede: string,
  luzAcesa: string,
  luzApagada: string,
  colunas = 4,
  andares = 6,
) => {
  const c = criarCanvas(256, 384);
  const g = c.getContext('2d')!;
  g.fillStyle = parede;
  g.fillRect(0, 0, c.width, c.height);
  const r = aleatorio(semente);
  const mw = c.width / colunas;
  const mh = c.height / andares;
  for (let y = 0; y < andares; y++) {
    for (let x = 0; x < colunas; x++) {
      const acesa = r() < 0.3;
      g.fillStyle = acesa ? luzAcesa : luzApagada;
      g.fillRect(x * mw + mw * 0.22, y * mh + mh * 0.2, mw * 0.56, mh * 0.55);
      // peitoril
      g.fillStyle = 'rgba(0,0,0,0.35)';
      g.fillRect(x * mw + mw * 0.18, y * mh + mh * 0.75, mw * 0.64, mh * 0.05);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const texturaCelular = () => {
  const c = criarCanvas(360, 720);
  const g = c.getContext('2d')!;
  // fundo do app
  g.fillStyle = '#0f1420';
  g.fillRect(0, 0, 360, 720);
  // mapa em branco (a rua sumiu)
  g.fillStyle = '#1b2333';
  g.fillRect(16, 120, 328, 400);
  g.strokeStyle = '#2c3a52';
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(16, 420);
  g.lineTo(200, 300);
  g.lineTo(200, 120);
  g.stroke();
  // ponto do Motoca
  g.fillStyle = '#ffcc33';
  g.beginPath();
  g.arc(120, 360, 14, 0, Math.PI * 2);
  g.fill();
  // aviso
  g.fillStyle = '#ff5a4f';
  g.font = 'bold 30px Inter, sans-serif';
  g.textAlign = 'center';
  g.fillText('ENDEREÇO NÃO', 180, 560);
  g.fillText('ENCONTRADO', 180, 596);
  // placar no topo
  g.fillStyle = '#ffcc33';
  g.fillRect(0, 0, 360, 100);
  g.fillStyle = '#0f1420';
  g.font = '900 34px Inter, sans-serif';
  g.fillText('NOITE 1/15', 180, 44);
  g.font = '800 30px Inter, sans-serif';
  g.fillText('DEVE R$ 5.000', 180, 84);
  // botão
  g.fillStyle = '#2bd17e';
  g.fillRect(40, 630, 280, 60);
  g.fillStyle = '#0f1420';
  g.font = '900 28px Inter, sans-serif';
  g.fillText('ACEITAR', 180, 670);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const texturaEspelho = (ceu: string) => {
  const c = criarCanvas(256, 192);
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 192);
  grad.addColorStop(0, ceu);
  grad.addColorStop(1, '#05070c');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 192);
  // um poste refletido
  g.fillStyle = '#ffd27a';
  g.beginPath();
  g.arc(70, 50, 10, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#2a2f3a';
  g.fillRect(66, 58, 8, 140);
  // a rachadura
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(150, 0);
  g.lineTo(140, 60);
  g.lineTo(170, 95);
  g.lineTo(150, 192);
  g.moveTo(140, 60);
  g.lineTo(100, 90);
  g.moveTo(170, 95);
  g.lineTo(230, 120);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const texturaFaixa = () => {
  const c = criarCanvas(512, 512);
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, 512, 512);
  g.fillStyle = 'rgba(235,235,225,0.95)';
  for (let i = 0; i < 7; i++) g.fillRect(i * 74 + 10, 0, 44, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
