_FACE = r"""
function face(cx, ey, es, worry, frame, dead, ink, brow){
  if (dead){ ctx.strokeStyle=ink; ctx.lineWidth=5; for (const s of [-1,1]){ const ex=cx+s*es*2.6; ctx.beginPath(); ctx.moveTo(ex-es*0.7,ey-es*0.7); ctx.lineTo(ex+es*0.7,ey+es*0.7); ctx.moveTo(ex+es*0.7,ey-es*0.7); ctx.lineTo(ex-es*0.7,ey+es*0.7); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx-es*1.2,ey+es*2.6); for(let i=0;i<=6;i++) ctx.lineTo(cx-es*1.2+i*es*0.4, ey+es*2.6+(i%2?-es*0.3:es*0.3)); ctx.stroke(); return; }
  for (const s of [-1,1]){ const ex=cx+s*es*2.6;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill(); ctx.strokeStyle='#222'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex, ey+3-worry*es*0.6, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle=brow; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(ex-s*es*1.1, ey-es*1.6-worry*4); ctx.lineTo(ex+s*es*0.8, ey-es*2.2); ctx.stroke(); } }
  ctx.fillStyle=ink; if (worry>0.6){ ctx.beginPath(); ctx.ellipse(cx, ey+es*2.6, es*0.55, es*0.75, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle=ink; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx, ey+es*1.6, es, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
  if (worry>0.55){ const dy=(frame*2)%24, sx=cx+es*5, sy=ey-es+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.quadraticCurveTo(sx-8,sy+4,sx,sy+6); ctx.quadraticCurveTo(sx+8,sy+4,sx,sy-10); ctx.fill(); }
}
function fx(txt, x, y, tb, stroke){ if (tb>=0.34) return; const kk=tb/0.34, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(x,y); ctx.scale(s,s); ctx.rotate(-0.08);
  ctx.font='900 100px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle=stroke; ctx.strokeText(txt,0,0); ctx.fillStyle='#fff'; ctx.fillText(txt,0,0); ctx.restore(); }
function flash(tb, col){ if (tb<0.07){ ctx.fillStyle=`rgba(${col},${0.4*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); } }
function flames(frame, e, y, n, sp){ for (let i=-n;i<=n;i++){ const fx2=PX+i*sp, fl=10+(6+12*e)*(0.6+0.4*Math.sin(frame*0.9+i*1.7));
  ctx.fillStyle='rgba(80,140,255,0.9)'; ctx.beginPath(); ctx.moveTo(fx2-7,y); ctx.quadraticCurveTo(fx2,y-fl*2,fx2+7,y); ctx.fill();
  ctx.fillStyle='rgba(255,180,80,0.9)'; ctx.beginPath(); ctx.moveTo(fx2-3,y); ctx.quadraticCurveTo(fx2,y-fl,fx2+3,y); ctx.fill(); } }
"""
def _T(title, item, bands, st, items, fx):
    return f"""const T = {{
  title:'{title}', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'{item}', bands:'{bands}', st:{st}, lim:'LIMITE', boom:'EXPLOSÃO', gauge:'', items:'{items}', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'SÓ A LETRA DO 0 MS VALE', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'{fx}'
}};"""
_EV = lambda n: f"""const EVENTS = []; ROUNDS.forEach((r,i)=>{{ let last=0; for(let lf=0; lf<=r.A; lf++){{ const n=Math.floor(ease(lf/r.A,r.style)*{n}); if(n>last){{ EVENTS.push(r.start+lf); last=n; }} }} }});"""

