TH['pipoca'] = dict(
title='Pare a Pipoca', word='TALENTO', approach='[33, 27, 39, 24, 36, 30, 27]', style='[4, 2, 4, 1, 3, 4, 2]', bands='[205, 212, 198, 220, 208, 215, 225]',
T="""const T = {
  title:'PARE ANTES DA PIPOCA ESTOURAR', lvl:'NÍVEL INSANO', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'MILHO', bands:'TEMPERATURA °C', st:['MORNO','ESQUENTANDO','TREMENDO','QUASE!','AGORA!','POC!'],
  lim:'LIMITE', boom:'POC', gauge:'', items:'MILHOS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'SÓ A LETRA DO 0 MS VALE', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'NÍVEL INSANO. CONSEGUE?', fx:'POC!'
};""",
tint=('#160a04','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='225°',
geo=r"""const TABLE_Y = 968, PX = 360, KY = 860;
const EVENTS = [];   // estalinhos do oleo (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*10); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function stovePan(frame, e){
  table();
  ctx.fillStyle='#2a2a33'; rr(150,TABLE_Y-14,420,14,4); ctx.fill();
  for (let i=-6;i<=6;i++){ const fx=PX+i*24, fl=10+(6+12*e)*(0.6+0.4*Math.sin(frame*0.9+i*1.7));
    ctx.fillStyle='rgba(80,140,255,0.9)'; ctx.beginPath(); ctx.moveTo(fx-7,TABLE_Y-12); ctx.quadraticCurveTo(fx,TABLE_Y-12-fl*2,fx+7,TABLE_Y-12); ctx.fill(); }
  ctx.fillStyle='#14151a'; rr(PX+200,912,150,22,10); ctx.fill();
  ctx.fillStyle='#2b2d36'; ctx.beginPath(); ctx.ellipse(PX,930,220,42,0,0,7); ctx.fill();
  ctx.fillStyle='#3d404c'; ctx.beginPath(); ctx.ellipse(PX,918,206,30,0,0,7); ctx.fill();
  ctx.fillStyle=`rgba(255,200,80,${0.15+0.25*e})`; ctx.beginPath(); ctx.ellipse(PX,920,180,22,0,0,7); ctx.fill();
  const R=rng(frame); for (let i=0;i<Math.floor(3+10*e);i++){ ctx.fillStyle='rgba(255,230,150,0.8)'; ctx.beginPath(); ctx.arc(PX-160+R()*320, 912+R()*16, 2+R()*2, 0, 7); ctx.fill(); }
}
function kernel(e, letter, worry, frame, jit){
  const sc=1+0.4*e, wob=Math.sin(frame*(0.6+2.2*e))*0.12*e;
  // ondas de calor
  ctx.strokeStyle=`rgba(255,200,120,${0.15+0.3*e})`; ctx.lineWidth=3;
  for (let k=-1;k<=1;k++){ ctx.beginPath(); for (let y=0;y<120;y+=6){ const x=PX+k*70+Math.sin(y*0.08+frame*0.3+k)*8; y===0?ctx.moveTo(x,KY-110-y):ctx.lineTo(x,KY-110-y); } ctx.stroke(); }
  ctx.save(); ctx.translate(PX+jit, KY); ctx.scale(sc,sc); ctx.rotate(wob);
  ctx.beginPath(); ctx.moveTo(0,-74); ctx.bezierCurveTo(62,-74,66,14,0,48); ctx.bezierCurveTo(-66,14,-62,-74,0,-74); ctx.closePath();
  const g=ctx.createRadialGradient(-18,-36,6,0,-10,90); g.addColorStop(0,'#ffe066'); g.addColorStop(.6,'#f2a20c'); g.addColorStop(1,'#c46a00');
  ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle='#8a4a00'; ctx.lineWidth=3; ctx.stroke();
  if (worry>0){ ctx.fillStyle=`rgba(255,60,30,${0.3*worry})`; ctx.fill(); }
  ctx.fillStyle='#fff3d6'; ctx.beginPath(); ctx.ellipse(0,40,12,8,0,0,7); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(-24,-46,10,18,-0.4,0,7); ctx.fill();
  if (letter) text(letter, 0, 18, 36, 'rgba(120,55,0,0.45)', 900);        // letra (falsas em todo frame, certa no 0 ms)
  const ey=-24, es=12;
  for (const s of [-1,1]){ const ex=s*20; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex, ey+3-worry*6, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#5a2a00'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ex-s*12, ey-es*1.6-worry*3); ctx.lineTo(ex+s*8, ey-es*2.2); ctx.stroke(); } }
  if (worry>0.6){ ctx.fillStyle='#5a2a00'; ctx.beginPath(); ctx.ellipse(0,ey+24,5,7,0,0,7); ctx.fill(); }
  else { ctx.strokeStyle='#5a2a00'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,ey+14,9,0.2*Math.PI,0.8*Math.PI); ctx.stroke(); }
  ctx.restore();
  if (worry>0.55){ const dy=(frame*2)%22, sx=PX+70*sc, sy=KY-70+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.quadraticCurveTo(sx-8,sy+4,sx,sy+6); ctx.quadraticCurveTo(sx+8,sy+4,sx,sy-10); ctx.fill(); }
}
function puff(x,y,s,rot){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.scale(s,s);
  for (const [dx,dy,r,c] of [[0,0,40,'#fffaf0'],[-30,-14,30,'#fff6e0'],[30,-12,32,'#fffaf0'],[-14,-36,28,'#fff'],[18,-34,26,'#fff6e0'],[0,22,26,'#ffe9b0']]){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(dx,dy,r,0,7); ctx.fill(); }
  ctx.fillStyle='#e0a020'; ctx.beginPath(); ctx.ellipse(0,30,12,7,0,0,7); ctx.fill();
  ctx.restore();
}
function popped(round, tb){
  const R=rng(round.start*7919+41), g=3000;
  if (tb<0.07){ ctx.fillStyle=`rgba(255,250,230,${0.45*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); }
  const y=KY-1000*tb+0.5*g*tb*tb; puff(PX+60*tb, Math.min(y,KY), 1.6+Math.min(1,tb*8)*0.6, tb*5);
  for (let i=0;i<10;i++){ const a=-Math.PI*(0.15+0.7*R()), sp=500+R()*600, x=PX+Math.cos(a)*sp*tb, yy=KY+Math.sin(a)*sp*tb+0.5*g*tb*tb; if (yy>KY+60) continue; puff(x,yy,0.4+R()*0.3,tb*8+i); }
  if (tb<0.32){ const kk=tb/0.32, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(PX,600); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 110px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle='#c46a00'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  stovePan(frame, broke?1:e);
  if (!broke) kernel(e, letterAt(ri, lf, round.A, frame), worry, frame, jitter||0);
  else popped(round, (lf-round.A)/FPS);
}
function coverScene(){ stovePan(6, 1); kernel(1, '', 1, 6, 0); }
""")
