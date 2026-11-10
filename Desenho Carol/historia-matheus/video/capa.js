// Gera a capa do episódio (1080x1920) e uma prévia recortada como na grade do perfil (1080x1440).
// Uso: node capa.js <capa.json> <saida.png>
// O capa.json traz os textos e a pose. Exemplo em ../ep01/capa.json.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

(async () => {
  const [cfgPath, saida] = process.argv.slice(2);
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  p.on('pageerror', e => { console.error(e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, 'index.html') + '?t=0');
  await p.evaluate(() => window.ready);
  await p.evaluate(cfg => {
    const INK = '#2a2233';
    const tw = (txt, fs) => larguraTexto(txt, fs);
    const pill = (y, txt, fs, fill, cor, rot = 0) => {
      const w = tw(txt, fs) + fs * 1.4, h = fs * 1.6;
      return `<g transform="translate(360,${y}) rotate(${rot})"><rect x="${-w / 2 + 4}" y="${-h / 2 + 6}" width="${w}" height="${h}" rx="${h / 2}" fill="${INK}"/>
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${INK}" stroke-width="5"/>
        <text y="${fs * 0.36}" text-anchor="middle" class="t" font-size="${fs}" fill="${cor}">${txt}</text></g>`;
    };
    let s = CENA_CAPA[cfg.cenario]();
    s += `<defs><linearGradient id="esc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1430" stop-opacity=".75"/><stop offset=".45" stop-color="#1a1430" stop-opacity="0"/></linearGradient></defs>
      <rect width="720" height="1280" fill="url(#esc)"/>`;
    s += pill(215, cfg.serie, 26, '#fff', INK);
    s += `<text x="360" y="345" text-anchor="middle" class="t big" font-size="104">EPISÓDIO <tspan fill="#ffd23f">${cfg.ep}</tspan></text>`;
    s += etiqueta(1, 0, 360, 430, cfg.prazo, 'amarelo', { fs: 62, txt: INK, rot: -3 });
    s += pill(530, cfg.gancho, 28, '#25213a', '#fff');
    s += place(matheus(cfg.matheus), cfg.mx, 1105, cfg.ms);
    // cartão inclinado com a ameaça
    const linhas = cfg.cartao.map((l, i) => `<text x="0" y="${-38 + i * 34}" text-anchor="middle" class="t" font-size="27" fill="${INK}">${l}</text>`).join('');
    s += `<g transform="translate(540,780) rotate(4)">
      <rect x="-146" y="-112" width="300" height="230" rx="16" fill="${INK}"/>
      <rect x="-150" y="-118" width="300" height="230" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/>
      <text x="0" y="-78" text-anchor="middle" class="t" font-size="20" fill="#e5484d">${cfg.cartaoTitulo}</text>${linhas}
      <rect x="-140" y="70" width="280" height="60" rx="12" fill="#e5484d" stroke="${INK}" stroke-width="5"/>
      <text x="0" y="108" text-anchor="middle" class="t" font-size="22" fill="#fff">${cfg.faixa}</text></g>`;
    s += etiqueta(1, 0, cfg.mx, 600, cfg.etiqueta, '#fff', { fs: 24, txt: INK, rot: -4 });
    document.getElementById('tela').innerHTML = s;
  }, cfg);
  await p.screenshot({ path: saida });
  await b.close();
  const recorte = saida.replace(/\.png$/, '-recorte-grade.png');
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', saida, '-vf', 'crop=1080:1440:0:240', recorte], { stdio: 'inherit' });
  console.log('capa:', saida, '\nrecorte da grade:', recorte);
})();
