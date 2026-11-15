// uso: node render.js <relogio|buraco|helice> <semente> <saida.mp4> [@perfil]
// depois: python3 synth.py saida.mp4.events.json saida.wav && ffmpeg -i saida.mp4.silent.mp4 -i saida.wav -c:v copy -c:a aac -shortest saida.mp4
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
(async () => { const [mode, seed, out, handle = '@seuperfil'] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`file://${require('path').resolve(__dirname, '..', 'index.html')}?render=1&mode=${mode}&seed=${seed}&handle=${encodeURIComponent(handle)}`);
  await p.evaluate(() => window.simReady);
  const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p', out + '.silent.mp4'], { stdio: ['pipe','inherit','inherit'] });
  const events = []; let endT = null;
  for (let f = 0; f < 30 * 75; f++) {
    const r = await p.evaluate(() => { const s = window.renderStep(); return { s, img: window.frameJpeg() }; });
    ff.stdin.write(Buffer.from(r.img.split(',')[1], 'base64'));
    events.push(r.s.ev);
    const s = r.s; if (endT === null && (s.broken || s.ended)) endT = s.t;
    if (endT !== null && s.t - endT > (s.broken ? 4.5 : 2.5)) break;
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  fs.writeFileSync(out + '.events.json', JSON.stringify(events)); await b.close();
  console.log(out, 'frames', events.length);
})();
