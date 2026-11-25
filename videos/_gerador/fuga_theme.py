g = open('/home/user/IA-Lucrativa/videos/golpe/golpe.html').read()
skypalm = g[g.index('function sky('):g.index('function car(')]
pigcool = g[g.index('function pigCool('):g.index('/* ================= CENARIO')]
pigfn = open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/pig.js').read()
TH['fuga'] = dict(
title='Pare a Fuga', word='BANDIDO', approach='[48, 60, 42, 57, 39, 63, 51]', style='[3, 0, 2, 1, 0, 2, 1]', bands='[5, 5, 5, 5, 5, 5, 5]',
T="""const T = {
  title:'PARE ANTES DA POLÍCIA TE PEGAR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'FUGA', bands:'ESTRELAS', st:['TRANQUILO','SIRENE','PERSEGUIÇÃO','QUASE!','AGORA!','PEGO!'],
  lim:'LIMITE', boom:'PEGO', gauge:'', items:'FUGAS',
  gold:'CARRO DE OURO! LETRA', join:'JUNTE AS 7 LETRAS E COMENTA A PALAVRA',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA FUGA', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'PEGO!'
};""",
tint=('#04140f','rgba(0,229,160,0.045)','rgba(0,229,160,0)','rgba(0,229,160,0.10)'), cover_n='5',
geo=r"""const TABLE_Y = 968; let CUR_FRAME = 0;
C.hot='#ff4d6d'; C.yellow='#ffd23f'; C.pink='#ff3da5';
const EVENTS = [];   // estrelas acendendo (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.min(5,Math.floor(ease(lf/r.A,r.style)*5.0001)); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=skypalm + pigfn + pigcool + r"""
const easeO = p=>1-Math.pow(1-clamp(p,0,1),3);
function background(){
  sky(CUR_FRAME*3, 0);
  const g=ctx.createLinearGradient(0,0,0,400); g.addColorStop(0,'rgba(10,4,20,0.9)'); g.addColorStop(1,'rgba(10,4,20,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,400);
}
function bodyPath(){ ctx.beginPath(); ctx.moveTo(-200,10); ctx.quadraticCurveTo(-200,-26,-160,-28); ctx.lineTo(-40,-28); ctx.lineTo(60,-20); ctx.lineTo(170,-8);
  ctx.quadraticCurveTo(205,-2,205,22); ctx.lineTo(205,40); ctx.lineTo(-200,40); ctx.closePath(); }
function vehicle(cx, cy, s, police, gold, frame, moving){
  ctx.save(); ctx.translate(cx,cy); ctx.scale(s,s);
  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0,64,200,14,0,0,7); ctx.fill();
  const g=ctx.createLinearGradient(0,-30,0,50);
  if (police){ g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#c9cedb'); } else if (gold){ g.addColorStop(0,'#fff3b0'); g.addColorStop(.5,'#f5c842'); g.addColorStop(1,'#9c6c00'); } else { g.addColorStop(0,'#ff6ec7'); g.addColorStop(1,'#c2187a'); }
  ctx.fillStyle=g; bodyPath(); ctx.fill();
  if (police){ ctx.save(); bodyPath(); ctx.clip(); ctx.fillStyle='#14161f'; ctx.fillRect(-210,12,420,40); ctx.fillStyle='#14161f'; ctx.fillRect(-70,-30,70,42); ctx.restore();
    text('POLÍCIA', 40, -8, 22, '#14161f', 900);
    const on=Math.floor(frame/3)%2===0; ctx.fillStyle='#333'; rr(-70,-46,100,12,4); ctx.fill();
    ctx.fillStyle= on?'#ff2e4d':'#5a1020'; rr(-68,-48,46,14,5); ctx.fill(); ctx.fillStyle= on?'#2a3d6e':'#2d7bff'; rr(-18,-48,46,14,5); ctx.fill(); }
  ctx.strokeStyle= gold?'#7a5600': police?'#2a2d38':'#5a0b3a'; ctx.lineWidth=3; bodyPath(); ctx.stroke();
  if (!police){ ctx.fillStyle= gold?'#fff6c0':C.cyan; ctx.fillRect(-190,6,390,4); }
  ctx.strokeStyle='rgba(45,226,230,0.9)'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(40,-24); ctx.lineTo(10,-70); ctx.stroke();
  ctx.fillStyle='#fff6b0'; rr(186,0,16,12,4); ctx.fill(); ctx.fillStyle=C.hot; rr(-200,-6,10,14,3); ctx.fill();
  for (const wx of [-120,120]){ ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(wx,40,32,0,7); ctx.fill();
    ctx.fillStyle='#c9c9e0'; ctx.beginPath(); ctx.arc(wx,40,16,0,7); ctx.fill();
    ctx.strokeStyle='#555'; ctx.lineWidth=3; for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+(moving?frame*0.9:0); ctx.beginPath(); ctx.moveTo(wx,40); ctx.lineTo(wx+Math.cos(a)*15,40+Math.sin(a)*15); ctx.stroke(); } }
  ctx.restore();
}
function starShape(x,y,r){ ctx.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr2=k%2?r*0.42:r; ctx.lineTo(x+Math.cos(a)*rr2, y+Math.sin(a)*rr2); } ctx.closePath(); }
function wanted(n, broke, frame){
  for (let i=0;i<5;i++){ const x=360+(i-2)*72, y=430, on=i<n, fl = broke && Math.floor(frame/3)%2===0;
    starShape(x,y,28); ctx.fillStyle= on ? (fl?'#ffffff':C.yellow) : 'rgba(255,255,255,0.14)'; ctx.fill(); ctx.strokeStyle='#120821'; ctx.lineWidth=4; ctx.stroke(); }
}
const CAR_X = 520, CAR_Y = 900, SC_V = 0.7, CONTACT_X = 237, POLICE_START = -260;
function crash(round, tb, bx){
  const R=rng(round.start*7919+3), g=2200, ix=380, iy=880;
  if (tb<0.07){ ctx.fillStyle=`rgba(255,255,255,${0.45*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); }
  if (tb<0.3) for(let i=0;i<18;i++){ const a=R()*Math.PI*2, sp=400+R()*700, x=ix+Math.cos(a)*sp*tb, y=iy+Math.sin(a)*sp*tb*0.7;
    ctx.strokeStyle='#ffd23f'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-Math.cos(a)*18,y-Math.sin(a)*12); ctx.stroke(); }
  for(let i=0;i<22;i++){ const vx=(R()-0.3)*700, vy=-500-R()*700, x=bx-60+(R()-0.5)*120+vx*tb, y=860+vy*tb+0.5*g*tb*tb*0.6;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*(6+i%5)+i); ctx.fillStyle='#3cb371'; ctx.fillRect(-18,-9,36,18); ctx.strokeStyle='#1d6b40'; ctx.lineWidth=2; ctx.strokeRect(-18,-9,36,18);
    text('$',0,1,14,'#0d3d22',900); ctx.restore(); }
  for(let i=0;i<10;i++){ const vx=(R()-0.5)*600, vy=-300-R()*500, x=ix+vx*tb, y=iy+vy*tb+0.5*g*tb*tb, s=6+R()*8;
    ctx.fillStyle='rgba(170,230,255,0.9)'; ctx.beginPath(); ctx.moveTo(x-s,y); ctx.lineTo(x+s*0.6,y-s*0.8); ctx.lineTo(x+s*0.4,y+s*0.7); ctx.fill(); }
  for(let i=0;i<6;i++){ const k=clamp(tb/0.7,0,1); ctx.fillStyle=`rgba(200,200,220,${0.4*(1-k)})`; ctx.beginPath(); ctx.arc(ix+(i-2.5)*30, iy-20-k*80-i*6, 20+k*40, 0, 7); ctx.fill(); }
  const k=clamp(tb/0.1,0,1), sc=1.6-0.6*easeO(k);
  ctx.save(); ctx.translate(360,700); ctx.rotate(-0.1); ctx.scale(sc,sc); ctx.globalAlpha=Math.min(1,k*1.5);
  rr(-170,-62,340,124,14); ctx.fillStyle='rgba(18,8,33,0.85)'; ctx.fill(); ctx.strokeStyle='#ff2e4d'; ctx.lineWidth=10; ctx.stroke();
  text(T.fx, 0, 4, 92, '#ff2e4d', 900); ctx.restore();
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  const tb = broke ? (lf-round.A)/FPS : 0;
  wanted(broke ? 5 : Math.min(5, Math.floor(e*5.0001)), broke, frame);
  const px = broke ? CONTACT_X - 30*clamp(tb/0.1,0,1) : POLICE_START + (CONTACT_X-POLICE_START)*e;
  const jolt = broke ? 80*easeO(clamp(tb/0.15,0,1)) : (jitter||0);
  const bx = CAR_X + jolt;
  ctx.save(); if (broke && tb<0.3){ ctx.translate(bx,CAR_Y); ctx.rotate(-0.08*Math.sin(tb*30)*(1-tb/0.3)); ctx.translate(-bx,-CAR_Y); }
  pigCool(bx-27, 862, 0.448, frame/FPS);
  vehicle(bx, CAR_Y, SC_V, false, false, frame, !broke);
  if (!broke) text(letterAt(ri, lf, round.A, frame), bx-20, CAR_Y+12, 52, 'rgba(110,8,62,0.55)', 900);
  ctx.restore();
  vehicle(px, CAR_Y, SC_V, true, false, frame, !broke);
  if (!broke){ const on=Math.floor(frame/3)%2===0; const rg=ctx.createRadialGradient(px-15,CAR_Y-40,5,px-15,CAR_Y-40,160);
    rg.addColorStop(0, on?'rgba(255,46,77,0.45)':'rgba(45,123,255,0.45)'); rg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=rg; ctx.fillRect(px-200,CAR_Y-220,400,320); }
  if (worry>0.55 && !broke && !gold){ const dy=(frame*2)%22, sx=bx+28, sy=790+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.quadraticCurveTo(sx-8,sy+4,sx,sy+6); ctx.quadraticCurveTo(sx+8,sy+4,sx,sy-10); ctx.fill(); }
  if (broke) crash(round, tb, bx);
}
function coverScene(){ ctx.translate(0,-90); pigCool(CAR_X-27, 862, 0.448, 0.2); vehicle(CAR_X, CAR_Y, SC_V, false, false, 4, false); vehicle(CONTACT_X-30, CAR_Y, SC_V, true, false, 0, false); }
""")