# ---------------- LIQUIDIFICADOR ----------------
TH['liqui'] = dict(title='Pare o Liquidificador', word='FOGUETE', approach='[54, 45, 60, 42, 57, 48, 39]', style='[0, 4, 1, 2, 3, 4, 1]', bands='[10, 10, 10, 10, 10, 10, 10]',
T=_T('PARE ANTES DO LIQUIDIFICADOR EXPLODIR','LIQUIDIFICADOR','VELOCIDADE',"['LIGADO','BATENDO','TURBO','QUASE!','AGORA!','SPLASH!']",'LIQUIDIFICADORES','SPLASH!'),
tint=('#100818','rgba(180,120,255,0.05)','rgba(180,120,255,0)','rgba(180,120,255,0.10)'), cover_n='10',
geo="const TABLE_Y = 968, PX = 360, JT = 520, JB = 830;\n"+_EV(10),
draw=_FACE+r"""
function jarPath(){ ctx.beginPath(); ctx.moveTo(PX-95,JT); ctx.lineTo(PX+95,JT); ctx.lineTo(PX+72,JB); ctx.lineTo(PX-72,JB); ctx.closePath(); }
function blender(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(PX,TABLE_Y+2,130,10,0,0,7); ctx.fill();
  // base
  const bg=ctx.createLinearGradient(PX-110,0,PX+110,0); bg.addColorStop(0,'#2a2d36'); bg.addColorStop(.5,'#4a4f5c'); bg.addColorStop(1,'#22252d');
  ctx.fillStyle=bg; ctx.beginPath(); ctx.moveTo(PX-90,JB); ctx.lineTo(PX+90,JB); ctx.lineTo(PX+115,TABLE_Y); ctx.lineTo(PX-115,TABLE_Y); ctx.closePath(); ctx.fill();
  for (let i=0;i<5;i++){ const on=!dead && i < Math.ceil(e*5); ctx.fillStyle= on ? (i<3?'#3cf0a0':i<4?'#ffd23f':'#ff4d5e') : '#555a66'; ctx.beginPath(); ctx.arc(PX-56+i*28,JB+26,8,0,7); ctx.fill(); }
  if (letter) text(letter, PX, JB+82, 48, 'rgba(255,255,255,0.30)', 900);        // letra (falsas em todo frame, certa no 0 ms)
  // jarra
  ctx.save(); jarPath(); ctx.clip();
  ctx.fillStyle='rgba(210,235,255,0.12)'; ctx.fillRect(PX-100,JT,200,JB-JT);
  if (!dead){ const lvl=690-30*e, dep=20+110*e, sp=frame*(0.3+1.5*e);
    ctx.fillStyle='#5b1f7a'; ctx.beginPath(); ctx.moveTo(PX-100,lvl-10*e); ctx.quadraticCurveTo(PX-40,lvl, PX, lvl+dep); ctx.quadraticCurveTo(PX+40,lvl, PX+100,lvl-10*e); ctx.lineTo(PX+100,JB); ctx.lineTo(PX-100,JB); ctx.fill();
    ctx.strokeStyle='rgba(200,140,255,0.6)'; ctx.lineWidth=3; for (let k=0;k<5;k++){ const yy=lvl+20+k*24, ph=sp+k; ctx.beginPath(); ctx.ellipse(PX+Math.sin(ph)*10, yy, 60-k*6, 8, 0, ph, ph+2.4); ctx.stroke(); }
    const R=rng(frame); ctx.fillStyle='rgba(120,50,160,0.9)'; for (let i=0;i<Math.floor(14*e);i++){ ctx.beginPath(); ctx.arc(PX-80+R()*160, lvl-10-R()*80*e, 3+R()*5, 0, 7); ctx.fill(); } }
  ctx.restore();
  jarPath(); ctx.strokeStyle='rgba(230,245,255,0.85)'; ctx.lineWidth=4; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(PX-78,JT+20,8,JB-JT-40);
  ctx.strokeStyle='rgba(230,245,255,0.85)'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(PX+90,JT+40); ctx.quadraticCurveTo(PX+150,JT+60,PX+82,JT+200); ctx.stroke();
  if (!dead){ const lift=34*e*e+(e>0.8?Math.abs(Math.sin(frame*1.4))*10*e:0); ctx.fillStyle='#151821'; rr(PX-104,JT-24-lift,208,26,8); ctx.fill(); rr(PX-24,JT-44-lift,48,22,6); ctx.fill(); }
  face(PX, JT+60, 15, worry, frame, dead, '#ffffff', '#ffffff');
  ctx.restore();
}
function splash(round, tb){
  const R=rng(round.start*7919+3), g=2200;
  blender(0,'',0,0,0,true); flash(tb,'230,200,255');
  const ly=JT-30-2600*tb+0.5*g*tb*tb; ctx.save(); ctx.translate(PX-200*tb,ly); ctx.rotate(-tb*16); ctx.fillStyle='#151821'; rr(-104,-13,208,26,8); ctx.fill(); ctx.restore();
  const sk=clamp(tb/0.3,0,1);
  for (let i=0;i<10;i++){ const x=80+R()*560, y=420+R()*420, r=(12+R()*30)*sk; ctx.fillStyle='rgba(91,31,122,0.85)'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.fillRect(x-r*0.2,y,r*0.4,r*1.6*sk); }
  for (let i=0;i<46;i++){ const a=-Math.PI*(0.05+0.9*R()), sp=500+R()*1100, x=PX+Math.cos(a)*sp*tb, y=JT+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (y>TABLE_Y) continue;
    ctx.fillStyle= i%4 ? 'rgba(110,40,150,0.95)' : 'rgba(200,150,255,0.95)'; ctx.beginPath(); ctx.arc(x,y,4+R()*8,0,7); ctx.fill(); }
  ctx.fillStyle='rgba(91,31,122,0.85)'; ctx.beginPath(); ctx.ellipse(PX,TABLE_Y+2,120+170*sk,6+4*sk,0,0,7); ctx.fill();
  fx(T.fx, PX, 460, tb, '#5b1f7a');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table();
  if (!broke) blender(e, letterAt(ri, lf, round.A, frame), worry, frame, (jitter||0)+(e>0.5?Math.sin(frame*3)*3*e:0));
  else splash(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); blender(1, '', 1, 7, 0); }
""")

