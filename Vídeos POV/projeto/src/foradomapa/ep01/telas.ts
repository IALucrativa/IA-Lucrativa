import * as THREE from 'three';

// Telas do celular do Motoca (desenhadas em canvas). Cada estado vira uma textura.
export type Tela = 'placar' | 'audio' | 'ganhos' | 'pedido' | 'aceito' | 'recalculando' | 'final' | 'mensagem';

const W = 360;
const H = 720;

const cabecalho = (g: CanvasRenderingContext2D, caixa: boolean) => {
  g.fillStyle = '#ffcc33';
  g.fillRect(0, 0, W, caixa ? 140 : 104);
  g.fillStyle = '#0f1420';
  g.textAlign = 'center';
  g.font = '900 36px Inter, sans-serif';
  g.fillText('NOITE 1/15', W / 2, 44);
  g.font = '800 30px Inter, sans-serif';
  g.fillText('DEVE R$ 5.000', W / 2, 84);
  if (caixa) g.fillText('CAIXA R$ 150', W / 2, 122);
};

const mapa = (g: CanvasRenderingContext2D, y: number, h: number, vazio = false) => {
  g.fillStyle = '#1b2333';
  g.fillRect(16, y, W - 32, h);
  if (!vazio) {
    g.strokeStyle = '#2c3a52';
    g.lineWidth = 10;
    g.beginPath();
    g.moveTo(16, y + h * 0.75);
    g.lineTo(200, y + h * 0.45);
    g.lineTo(200, y);
    g.moveTo(80, y);
    g.lineTo(140, y + h);
    g.stroke();
  }
  g.fillStyle = '#ffcc33';
  g.beginPath();
  g.arc(130, y + h * 0.6, 13, 0, Math.PI * 2);
  g.fill();
};

const balao = (g: CanvasRenderingContext2D, y: number, linhas: string[], titulo: string) => {
  const h = 70 + linhas.length * 38;
  g.fillStyle = '#26324a';
  g.beginPath();
  g.roundRect(20, y, W - 40, h, 18);
  g.fill();
  g.fillStyle = '#ffcc33';
  g.textAlign = 'left';
  g.font = '800 26px Inter, sans-serif';
  g.fillText(titulo, 40, y + 40);
  g.fillStyle = '#ffffff';
  g.font = '600 28px Inter, sans-serif';
  linhas.forEach((l, i) => g.fillText(l, 40, y + 80 + i * 38));
};

export const desenhaTela = (tela: Tela): THREE.Texture => {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0f1420';
  g.fillRect(0, 0, W, H);
  const caixa = tela === 'final' || tela === 'mensagem';
  cabecalho(g, caixa);
  g.textAlign = 'center';

  if (tela === 'placar') {
    mapa(g, 124, 440);
    g.fillStyle = '#8fa0bf';
    g.font = '700 28px Inter, sans-serif';
    g.fillText('Aguardando pedidos...', W / 2, 620);
  }
  if (tela === 'audio') {
    mapa(g, 124, 230);
    g.fillStyle = '#26324a';
    g.beginPath();
    g.roundRect(20, 390, W - 40, 150, 18);
    g.fill();
    g.fillStyle = '#ffcc33';
    g.textAlign = 'left';
    g.font = '800 26px Inter, sans-serif';
    g.fillText('Seu Vando', 40, 430);
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.moveTo(44, 460);
    g.lineTo(44, 510);
    g.lineTo(80, 485);
    g.fill();
    for (let i = 0; i < 26; i++) {
      const h = 8 + Math.abs(Math.sin(i * 1.7)) * 34;
      g.fillStyle = i < 9 ? '#ffcc33' : '#8fa0bf';
      g.fillRect(96 + i * 8.4, 485 - h / 2, 5, h);
    }
    g.fillStyle = '#8fa0bf';
    g.font = '600 22px Inter, sans-serif';
    g.textAlign = 'right';
    g.fillText('0:07', W - 40, 528);
  }
  if (tela === 'ganhos') {
    g.textAlign = 'left';
    g.font = '800 28px Inter, sans-serif';
    g.fillStyle = '#8fa0bf';
    g.fillText('Entregas de hoje', 30, 160);
    const itens: [string, string][] = [
      ['Pizzaria', '+R$ 12'],
      ['Farmácia', '+R$ 9'],
      ['Lanches', '+R$ 15'],
    ];
    itens.forEach(([n, v], i) => {
      g.fillStyle = '#1b2333';
      g.fillRect(20, 190 + i * 96, W - 40, 80);
      g.fillStyle = '#ffffff';
      g.font = '700 30px Inter, sans-serif';
      g.textAlign = 'left';
      g.fillText(n, 40, 242 + i * 96);
      g.fillStyle = '#2bd17e';
      g.font = '900 32px Inter, sans-serif';
      g.textAlign = 'right';
      g.fillText(v, W - 40, 242 + i * 96);
    });
  }
  if (tela === 'pedido' || tela === 'aceito') {
    g.fillStyle = '#ff5a4f';
    g.fillRect(0, 104, W, 56);
    g.fillStyle = '#ffffff';
    g.font = '900 30px Inter, sans-serif';
    g.fillText('NOVO PEDIDO', W / 2, 143);
    g.fillStyle = '#ffffff';
    g.font = '800 32px Inter, sans-serif';
    g.fillText('Lanche infantil', W / 2, 220);
    g.fillStyle = '#c9d3e6';
    g.font = '600 28px Inter, sans-serif';
    g.fillText('Rua sem nome, s/n', W / 2, 266);
    mapa(g, 300, 220, true);
    g.fillStyle = '#ff5a4f';
    g.font = '900 28px Inter, sans-serif';
    g.fillText('ENDEREÇO NÃO', W / 2, 560);
    g.fillText('ENCONTRADO', W / 2, 594);
    g.fillStyle = tela === 'aceito' ? '#ffcc33' : '#2bd17e';
    g.fillRect(40, 626, W - 80, 66);
    g.fillStyle = '#0f1420';
    g.font = '900 30px Inter, sans-serif';
    g.fillText(tela === 'aceito' ? 'ACEITO ✓' : 'ACEITAR', W / 2, 670);
  }
  if (tela === 'recalculando') {
    mapa(g, 124, 440, true);
    g.fillStyle = '#ffffff';
    g.font = '900 32px Inter, sans-serif';
    g.fillText('Recalculando...', W / 2, 330);
    g.strokeStyle = '#ffcc33';
    g.lineWidth = 8;
    g.beginPath();
    g.arc(W / 2, 420, 40, 0.3, Math.PI * 1.7);
    g.stroke();
    g.fillStyle = '#ff5a4f';
    g.font = '800 26px Inter, sans-serif';
    g.fillText('Rua sem nome, s/n', W / 2, 620);
  }
  if (tela === 'final') {
    mapa(g, 160, 400);
  }
  if (tela === 'mensagem') {
    mapa(g, 160, 200);
    balao(g, 390, ['Amanhã, 22h, na avenida.', 'Traz o que tiver.'], 'Seu Vando');
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
