TH['jacare'] = dict(
title='Pare o Jacaré', word='CORAGEM', approach='[51, 60, 42, 57, 45, 63, 39]', style='[0, 1, 2, 3, 0, 2, 1]', bands='[38, 42, 36, 45, 40, 47, 50]', subtle=True,
T="""const T = {
  title:'PARE ANTES DO JACARÉ PEGAR ELE', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'FUGA', bands:'JACARÉ KM/H', st:['LONGE','CORRENDO','CHEGANDO','QUASE!','AGORA!','NHAC!'],
  lim:'LIMITE', boom:'NHAC', gauge:'', items:'FUGAS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA FUGA', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'NHAC!'
};""",
tint=('#04140f','rgba(0,229,160,0.045)','rgba(0,229,160,0)','rgba(0,229,160,0.10)'), cover_n='50',
geo=r"""const TABLE_Y = 968; let CUR_FRAME = 0;
const GROUND = 1000, BOYX = 500, CONTACT_TIP = 476, GATOR_START = -40;
const EVENTS = [];   // passos do menino (audio)
{ let last=-1; for (let f=0; f<OUTRO_START; f++){ const n=Math.floor(f*0.9/Math.PI); if (n!==last){ EVENTS.push(f); last=n; } } }""",
draw=r"""function background(){
  const f=CUR_FRAME;
  const g=ctx.createLinearGradient(0,0,0,860); g.addColorStop(0,'#3aa6e8'); g.addColorStop(1,'#bfeaff'); ctx.fillStyle=g; ctx.fillRect(0,0,W,860);
  ctx.fillStyle='#ffe066'; ctx.beginPath(); ctx.arc(600,470,54,0,7); ctx.fill();
  for (let i=0;i<4;i++){ const cx=((i*230 - f*0.6)%(W+300)+W+300)%(W+300)-150, cy=520+(i%2)*60;
    ctx.fillStyle='rgba(255,255,255,0.9)'; for (const [dx,dy,r] of [[0,0,34],[34,6,28],[-32,8,26],[14,-18,26]]){ ctx.beginPath(); ctx.arc(cx+dx,cy+dy,r,0,7); ctx.fill(); } }
  for (let x=0;x<W;x+=4){ const h=Math.round(800+18*Math.sin((x+f*1)*0.012)+10*Math.sin((x+f)*0.04)); ctx.fillStyle='#4f9e5a'; ctx.fillRect(x,h,4,870-h); }
  for (let i=0;i<6;i++){ const tx=((i*170 - f*3)%(W+340)+W+340)%(W+340)-170;
    ctx.fillStyle='#6b4226'; ctx.fillRect(tx-8,780,16,90); ctx.fillStyle= i%2?'#2f7d3a':'#38914a';
    for (const [dx,dy,r] of [[0,-20,46],[-30,6,34],[30,6,34]]){ ctx.beginPath(); ctx.arc(tx+dx,780+dy,r,0,7); ctx.fill(); } }
  ctx.fillStyle='#5cbf4f'; ctx.fillRect(0,860,W,H-860);
  ctx.fillStyle='#4fae43'; for (let x=-((f*7)%80); x<W; x+=80){ ctx.fillRect(x,860,40,100); }
  ctx.fillStyle='#d9b27a'; ctx.fillRect(0,950,W,80); ctx.fillStyle='#c79d63'; for (let x=-((f*7)%60); x<W; x+=60){ ctx.fillRect(x,985,28,6); }
  ctx.fillStyle='#4caf50'; ctx.fillRect(0,1030,W,H-1030);
  const o=ctx.createLinearGradient(0,0,0,420); o.addColorStop(0,'rgba(8,18,30,0.88)'); o.addColorStop(1,'rgba(8,18,30,0)'); ctx.fillStyle=o; ctx.fillRect(0,0,W,420);
  const b=ctx.createLinearGradient(0,1060,0,H); b.addColorStop(0,'rgba(8,18,30,0)'); b.addColorStop(1,'rgba(8,18,30,0.75)'); ctx.fillStyle=b; ctx.fillRect(0,1060,W,H-1060);
}
const SKIN='#f1c27d';
function boy(x, gy, frame, letter, worry, flyY, flying){
  ctx.save(); ctx.translate(x, gy - flyY);
  if (!flying){ ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0,0,46,8,0,0,7); ctx.fill(); }
  ctx.rotate(flying ? -0.15 : 0.12);
  const ph=frame*0.9, a=flying?0.9:Math.sin(ph)*0.75;
  ctx.lineCap='round';
  for (const s of [1,-1]){ const ang=s*a, kx=Math.sin(ang)*40, ky=-80+Math.cos(ang)*40, fx=kx+Math.sin(ang*0.4-0.3*s)*38, fy=ky+38;
    ctx.strokeStyle=SKIN; ctx.lineWidth=13; ctx.beginPath(); ctx.moveTo(0,-82); ctx.lineTo(kx,ky); ctx.lineTo(fx,Math.min(fy,-4)); ctx.stroke();
    ctx.fillStyle='#e0344a'; ctx.beginPath(); ctx.ellipse(fx+8,Math.min(fy,-4)+2,15,8,0,0,7); ctx.fill(); }
  ctx.fillStyle='#2f6fd6'; rr(-25,-104,50,32,8); ctx.fill();
  if (flying){ ctx.fillStyle='#fff6e5'; ctx.beginPath(); ctx.moveTo(-25,-74); for(let i=0;i<=5;i++) ctx.lineTo(-25+i*10, -74-(i%2?8:0)); ctx.lineTo(25,-72); ctx.lineTo(-25,-72); ctx.fill(); }
  ctx.fillStyle='#ffd23f'; rr(-30,-172,60,76,16); ctx.fill(); ctx.strokeStyle='#d9a400'; ctx.lineWidth=2; ctx.stroke();
  if (letter) text(letter, 0, -132, 46, 'rgba(190,110,0,0.62)', 900);       // letra discreta na camiseta
  const sa = flying ? -2.4 : -a;
  for (const s of [1,-1]){ const ang=s*sa*0.9; ctx.strokeStyle=SKIN; ctx.lineWidth=11; ctx.beginPath(); ctx.moveTo(0,-160);
    ctx.lineTo(Math.sin(ang)*34, -160+Math.cos(ang)*30); ctx.lineTo(Math.sin(ang)*34+Math.sin(ang+0.8)*22, -160+Math.cos(ang)*30+16); ctx.stroke(); }
  // cabeca olhando pra tras
  ctx.fillStyle=SKIN; ctx.beginPath(); ctx.arc(2,-206,33,0,7); ctx.fill();
  ctx.fillStyle='#5a3a22'; ctx.beginPath(); ctx.arc(4,-214,33,Math.PI*1.05,Math.PI*1.95); ctx.fill(); ctx.fillRect(-28,-222,10,16);
  for (const ex of [-14,6]){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,-206,8,9+worry*3,0,0,7); ctx.fill();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex-3,-205-worry*2,4,0,7); ctx.fill(); }
  ctx.strokeStyle='#5a3a22'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-22,-220-worry*3); ctx.lineTo(-8,-224); ctx.moveTo(0,-224); ctx.lineTo(14,-220-worry*3); ctx.stroke();
  ctx.fillStyle='#7a1f2b'; ctx.beginPath(); ctx.ellipse(-6,-186,7,5+worry*5,0,0,7); ctx.fill();
  if (worry>0.4 || flying){ for (const [dx,dy] of [[30,-232],[38,-212]]){ const d=(frame*2)%14; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.ellipse(dx+d*0.6,dy+d,4,7,0.4,0,7); ctx.fill(); } }
  ctx.restore();
}
function gator(tip, frame, jaw, moving){
  ctx.save(); ctx.translate(tip, GROUND);
  const G='#3c8d3c', GD='#2a6b2a', BEL='#c9d98a';
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(-260,2,240,10,0,0,7); ctx.fill();
  const wig=moving?Math.sin(frame*0.6)*10:0;
  ctx.fillStyle=G; ctx.beginPath(); ctx.moveTo(-380,-60); ctx.quadraticCurveTo(-500,-40+wig,-600,-20+wig*1.5); ctx.lineTo(-380,-14); ctx.closePath(); ctx.fill();
  for (let k=0;k<4;k++){ const i=k%2, lx=[-340,-300,-190,-150][k], up=moving && ((Math.floor(frame/4)+i)%2) ? 8 : 0;
    ctx.fillStyle=GD; rr(lx-10,-26-up,20,26,6); ctx.fill(); ctx.fillRect(lx-2,-4-up,18,6); }
  ctx.fillStyle=G; ctx.beginPath(); ctx.ellipse(-265,-44,155,40,0,0,7); ctx.fill();
  ctx.fillStyle=BEL; ctx.beginPath(); ctx.ellipse(-265,-24,140,14,0,0,Math.PI); ctx.fill();
  ctx.fillStyle=GD; for (let x=-400;x<-130;x+=22){ ctx.beginPath(); ctx.moveTo(x,-80); ctx.lineTo(x+9,-94); ctx.lineTo(x+18,-80); ctx.fill(); }
  const hinge=[-128,-48];
  const drawJaw=(up)=>{ ctx.save(); ctx.translate(hinge[0],hinge[1]); ctx.rotate(up?-jaw:jaw*0.6);
    ctx.fillStyle=G; ctx.beginPath();
    if (up){ ctx.moveTo(0,-30); ctx.lineTo(110,-14); ctx.quadraticCurveTo(130,-10,128,2); ctx.lineTo(0,6); }
    else { ctx.moveTo(0,4); ctx.lineTo(124,4); ctx.quadraticCurveTo(126,16,110,18); ctx.lineTo(0,26); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; for (let x=14;x<118;x+=14){ ctx.beginPath(); if (up){ ctx.moveTo(x,2); ctx.lineTo(x+5,13); ctx.lineTo(x+10,2); } else { ctx.moveTo(x,4); ctx.lineTo(x+5,-7); ctx.lineTo(x+10,4); } ctx.fill(); }
    if (up){ ctx.fillStyle=GD; ctx.beginPath(); ctx.arc(118,-10,3,0,7); ctx.fill(); }
    ctx.restore(); };
  ctx.fillStyle='#b8323c'; ctx.beginPath(); ctx.moveTo(hinge[0],hinge[1]); ctx.lineTo(hinge[0]+120,hinge[1]-120*Math.sin(jaw)); ctx.lineTo(hinge[0]+120,hinge[1]+75*Math.sin(jaw*0.6)); ctx.fill();
  drawJaw(false); drawJaw(true);
  ctx.save(); ctx.translate(hinge[0],hinge[1]); ctx.rotate(-jaw*0.5);
  ctx.fillStyle=G; ctx.beginPath(); ctx.arc(14,-30,16,Math.PI,0); ctx.fill(); ctx.fillStyle='#fffbe0'; ctx.beginPath(); ctx.arc(14,-32,10,0,7); ctx.fill();
  ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.ellipse(18,-32,3,7,0,0,7); ctx.fill(); ctx.restore();
  ctx.restore();
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  const tb = broke ? (lf-round.A)/FPS : 0;
  const tip = broke ? CONTACT_TIP+14 : GATOR_START+(CONTACT_TIP-GATOR_START)*e;
  const jaw = broke ? 0.02 : 0.28+0.22*Math.sin(frame*0.8);
  gator(tip, frame, jaw, !broke);
  if (!broke) boy(BOYX+(jitter||0), GROUND, frame, gold?WORD[ri]:'', worry, 0, false);
  else {
    ctx.fillStyle='#2f6fd6'; ctx.beginPath(); ctx.moveTo(tip-14,GROUND-50); ctx.lineTo(tip+16,GROUND-56); ctx.lineTo(tip+10,GROUND-36); ctx.lineTo(tip-10,GROUND-38); ctx.fill();
    const fy=Math.max(0,1100*tb-1300*tb*tb);
    boy(BOYX+40+220*tb, GROUND, frame, '', 1, fy, true);
    const R=rng(round.start); for (let i=0;i<6;i++){ const k=clamp(tb/0.6,0,1); ctx.fillStyle=`rgba(230,210,170,${0.6*(1-k)})`; ctx.beginPath(); ctx.arc(tip-40+i*24, GROUND-10-k*40-R()*20, 14+k*30, 0, 7); ctx.fill(); }
    ctx.fillStyle='#ffd23f'; for (let i=0;i<5;i++){ const a=frame*0.3+i*1.26, x=BOYX+40+220*tb+Math.cos(a)*44, y=GROUND-fy-250+Math.sin(a)*12; ctx.save(); ctx.translate(x,y); ctx.beginPath(); for(let k=0;k<10;k++){ const an=-Math.PI/2+k*Math.PI/5, r=k%2?4:10; ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);} ctx.fill(); ctx.restore(); }
    if (tb<0.4){ const kk=tb/0.4, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(tip-60,GROUND-180); ctx.scale(s,s); ctx.rotate(-0.1);
      ctx.font='900 92px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=12; ctx.strokeStyle='#1d5a1f'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
  }
}
function coverScene(){ ctx.translate(0,-90); gator(CONTACT_TIP-50, 3, 0.5, false); boy(BOYX, GROUND, 3, '', 1, 0, false); }
""")