# ---------------- CHALEIRA ----------------
TH['chaleira'] = dict(title='Pare a Chaleira', word='MILAGRE', approach='[57, 42, 60, 48, 39, 54, 45]', style='[1, 2, 4, 0, 3, 4, 2]', bands='[100, 100, 100, 100, 100, 100, 100]',
T=_T('PARE ANTES DA CHALEIRA APITAR','CHALEIRA','ÁGUA °C',"['MORNA','ESQUENTANDO','FERVENDO','QUASE!','AGORA!','PIIIII!']",'CHALEIRAS','PIIIII!'),
tint=('#160606','rgba(255,120,80,0.05)','rgba(255,120,80,0)','rgba(255,120,80,0.10)'), cover_n='99°',
geo="const TABLE_Y = 968, PX = 340, KY = 820;\n"+_EV(16),
draw=_FACE+r"""
function stove(frame, e){ table(); ctx.fillStyle='#2a2a33'; rr(150,TABLE_Y-14,420,14,4); ctx.fill(); flames(frame, e, TABLE_Y-12, 5, 24); }
function kettle(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  const sx=1+0.04*e;
  // bico
  ctx.fillStyle='#d62839'; ctx.beginPath(); ctx.moveTo(PX+120,KY+10); ctx.quadraticCurveTo(PX+190,KY-10,PX+218,KY-80); ctx.lineTo(PX+240,KY-70); ctx.quadraticCurveTo(PX+210,KY+20,PX+120,KY+60); ctx.fill();
  if (!dead){ const vib=e>0.6?Math.sin(frame*3)*4*e:0; ctx.save(); ctx.translate(PX+229+vib*0.3,KY-82); ctx.rotate(-0.5+vib*0.02);
    ctx.fillStyle='#e6e9f0'; rr(-16,-20,32,26,8); ctx.fill(); ctx.fillStyle='#222'; ctx.fillRect(-8,-24,16,6); ctx.restore(); }
  // corpo
  const g=ctx.createRadialGradient(PX-50,KY-40,10,PX,KY+20,190); g.addColorStop(0, dead?'#6a3a3a':'#ff6b6b'); g.addColorStop(.6, dead?'#4a2424':'#d62839'); g.addColorStop(1,'#7a0f1a');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(PX,KY+30,150*sx,120,0,Math.PI*1.05,Math.PI*-0.05); ctx.lineTo(PX+150*sx,TABLE_Y-20); ctx.lineTo(PX-150*sx,TABLE_Y-20); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#7a0f1a'; rr(PX-158*sx,TABLE_Y-30,316*sx,16,6); ctx.fill();
  if (!dead && worry>0){ ctx.fillStyle=`rgba(255,200,60,${0.12*worry})`; ctx.beginPath(); ctx.ellipse(PX,KY+30,150*sx,120,0,0,7); ctx.fill(); }
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(PX-80,KY-20,18,40,-0.4,0,7); ctx.fill();
  // tampa + alca
  if (!dead){ const lift=e>0.7?Math.abs(Math.sin(frame*1.6))*8*e:0; ctx.fillStyle='#b81f30'; ctx.beginPath(); ctx.ellipse(PX,KY-80-lift,70,16,0,0,7); ctx.fill(); ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(PX,KY-96-lift,12,0,7); ctx.fill(); }
  ctx.strokeStyle='#222'; ctx.lineWidth=12; ctx.beginPath(); ctx.moveTo(PX-110,KY-50); ctx.quadraticCurveTo(PX,KY-200,PX+110,KY-50); ctx.stroke();
  if (letter) text(letter, PX, KY+104, 42, 'rgba(255,225,225,0.4)', 900);       // letra (falsas em todo frame, certa no 0 ms)
  face(PX, KY+24, 16, worry, frame, dead, '#3a0a10', '#3a0a10');
  ctx.restore();
}
function steam(e, frame){ const n=2+Math.floor(14*e);
  for (let k=0;k<n;k++){ const age=((frame*(1+3*e)+k*17)%60)/60, x=PX+236+age*(60+80*e)+Math.sin(k*1.7+age*4)*20*age, y=KY-100-age*(160+200*e), r=8+age*(24+36*e);
    ctx.fillStyle=`rgba(240,244,255,${(1-age)*(0.3+0.4*e)})`; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } }
function whistle(round, tb){
  const R=rng(round.start*7919+11), g=2200;
  flash(tb,'255,255,255');
  const hop = Math.max(0, 420*tb-1400*tb*tb);
  ctx.save(); ctx.translate(0,-hop); kettle(1,'',0,0,0,true); ctx.restore();
  // jato de vapor e tampa voando
  const k=clamp(tb/0.15,0,1); for (let i=0;i<14;i++){ const d=i/14, x=PX+240+d*420*k, y=KY-110-hop-d*300*k, r=14+d*60;
    ctx.fillStyle=`rgba(245,248,255,${0.75*(1-d*0.6)*Math.max(0,1-tb*1.2)})`; ctx.beginPath(); ctx.arc(x+Math.sin(i+tb*20)*10,y,r,0,7); ctx.fill(); }
  const ly=KY-90-2400*tb+0.5*g*tb*tb; ctx.save(); ctx.translate(PX-160*tb,ly); ctx.rotate(-tb*14); ctx.fillStyle='#b81f30'; ctx.beginPath(); ctx.ellipse(0,0,70,16,0,0,7); ctx.fill(); ctx.restore();
  for (let i=0;i<24;i++){ const a=-Math.PI*R(), sp=300+R()*700, x=PX+Math.cos(a)*sp*tb, y=KY-80+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (y>TABLE_Y) continue;
    ctx.fillStyle='rgba(126,200,255,0.9)'; ctx.beginPath(); ctx.ellipse(x,y,4,6,0,0,7); ctx.fill(); }
  fx(T.fx, 400, 470, tb, '#d62839');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  stove(frame, broke?1:e);
  if (!broke){ steam(e, frame); kettle(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0); }
  else whistle(round, (lf-round.A)/FPS);
}
function coverScene(){ stove(6,1); steam(1,6); steam(0.8,25); kettle(1,'',1,7,0); }
""")

