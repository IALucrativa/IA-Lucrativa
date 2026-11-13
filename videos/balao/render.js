// Uso: node render.js <pasta_saida> [frames separados por virgula]   |   node render.js --capa
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'balao.html') + '?export');
  await page.evaluate(() => document.fonts.load('900 40px Inter').then(() => document.fonts.ready));
  const save = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  if (process.argv[2] === '--capa') { save(path.join(__dirname, 'capa.png'), await page.evaluate(() => renderCover())); await browser.close(); return; }
  const out = process.argv[2] || 'frames'; fs.mkdirSync(out, { recursive: true });
  const meta = await page.evaluate(() => ({ total: TOTAL_FRAMES, rounds: ROUNDS, outro: OUTRO_START, pumps: PUMP_EVENTS }));
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta));
  const list = process.argv[3] ? process.argv[3].split(',').map(Number) : [...Array(meta.total).keys()];
  for (const f of list) save(path.join(out, `f_${String(f).padStart(4, '0')}.png`), await page.evaluate(n => renderFrame(n), f));
  await browser.close(); console.log('frames:', list.length, 'total:', meta.total);
})();
