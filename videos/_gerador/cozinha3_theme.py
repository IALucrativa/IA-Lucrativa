# ---------------- VULCAO ----------------
TH['vulcao'] = dict(title='Pare o Vulcão', word='CIÊNCIA', approach='[54, 60, 42, 57, 45, 63, 39]', style='[1, 4, 0, 2, 3, 4, 1]', bands='[100, 100, 100, 100, 100, 100, 100]',
T=_T('PARE ANTES DO VULCÃO ENTRAR EM ERUPÇÃO','VULCÃO','PRESSÃO %',"['DORMINDO','BORBULHANDO','TREMENDO','QUASE!','AGORA!','ERUPÇÃO!']",'VULCÕES','ERUPÇÃO!'),
tint=('#14080a','rgba(255,120,60,0.05)','rgba(255,120,60,0)','rgba(255,120,60,0.10)'), cover_n='99%',
geo="const TABLE_Y = 968, PX = 360, TOPY = 690;\n"+_EV(14),
draw=_FACE+r"""
function board(){ table(); ctx.fillStyle='#4f9e5a'; rr(110,TABLE_Y-22,500,24,8); ctx.fill();
  for (const [x,s] of [[150,1],[580,0.9],[190,0.7]]){ ctx.fillStyle='#6b4226'; ctx.fillRect(x-4,TABLE_Y-40*s-22,8,24); ctx.fillStyle='#2f7d3a'; ctx.beginPath(); ctx.moveTo(x-22*s,TABLE_Y-30*s-22); ctx.lineTo(x,TABLE_Y-90*s-22); ctx.lineTo(x+22*s,TABLE_Y-30*s-22); ctx.fill(); }
  ctx.fillStyle='#fff'; rr(560,TABLE_Y-112,130,46,6); ctx.fill(); ctx.fillStyle='#6b4226'; ctx.fillRect(622,TABLE_Y-66,6,46); text('FEIRA DE', 625, TABLE_Y-99, 14, '#151515', 900); text('CIÊNCIAS', 625, TABLE_Y-80, 14, '#151515', 900); }
function volcano(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  const g=ctx.createLinearGradient(PX-180,0,PX+180,0); g.addColorStop(0,'#5a3418'); g.addColorStop(.45,'#9a6233'); g.addColorStop(1,'#4a2a12');
  ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(PX-180,TABLE_Y-22); ctx.quadraticCurveTo(PX-120,TOPY+80,PX-62,TOPY); ctx.lineTo(PX+62,TOPY); ctx.quadraticCurveTo(PX+120,TOPY+80,PX+180,TABLE_Y-22); ctx.closePath(); ctx.fill();
  if (!dead && worry>0){ ctx.fillStyle=`rgba(255,60,20,${0.2*worry})`; ctx.fill(); }
  ctx.fillStyle='#3a2210'; ctx.beginPath(); ctx.ellipse(PX,TOPY,62,14,0,0,7); ctx.fill();
  // lava/espuma borbulhando na cratera
  if (!dead){ const h=6+46*e; ctx.fillStyle='#ff5a1f'; ctx.beginPath(); ctx.ellipse(PX,TOPY-2,56,8+h*0.4,0,Math.PI,0); ctx.fill();
    const R=rng(frame); for (let i=0;i<4+Math.floor(10*e);i++){ const x=PX-46+R()*92, y=TOPY-4-R()*h; ctx.fillStyle= i%2?'#ffb020':'#ff7a2a'; ctx.beginPath(); ctx.arc(x,y,5+R()*10*e,0,7); ctx.fill(); }
    const n=Math.floor(10*e); for (let k=0;k<n;k++){ const age=((frame*(1+2*e)+k*19)%50)/50, x=PX+Math.sin(k*2.1+age*3)*30*age, y=TOPY-30-age*(160+160*e), r=10+age*(20+30*e);
      ctx.fillStyle=`rgba(110,105,110,${(1-age)*0.5*e})`; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } }
  if (letter) text(letter, PX, TABLE_Y-70, 46, 'rgba(255,225,190,0.32)', 900);        // letra (falsas em todo frame, certa no 0 ms)
  face(PX, TOPY+90, 16, worry, frame, dead, '#2a1408', '#2a1408');
  ctx.restore();
}
function erupt(round, tb){
  const R=rng(round.start*7919+61), g=2000;
  volcano(0,'',0,0,0,true); flash(tb,'255,200,120');
  const hgt=Math.min(1,tb/0.12)*(330-Math.max(0,tb-0.4)*400); if (hgt>0){ const top=TOPY-hgt;
    const jg=ctx.createLinearGradient(0,top,0,TOPY); jg.addColorStop(0,'#ffd23f'); jg.addColorStop(1,'#ff4d1f'); ctx.fillStyle=jg;
    ctx.beginPath(); ctx.moveTo(PX-40,TOPY); ctx.lineTo(PX-70,top+40); ctx.quadraticCurveTo(PX,top-40,PX+70,top+40); ctx.lineTo(PX+40,TOPY); ctx.fill(); }
  const fl=clamp(tb/0.5,0,1); ctx.fillStyle='#ff6a1f'; for (const s of [-1,1]){ ctx.beginPath(); ctx.moveTo(PX+s*40,TOPY); ctx.quadraticCurveTo(PX+s*(60+40*fl),TOPY+120*fl,PX+s*(70+60*fl),TOPY+40+220*fl); ctx.lineTo(PX+s*(40+50*fl),TOPY+40+220*fl); ctx.quadraticCurveTo(PX+s*30,TOPY+80,PX+s*10,TOPY); ctx.fill(); }
  for (let i=0;i<40;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=500+R()*900, x=PX+Math.cos(a)*sp*tb, y=TOPY+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (y>TABLE_Y) continue;
    ctx.fillStyle= i%3?'#ff7a2a':'#ffd23f'; ctx.beginPath(); ctx.arc(x,y,4+R()*8,0,7); ctx.fill(); }
  for (let k=0;k<8;k++){ const a=R()*Math.PI*2, d=(60+R()*120)*Math.min(1,tb*3), r=30+R()*40+tb*100; ctx.fillStyle=`rgba(90,85,95,${0.5*Math.max(0,1-tb*1.3)})`; ctx.beginPath(); ctx.arc(PX+Math.cos(a)*d, TOPY-150+Math.sin(a)*d*0.6-tb*180, r, 0, 7); ctx.fill(); }
  fx(T.fx, PX, 470, tb, '#b8320a');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  board();
  if (!broke) volcano(e, letterAt(ri, lf, round.A, frame), worry, frame, (jitter||0)+(e>0.5?Math.sin(frame*3)*2.5*e:0));
  else erupt(round, (lf-round.A)/FPS);
}
function coverScene(){ board(); volcano(1,'',1,7,0); }
""")

