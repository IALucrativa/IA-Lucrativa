// Uso: node render.js <pasta_saida> [frames] [--ep N]   |   node render.js --capa [--ep N]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const args = process.argv.slice(2); const ei = args.indexOf('--ep'); const ep = ei >= 0 ? +args.splice(ei, 2)[1] : 1;
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'diferente.html') + `?export&ep=${ep}`);
  await page.evaluate(() => document.fonts.load('900 40px Inter').then(() => document.fonts.load('700 40px Inter')).then(() => document.fonts.ready));
  const save = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  if (args[0] === '--capa') { save(path.join(__dirname, ep === 1 ? 'capa.png' : `capa_teste${ep}.png`), await page.evaluate(() => renderCover())); await browser.close(); return; }
  const out = args[0] || 'frames'; fs.mkdirSync(out, { recursive: true });
  const meta = await page.evaluate(() => META);
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta));
  const list = args[1] ? args[1].split(',').map(Number) : [...Array(meta.total).keys()];
  for (const f of list) save(path.join(out, `f_${String(f).padStart(4, '0')}.png`), await page.evaluate(n => renderFrame(n), f));
  await browser.close(); console.log('ep', ep, 'frames:', list.length, 'answers:', meta.levels.map(l => l.answer).join(' '));
})();
