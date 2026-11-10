// Cenários, etiquetas, legenda e topo da tela do Ep. 1.
// Tela: 720 x 1280 (vertical 9:16).

const W = 720, H = 1280;
const INK_ = '#2a2233';
const COR = {
  verde: '#1f9d55', vermelho: '#e5484d', amarelo: '#ffd23f', azul: '#2f6fe0',
  escuro: '#25213a', laranja: '#ff8a1f', roxo: '#6a3df0', branco: '#ffffff',
};

// ---------- utilidades de animação
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const easeOutBack = k => { k = clamp(k); const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function pisca(t, seed = 0) { // 0 aberto, 1 fechado
  const per = 3.1 + (seed % 3) * 0.37;
  const ph = (t + seed * 0.71) % per;
  return ph < 0.07 ? ph / 0.07 : ph < 0.14 ? 1 - (ph - 0.07) / 0.07 : 0;
}
const bob = (t, a = 4, f = 2.2, ph = 0) => Math.sin((t + ph) * f * Math.PI) * a;
const falando = t => Math.floor(t / 0.11) % 2 === 0;

// ---------- medida de texto (usa canvas com a fonte carregada)
const _ctx = (typeof document !== 'undefined') ? document.createElement('canvas').getContext('2d') : null;
function larguraTexto(txt, fs) {
  _ctx.font = `800 ${fs}px "Baloo 2", "Noto Color Emoji"`;
  return _ctx.measureText(txt).width;
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- etiqueta (retângulo arredondado com contorno, inclinado)
// t0: momento em que aparece (global). Aparece com um "pulo".
function etiqueta(t, t0, x, y, texto, cor = 'verde', { fs = 40, rot = -3, txt = '#fff', t1 = Infinity } = {}) {
  if (t < t0 || t > t1) return '';
  const k = easeOutBack((t - t0) / 0.28);
  const w = larguraTexto(texto, fs) + fs * 1.1;
  const h = fs * 1.55;
  const fill = COR[cor] || cor;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})">
    <rect x="${-w / 2 + 4}" y="${-h / 2 + 7}" width="${w}" height="${h}" rx="${h * 0.32}" fill="${INK_}"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * 0.32}" fill="${fill}" stroke="${INK_}" stroke-width="6"/>
    <text x="0" y="${fs * 0.36}" text-anchor="middle" class="t" font-size="${fs}" fill="${txt}">${esc(texto)}</text>
  </g>`;
}

// ---------- legenda karaokê
function legenda(ep, t, y = 1000) {
  const b = ep.legendas.find(b => t >= b.start && t < b.end);
  if (!b) return '';
  const txt = b.palavras.map(p => p.w.toUpperCase()).join(' ');
  let fs = 74;
  const wTot = larguraTexto(txt, fs);
  if (wTot > 650) fs = fs * 650 / wTot;
  const k = easeOutBack((t - b.start) / 0.16);
  const spans = b.palavras.map((p, i) => {
    const cor = p.hi ? COR.amarelo : '#fff';
    return `<tspan fill="${cor}">${esc(p.w.toUpperCase())}${i < b.palavras.length - 1 ? ' ' : ''}</tspan>`;
  }).join('');
  return `<g transform="translate(${W / 2},${y}) scale(${0.85 + 0.15 * k})">
    <text x="0" y="0" text-anchor="middle" class="t cap" font-size="${fs}">${spans}</text></g>`;
}

// ---------- topo fixo (série, dinheiro, meta, @)
function moeda(x, y, r = 15) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffc62b" stroke="${INK_}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="#e09a00" stroke-width="3"/>`;
}
function pilula(x, y, texto, fundo, { fs = 26, icone = false, alinhar = 'l', escala = 1 } = {}) {
  const w = larguraTexto(texto, fs) + 36 + (icone ? 32 : 0);
  const h = 48;
  const x0 = alinhar === 'l' ? x : x - w;
  return `<g transform="translate(${x0 + w / 2},${y}) scale(${escala}) translate(${-w / 2},0)">
    <rect x="3" y="${-h / 2 + 5}" width="${w}" height="${h}" rx="24" fill="${INK_}"/>
    <rect x="0" y="${-h / 2}" width="${w}" height="${h}" rx="24" fill="${fundo}" stroke="${INK_}" stroke-width="5"/>
    ${icone ? moeda(30, 0) : ''}
    <text x="${(icone ? 52 : 18)}" y="${fs * 0.36}" class="t" font-size="${fs}" fill="${INK_}">${esc(texto)}</text></g>`;
}
function topo(ep, t, dinheiro, inicio) {
  if (t < inicio) return '';
  const k = easeOut((t - inicio) / 0.35);
  const dy = lerp(-120, 0, k);
  const din = 'R$ ' + dinheiro.toFixed(2).replace('.', ',');
  const pulso = ep._metaPulso ? 1 + 0.08 * Math.max(0, Math.sin(t * 9)) * ep._metaPulso : 1;
  return `<g transform="translate(0,${dy})">
    <text x="${W / 2}" y="34" text-anchor="middle" class="t small" font-size="21">${esc(ep.serie)} • EP. ${ep.ep}</text>
    ${pilula(18, 76, din, '#fff', { icone: true })}
    ${pilula(W - 18, 76, 'META ' + ep.meta, COR.amarelo, { alinhar: 'r', escala: pulso })}
    <text x="${W - 22}" y="124" text-anchor="end" class="t small" font-size="17">${esc(ep.arroba)}</text>
  </g>`;
}