# ---------------- ARROZ ----------------
TH['arroz'] = dict(title='Pare o Arroz', word='TEMPERO', approach='[60, 45, 57, 42, 54, 63, 48]', style='[0, 2, 4, 1, 3, 0, 4]', bands='[100, 100, 100, 100, 100, 100, 100]',
T=_T('PARE ANTES DO ARROZ TRANSBORDAR','PANELA','ESPUMA %',"['COZINHANDO','FERVENDO','SUBINDO','QUASE!','AGORA!','VAZOU!']",'PANELAS','BLUUUP!'),
tint=('#140a06','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='99%',
geo="const TABLE_Y = 968, PX = 360, PT = 780, PB = 944;\n"+_EV(16),
draw=_FACE+r"""
function stove(frame, e, off=false){ table(); ctx.fillStyle='#2a2a33'; rr(150,TABLE_Y-14,420,14,4); ctx.fill(); if (!off) flames(frame, e, TABLE_Y-12, 6, 22); }
function pot(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  const w=330, x=PX-w/2;
  ctx.fillStyle='#14151a'; rr(x-56,PT+30,60,20,10); ctx.fill(); rr(x+w-4,PT+30,60,20,10); ctx.fill();
  const g=ctx.createLinearGradient(x,0,x+w,0); g.addColorStop(0,'#8a90a0'); g.addColorStop(.45,'#f2f4f8'); g.addColorStop(1,'#7d8496');
  ctx.fillStyle=g; rr(x,PT,w,PB-PT,24); ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=3; ctx.stroke();
  if (!dead && worry>0){ ctx.fillStyle=`rgba(255,80,40,${0.15*worry})`; rr(x,PT,w,PB-PT,24); ctx.fill(); }
  // espuma escorrendo pelos lados
  if (!dead){ const R=rng(3); ctx.fillStyle='#fffdf5';
    for (let i=0;i<3+Math.floor(6*e);i++){ const dx=x+20+R()*(w-40), len=(10+R()*60)*e*e; rr(dx-8,PT-6,16,len+12,8); ctx.fill(); ctx.beginPath(); ctx.arc(dx,PT+6+len,10,0,7); ctx.fill(); }
    const fh=10+46*e; ctx.beginPath(); ctx.moveTo(x-6,PT+4); for (let i=0;i<=10;i++){ ctx.quadraticCurveTo(x+i*w/10-w/20, PT-fh-(i%2)*10-Math.sin(frame*0.6+i)*4*e, x+i*w/10, PT-fh*0.6); } ctx.lineTo(x+w+6,PT+4); ctx.closePath(); ctx.fill();
    const lift=fh*0.8+(e>0.6?Math.abs(Math.sin(frame*1.5))*10*e:0), tilt=e>0.6?Math.sin(frame*1.1)*0.06*e:0;
    ctx.save(); ctx.translate(PX,PT-lift); ctx.rotate(tilt); ctx.fillStyle='#c9ced9'; ctx.beginPath(); ctx.ellipse(0,0,w/2+8,18,0,Math.PI,0); ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.stroke();
    ctx.fillStyle='#14151a'; rr(-26,-30,52,16,8); ctx.fill(); ctx.restore(); }
  if (letter) text(letter, PX, PT+130, 44, 'rgba(60,64,78,0.32)', 900);        // letra (falsas em todo frame, certa no 0 ms)
  face(PX, PT+70, 15, worry, frame, dead, '#222', '#222');
  ctx.restore();
}
function overflow(round, tb){
  const R=rng(round.start*7919+71), g=2200;
  stove(0,0,true); pot(0,'',0,0,0,true); flash(tb,'255,255,250');
  const k=clamp(tb/0.35,0,1); ctx.fillStyle='#fffdf5';
  ctx.beginPath(); ctx.moveTo(PX-175,PT+4); for (let i=0;i<=10;i++) ctx.quadraticCurveTo(PX-175+i*35-17,PT-70-(i%2)*14,PX-175+i*35,PT-40); ctx.lineTo(PX+175,PT+4); ctx.closePath(); ctx.fill();
  for (const s of [-1,1]) for (let j=0;j<3;j++){ const xx=PX+s*(150+j*14); rr(xx-12,PT-10,24,(PB-PT+40)*k,12); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(PX,TABLE_Y-12,180+120*k,8+6*k,0,0,7); ctx.fill();
  const ly=PT-60-2200*tb+0.5*g*tb*tb; ctx.save(); ctx.translate(PX+180*tb,ly); ctx.rotate(tb*12); ctx.fillStyle='#c9ced9'; ctx.beginPath(); ctx.ellipse(0,0,170,18,0,Math.PI,0); ctx.fill(); ctx.restore();
  for (let i=0;i<36;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=300+R()*700, x=PX+Math.cos(a)*sp*tb, y=PT-40+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (y>TABLE_Y) continue;
    ctx.fillStyle='#fffbe8'; ctx.beginPath(); ctx.ellipse(x,y,5,2.6,i,0,7); ctx.fill(); }
  for (let k2=0;k2<6;k2++){ const r=20+tb*70; ctx.fillStyle=`rgba(150,150,160,${0.4*Math.max(0,1-tb*1.4)})`; ctx.beginPath(); ctx.arc(PX-150+k2*60, TABLE_Y-40-tb*160, r, 0, 7); ctx.fill(); }
  fx(T.fx, PX, 520, tb, '#8a90a0');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  if (!broke){ stove(frame, e); pot(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0); }
  else overflow(round, (lf-round.A)/FPS);
}
function coverScene(){ stove(6,1); pot(1,'',1,7,0); }
""")

# ---------------- PRIVADA ----------------
TH['privada'] = dict(title='Pare o Celular', word='MOLHADO', approach='[57, 42, 63, 48, 39, 54, 45]', style='[0, 3, 4, 1, 2, 4, 0]', bands='[12, 15, 11, 18, 14, 16, 20]',
T=_T('PARE ANTES DO CELULAR CAIR NA PRIVADA','CELULAR','NOTIFICAÇÕES',"['NA PIA','VIBRANDO','ESCORREGANDO','QUASE!','AGORA!','TCHIBUM!']",'CELULARES','TCHIBUM!'),
tint=('#04140f','rgba(0,229,160,0.045)','rgba(0,229,160,0)','rgba(0,229,160,0.10)'), cover_n='20',
geo="const TABLE_Y = 968, TOP = 700, EDGE = 400, FLOOR = 1080, PX0 = 170, BOWLX = 545;\n"+_EV(18),
draw=_FACE+r"""
function background(){
  ctx.fillStyle='#7fb0c4'; ctx.fillRect(0,0,W,FLOOR);
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=3; for (let x=0;x<=W;x+=60){ ctx.beginPath(); ctx.moveTo(x,380); ctx.lineTo(x,FLOOR); ctx.stroke(); } for (let y=380;y<=FLOOR;y+=60){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.fillStyle='#4a5560'; ctx.fillRect(0,FLOOR,W,H-FLOOR); ctx.fillStyle='rgba(0,0,0,0.08)'; for (let x=0;x<W;x+=80) ctx.fillRect(x,FLOOR,3,H-FLOOR);
  // espelho
  ctx.fillStyle='#e8f6ff'; rr(40,420,250,200,16); ctx.fill(); ctx.strokeStyle='#9aa8b4'; ctx.lineWidth=8; ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.moveTo(70,450); ctx.lineTo(120,450); ctx.lineTo(70,520); ctx.fill();
  const o=ctx.createLinearGradient(0,0,0,640); o.addColorStop(0,'rgba(8,14,24,0.95)'); o.addColorStop(0.6,'rgba(8,14,24,0.55)'); o.addColorStop(1,'rgba(8,14,24,0)'); ctx.fillStyle=o; ctx.fillRect(0,0,W,640);
}
function sink(){ ctx.fillStyle='#8a5a32'; rr(-20,TOP+30,EDGE+20,FLOOR-TOP-30,0); ctx.fill(); ctx.fillStyle='#6b4226'; for (const y of [TOP+120,TOP+240]) ctx.fillRect(10,y,EDGE-30,4);
  ctx.fillStyle='#f4f6fa'; rr(-20,TOP,EDGE+20,32,6); ctx.fill(); ctx.strokeStyle='#c9d2dc'; ctx.lineWidth=3; ctx.stroke(); ctx.fillStyle='#c9d2dc'; ctx.beginPath(); ctx.ellipse(80,TOP+6,70,10,0,0,7); ctx.fill();
  ctx.fillStyle='#b8c2cc'; rr(70,TOP-60,16,60,6); ctx.fill(); rr(70,TOP-60,70,14,6); ctx.fill(); }
function toilet(){ ctx.fillStyle='#ffffff'; rr(BOWLX+10,600,150,190,14); ctx.fill(); ctx.strokeStyle='#c9d2dc'; ctx.lineWidth=3; ctx.stroke(); ctx.fillStyle='#c9d2dc'; rr(BOWLX+110,620,36,12,6); ctx.fill();
  ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(BOWLX-110,840); ctx.quadraticCurveTo(BOWLX-100,960,BOWLX-20,980); ctx.lineTo(BOWLX-40,FLOOR); ctx.lineTo(BOWLX+90,FLOOR); ctx.lineTo(BOWLX+70,980); ctx.quadraticCurveTo(BOWLX+140,960,BOWLX+150,840); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#f4f6fa'; ctx.beginPath(); ctx.ellipse(BOWLX+20,840,130,26,0,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#6ec8ff'; ctx.beginPath(); ctx.ellipse(BOWLX+20,844,96,15,0,0,7); ctx.fill(); }
function phone(x, y, rot, letter, worry, frame, dead=false){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  const w=86, h=150;
  ctx.fillStyle='#22262f'; rr(-w/2,-h,w,h,16); ctx.fill(); ctx.strokeStyle='#0b0d12'; ctx.lineWidth=3; ctx.stroke();
  const sg=ctx.createLinearGradient(0,-h,0,0); sg.addColorStop(0, dead?'#20242c':'#2b5cff'); sg.addColorStop(1, dead?'#101216':'#0b1a44'); ctx.fillStyle=sg; rr(-w/2+6,-h+8,w-12,h-16,11); ctx.fill();
  if (!dead){ ctx.fillStyle='#ffd23f'; rr(-w/2+12,-h+16,w-24,20,6); ctx.fill(); text('NOVA MSG', 0, -h+26, 10, '#151515', 900); }
  if (letter) text(letter, 0, -24, 30, 'rgba(255,255,255,0.33)', 900);          // letra (falsas em todo frame, certa no 0 ms)
  face(0, -h*0.52, 9, worry, frame, dead, '#ffffff', '#ffffff');
  ctx.restore();
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  toilet(); sink();
  if (!broke){ const buzz=Math.sin(frame*2.6)*(1.5+3*e), x=PX0+(EDGE-PX0)*e+buzz, rot=0.25*Math.max(0,(e-0.88)/0.12)+Math.sin(frame*3.1)*0.02*e;
    if (Math.floor(frame/3)%2===0){ ctx.strokeStyle='rgba(30,40,60,0.5)'; ctx.lineWidth=3; for (const s of [-1,1]){ ctx.beginPath(); ctx.arc(x,TOP-80,60,s>0?-0.5:Math.PI-0.5+1,s>0?0.5:Math.PI+0.5); ctx.stroke(); } }
    phone(x, TOP, rot, letterAt(ri, lf, round.A, frame), worry, frame); }
  else { const tb=(lf-round.A)/FPS, tf=Math.min(tb,0.25), k=tf/0.25;
    if (tb<0.25) phone(EDGE+(BOWLX+20-EDGE)*k, TOP+(850-TOP)*k*k, 0.25+k*2.4, '', 1, frame);
    else { const ts=tb-0.25, R=rng(round.start*13+3), g=2200; flash(ts,'220,240,255');
      ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,846); ctx.clip(); phone(BOWLX+20, 900+ts*80, Math.PI, '', 0, frame, true); ctx.restore();
      for (let i=0;i<30;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=300+R()*700, x=BOWLX+20+Math.cos(a)*sp*ts, y=840+Math.sin(a)*sp*ts+0.5*g*ts*ts; if (y>850) continue;
        ctx.fillStyle='rgba(80,170,255,0.9)'; ctx.beginPath(); ctx.arc(x,y,4+R()*6,0,7); ctx.fill(); }
      for (let i=0;i<5;i++){ ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(BOWLX+R()*60, 836-((ts*120+i*20)%40), 5+R()*4, 0, 7); ctx.stroke(); }
      fx(T.fx, 400, 520, ts, '#1d4f9e'); } }
}
function coverScene(){ ctx.translate(0,-90); toilet(); sink(); phone(EDGE-6, TOP, 0.18, '', 1, 4); }
""")
