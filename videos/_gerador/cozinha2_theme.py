# ---------------- PNEU ----------------
TH['pneu'] = dict(title='Pare o Pneu', word='TURBINA', approach='[57, 45, 60, 39, 54, 48, 42]', style='[0, 4, 1, 2, 3, 4, 2]', bands='[48, 52, 46, 55, 50, 58, 60]',
T=_T('PARE ANTES DO PNEU ESTOURAR','PNEU','PRESSÃO PSI',"['VAZIO','ENCHENDO','ESTUFANDO','QUASE!','AGORA!','BUM!']",'PNEUS','BUM!'),
tint=('#0e0e12','rgba(255,210,63,0.05)','rgba(255,210,63,0)','rgba(255,210,63,0.10)'), cover_n='60',
geo="const TABLE_Y = 968, PX = 400, PY = 790;\n"+_EV(16),
draw=_FACE+r"""
function compressor(frame, e){
  const sh = Math.sin(frame*2.5)*2*(0.3+e);
  ctx.save(); ctx.translate(sh,0);
  ctx.fillStyle='#c62828'; rr(40,800,150,160,16); ctx.fill(); ctx.fillStyle='#8e1b1b'; ctx.fillRect(40,930,150,30);
  ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(70,962,14,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(160,962,14,0,7); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(115,855,34,0,7); ctx.fill(); ctx.strokeStyle='#222'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle='#3cf0a0'; ctx.beginPath(); ctx.moveTo(115,855); ctx.arc(115,855,26,Math.PI*0.75,Math.PI*1.75); ctx.fill(); ctx.fillStyle='#ff4d5e'; ctx.beginPath(); ctx.moveTo(115,855); ctx.arc(115,855,26,Math.PI*1.75,Math.PI*2.25); ctx.fill();
  const a=Math.PI*0.75+Math.PI*1.45*e; ctx.strokeStyle='#111'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(115,855); ctx.lineTo(115+Math.cos(a)*28,855+Math.sin(a)*28); ctx.stroke();
  ctx.restore();
}
function hose(e, broke){ ctx.strokeStyle='#1d1d22'; ctx.lineWidth=10; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(190,880);
  if (broke){ ctx.bezierCurveTo(250,960,300,950,330,930); } else { ctx.bezierCurveTo(260,960,300,860,PX-60,PY+50); } ctx.stroke(); }
function tire(e, letter, worry, frame, jit, dead=false){
  const cx=PX+jit, sx=1+0.10*e, sy=1+0.14*e;
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx,TABLE_Y+2,150*sx,10,0,0,7); ctx.fill();
  if (!dead){
    ctx.save(); ctx.translate(cx,PY); ctx.scale(sx,sy);
    ctx.fillStyle='#1b1c20'; ctx.beginPath(); ctx.arc(0,0,160,0,7); ctx.fill(); ctx.strokeStyle='#5a5e6b'; ctx.lineWidth=6; ctx.stroke();
    const sg=ctx.createRadialGradient(-50,-60,10,0,0,160); sg.addColorStop(0,'rgba(255,255,255,0.18)'); sg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(0,0,158,0,7); ctx.fill();
    ctx.strokeStyle='#3a3d46'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,0,112,0,7); ctx.stroke();
    ctx.strokeStyle='#2c2e35'; ctx.lineWidth=12; for (let i=0;i<24;i++){ const a=i/24*Math.PI*2+frame*0.002; ctx.beginPath(); ctx.moveTo(Math.cos(a)*140,Math.sin(a)*140); ctx.lineTo(Math.cos(a)*160,Math.sin(a)*160); ctx.stroke(); }
    if (worry>0){ ctx.fillStyle=`rgba(255,60,40,${0.18*worry})`; ctx.beginPath(); ctx.arc(0,0,160,0,7); ctx.fill(); }
    if (e>0.75){ ctx.strokeStyle=`rgba(230,230,240,${(e-0.75)*3})`; ctx.lineWidth=2; for (const [a0,len] of [[-0.9,40],[-2.3,30],[0.4,36]]){ ctx.beginPath(); ctx.moveTo(Math.cos(a0)*150,Math.sin(a0)*150); ctx.lineTo(Math.cos(a0+0.08)*(150-len),Math.sin(a0+0.08)*(150-len)); ctx.stroke(); } }
    ctx.restore();
  }
  // aro
  const rg=ctx.createRadialGradient(cx-20,PY-20,5,cx,PY,80); rg.addColorStop(0,'#f2f4f8'); rg.addColorStop(1,'#8a90a0');
  ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(cx, dead?TABLE_Y-80:PY, 78, 0, 7); ctx.fill(); ctx.strokeStyle='#5d6270'; ctx.lineWidth=4; ctx.stroke();
  const ry = dead?TABLE_Y-80:PY;
  ctx.fillStyle='#5d6270'; for (let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*48, ry+Math.sin(a)*48, 7, 0, 7); ctx.fill(); }
  if (!dead && letter) text(letter, cx, PY+118*sy, 44, 'rgba(255,255,255,0.28)', 900);        // letra (falsas em todo frame, certa no 0 ms)
  face(cx, ry-6, 13, worry, frame, dead, '#2a2d36', '#2a2d36');
}
function boom(round, tb){
  const R=rng(round.start*7919+29), g=2300;
  tire(0,'',0,0,0,true); flash(tb,'255,255,255');
  for (let k=0;k<10;k++){ const a=R()*Math.PI*2, d=(80+R()*160)*Math.min(1,tb*3), r=30+R()*50+tb*110;
    ctx.fillStyle=`rgba(80,80,90,${0.55*Math.max(0,1-tb*1.3)})`; ctx.beginPath(); ctx.arc(PX+Math.cos(a)*d, PY+Math.sin(a)*d*0.7-tb*180, r, 0, 7); ctx.fill(); }
  for (let i=0;i<20;i++){ const a=R()*Math.PI*2, sp=500+R()*900, x=PX+Math.cos(a)*sp*tb, y=PY+Math.sin(a)*sp*tb+0.5*g*tb*tb, s=14+R()*22;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*10+i); ctx.fillStyle='#1b1c20'; ctx.beginPath(); ctx.moveTo(-s,-s*0.3); ctx.quadraticCurveTo(0,-s*0.8,s,-s*0.2); ctx.lineTo(s*0.8,s*0.4); ctx.quadraticCurveTo(0,0,-s,s*0.3); ctx.fill(); ctx.restore(); }
  if (tb<0.3){ ctx.strokeStyle=`rgba(255,226,110,${1-tb/0.3})`; ctx.lineWidth=6; for (let i=0;i<14;i++){ const a=i/14*Math.PI*2, r1=180+300*tb; ctx.beginPath(); ctx.moveTo(PX+Math.cos(a)*r1,PY+Math.sin(a)*r1); ctx.lineTo(PX+Math.cos(a)*(r1+50),PY+Math.sin(a)*(r1+50)); ctx.stroke(); } }
  fx(T.fx, PX, 520, tb, '#c62828');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table(); compressor(frame, broke?0:e); hose(e, broke);
  if (!broke) tire(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0);
  else boom(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); compressor(3,1); hose(1,false); tire(1,'',1,7,0); }
""")