// ---------- fundos
function fundoRaios(t, c1, c2) {
  let s = `<rect width="${W}" height="${H}" fill="${c1}"/>`;
  const cx = W / 2, cy = 520, n = 18, rot = t * 6;
  for (let i = 0; i < n; i += 2) {
    const a1 = (i / n) * 360 + rot, a2 = ((i + 1) / n) * 360 + rot;
    const p = a => [cx + 1600 * Math.cos(a * Math.PI / 180), cy + 1600 * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    s += `<path d="M${cx},${cy} L${x1},${y1} L${x2},${y2} Z" fill="${c2}"/>`;
  }
  return s;
}
function fundoRoxoAB(t) {
  let s = `<defs><radialGradient id="gr" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#7b4dff"/><stop offset="1" stop-color="#3b1fb0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#gr)"/>`;
  const letras = [[80, 0.1, 'A'], [640, 0.5, 'B'], [200, 0.8, 'B'], [560, 0.25, 'A'], [360, 0.65, 'A'], [120, 0.42, 'B'], [600, 0.9, 'A']];
  letras.forEach(([x, ph, L], i) => {
    const y = ((ph * H + t * (40 + i * 6)) % (H + 100)) - 50;
    s += `<text x="${x + Math.sin(t + i) * 12}" y="${H - y}" class="t" font-size="${44 + (i % 3) * 14}" fill="#fff" opacity=".13" text-anchor="middle">${L}</text>`;
  });
  return s;
}
function fundoVerde(t) {
  let s = `<rect width="${W}" height="${H}" fill="#1aa95a"/>
  <defs><radialGradient id="gv" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3fd27f"/><stop offset="1" stop-color="#14894a"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#gv)"/>`;
  for (let i = 0; i < 16; i++) {
    const x = (i * 97 + 31) % W;
    const sp = 260 + (i % 5) * 60;
    const y = ((t * sp + i * 173) % (H + 80)) - 40;
    const sx = Math.abs(Math.cos(t * 4 + i));
    s += `<g transform="translate(${x},${y}) scale(${0.3 + 0.7 * sx},1)">${moeda(0, 0, 17)}</g>`;
  }
  return s;
}
function nuvem(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path class="o" d="M-60,20 Q-70,-10 -40,-12 Q-34,-40 -4,-36 Q14,-58 40,-38 Q72,-40 66,-8 Q86,6 64,24 Z" fill="#fff"/></g>`;
}
function ceu(c1 = '#8fd3ff', c2 = '#cdeeff') {
  return `<defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#ceu)"/>`;
}
function predios(y = 820) {
  const ps = [[0, 230, 150, '#f2a65a'], [150, 300, 130, '#e86a5a'], [280, 210, 160, '#7fb7e6'], [440, 330, 120, '#f5d06f'], [560, 250, 170, '#9ccf7a']];
  let s = '';
  for (const [x, h, w, c] of ps) {
    s += `<rect class="o" x="${x}" y="${y - h}" width="${w}" height="${h + 10}" fill="${c}"/>`;
    for (let yy = y - h + 26; yy < y - 40; yy += 56) for (let xx = x + 20; xx < x + w - 30; xx += 46)
      s += `<rect x="${xx}" y="${yy}" width="26" height="30" rx="4" fill="#fff" opacity=".75" stroke="${INK_}" stroke-width="4"/>`;
  }
  return s;
}
function rua(y = 1010, cor = '#4a4a5a') {
  let s = `<rect x="0" y="${y - 60}" width="${W}" height="60" fill="#c9c3b6" stroke="${INK_}" stroke-width="6"/>
  <rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${cor}"/>`;
  for (let x = 20; x < W; x += 120) s += `<rect x="${x}" y="${y + 120}" width="70" height="14" rx="6" fill="#fff"/>`;
  return s;
}
function semaforo(x, y, luz = 'r') {
  return `<rect class="o" x="${x - 9}" y="${y}" width="18" height="${1000 - y}" fill="#555"/>
  <rect class="o" x="${x - 38}" y="${y - 170}" width="76" height="190" rx="18" fill="#2b2b33"/>
  <circle cx="${x}" cy="${y - 128}" r="22" fill="${luz === 'r' ? '#ff3b3b' : '#5a2020'}" stroke="${INK_}" stroke-width="4"/>
  <circle cx="${x}" cy="${y - 76}" r="22" fill="#5a4a10" stroke="${INK_}" stroke-width="4"/>
  <circle cx="${x}" cy="${y - 24}" r="22" fill="${luz === 'g' ? '#3bff7a' : '#1e4a2c'}" stroke="${INK_}" stroke-width="4"/>
  ${luz === 'r' ? `<circle cx="${x}" cy="${y - 128}" r="40" fill="#ff3b3b" opacity=".25"/>` : ''}`;
}
function carro(x, y, cor = '#e5484d', s = 1, flip = false) {
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
    <path class="o" d="M-170,-40 L-150,-110 Q-140,-130 -110,-132 L60,-132 Q90,-130 110,-100 L140,-60 L180,-52 Q200,-48 200,-20 L200,10 L-180,10 L-180,-30 Z" fill="${cor}"/>
    <path class="o" d="M-130,-60 L-118,-110 L-30,-110 L-30,-60 Z" fill="#bfe8ff"/>
    <path class="o" d="M-10,-60 L-10,-110 L60,-110 Q80,-108 92,-90 L112,-60 Z" fill="#bfe8ff"/>
    <rect class="o" x="160" y="-40" width="34" height="18" rx="6" fill="#ffe680"/>
    <circle class="o" cx="-110" cy="12" r="38" fill="#2b2b33"/><circle cx="-110" cy="12" r="15" fill="#bbb"/>
    <circle class="o" cx="120" cy="12" r="38" fill="#2b2b33"/><circle cx="120" cy="12" r="15" fill="#bbb"/>
  </g>`;
}

// ---------- cenas
// Cada cena: (ep, t, c) => svg. c = {start, end}. u = tempo dentro da cena.

const CENAS = {
  gancho(ep, t, c) {
    const u = t - c.start;
    let s = ceu('#ffb36b', '#ffe1b0') + nuvem(120, 220, 1.2) + nuvem(560, 300) + predios(940) + rua(1010);
    s += semaforo(640, 520, 'r');
    s += carro(150, 1110, '#2f6fe0', 0.95);
    const mx = lerp(780, 440, easeOut(u / 1.6));
    s += carro(610, 1240, '#e5484d', 0.8, true);
    s += place(matheus({ pose: 'box', blink: pisca(t, 1) }), mx, 1250 + Math.abs(bob(u, 10, 3.2)), 0.82);
    s += etiqueta(t, c.start + 1.0, 360, 240, 'ELE TEM 17 ANOS', 'vermelho', { fs: 48, rot: -4 });
    return s;
  },

  convite(ep, t, c) {
    const u = t - c.start;
    let s = fundoRoxoAB(t);
    s += place(matheus({ pose: 'down', face: 'happy', blink: pisca(t, 2) }), 440, 1300 + bob(u, 4), 0.95);
    s += place(bia({ pose: 'down', blink: pisca(t, 4) }), 280, 1180 + bob(u, 4, 2.2, 0.3), 0.95, { kid: true });
    s += etiqueta(t, c.start + 0.1, 360, 190, 'QUEM DECIDE A VIDA DELE', '#fff', { fs: 40, txt: INK_, rot: -2 });
    s += etiqueta(t, wt(ep, 'N2', 'você'), 360, 300, 'É VOCÊ', 'amarelo', { fs: 80, txt: INK_, rot: 2 });
    s += etiqueta(t, wt(ep, 'N2', 'final'), 360, 410, 'VOCÊ DECIDE NO FINAL 👇', 'laranja', { fs: 36, rot: -3 });
    return s;
  },

  quem(ep, t, c) {
    const u = t - c.start;
    let s = fundoRaios(t, '#ffcf5a', '#ffd978') + nuvem(110, 420, 1.1) + nuvem(620, 520, 0.9);
    s += `<ellipse cx="360" cy="1220" rx="260" ry="34" fill="#e0a93a" opacity=".6"/>`;
    s += place(matheus({ pose: 'wave', backpack: true, blink: pisca(t, 1) }), 360, 1220 + bob(u, 5), 0.95);
    s += etiqueta(t, wt(ep, 'N3', 'Matheus'), 190, 520, 'MATHEUS', 'azul', { fs: 34, rot: -6 });
    s += etiqueta(t, wt(ep, 'N3', 'Dezessete'), 560, 600, '17 ANOS', 'amarelo', { fs: 40, txt: INK_, rot: 5 });
    s += etiqueta(t, wt(ep, 'N3', 'escola'), 360, 230, 'ESTUDANTE 🎒', 'verde', { fs: 42, rot: -3 });
    return s;
  },

  mae(ep, t, c) {
    const u = t - c.start;
    let s = `<rect width="${W}" height="${H}" fill="#fff4e0"/>`;
    // prateleiras
    const cores = ['#e5484d', '#2f6fe0', '#ffd23f', '#1f9d55', '#ff8a1f', '#a35bd6'];
    for (let r = 0; r < 4; r++) {
      const y = 260 + r * 150;
      s += `<rect class="o" x="-10" y="${y + 100}" width="${W + 20}" height="24" fill="#c98a4b"/>`;
      for (let i = 0; i < 9; i++) {
        const hh = 60 + ((i * 7 + r * 3) % 4) * 10;
        s += `<rect class="o" x="${10 + i * 80}" y="${y + 100 - hh}" width="62" height="${hh}" rx="6" fill="${cores[(i + r) % 6]}"/>`;
        s += `<rect x="${22 + i * 80}" y="${y + 112 - hh}" width="38" height="14" rx="4" fill="#fff" opacity=".8"/>`;
      }
    }
    s += `<rect class="o" x="40" y="150" width="640" height="70" rx="14" fill="${COR.vermelho}"/>
    <text x="360" y="200" text-anchor="middle" class="t" font-size="44" fill="${COR.amarelo}">MAIS MERCADO</text>`;
    s += place(sandra({ pose: 'scan', blink: pisca(t, 3) }), 360, 1330 + bob(u, 3), 1.0);
    // balcão do caixa + esteira
    s += `<rect class="o" x="-10" y="930" width="${W + 20}" height="360" fill="#5b6b8a"/>
    <rect class="o" x="-10" y="900" width="${W + 20}" height="60" fill="#2b2b33"/>`;
    for (let i = 0; i < 5; i++) {
      const x = ((u * 120 + i * 170) % 900) - 100;
      s += `<rect class="o" x="${x}" y="${862 - (i % 2) * 14}" width="${70 + (i % 2) * 20}" height="${50 + (i % 2) * 14}" rx="8" fill="${cores[i]}"/>`;
    }
    s += `<rect class="o" x="520" y="790" width="170" height="120" rx="12" fill="#ddd"/><rect x="540" y="808" width="130" height="50" rx="6" fill="#2b2b33"/>
    <text x="605" y="845" text-anchor="middle" class="t" font-size="28" fill="#3bff7a">R$ 7,49</text>`;
    s += etiqueta(t, wt(ep, 'N4', 'Sandra'), 170, 330, 'DONA SANDRA', 'azul', { fs: 32, rot: -5 });
    s += etiqueta(t, wt(ep, 'N4', 'caixa'), 360, 420, 'CAIXA DE MERCADO', COR.escuro, { fs: 40, rot: 2 });
    s += etiqueta(t, wt(ep, 'N4', 'pouco'), 360, 530, 'GANHA POUCO', 'vermelho', { fs: 50, rot: -3 });
    return s;
  },

  aluguel(ep, t, c) {
    const u = t - c.start;
    const tz = wt(ep, 'N5', 'três');
    const z = 1 + 1.1 * easeOut((t - tz + 0.3) / 0.6);
    let s = `<g transform="translate(360,560) scale(${z}) translate(-360,-560)">`;
    s += ceu() + `<rect class="o" x="-20" y="200" width="${W + 40}" height="900" fill="#f7b7a3"/>`;
    for (let y = 230; y < 1080; y += 40) s += `<path d="M-20,${y} L740,${y}" stroke="#e79f8a" stroke-width="3"/>`;
    s += `<rect class="o" x="210" y="330" width="300" height="680" rx="10" fill="#8a5a3c"/>
    <rect class="o" x="240" y="370" width="240" height="280" rx="8" fill="#a26f4d"/>
    <rect class="o" x="240" y="690" width="240" height="280" rx="8" fill="#a26f4d"/>
    <circle class="o" cx="470" cy="700" r="14" fill="#ffd23f"/>
    <rect class="o" x="560" y="420" width="70" height="44" rx="6" fill="#fff"/><text x="595" y="452" text-anchor="middle" class="t" font-size="30" fill="${INK_}">12</text>`;
    // papel colado
    s += `<g transform="rotate(-4 360 560)">
      <rect x="276" y="474" width="168" height="196" fill="${INK_}" rx="4"/>
      <rect x="270" y="466" width="168" height="196" fill="#fffdf4" stroke="${INK_}" stroke-width="5" rx="4"/>
      <rect x="330" y="456" width="50" height="20" fill="#ffe680" opacity=".9"/>
      <text x="354" y="508" text-anchor="middle" class="t" font-size="26" fill="${COR.vermelho}">AVISO</text>
      <text x="354" y="545" text-anchor="middle" class="t" font-size="20" fill="${INK_}">ALUGUEL</text>
      <text x="354" y="570" text-anchor="middle" class="t" font-size="20" fill="${INK_}">ATRASADO</text>
      <text x="354" y="606" text-anchor="middle" class="t" font-size="22" fill="${COR.vermelho}">3 MESES</text>
      <path d="M296,626 L412,626 M296,644 L380,644" stroke="#bbb" stroke-width="5"/>
    </g>`;
    s += `<rect class="o" x="-20" y="1010" width="${W + 40}" height="300" fill="#c9c3b6"/>
    <rect class="o" x="190" y="1000" width="340" height="30" fill="#b7aea0"/>`;
    s += '</g>';
    s += etiqueta(t, wt(ep, 'N5', 'aluguel'), 360, 230, 'ALUGUEL ATRASADO', 'vermelho', { fs: 50, rot: -3 });
    s += etiqueta(t, wt(ep, 'N5', 'oitocentos'), 360, 900, '3 MESES • R$ 1.800', 'amarelo', { fs: 50, txt: INK_, rot: 2 });
    return s;
  },

  contas(ep, t, c) {
    const u = t - c.start;
    let s = cozinha();
    s += place(sandra({ pose: 'forehead', blink: pisca(t, 3) }), 360, 1300 + bob(u, 3), 1.0);
    s += mesa(900);
    const boletos = [[180, 905, -12], [330, 890, 6], [490, 908, -4], [260, 950, 10], [430, 960, -8]];
    boletos.forEach(([x, y, r], i) => {
      const k = easeOutBack((u - 0.15 * i) / 0.3);
      if (k <= 0) return;
      s += `<g transform="translate(${x},${y - (1 - k) * 300}) rotate(${r})">
        <rect x="-60" y="-40" width="120" height="80" rx="4" fill="#fff" stroke="${INK_}" stroke-width="5"/>
        <path d="M-44,-20 L40,-20 M-44,-4 L20,-4 M-44,12 L30,12" stroke="#bbb" stroke-width="5"/>
        <rect x="-30" y="16" width="70" height="20" rx="4" fill="none" stroke="${COR.vermelho}" stroke-width="4" transform="rotate(-10)"/>
        <text x="5" y="31" text-anchor="middle" class="t" font-size="13" fill="${COR.vermelho}" transform="rotate(-10)">VENCIDO</text></g>`;
    });
    s += etiqueta(t, wt(ep, 'N6', 'quinhentos'), 360, 240, 'CONTAS ATRASADAS • R$ 500', 'amarelo', { fs: 40, txt: INK_, rot: -2 });
    return s;
  },

  aniver(ep, t, c) {
    const u = t - c.start;
    let s = `<rect width="${W}" height="${H}" fill="#d9c7f2"/>`;
    for (let x = 30; x < W; x += 70) s += `<circle cx="${x}" cy="${(x * 7) % 700 + 150}" r="6" fill="#fff" opacity=".5"/>`;
    s += `<rect class="o" x="-10" y="1040" width="${W + 20}" height="260" fill="#c48b5c"/>`;
    for (let x = 0; x < W; x += 90) s += `<path d="M${x},1040 L${x},1290" stroke="#a87348" stroke-width="4"/>`;
    // janela
    s += `<rect class="o" x="60" y="260" width="200" height="240" rx="10" fill="#9fdcff"/><path d="M160,260 L160,500 M60,380 L260,380" stroke="${INK_}" stroke-width="6"/>`;
    // calendário
    const fal = t >= wt(ep, 'N7', 'sete');
    s += `<g transform="translate(470,330) rotate(3)">
      <rect x="-150" y="-120" width="300" height="290" rx="12" fill="#fff" stroke="${INK_}" stroke-width="6"/>
      <rect x="-150" y="-120" width="300" height="60" rx="12" fill="${COR.vermelho}" stroke="${INK_}" stroke-width="6"/>
      <text x="0" y="-78" text-anchor="middle" class="t" font-size="30" fill="#fff">NOVEMBRO</text>`;
    for (let i = 0; i < 28; i++) {
      const cx = -120 + (i % 7) * 40, cy = -30 + Math.floor(i / 7) * 46;
      s += `<text x="${cx}" y="${cy + 8}" text-anchor="middle" class="t" font-size="20" fill="${i < 10 ? '#bbb' : INK_}">${i + 1}</text>`;
      if (i < 10) s += `<path d="M${cx - 10},${cy - 6} L${cx + 10},${cy + 10}" stroke="${COR.vermelho}" stroke-width="3"/>`;
    }
    const hk = fal ? easeOutBack((t - wt(ep, 'N7', 'sete')) / 0.3) : 0;
    s += `<g transform="translate(${-120 + 3 * 40},${-30 + 2 * 46}) scale(${hk})"><path d="M0,14 C-30,-6 -18,-30 0,-14 C18,-30 30,-6 0,14 Z" fill="#ff6fa8" stroke="${INK_}" stroke-width="4"/></g>
    </g>`;
    const fala = t >= ep.frases.find(f => f.id === 'B1').start && t < ep.frases.find(f => f.id === 'B1').end;
    s += place(bia({ pose: 'point', face: fala && falando(t) ? 'ask' : 'happy', blink: pisca(t, 4), look: [8, -6] }), 300, 1200 + bob(u, 5), 1.15, { kid: true });
    if (fala || t > ep.frases.find(f => f.id === 'B1').start) {
      s += `<text x="470" y="700" class="t" font-size="90" fill="#fff" stroke="${INK_}" stroke-width="8" paint-order="stroke" transform="rotate(${bob(u, 8, 1)} 490 670)">?</text>`;
    }
    s += etiqueta(t, wt(ep, 'N7', 'sete'), 470, 600, 'FALTAM 7 DIAS', 'verde', { fs: 42, rot: 4 });
    s += etiqueta(t, wt(ep, 'N7', 'anos'), 360, 180, 'ANIVERSÁRIO DA BIA • R$ 500', 'amarelo', { fs: 38, txt: INK_, rot: -2 });
    s += etiqueta(t, ep.frases.find(f => f.id === 'B1').start, 110, 640, 'BIA', 'azul', { fs: 34, rot: -6 });
    return s;
  },

  meta(ep, t, c) {
    const u = t - c.start, d = c.end - c.start;
    let s = fundoVerde(t);
    const linhas = [['ALUGUEL (3 MESES)', 'R$ 1.800'], ['CONTAS DA MÃE', 'R$ 500'], ['ANIVERSÁRIO DA BIA', 'R$ 500']];
    s += `<g transform="translate(360,560)">
      <rect x="-300" y="-230" width="608" height="470" rx="30" fill="${INK_}"/>
      <rect x="-306" y="-238" width="608" height="470" rx="30" fill="#fff" stroke="${INK_}" stroke-width="7"/>
      <text x="0" y="-172" text-anchor="middle" class="t" font-size="40" fill="${COR.verde}">O QUE O MATHEUS PRECISA</text>`;
    linhas.forEach(([a, b], i) => {
      const k = easeOutBack((u - 0.1 - i * 0.35) / 0.3);
      if (k <= 0) return;
      s += `<g transform="translate(0,${-100 + i * 80}) scale(${k})">
        <rect x="-270" y="-32" width="540" height="62" rx="14" fill="#f2f7f3" stroke="#d3e6d9" stroke-width="3"/>
        <text x="-250" y="12" class="t" font-size="32" fill="${INK_}">${a}</text>
        <text x="250" y="12" text-anchor="end" class="t" font-size="34" fill="${COR.vermelho}">${b}</text></g>`;
    });
    const tk = easeOutBack((t - wt(ep, 'N8', 'oitocentos') + 0.6) / 0.35);
    if (tk > 0) {
      s += `<g transform="translate(0,160) scale(${tk})"><rect x="-270" y="-44" width="540" height="88" rx="18" fill="${COR.amarelo}" stroke="${INK_}" stroke-width="6"/>
        <text x="-246" y="16" class="t" font-size="40" fill="${INK_}">TOTAL</text>
        <text x="246" y="18" text-anchor="end" class="t" font-size="54" fill="${INK_}">R$ 2.800</text></g>`;
    }
    s += '</g>';
    ep._metaPulso = t > wt(ep, 'N8', 'oitocentos') ? 1 : 0;
    s += etiqueta(t, wt(ep, 'N8', 'sete'), 360, 880, 'EM 7 DIAS ⏰', 'vermelho', { fs: 56, rot: -3 });
    return s;
  },

  rotina(ep, t, c) {
    const u = t - c.start;
    const tb = wt(ep, 'N9', 'busca'), tv = wt(ep, 'N9', 'deixa'), ts = wt(ep, 'N9', 'vai');
    let s;
    if (t < tb) { // a) saindo da escola
      const k = t - c.start;
      s = ceu() + nuvem(560, 200) + `<rect class="o" x="-10" y="380" width="${W + 20}" height="640" fill="#f3d9a4"/>`;
      for (let x = 40; x < W; x += 160) s += `<rect class="o" x="${x}" y="470" width="100" height="120" rx="6" fill="#9fdcff"/>`;
      s += `<rect class="o" x="110" y="400" width="500" height="60" rx="10" fill="${COR.azul}"/>
      <text x="360" y="444" text-anchor="middle" class="t" font-size="36" fill="#fff">ESCOLA ESTADUAL</text>
      <rect class="o" x="220" y="640" width="280" height="380" fill="#6b4a36"/>`;
      for (let x = 230; x < 500; x += 34) s += `<path d="M${x},650 L${x},1015" stroke="#3b2a20" stroke-width="8"/>`;
      s += rua(1040, '#8d8d99');
      s += place(matheus({ pose: 'down', backpack: true, blink: pisca(t, 1) }), lerp(360, 470, k / (tb - c.start)), 1200 + Math.abs(bob(k, 10, 3)), 0.78);
    } else if (t < tv) { // b) creche
      const k = t - tb;
      s = `<rect width="${W}" height="${H}" fill="#ffe08a"/>`;
      for (let i = 0; i < 8; i++) s += `<circle cx="${(i * 113) % W}" cy="${200 + (i * 151) % 600}" r="${30 + (i % 3) * 12}" fill="${['#ff8fb1', '#8fd3ff', '#9ccf7a'][i % 3]}" opacity=".7"/>`;
      s += `<rect class="o" x="110" y="290" width="500" height="80" rx="16" fill="#ff6fa8"/>
      <text x="360" y="346" text-anchor="middle" class="t" font-size="44" fill="#fff">CRECHE ARCO-ÍRIS</text>
      <rect class="o" x="-10" y="1060" width="${W + 20}" height="240" fill="#7cc47a"/>`;
      s += place(matheus({ pose: 'down', backpack: true, blink: pisca(t, 1) }), 470, 1210, 0.9);
      s += place(bia({ pose: 'up', blink: pisca(t, 4), look: [10, -4] }), lerp(120, 300, easeOut(k / 0.7)), 1210 - Math.abs(bob(k, 18, 3.4)), 0.85, { kid: true });
    } else if (t < ts) { // c) casa da vó
      const k = t - tv;
      s = ceu() + `<rect class="o" x="-10" y="300" width="${W + 20}" height="760" fill="#a6dcb4"/>
      <path class="o" d="M-10,300 L360,120 L730,300 Z" fill="#d1584a"/>
      <rect class="o" x="120" y="520" width="250" height="540" fill="#3b2a20"/>
      <rect class="o" x="460" y="520" width="160" height="150" rx="8" fill="#9fdcff"/>`;
      s += rua(1060, '#c9c3b6');
      s += place(vo({ pose: 'wave', blink: pisca(t, 5), wave: t * 7 }), 230, 1150, 0.78);
      s += place(bia({ pose: 'down', blink: pisca(t, 4) }), 420, 1160, 0.62, { kid: true });
      s += place(matheus({ pose: 'wave', backpack: true, blink: pisca(t, 1) }), lerp(620, 700, k / Math.max(0.1, ts - tv)), 1200, 0.85);
      s += etiqueta(t, tv + 0.2, 245, 380, 'VÓ LURDES', 'azul', { fs: 32, rot: -5 });
    } else { // d) semáforo
      const k = t - ts;
      s = ceu('#ff9a5a', '#ffd9a0') + predios(940) + rua(1010) + semaforo(90, 520, 'r');
      s += carro(250, 1180, '#7b4fa0', 1.15);
      s += place(matheus({ pose: 'box', blink: pisca(t, 1), look: [-6, 2] }), 560, 1230 + bob(k, 4), 0.7);
      s += etiqueta(t, wt(ep, 'N10', 'trinta'), 360, 300, '1º DIA: 38 PAÇOCAS', 'verde', { fs: 48, rot: -3 });
    }
    s += etiqueta(t, c.start + 0.2, 150, 190, 'TODO DIA', COR.escuro, { fs: 36, rot: -4, t1: ts });
    return s;
  },

  virada(ep, t, c) {
    const u = t - c.start;
    const S1 = ep.frases.find(f => f.id === 'S1');
    const fala = t >= S1.start && t < S1.end;
    let s = cozinha(true);
    s += place(sandra({ pose: 'arms', face: fala ? (falando(t) ? 'talk' : 'stern') : 'stern', blink: pisca(t, 3), look: [10, 2] }), 230, 1300, 0.95);
    s += mesa(910, true);
    const mx = lerp(780, 560, easeOut(u / 1.4));
    s += place(matheus({ pose: 'behind', face: 'nervous', blink: pisca(t, 1), look: [-8, 3] }), mx, 1240, 0.82);
    s += `<rect width="${W}" height="${H}" fill="#0b1240" opacity=".28"/>`;
    s += `<path d="M300,90 L250,180 L470,180 L420,90 Z" fill="#ffe680" opacity=".2"/>`;
    s += etiqueta(t, c.start + 0.2, 360, 200, '22H 🌙', COR.escuro, { fs: 44, rot: -3 });
    s += etiqueta(t, S1.start, 200, 470, 'DONA SANDRA', 'azul', { fs: 30, rot: -5 });
    return s;
  },

  escolha(ep, t, c) {
    const u = t - c.start;
    const tA = c.start + 0.1, tB = wt(ep, 'N12', 'esconde');
    let s = `<defs><clipPath id="ca"><rect width="${W}" height="600"/></clipPath><clipPath id="cb"><rect y="680" width="${W}" height="600"/></clipPath></defs>`;
    // A: conta a verdade (cozinha, mostrando a caixa)
    s += `<g clip-path="url(#ca)"><g transform="translate(0,-330)">${cozinha()}${place(sandra({ pose: 'down', face: 'tired', blink: pisca(t, 3), look: [10, 0] }), 230, 1300, 0.95)}${place(matheus({ pose: 'box', blink: pisca(t, 1), look: [-8, 0] }), 520, 1290, 0.9)}</g>
      <rect width="${W}" height="600" fill="${COR.laranja}" opacity=".18"/></g>`;
    // B: esconde (quarto, caixa debaixo da cama)
    s += `<g clip-path="url(#cb)"><rect y="680" width="${W}" height="600" fill="#d9c7f2"/>
      <rect class="o" x="-10" y="1150" width="${W + 20}" height="140" fill="#c48b5c"/>
      <rect class="o" x="300" y="960" width="420" height="120" rx="12" fill="#5d8fd6"/><rect class="o" x="300" y="930" width="120" height="60" rx="20" fill="#fff"/>
      <rect class="o" x="300" y="1080" width="420" height="30" fill="#8a5a3c"/>
      <path class="o" d="M${lerp(250, 420, easeOut(u / 1.5))},1110 l120,0 l-6,50 l-108,0 Z" fill="#c98a4b"/>
      ${place(matheus({ pose: 'down', face: 'nervous', blink: pisca(t, 2), look: [8, 6] }), 170, 1330, 0.75)}
      <rect y="680" width="${W}" height="600" fill="${COR.roxo}" opacity=".18"/></g>`;
    // faixa do meio
    s += `<rect y="596" width="${W}" height="88" fill="${COR.roxo}" stroke="${INK_}" stroke-width="6"/>`;
    // letras A e B
    const circ = (x, y, L, cor, t0) => {
      const k = easeOutBack((t - t0) / 0.3);
      return k > 0 ? `<g transform="translate(${x},${y}) scale(${k})"><circle r="52" fill="${cor}" stroke="#fff" stroke-width="7"/><text y="26" text-anchor="middle" class="t" font-size="72" fill="#fff">${L}</text></g>` : '';
    };
    s += circ(80, 180, 'A', COR.laranja, tA) + circ(80, 760, 'B', COR.roxo, tB);
    s += etiqueta(t, tA, 400, 175, 'CONTA A VERDADE', '#fff', { fs: 40, txt: INK_, rot: -2 });
    s += etiqueta(t, wt(ep, 'N12', 'verdade') + 0.2, 410, 270, 'ELA PODE SE ORGULHAR ✓', 'verde', { fs: 30, rot: 2 });
    s += etiqueta(t, wt(ep, 'N12', 'verdade') + 0.5, 410, 345, 'PODE PROIBIR ✗', 'vermelho', { fs: 30, rot: -2 });
    s += etiqueta(t, tB, 400, 755, 'ESCONDE DA MÃE', '#fff', { fs: 40, txt: INK_, rot: 2 });
    s += etiqueta(t, wt(ep, 'N12', 'escondido') - 0.4, 500, 850, 'CONTINUA VENDENDO ✓', 'verde', { fs: 30, rot: -2 });
    s += etiqueta(t, wt(ep, 'N12', 'escondido'), 500, 925, 'SE ELA DESCOBRIR... ✗', 'vermelho', { fs: 30, rot: 2 });
    return s;
  },

  cta(ep, t, c) {
    const u = t - c.start;
    let s = fundoRoxoAB(t);
    s += `<text x="360" y="420" text-anchor="middle" class="t big" font-size="120">COMENTA</text>`;
    const b1 = 1 + 0.06 * Math.sin(u * 6), b2 = 1 + 0.06 * Math.sin(u * 6 + Math.PI);
    s += `<g transform="translate(190,600) scale(${b1})"><circle r="95" fill="${COR.laranja}" stroke="#fff" stroke-width="10"/><text y="50" text-anchor="middle" class="t" font-size="150" fill="#fff">A</text></g>
    <text x="360" y="620" text-anchor="middle" class="t big" font-size="56">OU</text>
    <g transform="translate(530,600) scale(${b2})"><circle r="95" fill="${COR.roxo}" stroke="#fff" stroke-width="10"/><text y="50" text-anchor="middle" class="t" font-size="150" fill="#fff">B</text></g>`;
    // @ com ícone
    const wA = larguraTexto(ep.arroba, 44);
    const x0 = 360 - (wA + 60) / 2;
    s += `<g transform="translate(${x0},900)"><rect x="0" y="-38" width="44" height="44" rx="12" fill="none" stroke="#fff" stroke-width="5"/><circle cx="22" cy="-16" r="10" fill="none" stroke="#fff" stroke-width="5"/><circle cx="34" cy="-28" r="3" fill="#fff"/>
      <text x="60" y="0" class="t big" font-size="44">${esc(ep.arroba)}</text></g>`;
    s += etiqueta(t, wt(ep, 'N13', 'próximo'), 360, 780, `SEGUIR + EP. ${ep.ep + 1}`, COR.azul, { fs: 40, rot: 0 });
    return s;
  },
};

// ---------- peças de cenário reaproveitadas
function cozinha(noite = false) {
  let s = `<rect width="${W}" height="${H}" fill="${noite ? '#3a3f6b' : '#fbe9c9'}"/>`;
  for (let y = 300; y < 900; y += 60) for (let x = (y / 60) % 2 ? 0 : 30; x < W; x += 60)
    s += `<rect x="${x}" y="${y}" width="56" height="56" fill="${noite ? '#454b7d' : '#fff7e6'}" stroke="${noite ? '#353a63' : '#efd9b4'}" stroke-width="3"/>`;
  s += `<rect class="o" x="450" y="200" width="200" height="220" rx="10" fill="${noite ? '#1b2050' : '#9fdcff'}"/><path d="M550,200 L550,420 M450,310 L650,310" stroke="${INK_}" stroke-width="6"/>`;
  if (noite) s += `<circle cx="610" cy="250" r="22" fill="#fff6c8"/><circle cx="600" cy="244" r="20" fill="#1b2050"/>`;
  s += `<rect class="o" x="60" y="560" width="230" height="40" fill="#c98a4b"/>
  <path d="M360,0 L360,90" stroke="${INK_}" stroke-width="5"/><path class="o" d="M310,90 L410,90 L390,130 L330,130 Z" fill="${noite ? '#ffe680' : '#e5484d'}"/>
  <rect x="0" y="880" width="${W}" height="${H - 880}" fill="${noite ? '#2a2f55' : '#e3cfa9'}"/>`;
  return s;
}
function mesa(y, noite = false) {
  return `<rect class="o" x="-20" y="${y}" width="${W + 40}" height="60" rx="10" fill="${noite ? '#6b4a36' : '#c98a4b'}"/>
  <rect class="o" x="-20" y="${y + 56}" width="${W + 40}" height="${H - y}" fill="${noite ? '#4d3527' : '#a8703c'}"/>`;
}

// ---------- quadro completo
function quadro(ep, t) {
  const c = ep.cenas.find(c => t >= c.start && t < c.end) || ep.cenas[ep.cenas.length - 1];
  const u = t - c.start;
  const pop = 1 + 0.05 * (1 - easeOut(u / 0.2));
  const zoom = 1 + 0.03 * clamp(u / (c.end - c.start));
  ep._metaPulso = 0;
  let cena = CENAS[c.id](ep, t, c);
  // dinheiro
  let din = 0;
  const t38 = wt(ep, 'N10', 'trinta');
  if (t >= t38) din = Math.round(38 * easeOut((t - t38) / 0.9));
  const inicioTopo = ep.cenas.find(x => x.id === 'quem').start;
  const capY = c.id === 'escolha' ? 662 : 1010;
  return `<g transform="translate(360,640) scale(${pop * zoom}) translate(-360,-640)">${cena}</g>
    ${topo(ep, t, din, inicioTopo)}
    ${legenda(ep, t, capY)}`;
}

if (typeof module !== 'undefined') module.exports = { quadro };
