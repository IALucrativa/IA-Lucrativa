// Uso: node cover.js  -> gera capa.png (1080x1920)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'cofrinho.html') + '?export');
  await p.evaluate(() => document.fonts.load('900 40px Inter').then(() => document.fonts.ready));
  const url = await p.evaluate(() => renderCover());
  fs.writeFileSync(path.join(__dirname, 'capa.png'), Buffer.from(url.split(',')[1], 'base64'));
  await b.close();
})();
