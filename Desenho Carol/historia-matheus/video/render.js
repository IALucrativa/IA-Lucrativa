// Gera prévias e o vídeo do episódio.
//   node render.js previa <saida.png>            -> folha de quadros (1 por cena + meio)
//   node render.js video <saida.mp4> [audio.mp3] -> vídeo 720x1280, 30 fps
const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');

(async () => {
  const [modo, saida, audio] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
  page.on('pageerror', e => { console.error('ERRO NA PÁGINA:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);
  const dur = await page.evaluate(() => window.DURACAO);
  const cenas = await page.evaluate(() => window.CENAS_INFO);
  console.log('duração:', dur.toFixed(1), 's');
  console.log(cenas.map(c => `${c.id} ${c.start.toFixed(1)}–${c.end.toFixed(1)}`).join('\n'));

  if (modo === 'previa') {
    const tempos = [];
    for (const c of cenas) { tempos.push(c.start + (c.end - c.start) * 0.35, c.start + (c.end - c.start) * 0.9); }
    const fs = require('fs');
    const dir = saida + '.d'; fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < tempos.length; i++) {
      await page.evaluate(t => renderAt(t), tempos[i]);
      await page.screenshot({ path: `${dir}/${String(i).padStart(2, '0')}.png` });
    }
    await new Promise(r => spawn('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', `${dir}/*.png`,
      '-vf', 'scale=240:-1,tile=6x4:padding=4', '-frames:v', '1', saida], { stdio: 'inherit' }).on('close', r));
  } else {
    const fps = 30, n = Math.ceil(dur * fps);
    const args = ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
    if (audio) args.push('-i', audio);
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p');
    if (audio) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
    args.push('-movflags', '+faststart', saida);
    const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => renderAt(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`quadro ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
