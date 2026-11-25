TH['bomba'] = dict(
title='Pare a Bomba', word='SORTUDO', approach='[54, 42, 60, 45, 63, 39, 57]', style='[0, 2, 1, 3, 0, 2, 1]', bands='[100, 100, 100, 100, 100, 100, 100]', subtle=True,
T="""const T = {
  title:'PARE ANTES DA BOMBA EXPLODIR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'BOMBA', bands:'PAVIO %', st:['ACESO','QUEIMANDO','CHEGANDO','QUASE!','AGORA!','KABUM!'],
  lim:'LIMITE', boom:'EXPLOSÃO', gauge:'', items:'BOMBAS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA BOMBA', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'KABUM!'
};""",
tint=('#120a14','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='99%',
geo=r"""const TABLE_Y = 968, BX = 360, BY = 830, BR = 130;
// pavio: curva de bezier da tampa (t=0) ate a ponta (t=1)
const F0=[BX+30,BY-BR-34], F1=[BX+70,BY-BR-150], F2=[BX-170,BY-BR-60], F3=[BX-190,BY-BR-250];
function fuseAt(t){ const u=1-t; return [0,1].map(k=>u*u*u*F0[k]+3*u*u*t*F1[k]+3*u*t*t*F2[k]+t*t*t*F3[k]); }
const EVENTS = [];   // estalos do pavio (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*14); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function bomb(e, letter, worry, frame, jit){
  const cx=BX+jit;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(cx,TABLE_Y+2,BR*0.9,12,0,0,7); ctx.fill();
  // pavio restante (da tampa ate a faisca)
  const tS = 1-e; ctx.strokeStyle='#c9a46a'; ctx.lineWidth=7; ctx.lineCap='round'; ctx.beginPath();
  for (let k=0;k<=40;k++){ const t=tS*k/40, p=fuseAt(t); k===0?ctx.moveTo(p[0]+jit,p[1]):ctx.lineTo(p[0]+jit,p[1]); } ctx.stroke();
  ctx.strokeStyle='rgba(90,60,30,0.6)'; ctx.lineWidth=2; ctx.setLineDash([5,6]); ctx.stroke(); ctx.setLineDash([]);
  // corpo
  const g=ctx.createRadialGradient(cx-45,BY-50,10,cx,BY,BR*1.1); g.addColorStop(0,'#5a6170'); g.addColorStop(.45,'#23262f'); g.addColorStop(1,'#08090c');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,BY,BR,0,7); ctx.fill();
  if (worry>0){ ctx.fillStyle=`rgba(255,40,30,${0.25*worry*(0.6+0.4*Math.sin(frame*1.3))})`; ctx.beginPath(); ctx.arc(cx,BY,BR,0,7); ctx.fill(); }
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(cx-55,BY-62,26,14,-0.6,0,7); ctx.fill();
  // tampa
  ctx.save(); ctx.translate(cx+28,BY-BR+4); ctx.rotate(0.35); ctx.fillStyle='#4a4f5c'; rr(-26,-30,52,34,6); ctx.fill(); ctx.fillStyle='#6c7384'; ctx.fillRect(-26,-30,52,6); ctx.restore();
  if (letter) text(letter, cx-36, BY+54, 80, 'rgba(255,150,150,0.42)', 900);       // letra discreta no corpo
  // rosto
  const ey=BY-6, es=17;
  for (const s of [-1,1]){ const ex=cx+30+s*30;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+4-worry*3, ey+3-worry*10, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(ex-s*16, ey-es*1.6-worry*4); ctx.lineTo(ex+s*12, ey-es*2.2); ctx.stroke(); } }
  if (worry>0.6){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx+30, ey+44, 9, 12, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx+30, ey+28, 15, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
  if (worry>0.55){ const dy=(frame*2)%26, sx=cx+100, sy=BY-60+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.quadraticCurveTo(sx-8,sy+4,sx,sy+6); ctx.quadraticCurveTo(sx+8,sy+4,sx,sy-10); ctx.fill(); }
  // faisca
  const sp=fuseAt(tS); const x=sp[0]+jit, y=sp[1], R=rng(frame);
  const rg=ctx.createRadialGradient(x,y,2,x,y,46); rg.addColorStop(0,'rgba(255,240,150,0.9)'); rg.addColorStop(1,'rgba(255,120,0,0)'); ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(x,y,46,0,7); ctx.fill();
  ctx.strokeStyle='#ffd23f'; ctx.lineWidth=3; for (let k=0;k<10;k++){ const a=R()*Math.PI*2, l=10+R()*22; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); ctx.stroke(); }
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,6,0,7); ctx.fill();
}
function kaboom(round, tb){
  const R=rng(round.start*7919+13), g=2200;
  const sk=clamp(tb/0.2,0,1); ctx.fillStyle='rgba(20,15,10,0.85)'; ctx.beginPath(); ctx.ellipse(BX,TABLE_Y+2,90+170*sk,7,0,0,7); ctx.fill();
  if (tb<0.08){ ctx.fillStyle=`rgba(255,240,200,${0.5*(1-tb/0.08)})`; ctx.fillRect(0,0,W,H); }
  const k=clamp(tb/0.25,0,1), fade=Math.max(0,1-Math.max(0,tb-0.25)/0.45);
  // bola de fogo
  for (const [r0,col] of [[1.0,'255,77,46'],[0.75,'255,159,67'],[0.48,'255,226,110']]){ ctx.fillStyle=`rgba(${col},${0.95*fade})`; ctx.beginPath();
    for (let a=0;a<=24;a++){ const ang=a/24*Math.PI*2, rr2=(60+230*k)*r0*(0.85+0.15*Math.sin(a*2.7+round.start)); ctx.lineTo(BX+Math.cos(ang)*rr2, BY-20+Math.sin(ang)*rr2*0.85); } ctx.fill(); }
  // fumaca
  for (let i=0;i<10;i++){ const a=R()*Math.PI*2, d=(120+R()*160)*k, r=40+R()*50+tb*80;
    ctx.fillStyle=`rgba(70,70,80,${0.55*Math.max(0,1-tb*1.3)})`; ctx.beginPath(); ctx.arc(BX+Math.cos(a)*d, BY-40+Math.sin(a)*d*0.7-tb*160, r, 0, 7); ctx.fill(); }
  // estilhacos
  for (let i=0;i<24;i++){ const a=R()*Math.PI*2, sp=600+R()*900, x=BX+Math.cos(a)*sp*tb, y=BY+Math.sin(a)*sp*tb+0.5*g*tb*tb, s=6+R()*12;
    ctx.save(); ctx.translate(x,y); ctx.rotate(tb*12+i); ctx.fillStyle= i%3?'#23262f':'#ffd23f'; ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s*0.6,-s*0.8); ctx.lineTo(s*0.4,s*0.7); ctx.fill(); ctx.restore(); }
  // raios
  if (tb<0.3){ ctx.strokeStyle=`rgba(255,226,110,${1-tb/0.3})`; ctx.lineWidth=6; for (let i=0;i<16;i++){ const a=i/16*Math.PI*2, r1=200+300*tb, r2=r1+60; ctx.beginPath(); ctx.moveTo(BX+Math.cos(a)*r1,BY-20+Math.sin(a)*r1); ctx.lineTo(BX+Math.cos(a)*r2,BY-20+Math.sin(a)*r2); ctx.stroke(); } }
  if (tb<0.35){ const kk=tb/0.35, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(BX,BY-40); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 100px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle='#7a0a14'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table();
  if (!broke) bomb(e, gold?WORD[ri]:'', worry, frame, jitter);
  else kaboom(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); bomb(0.93, '', 1, 6, 0); }
""")
