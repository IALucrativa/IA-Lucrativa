# Gera um video "pare antes de X" a partir do motor da melancia + um tema
import sys, re
base = open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/melancia_base.html').read()
theme = sys.argv[1]; out = sys.argv[2]
TH = {}
TH['prensa'] = dict(
title='Pare a Prensa', word='TESOURO', approach='[54, 42, 60, 48, 63, 39, 57]', style='[0, 2, 1, 3, 2, 0, 1]', bands='[38, 42, 35, 47, 40, 44, 50]',
T="""const T = {
  title:'PARE ANTES DO CELULAR QUEBRAR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'CELULAR', bands:'TONELADAS', st:['LONGE','DESCENDO','APERTANDO','QUASE!','AGORA!','QUEBROU!'],
  lim:'LIMITE', boom:'QUEBRA', gauge:'PRESSÃO', items:'CELULARES',
  gold:'CELULAR DE OURO! LETRA', join:'JUNTE AS 7 LETRAS E COMENTA A PALAVRA',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA CELULAR', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'CRACK!'
};""",
tint=('#140c03','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='50',
geo=r"""const TABLE_Y = 968, PX = 360, PLATE_START = 486, PHONE_TOP = 708;
const EVENTS = [];   // pulsos hidraulicos (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*8); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function pressFrame(){
  const g=ctx.createLinearGradient(0,390,0,450); g.addColorStop(0,'#5a5f6e'); g.addColorStop(1,'#2a2e38');
  ctx.fillStyle='#1b1e26'; ctx.fillRect(118,392,40,TABLE_Y-392); ctx.fillRect(562,392,40,TABLE_Y-392);
  ctx.fillStyle='rgba(255,159,67,0.35)'; ctx.fillRect(154,392,3,TABLE_Y-392); ctx.fillRect(562,392,3,TABLE_Y-392);
  ctx.fillStyle=g; rr(96,388,528,60,10); ctx.fill();
  // faixa de perigo
  ctx.save(); rr(96,430,528,16,4); ctx.clip(); ctx.fillStyle='#f5c842'; ctx.fillRect(96,430,528,16);
  ctx.fillStyle='#111'; for(let x=80;x<640;x+=36){ ctx.beginPath(); ctx.moveTo(x,446); ctx.lineTo(x+18,430); ctx.lineTo(x+36,430); ctx.lineTo(x+18,446); ctx.fill(); } ctx.restore();
  ctx.fillStyle='#3a3f4c'; rr(300,446,120,48,8); ctx.fill(); ctx.fillStyle='#ff4d5e'; ctx.fillRect(300,470,120,6);
}
function plate(bottom){
  const g=ctx.createLinearGradient(330,0,390,0); g.addColorStop(0,'#8c93a3'); g.addColorStop(.5,'#eef1f6'); g.addColorStop(1,'#7a8191');
  ctx.fillStyle=g; ctx.fillRect(334,494,52,Math.max(0,bottom-40-494));
  const pg=ctx.createLinearGradient(0,bottom-40,0,bottom); pg.addColorStop(0,'#6c7384'); pg.addColorStop(1,'#2c303b');
  ctx.fillStyle=pg; rr(210,bottom-40,300,40,6); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(214,bottom-38,292,3);
  text('50T', 360, bottom-20, 16, 'rgba(232,240,254,0.7)', 900);
}
function phone(cx, gold, letter, worry, frame){
  const w=150, h=260, x=cx-w/2, y=PHONE_TOP;
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx,TABLE_Y+2,100,10,0,0,7); ctx.fill();
  let g=ctx.createLinearGradient(x,0,x+w,0);
  if (gold){ g.addColorStop(0,'#9c6c00'); g.addColorStop(.5,'#ffe27a'); g.addColorStop(1,'#8a5f00'); } else { g.addColorStop(0,'#2c3140'); g.addColorStop(.5,'#4a5166'); g.addColorStop(1,'#22262f'); }
  ctx.fillStyle=g; rr(x,y,w,h,26); ctx.fill(); ctx.strokeStyle='#0b0d12'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle= gold?'#8a5f00':'#151821'; ctx.fillRect(x-4,y+60,4,36); ctx.fillRect(x+w,y+70,4,50);
  const sg=ctx.createLinearGradient(0,y,0,y+h); if (gold){ sg.addColorStop(0,'#fff6c0'); sg.addColorStop(1,'#f5c842'); } else { sg.addColorStop(0,'#2b5cff'); sg.addColorStop(1,'#0b1a44'); }
  ctx.fillStyle=sg; rr(x+10,y+14,w-20,h-28,16); ctx.fill();
  ctx.fillStyle='#0b0d12'; rr(cx-22,y+22,44,10,5); ctx.fill();
  if (gold){ ctx.save(); ctx.shadowColor='rgba(90,60,0,0.8)'; ctx.shadowOffsetY=5; text(letter, cx, y+h/2+6, 110, '#fffbe6', 900); ctx.restore();
    ctx.textAlign='center'; ctx.strokeStyle='rgba(122,86,0,0.6)'; ctx.lineWidth=2; ctx.font='900 110px Inter'; ctx.strokeText(letter,cx,y+h/2+6); return; }
  // bateria e hora
  text('12:00', x+26, y+44, 12, 'rgba(255,255,255,0.8)', 800, 'left');
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=1.5; ctx.strokeRect(x+w-42,y+38,20,10); ctx.fillStyle= worry>0.6?'#ff4d5e':'#7cff6b'; ctx.fillRect(x+w-40,y+40,Math.max(2,16*(1-worry*0.9)),6);
  const ey=y+122, es=15;
  for (const s of [-1,1]){ const ex=cx+s*30;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex, ey+3-worry*9, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#fff'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(ex-s*16, ey-es*1.6-worry*4); ctx.lineTo(ex+s*12, ey-es*2.2); ctx.stroke(); } }
  if (worry>0.6){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx, ey+52, 9, 12, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle='#fff'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.arc(cx, ey+34, 14, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
  if (worry>0.55){ const dy=(frame*2)%26, sx=cx+56, sy=y+80+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.quadraticCurveTo(sx-8,sy+4,sx,sy+6); ctx.quadraticCurveTo(sx+8,sy+4,sx,sy-10); ctx.fill(); }
}
function crush(round, tb){
  const R=rng(round.start*7919+5), g=2300, cy=TABLE_Y-30;
  ctx.fillStyle='#22262f'; rr(250,TABLE_Y-26,220,26,6); ctx.fill(); ctx.fillStyle='#2b5cff'; ctx.fillRect(262,TABLE_Y-20,196,8);
  if (tb<0.22){ const k=tb/0.22; ctx.strokeStyle=`rgba(255,255,255,${1-k})`; ctx.lineWidth=6*(1-k)+1; ctx.beginPath(); ctx.ellipse(360,cy,120+260*k,20+50*k,0,0,7); ctx.stroke();
    if (tb<0.07){ ctx.fillStyle=`rgba(200,240,255,${0.4*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); } }
  for(let i=0;i<26;i++){ const dir=R()<0.5?-1:1, vx=dir*(300+R()*900), vy=-200-R()*700, x=360+dir*(60+R()*60)+vx*tb, y=cy+vy*tb+0.5*g*tb*tb, s=8+R()*16;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*(8+i)); ctx.fillStyle= i%3? 'rgba(170,230,255,0.9)':'#ffffff';
    ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s*0.6,-s*0.8); ctx.lineTo(s*0.4,s*0.7); ctx.closePath(); ctx.fill(); ctx.restore(); }
  for(let i=0;i<12;i++){ const dir=R()<0.5?-1:1, vx=dir*(250+R()*700), vy=-300-R()*600, x=360+vx*tb, y=cy+vy*tb+0.5*g*tb*tb;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*10+i); ctx.fillStyle= i%2?'#2c3140':'#1f8a4c'; ctx.fillRect(-10,-6,20,12);
    if(i%2===0){ ctx.fillStyle='#f5c842'; ctx.fillRect(-8,-2,16,2); } ctx.restore(); }
  for(let i=0;i<16;i++){ const a=Math.PI+R()*Math.PI, sp=500+R()*700, x=360+Math.cos(a)*sp*tb, y=cy+Math.sin(a)*sp*tb*0.6+300*tb*tb;
    if (tb<0.35){ ctx.strokeStyle='#ffd23f'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-Math.cos(a)*16,y-Math.sin(a)*10); ctx.stroke(); } }
  if (tb<0.3){ const k=tb/0.3, s=1+0.6*k; ctx.save(); ctx.globalAlpha=1-k*k; ctx.translate(360,820); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 96px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=12; ctx.strokeStyle='#ff4d5e'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table(); pressFrame();
  let bottom;
  if (!broke) bottom = PLATE_START + (PHONE_TOP-PLATE_START)*e;
  else { const tb=(lf-round.A)/FPS; const k=clamp(tb/0.07,0,1); bottom = PHONE_TOP + (TABLE_Y-26-PHONE_TOP)*k; }
  if (!broke){ phone(PX+jitter, false, '', worry, frame); text(letterAt(ri, lf, round.A, frame), PX+jitter, PHONE_TOP+222, 40, 'rgba(255,255,255,0.33)', 900); }
  else crush(round, (lf-round.A)/FPS);
  plate(bottom);
}
function coverScene(){ table(); pressFrame(); phone(PX, false, '', 1, 4); plate(PHONE_TOP-14); }
""")
TH['panela'] = dict(
title='Pare a Panela', word='VITÓRIA', approach='[57, 45, 63, 39, 54, 60, 42]', style='[1, 3, 0, 2, 1, 0, 2]', bands='[15, 17, 16, 18, 15, 17, 19]',
T="""const T = {
  title:'PARE ANTES DA PANELA EXPLODIR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'PANELA', bands:'PRESSÃO PSI', st:['MORNA','ESQUENTANDO','CHIANDO','QUASE!','AGORA!','EXPLODIU!'],
  lim:'LIMITE', boom:'EXPLOSÃO', gauge:'PRESSÃO', items:'PANELAS',
  gold:'PANELA DE OURO! LETRA', join:'JUNTE AS 7 LETRAS E COMENTA A PALAVRA',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA PANELA', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'BOOM!'
};""",
tint=('#160505','rgba(255,77,94,0.05)','rgba(255,120,60,0)','rgba(255,120,60,0.10)'), cover_n='19',
geo=r"""const TABLE_Y = 968, PX = 360, POT_TOP = 792, POT_BOT = 940;
const EVENTS = [];   // giros da valvula (audio)
ROUNDS.forEach((r,i)=>{ let ph=0, last=0; for(let lf=0; lf<=r.A; lf++){ ph += 0.3+1.6*ease(lf/r.A,r.style); const n=Math.floor(ph/Math.PI); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function stove(frame, e){
  table();
  ctx.fillStyle='#2a2a33'; rr(150,TABLE_Y-14,420,14,4); ctx.fill();
  for (let i=-6;i<=6;i++){ const fx=PX+i*22, fl=10+(6+12*e)*(0.6+0.4*Math.sin(frame*0.9+i*1.7));
    ctx.fillStyle='rgba(80,140,255,0.9)'; ctx.beginPath(); ctx.moveTo(fx-7,TABLE_Y-12); ctx.quadraticCurveTo(fx,TABLE_Y-12-fl*2,fx+7,TABLE_Y-12); ctx.fill();
    ctx.fillStyle='rgba(255,180,80,0.9)'; ctx.beginPath(); ctx.moveTo(fx-3,TABLE_Y-12); ctx.quadraticCurveTo(fx,TABLE_Y-12-fl,fx+3,TABLE_Y-12); ctx.fill(); }
  // botoes do fogao
  for (const x of [190,250,470,530]){ ctx.fillStyle='#d9dce3'; ctx.beginPath(); ctx.arc(x,TABLE_Y+20,10,0,7); ctx.fill(); ctx.fillStyle='#333'; ctx.fillRect(x-1.5,TABLE_Y+12,3,8); }
}
function steam(cx, e, frame){
  const n = 3 + Math.floor(14*e);
  for (let k=0;k<n;k++){ const age=((frame*(1+3*e)+k*17)%60)/60, y=POT_TOP-96-age*(200+220*e), x=cx+Math.sin(k*1.7+age*4)*36*age, r=8+age*(26+40*e);
    ctx.fillStyle=`rgba(240,244,255,${(1-age)*(0.35+0.35*e)})`; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }
}
function pot(cx, e, gold, letter, worry, frame, lid=true){
  const sx=1+0.08*e, w=290*sx, x=cx-w/2, h=POT_BOT-POT_TOP;
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx,TABLE_Y-12,w*0.55,10,0,0,7); ctx.fill();
  const mk=(a,b,c)=>{ const g=ctx.createLinearGradient(x,0,x+w,0); g.addColorStop(0,a); g.addColorStop(.45,b); g.addColorStop(1,c); return g; };
  ctx.fillStyle='#14151a'; rr(x-66,POT_TOP+26,70,24,12); ctx.fill();
  ctx.fillStyle= gold? mk('#9c6c00','#ffe27a','#8a5f00') : mk('#7d8496','#eef1f6','#6b7183'); rr(x,POT_TOP,w,h,30); ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=3; ctx.stroke();
  if (!gold && worry>0){ ctx.fillStyle=`rgba(255,60,40,${0.22*worry})`; rr(x,POT_TOP,w,h,30); ctx.fill(); }
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(x+30,POT_TOP+16,10,h-36);
  if (lid){
    ctx.fillStyle= gold?'#e8b42a':'#c9ced9'; ctx.beginPath(); ctx.ellipse(cx,POT_TOP+4,w/2+10,44,0,Math.PI,0); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#14151a'; rr(cx-60,POT_TOP-56,300,22,10); ctx.fill();
    ctx.fillStyle='#8a90a0'; rr(cx-12,POT_TOP-80,24,30,4); ctx.fill();
    const sp=frame*(0.3+1.6*e), wob=Math.sin(sp)*(4+10*e);
    ctx.save(); ctx.translate(cx,POT_TOP-88); ctx.rotate(wob*0.03); ctx.fillStyle='#4a4f60'; ctx.beginPath(); ctx.ellipse(0,0,18,12,0,0,7); ctx.fill();
    ctx.fillStyle='#d9dce3'; ctx.fillRect(Math.cos(sp)*12-2,-10,4,20); ctx.restore();
  }
  if (gold){ ctx.save(); ctx.shadowColor='rgba(90,60,0,0.8)'; ctx.shadowOffsetY=5; text(letter, cx, POT_TOP+h/2+8, 110, '#fffbe6', 900); ctx.restore();
    ctx.textAlign='center'; ctx.strokeStyle='rgba(122,86,0,0.6)'; ctx.lineWidth=2; ctx.font='900 110px Inter'; ctx.strokeText(letter,cx,POT_TOP+h/2+8); return; }
  const ey=POT_TOP+62, es=15;
  for (const s of [-1,1]){ const ex=cx+s*44;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill(); ctx.strokeStyle='#222'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex, ey+3-worry*9, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#222'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(ex-s*16, ey-es*1.6-worry*4); ctx.lineTo(ex+s*12, ey-es*2.2); ctx.stroke(); } }
  ctx.fillStyle='#222';
  if (worry>0.6){ ctx.beginPath(); ctx.ellipse(cx, ey+50, 10, 13, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle='#222'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx, ey+30, 16, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
  if (worry>0.55){ const dy=(frame*2)%26, sx2=cx+w/2-30, sy=POT_TOP+30+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx2,sy-10); ctx.quadraticCurveTo(sx2-8,sy+4,sx2,sy+6); ctx.quadraticCurveTo(sx2+8,sy+4,sx2,sy-10); ctx.fill(); }
}
function blast(round, tb){
  const R=rng(round.start*7919+9), g=2300;
  pot(PX, 0.4, false, '', 0, 0, false);
  ctx.fillStyle='#3a1d0e'; ctx.beginPath(); ctx.ellipse(PX,POT_TOP+4,150,18,0,0,7); ctx.fill();
  for (let k=0;k<10;k++){ const a=R()*Math.PI*2, d=(80+R()*120)*Math.min(1,tb*3), r=40+R()*60+tb*120;
    ctx.fillStyle=`rgba(240,244,255,${0.55*Math.max(0,1-tb*1.4)})`; ctx.beginPath(); ctx.arc(PX+Math.cos(a)*d, POT_TOP-60+Math.sin(a)*d*0.6-tb*200, r, 0, 7); ctx.fill(); }
  if (tb<0.07){ ctx.fillStyle=`rgba(255,240,220,${0.4*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); }
  // tampa voando
  const ly=POT_TOP-30-2800*tb+0.5*g*tb*tb, lx=PX+240*tb; ctx.save(); ctx.translate(lx,ly); ctx.rotate(tb*14);
  ctx.fillStyle='#c9ced9'; ctx.beginPath(); ctx.ellipse(0,0,165,42,0,Math.PI,0); ctx.fill(); ctx.fillStyle='#14151a'; rr(-60,-60,300,22,10); ctx.fill(); ctx.restore();
  // feijao e caldo
  for (let i=0;i<46;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=500+R()*1100, x=PX+(R()-0.5)*200+Math.cos(a)*sp*tb, y=POT_TOP+Math.sin(a)*sp*tb+0.5*g*tb*tb;
    ctx.save(); ctx.translate(x,y); ctx.rotate(i+tb*8);
    if (i%3){ ctx.fillStyle='#4a2412'; ctx.beginPath(); ctx.ellipse(0,0,8,5,0,0,7); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(-3,-3,4,1.5); }
    else { ctx.fillStyle='rgba(110,55,25,0.9)'; ctx.beginPath(); ctx.arc(0,0,4+R()*5,0,7); ctx.fill(); }
    ctx.restore(); }
  const sk=clamp(tb/0.4,0,1); ctx.fillStyle='rgba(74,36,18,0.85)'; ctx.beginPath(); ctx.ellipse(PX,TABLE_Y+1,80+180*sk,5+4*sk,0,0,7); ctx.fill();
  if (tb<0.3){ const k=tb/0.3, s=1+0.6*k; ctx.save(); ctx.globalAlpha=1-k*k; ctx.translate(PX,700); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 100px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=12; ctx.strokeStyle='#ff4d5e'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  stove(frame, broke?1:e);
  if (!broke){ steam(PX, e, frame); pot(PX+jitter, e, false, '', worry, frame); text(letterAt(ri, lf, round.A, frame), PX+jitter, POT_TOP+120, 46, 'rgba(60,60,75,0.33)', 900); }
  else blast(round, (lf-round.A)/FPS);
}
function coverScene(){ stove(6, 1); steam(PX, 1, 6); steam(PX, 0.8, 23); pot(PX, 1, false, '', 1, 4); }
""")
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/fuga_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/refri_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/bomba_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/jacare_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/micro_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/gato_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/pipoca_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/dog_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/cozinha_theme.py').read())
exec(open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/cozinha2_theme.py').read())
th = TH[theme]; s = base
if theme in ('fuga','jacare'): s = s.replace('background(); header();\n  let ri','CUR_FRAME=frame; background(); header();\n  let ri')
def cut(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i); s = s[:i] + new + s[j:]
s = s.replace('<title>Pare a Melancia</title>', f"<title>{th['title']}</title>")
s = s.replace('const WORD     = "SUCESSO";', f'const WORD     = "{th["word"]}";')
s = re.sub(r'const APPROACH = \[.*?\];', f"const APPROACH = {th['approach']};", s)
s = re.sub(r'const STYLE    = \[.*?\];', f"const STYLE    = {th['style']};", s)
s = re.sub(r'const BANDS    = \[.*?\];.*', f"const BANDS    = {th['bands']};", s)
cut('const T = {', '/* ================= TIMELINE', th['T'] + '\n\n')
cut('const TABLE_Y = 968, MX', '/* ================= DRAW', th['geo'] + '\n\n')
cut('function melonPath(', 'function sparkles(', th['draw'] + '\n')
cut('function explode(', 'function outro(', '')
for a, b in zip(('#04140f', 'rgba(0,229,160,0.045)', 'rgba(0,229,160,0)', 'rgba(0,229,160,0.10)'), th['tint']): s = s.replace(a, b)
s = s.replace("  const pinch = 0.06 + 0.36*e;\n", "")
a = s.index('  gauge(e, broke, frame); table();'); b = s.index('  ctx.restore();\n\n  hud(')
s = s[:a] + '  scene(ri, round, lf, e, gold, broke, worry, jitter, frame);\n' + s[b:]
s = s.replace("table(); melon(MX, 0.4, 300, false, '', 1, 4, 99);", "coverScene();")
s = s.replace("text('352',", f"text('{th['cover_n']}',")
s = s.replace("window.SNAP_EVENTS = SNAP_EVENTS;", f"window.META = {{ theme:'{theme}', total: TOTAL_FRAMES, rounds: ROUNDS, outro: OUTRO_START, events: EVENTS }};")
th['subtle'] = True
s = s.replace("const TOTAL_FRAMES = OUTRO_START + OUTRO;", '''const TOTAL_FRAMES = OUTRO_START + OUTRO;
/* letras falsas: a cada frame aparece uma letra aleatoria; so o frame do 0 ms tem a letra certa */
const DECOY_AB = 'ABCDEFGHIJLMNOPQRSTUVXZ';
function letterAt(ri, lf, A, frame){ if (lf===A) return WORD[ri]; if (lf>A) return ''; const R=rng(frame*977+13); let c; do { c=DECOY_AB[Math.floor(R()*DECOY_AB.length)]; } while (c===WORD[ri]); return c; }''', 1)
s = s.replace("' · SÓ 1 FRAME REVELA A LETRA'", "' · SÓ A LETRA DO 0 MS VALE'")
s = s.replace("gold?WORD[ri]:''", "letterAt(ri, lf, round.A, frame)")
s = s.replace("  return 1 - Math.pow(1-p, 1.6);\n}", "  if (style===4) return p<0.5 ? p/0.5*0.85 : p<0.7 ? 0.85-(p-0.5)/0.2*0.2 : 0.65+(p-0.7)/0.3*0.35;   // finta: chega perto, recua e dispara\n  return 1 - Math.pow(1-p, 1.6);\n}", 1)
if th.get('subtle'):
    s = s.replace('  hud(ri, ms, p, nb, broke, gold);\n  if (gold) goldBanner(ri);', '  hud(ri, ms, p, nb, broke, false);')
assert 'function letterAt' in s and 'style===4' in s
for bad in ('melon(', 'explode(', 'SNAP_EVENTS', 'gauge(e, broke, frame); table'): assert bad not in s, bad
open(out, 'w').write(s)
print('ok', theme)
