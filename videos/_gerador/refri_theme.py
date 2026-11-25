TH['refri'] = dict(
title='Pare o Refri', word='CAMPEÃO', approach='[51, 63, 45, 57, 42, 60, 39]', style='[1, 0, 3, 2, 1, 0, 2]', bands='[48, 55, 44, 60, 41, 58, 52]', subtle=True,
T="""const T = {
  title:'PARE ANTES DO REFRI EXPLODIR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'GARRAFA', bands:'SACUDIDAS', st:['PARADA','AGITANDO','BORBULHANDO','QUASE!','AGORA!','EXPLODIU!'],
  lim:'LIMITE', boom:'EXPLOSÃO', gauge:'', items:'GARRAFAS',
  gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA GARRAFA', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'PSHHH!'
};""",
tint=('#140a04','rgba(255,159,67,0.05)','rgba(255,159,67,0)','rgba(255,159,67,0.10)'), cover_n='60',
geo=r"""const TABLE_Y = 968, BX = 360, BASE = 958;
const EVENTS = [];   // sacudidas (audio)
ROUNDS.forEach((r,i)=>{ let ph=0, last=0; for(let lf=0; lf<=r.A; lf++){ const e=ease(lf/r.A,r.style); ph += 0.6+1.4*e; const n=Math.floor(ph/Math.PI); if(n>last && e>0.05){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function cloth(){
  table();
  ctx.save(); rr(60,TABLE_Y,600,36,6); ctx.clip();
  for (let x=60;x<660;x+=30) for (let k=0;k<2;k++){ ctx.fillStyle=((x/30+k)%2)?'#e8e8ee':'#e0344a'; ctx.fillRect(x,TABLE_Y+k*18,30,18); }
  ctx.restore(); ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(60,TABLE_Y+30,600,6);
}
function bottlePath(sx){
  const w=86*sx, nw=30, top=530;
  ctx.beginPath();
  ctx.moveTo(-nw, top+30); ctx.lineTo(-nw, 600);
  ctx.bezierCurveTo(-nw, 630, -w, 640, -w, 690);
  ctx.lineTo(-w, BASE-40); ctx.quadraticCurveTo(-w, BASE, -w+30, BASE); ctx.lineTo(w-30, BASE); ctx.quadraticCurveTo(w, BASE, w, BASE-40);
  ctx.lineTo(w, 690); ctx.bezierCurveTo(w, 640, nw, 630, nw, 600); ctx.lineTo(nw, top+30); ctx.closePath();
}
function bottle(e, letter, worry, frame, shake, empty=false){
  const sx = 1 + 0.07*e;
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(BX,TABLE_Y+2,110,10,0,0,7); ctx.fill();
  ctx.save(); ctx.translate(BX, BASE); ctx.rotate(shake); ctx.translate(0, -BASE);
  // liquido
  ctx.save(); bottlePath(sx); ctx.clip();
  ctx.fillStyle='rgba(200,230,255,0.10)'; ctx.fillRect(-120,500,240,500);
  const lvl = empty ? 905 : 650;
  const lg=ctx.createLinearGradient(0,lvl,0,BASE); lg.addColorStop(0,'#5a2a12'); lg.addColorStop(1,'#2a0e05'); ctx.fillStyle=lg; ctx.fillRect(-120,lvl,240,BASE-lvl);
  if (!empty){
    const foam = 10 + 70*e; ctx.fillStyle='#f3e3c8'; ctx.fillRect(-120, lvl-foam, 240, foam);
    ctx.fillStyle='rgba(255,255,255,0.6)'; for(let i=0;i<14;i++){ ctx.beginPath(); ctx.arc(-80+i*12, lvl-foam, 7, 0, 7); ctx.fill(); }
    const R=rng(7); const nb = 12 + Math.floor(50*e);
    for (let i=0;i<nb;i++){ const x=-75+R()*150, sp=40+R()*120*(0.5+e), y=BASE-8-((frame*sp/10 + R()*400)%(BASE-lvl-12));
      ctx.strokeStyle='rgba(255,220,180,0.55)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x, y, 2+R()*4, 0, 7); ctx.stroke(); }
  }
  ctx.restore();
  // vidro
  bottlePath(sx); ctx.strokeStyle='rgba(220,240,255,0.75)'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.fillRect(-60*sx, 700, 10, 220);
  // rotulo
  const lw=86*sx*2+4; ctx.fillStyle='#ff8a1c'; ctx.fillRect(-lw/2, 760, lw, 92); ctx.fillStyle='#c9520a'; ctx.fillRect(-lw/2, 760, lw, 8); ctx.fillRect(-lw/2, 844, lw, 8);
  if (letter) text(letter, 0, 808, 62, '#7a2e00', 900);           // letra discreta no lugar do nome
  else text('REFRI', 0, 808, 40, '#fff4e0', 900);
  // tampa
  if (!empty){ const lift = 6*e*e;
    ctx.fillStyle='#d62828'; rr(-36, 506-lift, 72, 32, 6); ctx.fill();
    ctx.strokeStyle='#8a1010'; ctx.lineWidth=2; for (let k=0;k<7;k++){ const x=-30+((k*10+frame*e*6)%64); ctx.beginPath(); ctx.moveTo(x,510-lift); ctx.lineTo(x,534-lift); ctx.stroke(); } }
  // rostinho
  const ey=715, es=13;
  if (empty){ ctx.strokeStyle='#222'; ctx.lineWidth=4; for (const s of [-1,1]){ const ex=s*30; ctx.beginPath(); ctx.moveTo(ex-9,ey-9); ctx.lineTo(ex+9,ey+9); ctx.moveTo(ex+9,ey-9); ctx.lineTo(ex-9,ey+9); ctx.stroke(); } }
  else {
    for (const s of [-1,1]){ const ex=s*30;
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill();
      ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex, ey+3-worry*8, es*0.5, 0, 7); ctx.fill();
      if (worry>0.3){ ctx.strokeStyle='#fff'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(ex-s*14, ey-es*1.6-worry*4); ctx.lineTo(ex+s*10, ey-es*2.1); ctx.stroke(); } }
    if (worry>0.6){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(0, ey+30, 7, 9, 0, 0, 7); ctx.fill(); }
    if (worry>0.55){ const dy=(frame*2)%22, sx2=58, sy=ey-30+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx2,sy-10); ctx.quadraticCurveTo(sx2-8,sy+4,sx2,sy+6); ctx.quadraticCurveTo(sx2+8,sy+4,sx2,sy-10); ctx.fill(); }
  }
  ctx.restore();
}
function geyserFx(round, tb){
  const R=rng(round.start*7919+21), g=2200;
  // jato
  const hgt = Math.min(1, tb/0.12) * (320 - Math.max(0, tb-0.35)*600);
  if (hgt>0){ const top=506-hgt; const jg=ctx.createLinearGradient(0,top,0,506); jg.addColorStop(0,'rgba(243,227,200,0.95)'); jg.addColorStop(1,'rgba(90,42,18,0.95)');
    ctx.fillStyle=jg; ctx.beginPath(); ctx.moveTo(BX-14,506); ctx.lineTo(BX-40,top+30); ctx.quadraticCurveTo(BX,top-30,BX+40,top+30); ctx.lineTo(BX+14,506); ctx.fill(); }
  if (tb<0.07){ ctx.fillStyle=`rgba(255,240,220,${0.35*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); }
  // tampa voando
  const cy=506-2600*tb+0.5*g*tb*tb, cx=BX-300*tb; ctx.save(); ctx.translate(cx,cy); ctx.rotate(tb*20); ctx.fillStyle='#d62828'; rr(-36,-16,72,32,6); ctx.fill(); ctx.restore();
  // gotas e espuma caindo
  for (let i=0;i<60;i++){ const a=-Math.PI/2+(R()-0.5)*1.4, sp=600+R()*1100, t0=R()*0.3, t=Math.max(0,tb-t0);
    const x=BX+Math.cos(a)*sp*t, y=506-hgt*R()*0.3+Math.sin(a)*sp*t+0.5*g*t*t; if (t<=0 || y>TABLE_Y) continue;
    ctx.fillStyle= i%3 ? 'rgba(110,55,25,0.9)' : 'rgba(243,227,200,0.95)'; ctx.beginPath(); ctx.arc(x,y,3+R()*6,0,7); ctx.fill(); }
  const sk=clamp(tb/0.5,0,1); ctx.fillStyle='rgba(90,42,18,0.8)'; ctx.beginPath(); ctx.ellipse(BX,TABLE_Y+2,90+190*sk,5+4*sk,0,0,7); ctx.fill();
  if (tb<0.32){ const k=tb/0.32, s=1+0.5*k; ctx.save(); ctx.globalAlpha=1-k*k; ctx.translate(BX,720); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 92px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=12; ctx.strokeStyle='#ff4d5e'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  cloth();
  if (!broke){ const shake = Math.sin(frame*(0.6+1.4*e))*(0.015+0.11*e); bottle(e, gold?WORD[ri]:'', worry, frame, shake); }
  else { bottle(0,'',0,0,0,true); geyserFx(round, (lf-round.A)/FPS); }
}
function coverScene(){ cloth(); bottle(1, '', 1, 6, 0.06); }
""")
