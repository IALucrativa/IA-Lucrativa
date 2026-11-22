// Uso: node cover_gato.js  -> gera capa.png (1080x1920) com a cena em close
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'gato.html') + '?export');
  await p.evaluate(() => document.fonts.load('900 40px Inter').then(() => document.fonts.ready));
  const url = await p.evaluate(() => {
    ctx.setTransform(S,0,0,S,0,0);
    background();
    // cena em close
    ctx.save(); ctx.translate(-118,-400); ctx.scale(1.4,1.4);
    tableDraw(); cat(EDGE-6, 3, true, false); glass(EDGE-6, TOP, 0.2, 1, '', 3);
    ctx.fillStyle='rgba(70,160,255,0.85)'; for (const [x,y,r] of [[EDGE+26,TOP-120,5],[EDGE+40,TOP-96,4],[EDGE+18,TOP-140,3]]){ ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }
    ctx.restore();
    // linhas de tensao em volta do copo
    ctx.strokeStyle='#ff4d5e'; ctx.lineWidth=6; ctx.lineCap='round';
    for (const [x1,y1,x2,y2] of [[630,560,670,530],[650,620,700,615],[630,690,670,720]]){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
    // balao do gato
    ctx.fillStyle='#fff'; rr(40,330,190,70,35); ctx.fill();
    ctx.beginPath(); ctx.moveTo(90,396); ctx.lineTo(80,440); ctx.lineTo(125,398); ctx.fill();
    text('HEHE...', 135, 366, 34, '#1d1530', 900);
    // titulo
    const o=ctx.createLinearGradient(0,0,0,340); o.addColorStop(0,'rgba(8,6,16,0.95)'); o.addColorStop(1,'rgba(8,6,16,0)'); ctx.fillStyle=o; ctx.fillRect(0,0,W,340);
    ctx.save(); ctx.translate(360,112); ctx.rotate(-0.03); rr(-160,-24,320,48,24); ctx.fillStyle=C.red; ctx.fill(); text('NÍVEL IMPOSSÍVEL', 0, 1, 22, '#fff', 900); ctx.restore();
    ctx.save(); ctx.shadowColor='rgba(245,200,66,0.6)'; ctx.shadowBlur=28; fitText('PARE ANTES DO GATO', 360, 190, 660, 64, C.gold, 900); ctx.restore();
    fitText('DERRUBAR O COPO', 360, 256, 660, 58, '#ffffff', 900);
    // selos
    rr(400,820,280,62,16); ctx.fillStyle='rgba(16,14,32,0.92)'; ctx.fill(); ctx.strokeStyle=C.gold; ctx.lineWidth=3; ctx.stroke();
    text('7 LETRAS ESCONDIDAS', 540, 852, 22, C.gold, 900);
    rr(120,1130,480,80,40); ctx.fillStyle=C.green; ctx.fill(); text('VOCÊ CONSEGUE PAUSAR?', 360, 1171, 30, '#04130d', 900);
    text('SÓ A LETRA DO 0 MS VALE', 360, 1240, 20, 'rgba(255,255,255,0.75)', 800);
    return cv.toDataURL('image/png');
  });
  fs.writeFileSync(path.join(__dirname, 'capa.png'), Buffer.from(url.split(',')[1], 'base64'));
  await b.close();
})();