# ---------------- TORRADEIRA ----------------
TH['torra'] = dict(title='Pare a Torradeira', word='GIGANTE', approach='[51, 60, 42, 57, 45, 39, 54]', style='[2, 0, 4, 1, 3, 2, 4]', bands='[100, 100, 100, 100, 100, 100, 100]',
T=_T('PARE ANTES DA TORRADEIRA PULAR','TORRADEIRA','QUEIMADO %',"['LIGADA','DOURANDO','QUEIMANDO','QUASE!','AGORA!','PLOFT!']",'TORRADEIRAS','PLOFT!'),
tint=('#140c03','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='99%',
geo="const TABLE_Y = 968, PX = 360, TT = 740;\n"+_EV(20),
draw=_FACE+r"""
function bread(x, y, burn, rot=0){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  const c1=`rgb(${Math.round(230-200*burn)},${Math.round(190-170*burn)},${Math.round(120-110*burn)})`, c2=`rgb(${Math.round(160-140*burn)},${Math.round(100-90*burn)},${Math.round(50-45*burn)})`;
  ctx.fillStyle=c2; ctx.beginPath(); ctx.moveTo(-44,40); ctx.lineTo(-44,-20); ctx.quadraticCurveTo(-48,-56,-20,-56); ctx.quadraticCurveTo(0,-70,20,-56); ctx.quadraticCurveTo(48,-56,44,-20); ctx.lineTo(44,40); ctx.closePath(); ctx.fill();
  ctx.fillStyle=c1; ctx.beginPath(); ctx.moveTo(-36,36); ctx.lineTo(-36,-18); ctx.quadraticCurveTo(-38,-48,-16,-48); ctx.quadraticCurveTo(0,-60,16,-48); ctx.quadraticCurveTo(38,-48,36,-18); ctx.lineTo(36,36); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function toaster(e, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(PX,TABLE_Y+2,170,10,0,0,7); ctx.fill();
  if (!dead){ bread(PX-60, TT+4, e); bread(PX+60, TT+4, e); }
  const g=ctx.createLinearGradient(PX-160,0,PX+160,0); g.addColorStop(0, dead?'#5a5e68':'#9aa0ae'); g.addColorStop(.45, dead?'#8a8f9a':'#f2f4f8'); g.addColorStop(1, dead?'#3a3d44':'#7d8496');
  ctx.fillStyle=g; rr(PX-160,TT,320,TABLE_Y-TT-6,56); ctx.fill(); ctx.strokeStyle='#4a4f5c'; ctx.lineWidth=3; ctx.stroke();
  if (!dead && worry>0){ ctx.fillStyle=`rgba(255,80,30,${0.18*worry})`; rr(PX-160,TT,320,TABLE_Y-TT-6,56); ctx.fill(); }
  // fendas com brilho
  for (const sx of [-60,60]){ ctx.fillStyle='#1a1a1a'; rr(PX+sx-50,TT+8,100,16,8); ctx.fill();
    if (!dead){ ctx.fillStyle=`rgba(255,120,30,${0.3+0.6*e})`; rr(PX+sx-46,TT+11,92,10,5); ctx.fill(); } }
  // alavanca
  ctx.fillStyle='#4a4f5c'; ctx.fillRect(PX+160,TT+40,10,140); ctx.fillStyle='#222'; rr(PX+160,(dead?TT+40:TT+150),40,22,6); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillRect(PX-130,TT+30,10,150);
  if (letter) text(letter, PX, TT+170, 46, 'rgba(60,64,78,0.32)', 900);       // letra (falsas em todo frame, certa no 0 ms)
  face(PX, TT+80, 16, worry, frame, dead, '#2a2d36', '#2a2d36');
  ctx.restore();
}
function smoke(e, frame){ const n=Math.floor(14*e*e);
  for (let k=0;k<n;k++){ const age=((frame*(1+2*e)+k*19)%50)/50, x=PX+(k%2?60:-60)+Math.sin(k*2.1+age*3)*26*age, y=TT-age*(200+180*e), r=8+age*(20+34*e);
    ctx.fillStyle=`rgba(70,70,80,${(1-age)*0.55*e})`; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } }
function ploft(round, tb){
  const R=rng(round.start*7919+19), g=2600;
  toaster(0,'',0,0,0,true); flash(tb,'255,230,200');
  for (const [dx,vx,sp] of [[-60,-160,-9],[60,180,11]]){ const y=TT-1500*tb+0.5*g*tb*tb; bread(PX+dx+vx*tb, Math.min(y,TT), 1, tb*sp); }
  for (let k=0;k<10;k++){ const a=R()*Math.PI*2, d=(60+R()*120)*Math.min(1,tb*3), r=30+R()*40+tb*90;
    ctx.fillStyle=`rgba(50,50,60,${0.6*Math.max(0,1-tb*1.3)})`; ctx.beginPath(); ctx.arc(PX+Math.cos(a)*d, TT-40+Math.sin(a)*d*0.5-tb*200, r, 0, 7); ctx.fill(); }
  for (let i=0;i<30;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=300+R()*800, x=PX+Math.cos(a)*sp*tb, y=TT+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (y>TABLE_Y) continue;
    ctx.fillStyle= i%2?'#3a2210':'#1a1008'; ctx.beginPath(); ctx.arc(x,y,2+R()*4,0,7); ctx.fill(); }
  fx(T.fx, PX, 470, tb, '#5a3a10');
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table();
  if (!broke){ smoke(e, frame); toaster(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0); }
  else ploft(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); smoke(1,6); smoke(0.9,30); toaster(1,'',1,7,0); }
""")
