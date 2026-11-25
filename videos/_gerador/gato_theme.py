TH['gato'] = dict(
title='Pare o Gato', word='ESPERTO', approach='[54, 63, 45, 57, 42, 60, 39]', style='[0, 2, 1, 3, 2, 0, 1]', bands='[12, 14, 11, 15, 13, 16, 17]', subtle=True,
T="""const T = {
  title:'PARE ANTES DO GATO DERRUBAR O COPO', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'COPO', bands:'EMPURRÕES', st:['NA MESA','EMPURRANDO','NA BEIRADA','QUASE!','AGORA!','CRASH!'],
  lim:'LIMITE', boom:'QUEDA', gauge:'', items:'COPOS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA COPO', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'CRASH!'
};""",
tint=('#04140f','rgba(0,229,160,0.045)','rgba(0,229,160,0)','rgba(0,229,160,0.10)'), cover_n='17',
geo=r"""const TABLE_Y = 968, TOP = 820, EDGE = 470, FLOOR = 1080, GX0 = 236;
const EVENTS = [];   // empurroes da patinha (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*BANDS[i]); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function background(){
  const g=ctx.createLinearGradient(0,0,0,FLOOR); g.addColorStop(0,'#1d1530'); g.addColorStop(1,'#3a2a55'); ctx.fillStyle=g; ctx.fillRect(0,0,W,FLOOR);
  ctx.fillStyle='rgba(255,255,255,0.035)'; for (let x=0;x<W;x+=40) ctx.fillRect(x,380,18,FLOOR-380);
  // janela com lua
  ctx.fillStyle='#0d1030'; rr(520,430,150,170,10); ctx.fill(); ctx.strokeStyle='#c9a46a'; ctx.lineWidth=8; ctx.stroke();
  ctx.fillStyle='#fff3c4'; ctx.beginPath(); ctx.arc(615,480,22,0,7); ctx.fill(); ctx.fillStyle='#0d1030'; ctx.beginPath(); ctx.arc(625,474,20,0,7); ctx.fill();
  ctx.strokeStyle='#c9a46a'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(595,430); ctx.lineTo(595,600); ctx.moveTo(520,515); ctx.lineTo(670,515); ctx.stroke();
  // rodape e piso
  ctx.fillStyle='#e8dcc8'; ctx.fillRect(0,FLOOR-14,W,14);
  ctx.fillStyle='#8a5a32'; ctx.fillRect(0,FLOOR,W,H-FLOOR); ctx.fillStyle='rgba(0,0,0,0.18)'; for (let y=FLOOR+40;y<H;y+=40) ctx.fillRect(0,y,W,3);
  for (let y=FLOOR;y<H;y+=40) for (let x=((y/40)%2)*90; x<W; x+=180) ctx.fillRect(x,y,3,40);
  const o=ctx.createLinearGradient(0,0,0,400); o.addColorStop(0,'rgba(8,6,16,0.9)'); o.addColorStop(1,'rgba(8,6,16,0)'); ctx.fillStyle=o; ctx.fillRect(0,0,W,400);
}
function tableDraw(){
  ctx.fillStyle='#5a3a1c'; ctx.fillRect(40,TOP+28,22,FLOOR-TOP-28); ctx.fillRect(420,TOP+28,22,FLOOR-TOP-28);
  ctx.fillStyle='#9b6a3a'; rr(-20,TOP,EDGE+20,30,4); ctx.fill(); ctx.fillStyle='#b98250'; ctx.fillRect(-20,TOP,EDGE+20,5);
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(-20,TOP+26,EDGE+20,4);
}
function glass(gx, gy, rot, worry, letter, frame, spill=0){
  ctx.save(); ctx.translate(gx, gy); ctx.rotate(rot);
  const path=()=>{ ctx.beginPath(); ctx.moveTo(-35,0); ctx.lineTo(-44,-130); ctx.lineTo(44,-130); ctx.lineTo(35,0); ctx.closePath(); };
  if (gy<=TOP+1){ ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0,2,40,6,0,0,7); ctx.fill(); }
  ctx.save(); path(); ctx.clip();
  ctx.fillStyle='rgba(200,235,255,0.18)'; ctx.fillRect(-50,-140,100,140);
  const lvl=-92+spill*80, wob=Math.sin(frame*0.7)*3*(0.3+worry);
  ctx.fillStyle='rgba(70,160,255,0.6)'; ctx.beginPath(); ctx.moveTo(-50,lvl+wob); ctx.lineTo(50,lvl-wob); ctx.lineTo(50,0); ctx.lineTo(-50,0); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(-50,lvl-wob-2,100,4);
  if (letter) text(letter, 4, -36, 54, 'rgba(255,255,255,0.42)', 900);       // letra discreta na agua
  ctx.restore();
  path(); ctx.strokeStyle='rgba(235,248,255,0.95)'; ctx.lineWidth=3.5; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fillRect(-32,-118,6,100);
  // rosto
  const ey=-100, es=11;
  for (const s of [-1,1]){ const ex=s*16; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+3+worry*2, ey+3+worry*4, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#e8f6ff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ex-s*11, ey-es*1.7-worry*3); ctx.lineTo(ex+s*8, ey-es*2.2); ctx.stroke(); } }
  if (worry>0.6){ ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.ellipse(0,ey+24,5,7,0,0,7); ctx.fill(); }
  ctx.restore();
}
function cat(gx, frame, pushing, shocked){
  const bx=130, by=TOP;
  const tw=Math.sin(frame*0.12)*0.4;
  ctx.strokeStyle='#d9822b'; ctx.lineWidth=18; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(bx-50,by-20); ctx.quadraticCurveTo(bx-120,by-60,bx-100+Math.sin(tw)*40,by-150); ctx.stroke();
  ctx.fillStyle='#f0a04b'; ctx.beginPath(); ctx.ellipse(bx,by-70,72,72,0,0,7); ctx.fill();
  ctx.fillStyle='#fff3e0'; ctx.beginPath(); ctx.ellipse(bx+22,by-50,36,46,0,0,7); ctx.fill();
  ctx.strokeStyle='#c96f1e'; ctx.lineWidth=7; for (const a of [-0.9,-0.5,-0.1]){ ctx.beginPath(); ctx.arc(bx,by-70,60,a-0.15+Math.PI,a+0.15+Math.PI); ctx.stroke(); }
  // braco empurrando
  const pawX = pushing ? gx-48 : bx+70, pawY = pushing ? TOP-30 : TOP-12;
  ctx.strokeStyle='#f0a04b'; ctx.lineWidth=24; ctx.beginPath(); ctx.moveTo(bx+40,by-80); ctx.quadraticCurveTo((bx+40+pawX)/2, pawY-40, pawX, pawY); ctx.stroke();
  ctx.fillStyle='#fff3e0'; ctx.beginPath(); ctx.arc(pawX,pawY,15,0,7); ctx.fill();
  // cabeca
  const hx=bx+14, hy=by-172;
  ctx.fillStyle='#f0a04b';
  for (const s of [-1,1]){ ctx.beginPath(); ctx.moveTo(hx+s*20,hy-40); ctx.lineTo(hx+s*48,hy-78); ctx.lineTo(hx+s*56,hy-26); ctx.fill(); }
  ctx.fillStyle='#ffb6c9'; for (const s of [-1,1]){ ctx.beginPath(); ctx.moveTo(hx+s*30,hy-40); ctx.lineTo(hx+s*46,hy-64); ctx.lineTo(hx+s*50,hy-36); ctx.fill(); }
  ctx.fillStyle='#f0a04b'; ctx.beginPath(); ctx.ellipse(hx,hy,62,54,0,0,7); ctx.fill();
  ctx.strokeStyle='#c96f1e'; ctx.lineWidth=6; for (const dx of [-14,0,14]){ ctx.beginPath(); ctx.moveTo(hx+dx,hy-52); ctx.lineTo(hx+dx,hy-36); ctx.stroke(); }
  // olhos: safados (meio fechados) ou chocados
  for (const s of [-1,1]){ const ex=hx+s*24+6, ey=hy-4;
    if (shocked){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex,ey,15,0,7); ctx.fill(); ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+4,ey+6,7,0,7); ctx.fill(); }
    else { ctx.fillStyle='#c8e64a'; ctx.beginPath(); ctx.ellipse(ex,ey,14,10,0,0,7); ctx.fill(); ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.ellipse(ex+5,ey+2,3,8,0,0,7); ctx.fill();
      ctx.fillStyle='#f0a04b'; ctx.fillRect(ex-16,ey-12,32,10); ctx.strokeStyle='#7a3f0e'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ex-15,ey-2); ctx.lineTo(ex+15,ey-2); ctx.stroke(); } }
  ctx.fillStyle='#ff7aa2'; ctx.beginPath(); ctx.moveTo(hx+2,hy+14); ctx.lineTo(hx+14,hy+14); ctx.lineTo(hx+8,hy+22); ctx.fill();
  ctx.strokeStyle='#7a3f0e'; ctx.lineWidth=3; ctx.beginPath();
  if (shocked){ ctx.arc(hx+8,hy+36,7,0,7); } else { ctx.moveTo(hx-8,hy+28); ctx.quadraticCurveTo(hx+8,hy+38,hx+28,hy+24); }
  ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2; for (const s of [-1,1]) for (const k of [-1,1]){ ctx.beginPath(); ctx.moveTo(hx+8+s*22,hy+20+k*4); ctx.lineTo(hx+8+s*62,hy+14+k*10); ctx.stroke(); }
  if (shocked) text('?', hx+70, hy-70, 56, '#ffd23f', 900);
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  tableDraw();
  if (!broke){
    const gx = GX0 + (EDGE-GX0)*e, rot = 0.22*Math.max(0,(e-0.86)/0.14);
    cat(gx, frame, true, false);
    glass(gx+(jitter||0)*0.6, TOP, rot, worry, gold?WORD[ri]:'', frame);
  } else {
    const tb=(lf-round.A)/FPS, tf=Math.min(tb,0.25);
    cat(EDGE, frame, false, true);
    if (tb<0.25){ glass(EDGE+150*tf, TOP+260*(tf/0.25)**2, 0.22+7*tf, 1, '', frame, tf*3);
      const R=rng(frame); ctx.fillStyle='rgba(70,160,255,0.8)'; for (let i=0;i<8;i++){ ctx.beginPath(); ctx.arc(EDGE+150*tf-20+R()*40, TOP+260*(tf/0.25)**2-60-R()*60, 3+R()*4, 0, 7); ctx.fill(); }
    } else {
      const ts=tb-0.25, R=rng(round.start*31+7), g=2400, cx=EDGE+40, cy=FLOOR-4;
      if (ts<0.06){ ctx.fillStyle=`rgba(230,245,255,${0.4*(1-ts/0.06)})`; ctx.fillRect(0,0,W,H); }
      const pk=clamp(ts/0.3,0,1); ctx.fillStyle='rgba(70,160,255,0.55)'; ctx.beginPath(); ctx.ellipse(cx,cy+6,40+150*pk,6+6*pk,0,0,7); ctx.fill();
      for (let i=0;i<20;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=300+R()*700, x=cx+Math.cos(a)*sp*ts, y=cy+Math.sin(a)*sp*ts+0.5*g*ts*ts, s=6+R()*14;
        if (y>cy+10) continue; ctx.save(); ctx.translate(x,y); ctx.rotate(ts*10+i); ctx.fillStyle='rgba(220,240,255,0.9)'; ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s*0.6,-s*0.8); ctx.lineTo(s*0.4,s*0.7); ctx.fill(); ctx.restore(); }
      for (let i=0;i<24;i++){ const a=-Math.PI*(0.15+0.7*R()), sp=200+R()*500, x=cx+Math.cos(a)*sp*ts, y=cy+Math.sin(a)*sp*ts+0.5*g*ts*ts;
        if (y>cy+8) continue; ctx.fillStyle='rgba(70,160,255,0.85)'; ctx.beginPath(); ctx.arc(x,y,3+R()*5,0,7); ctx.fill(); }
      if (ts<0.32){ const kk=ts/0.32, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(430,900); ctx.scale(s,s); ctx.rotate(-0.08);
        ctx.font='900 96px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle='#1d4f9e'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
    }
  }
}
function coverScene(){ ctx.translate(0,-90); tableDraw(); cat(EDGE-14, 3, true, false); glass(EDGE-14, TOP, 0.14, 1, '', 3); }
""")
