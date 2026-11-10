// Uso:
//   node render.js stills <pasta> 3 8 14 ...   -> salva quadros soltos (PNG/JPG) para conferir
//   node render.js video <saida.mp4> [audio.wav] -> renderiza o vídeo completo (30 fps)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

(async () => {
  const [mode, target, ...rest] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => { console.error('PAGE ERROR', e); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  await page.waitForFunction(() => window.renderFrame);
  const grab = async t => Buffer.from((await page.evaluate(t => renderFrame(t), t)).split(',')[1], 'base64');

  if (mode === 'stills') {
    fs.mkdirSync(target, { recursive: true });
    for (const s of rest) fs.writeFileSync(path.join(target, `t${s}.jpg`), await grab(parseFloat(s)));
  } else {
    const fps = 30, dur = await page.evaluate(() => DURATION), n = Math.round(dur * fps);
    if (dur < 60 || dur > 120) { console.error(`Regra do projeto: o vídeo precisa ter entre 60 s e 120 s (atual: ${dur} s).`); process.exit(1); }
    const audio = rest[0];
    const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
    if (audio) args.push('-i', audio);
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
    if (audio) args.push('-c:a', 'aac', '-b:a', '160k', '-shortest');
    args.push(target);
    const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      const buf = await grab(i / fps);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`quadro ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