# ---------------- SORVETE ----------------
TH['sorvete'] = dict(title='Pare o Sorvete', word='ALEGRIA', approach='[60, 48, 57, 42, 63, 45, 51]', style='[1, 0, 4, 2, 0, 3, 4]', bands='[38, 40, 39, 42, 41, 43, 45]',
T=_T('PARE ANTES DO SORVETE CAIR','SORVETE','CALOR °C',"['GELADINHO','DERRETENDO','ESCORREGANDO','QUASE!','AGORA!','PLOFT!']",'SORVETES','PLOFT!'),
tint=('#1a0e04','rgba(255,200,80,0.06)','rgba(255,200,80,0)','rgba(255,200,80,0.12)'), cover_n='45°',
geo="const TABLE_Y = 968, PX = 330;\n"+_EV(12),
draw=_FACE+r"""
function sun(frame){ const sx=600, sy=470; ctx.fillStyle='rgba(255,210,63,0.18)'; ctx.beginPath(); ctx.arc(sx,sy,110,0,7); ctx.fill();
  ctx.strokeStyle='#ffd23f'; ctx.lineWidth=6; ctx.lineCap='round'; for (let i=0;i<12;i++){ const a=i/12*Math.PI*2+frame*0.01; ctx.beginPath(); ctx.moveTo(sx+Math.cos(a)*70,sy+Math.sin(a)*70); ctx.lineTo(sx+Math.cos(a)*92,sy+Math.sin(a)*92); ctx.stroke(); }
  ctx.fillStyle='#ffd23f'; ctx.beginPath(); ctx.arc(sx,sy,56,0,7); ctx.fill();
  ctx.fillStyle='#7a4a00'; ctx.beginPath(); ctx.arc(sx-18,sy-6,5,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(sx+18,sy-6,5,0,7); ctx.fill();
  ctx.strokeStyle='#7a4a00'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(sx,sy+8,16,0.2*Math.PI,0.8*Math.PI); ctx.stroke(); }
function holder(){ ctx.fillStyle='#8a5a32'; rr(PX-70,880,140,82,10); ctx.fill(); ctx.fillStyle='#5a3a1c'; ctx.beginPath(); ctx.ellipse(PX,884,44,10,0,0,7); ctx.fill(); }
function scoop(x, y, r, col, colD, sag, rot=0){ ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.scale(1+0.18*sag, 1-0.16*sag);
  ctx.fillStyle=col; ctx.beginPath(); ctx.arc(0,0,r,Math.PI,0); for (let i=0;i<=6;i++){ ctx.quadraticCurveTo(r-i*r/3+r/6, r*0.55+(i%2)*10, r-(i+1)*r/3, r*0.3); } ctx.closePath(); ctx.fill();
  ctx.fillStyle=colD; ctx.beginPath(); ctx.ellipse(0,r*0.35,r*0.95,r*0.18,0,0,Math.PI); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(-r*0.4,-r*0.45,r*0.18,r*0.1,-0.5,0,7); ctx.fill(); ctx.restore(); }
function icecream(e, letter, worry, frame, jit, top=true){
  const cx=PX+jit;
  // casquinha
  ctx.fillStyle='#e0a050'; ctx.beginPath(); ctx.moveTo(cx-70,690); ctx.lineTo(cx+70,690); ctx.lineTo(cx,940); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle='#b8762c'; ctx.lineWidth=3; for (let k=-8;k<8;k++){ ctx.beginPath(); ctx.moveTo(cx-90+k*22,690); ctx.lineTo(cx+60+k*22,940); ctx.moveTo(cx+90+k*22,690); ctx.lineTo(cx-60+k*22,940); ctx.stroke(); } ctx.restore();
  if (letter) text(letter, cx, 770, 40, 'rgba(90,45,5,0.5)', 900);         // letra (falsas em todo frame, certa no 0 ms)
  // bola de baixo (morango) e gotas
  scoop(cx, 660, 76, '#ff9fbd', '#e07090', e*0.6);
  const R=rng(7); for (let i=0;i<3+Math.floor(5*e);i++){ const dx=-60+R()*120, len=(10+R()*60)*e*(0.5+0.5*Math.sin(frame*0.05+i)); ctx.fillStyle='#ff9fbd'; rr(cx+dx-6,690,12,len+10,6); ctx.fill(); ctx.beginPath(); ctx.arc(cx+dx,700+len,8,0,7); ctx.fill(); }
  // bola de cima (menta) escorregando
  if (top){ const off=90*e*e, rot=0.5*e*e; scoop(cx+off, 560+40*e*e, 66, '#9ef0c8', '#5cc99a', e*0.5, rot);
    ctx.save(); ctx.translate(cx+off, 552+40*e*e); ctx.rotate(rot); face(0, 0, 11, worry, frame, false, '#1f5e44', '#1f5e44'); ctx.restore(); }
}
function heat(e, frame){ ctx.strokeStyle=`rgba(255,200,120,${0.15+0.3*e})`; ctx.lineWidth=3; for (let k=-1;k<=1;k++){ ctx.beginPath(); for (let y=0;y<120;y+=6){ const x=PX+k*80+Math.sin(y*0.08+frame*0.3+k)*8; y===0?ctx.moveTo(x,470-y):ctx.lineTo(x,470-y); } ctx.stroke(); } }
function ploft(round, tb){
  const R=rng(round.start*7919+31), g=2600;
  icecream(1,'',0,0,0,false); flash(tb,'230,255,240');
  const t0=Math.min(tb,0.22), fy=560+40+((TABLE_Y-40)-600)*(t0/0.22)**2, fx2=PX+90+120*t0;
  if (tb<0.22){ scoop(fx2, fy, 66, '#9ef0c8', '#5cc99a', 0.5, 0.5+tb*8); }
  else { const k=clamp((tb-0.22)/0.2,0,1); ctx.fillStyle='#9ef0c8'; ctx.beginPath(); ctx.ellipse(fx2,TABLE_Y-10,70+60*k,22,0,Math.PI,0); ctx.fill();
    ctx.beginPath(); ctx.ellipse(fx2,TABLE_Y-2,100+70*k,9,0,0,7); ctx.fill(); face(fx2, TABLE_Y-28, 10, 0, 0, true, '#1f5e44', '#1f5e44');
    for (let i=0;i<16;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=200+R()*500, ts=tb-0.22, x=fx2+Math.cos(a)*sp*ts, y=TABLE_Y-20+Math.sin(a)*sp*ts+0.5*g*ts*ts; if (y>TABLE_Y) continue;
      ctx.fillStyle='#9ef0c8'; ctx.beginPath(); ctx.arc(x,y,4+R()*6,0,7); ctx.fill(); } }
  if (tb>=0.22) fx(T.fx, 420, 600, tb-0.22, '#1f8a5a');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table(); sun(frame); heat(broke?1:e, frame); holder();
  if (!broke) icecream(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0);
  else ploft(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); sun(3); heat(1,3); holder(); icecream(0.92,'',1,7,0); }
""")

