// Uso: node render.js <pasta_saida> [frame1,frame2,...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2] || 'frames'; fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'alcancia.html') + '?export');
  await page.evaluate(() => document.fonts.load('900 40px Inter').then(() => document.fonts.ready));
  const meta = await page.evaluate(() => ({ total: TOTAL_FRAMES, rounds: ROUNDS, outro: OUTRO_START }));
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta));
  const list = process.argv[3] ? process.argv[3].split(',').map(Number) : [...Array(meta.total).keys()];
  for (const f of list) {
    const url = await page.evaluate(n => renderFrame(n), f);
    fs.writeFileSync(path.join(out, `f_${String(f).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await browser.close();
  console.log('frames:', list.length, 'total:', meta.total);
})();