# ---------------- ESPUMANTE ----------------
TH['espumante'] = dict(title='Pare o Espumante', word='BRINDES', approach='[54, 42, 60, 45, 57, 39, 51]', style='[2, 4, 0, 1, 4, 2, 3]', bands='[920, 870, 990, 940, 1010, 960, 999]',
T=_T('PARE ANTES DO ESPUMANTE ESTOURAR','ESPUMANTE','BOLHAS',"['GELADO','BORBULHANDO','A ROLHA SOBE','QUASE!','AGORA!','POP!']",'GARRAFAS','POP!'),
tint=('#0c0a1a','rgba(245,200,66,0.05)','rgba(245,200,66,0)','rgba(245,200,66,0.10)'), cover_n='999',
geo="const TABLE_Y = 968, PX = 360, NECK = 560;\n"+_EV(12),
draw=_FACE+r"""
function fireworks(frame){ for (let k=0;k<3;k++){ const per=70, t=((frame+k*23)%per)/per, cx=[140,560,360][k], cy=[460,430,520][k], col=['#ff5fa2','#ffd23f','#6ec8ff'][k];
  if (t<0.15){ ctx.fillStyle=col; ctx.fillRect(cx-1, cy+80-t/0.15*80, 3, 10); continue; }
  const r=(t-0.15)*160, al=Math.max(0,1-(t-0.15)/0.85); ctx.fillStyle=col; ctx.globalAlpha=al;
  for (let i=0;i<16;i++){ const a=i/16*Math.PI*2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r+r*r*0.004, 3, 0, 7); ctx.fill(); } ctx.globalAlpha=1; } }
function bottlePath(){ ctx.beginPath(); ctx.moveTo(PX-24,NECK); ctx.lineTo(PX-24,640); ctx.bezierCurveTo(PX-24,690,PX-78,700,PX-78,760); ctx.lineTo(PX-78,TABLE_Y-20); ctx.quadraticCurveTo(PX-78,TABLE_Y,PX-58,TABLE_Y); ctx.lineTo(PX+58,TABLE_Y); ctx.quadraticCurveTo(PX+78,TABLE_Y,PX+78,TABLE_Y-20); ctx.lineTo(PX+78,760); ctx.bezierCurveTo(PX+78,700,PX+24,690,PX+24,640); ctx.lineTo(PX+24,NECK); ctx.closePath(); }
function bottle(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(PX+jit, TABLE_Y); ctx.rotate(dead?0:Math.sin(frame*(0.6+1.2*e))*0.03*e); ctx.translate(-PX, -TABLE_Y);
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(PX,TABLE_Y+2,90,9,0,0,7); ctx.fill();
  const g=ctx.createLinearGradient(PX-80,0,PX+80,0); g.addColorStop(0,'#0f3d24'); g.addColorStop(.45,'#2e8a55'); g.addColorStop(1,'#0b2a19');
  ctx.fillStyle=g; bottlePath(); ctx.fill();
  if (!dead){ ctx.save(); bottlePath(); ctx.clip(); const R=rng(9); for (let i=0;i<8+Math.floor(30*e);i++){ const x=PX-60+R()*120, sp=60+R()*140*(0.5+e), y=TABLE_Y-10-((frame*sp/10+R()*400)%330);
    ctx.strokeStyle='rgba(255,240,180,0.55)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x,y,2+R()*3,0,7); ctx.stroke(); } ctx.restore(); }
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(PX-56,770,8,170);
  // papel dourado no gargalo
  ctx.fillStyle='#d9a520'; ctx.beginPath(); ctx.moveTo(PX-28,NECK-6); ctx.lineTo(PX+28,NECK-6); ctx.lineTo(PX+26,650); ctx.lineTo(PX-26,650); ctx.fill(); ctx.fillStyle='#f5c842'; ctx.fillRect(PX-28,640,56,10);
  // rotulo
  ctx.fillStyle='#fff3d6'; rr(PX-74,780,148,140,10); ctx.fill(); ctx.strokeStyle='#d9a520'; ctx.lineWidth=3; ctx.strokeRect(PX-66,788,132,124);
  if (letter) text(letter, PX, 888, 40, 'rgba(150,110,30,0.48)', 900);         // letra (falsas em todo frame, certa no 0 ms)
  face(PX, 826, 12, worry, frame, dead, '#5a3a00', '#5a3a00');
  // rolha subindo
  if (!dead){ const up=46*e*e+(e>0.8?Math.abs(Math.sin(frame*1.5))*4:0); ctx.fillStyle='#d8b07a'; rr(PX-20,NECK-34-up,40,40,8); ctx.fill(); ctx.fillStyle='#b8894f'; rr(PX-26,NECK-46-up,52,16,8); ctx.fill(); }
  ctx.restore();
}
function pop(round, tb){
  const R=rng(round.start*7919+51), g=2200;
  bottle(0,'',0,0,0,true); flash(tb,'255,245,210');
  const cy=NECK-40-3000*tb+0.5*g*tb*tb; ctx.save(); ctx.translate(PX+120*tb,cy); ctx.rotate(tb*22); ctx.fillStyle='#d8b07a'; rr(-20,-20,40,40,8); ctx.fill(); ctx.restore();
  const hgt=Math.min(1,tb/0.1)*(300-Math.max(0,tb-0.35)*600); if (hgt>0){ const top=NECK-hgt; const jg=ctx.createLinearGradient(0,top,0,NECK); jg.addColorStop(0,'rgba(255,250,230,0.95)'); jg.addColorStop(1,'rgba(245,215,120,0.95)');
    ctx.fillStyle=jg; ctx.beginPath(); ctx.moveTo(PX-16,NECK); ctx.lineTo(PX-46,top+30); ctx.quadraticCurveTo(PX,top-30,PX+46,top+30); ctx.lineTo(PX+16,NECK); ctx.fill(); }
  const cols=['#ff5fa2','#ffd23f','#6ec8ff','#3cf0a0','#ffffff','#b48cff'];
  for (let i=0;i<60;i++){ const a=-Math.PI*(0.05+0.9*R()), sp=400+R()*900, drag=Math.min(tb,0.35), x=PX+Math.cos(a)*sp*drag+Math.sin(tb*10+i)*12, y=NECK+Math.sin(a)*sp*drag+0.5*700*tb*tb;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*(6+i%5)+i); ctx.fillStyle=cols[i%cols.length]; ctx.fillRect(-6,-3*Math.abs(Math.cos(tb*12+i)),12,6*Math.abs(Math.cos(tb*12+i))+1); ctx.restore(); }
  fx(T.fx, PX, 470, tb, '#b8860b');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  fireworks(frame); table();
  if (!broke) bottle(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0);
  else pop(round, (lf-round.A)/FPS);
}
function coverScene(){ fireworks(20); table(); bottle(0.95,'',1,7,0); }
""")
