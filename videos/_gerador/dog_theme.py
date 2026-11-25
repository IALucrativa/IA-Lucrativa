_gt = open('/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad/gato_theme.py').read()
_room = _gt[_gt.index('function background(){'):_gt.index('function glass(')]
TH['dog'] = dict(
title='Pare o Cachorro', word='FAMINTO', approach='[57, 45, 60, 42, 54, 39, 51]', style='[1, 3, 0, 2, 4, 1, 0]', bands='[100, 100, 100, 100, 100, 100, 100]',
T="""const T = {
  title:'PARE ANTES DO CACHORRO COMER O BOLO', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'BOLO', bands:'FOME %', st:['DE OLHO','FAREJANDO','ESTICANDO','QUASE!','AGORA!','NHAM!'],
  lim:'LIMITE', boom:'NHAM', gauge:'', items:'BOLOS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'SÓ A LETRA DO 0 MS VALE', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'NHAM!'
};""",
tint=('#04140f','rgba(0,229,160,0.045)','rgba(0,229,160,0)','rgba(0,229,160,0.10)'), cover_n='99%',
geo=r"""const TABLE_Y = 968, TOP = 820, EDGE = 470, FLOOR = 1080, CAKEX = 320, DOGX = 610;
const EVENTS = [];   // fungadas (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*14); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=_room + r"""
function cake(letter, worry, frame, bitten=0){
  const x=CAKEX-80, y=TOP-96, w=160, h=96;
  ctx.fillStyle='#e8e8ee'; ctx.beginPath(); ctx.ellipse(CAKEX,TOP-2,110,12,0,0,7); ctx.fill();
  ctx.fillStyle='#6b3a1f'; rr(x,y,w,h,10); ctx.fill();
  ctx.fillStyle='#4d2914'; ctx.fillRect(x,y+46,w,8);
  ctx.fillStyle='#fff3e6'; ctx.beginPath(); ctx.moveTo(x,y+14); for(let i=0;i<=8;i++){ ctx.quadraticCurveTo(x+i*20-10,y+30+(i%2)*8,x+i*20,y+14); } ctx.lineTo(x+w,y); ctx.lineTo(x,y); ctx.closePath(); ctx.fill();
  rr(x-2,y-6,w+4,22,10); ctx.fill();
  ctx.fillStyle='#e0344a'; ctx.beginPath(); ctx.arc(CAKEX-30,y-12,12,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(CAKEX+30,y-12,12,0,7); ctx.fill();
  ctx.fillStyle='#6ec8ff'; ctx.fillRect(CAKEX-4,y-56,8,44); const fl=0.8+0.2*Math.sin(frame*0.9);
  ctx.fillStyle='#ffd23f'; ctx.beginPath(); ctx.ellipse(CAKEX,y-66,7*fl,13*fl,0,0,7); ctx.fill();
  if (bitten>0){ ctx.fillStyle='#2e2246'; ctx.beginPath(); ctx.arc(x+w+6,y+30,46*bitten,0,7); ctx.fill(); }
  if (letter) text(letter, CAKEX-38, y+72, 40, 'rgba(255,240,220,0.45)', 900);       // letra (falsas em todo frame, certa no 0 ms)
  const ey=y+42, es=11;
  for (const s of [-1,1]){ const ex=CAKEX+22+s*18; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill();
    ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+3+worry*3, ey+1, es*0.5, 0, 7); ctx.fill();
    if (worry>0.3){ ctx.strokeStyle='#fff3e6'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ex-s*11, ey-es*1.6-worry*3); ctx.lineTo(ex+s*8, ey-es*2.2); ctx.stroke(); } }
  if (worry>0.55){ const dy=(frame*2)%20; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.ellipse(x+w-12,y+20+dy,4,7,0,0,7); ctx.fill(); }
}
function dog(lean, frame, e, mood){
  // mood: 0 = de olho, 1 = comendo feliz
  ctx.save(); ctx.translate(DOGX, FLOOR); ctx.rotate(-lean);
  const B='#c68642', BD='#8a5a2b', BL='#f0d2a8';
  const wag=Math.sin(frame*(0.5+1.5*e))*0.5;
  ctx.strokeStyle=B; ctx.lineWidth=16; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(30,-110); ctx.quadraticCurveTo(80,-140,70+Math.sin(wag)*40,-200); ctx.stroke();
  ctx.fillStyle=BD; rr(-30,-120,24,120,10); ctx.fill(); rr(8,-120,24,120,10); ctx.fill();
  ctx.fillStyle='#4a2e14'; ctx.beginPath(); ctx.ellipse(-22,-4,22,10,0,0,7); ctx.fill(); ctx.beginPath(); ctx.ellipse(18,-4,22,10,0,0,7); ctx.fill();
  ctx.fillStyle=B; ctx.beginPath(); ctx.ellipse(0,-190,58,92,0,0,7); ctx.fill();
  ctx.fillStyle=BL; ctx.beginPath(); ctx.ellipse(-14,-180,30,62,0,0,7); ctx.fill();
  ctx.strokeStyle=B; ctx.lineWidth=20; ctx.beginPath(); ctx.moveTo(-20,-240); ctx.lineTo(-96,-262); ctx.stroke();
  ctx.fillStyle=BL; ctx.beginPath(); ctx.arc(-100,-262,13,0,7); ctx.fill();
  // cabeca
  const hx=-4, hy=-298;
  ctx.fillStyle=BD; ctx.beginPath(); ctx.ellipse(hx+44,hy+6,18,44,-0.25,0,7); ctx.fill();
  ctx.fillStyle=B; ctx.beginPath(); ctx.arc(hx,hy,56,0,7); ctx.fill();
  ctx.fillStyle=BL; ctx.beginPath(); ctx.ellipse(hx-56,hy+14,44,28,0,0,7); ctx.fill();
  ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.ellipse(hx-96,hy+4,13,10,0,0,7); ctx.fill();
  ctx.fillStyle=BD; ctx.beginPath(); ctx.ellipse(hx-10,hy-44,16,40,0.5,0,7); ctx.fill();
  if (mood===1){ ctx.strokeStyle='#1a1a1a'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(hx-22,hy-12,10,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
    ctx.fillStyle='#fff3e6'; ctx.beginPath(); ctx.ellipse(hx-80,hy+6,26,14,0,0,7); ctx.fill(); ctx.fillStyle='#6b3a1f'; for (const [dx,dy] of [[-64,22],[-92,24],[-50,2]]){ ctx.beginPath(); ctx.arc(hx+dx,hy+dy,5,0,7); ctx.fill(); } }
  else { ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(hx-24,hy-12,13,0,7); ctx.fill(); ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(hx-30,hy-10,8,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(hx-33,hy-13,3,0,7); ctx.fill();
    const tl=10+26*e; ctx.fillStyle='#ff7aa2'; rr(hx-78,hy+26,22,tl,10); ctx.fill();
    if (e>0.3){ const d=(frame*3)%40; ctx.fillStyle='rgba(200,235,255,0.85)'; ctx.beginPath(); ctx.ellipse(hx-62,hy+40+tl+d,4,7,0,0,7); ctx.fill(); } }
  ctx.restore();
}
function nham(round, tb){
  const R=rng(round.start*7919+5), g=2200;
  if (tb<0.07){ ctx.fillStyle=`rgba(255,245,230,${0.35*(1-tb/0.07)})`; ctx.fillRect(0,0,W,H); }
  for (let i=0;i<34;i++){ const a=-Math.PI*(0.1+0.8*R()), sp=300+R()*700, x=CAKEX+70+Math.cos(a)*sp*tb, y=TOP-60+Math.sin(a)*sp*tb+0.5*g*tb*tb;
    if (y>FLOOR) continue; ctx.fillStyle= i%3===0?'#fff3e6': i%3===1?'#6b3a1f':'#e0344a'; ctx.beginPath(); ctx.arc(x,y,3+R()*6,0,7); ctx.fill(); }
  if (tb<0.4){ const kk=tb/0.4, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(430,560); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 100px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle='#8a5a2b'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
  ctx.fillStyle='#ff4d6d'; for (let i=0;i<3;i++){ const y=520-tb*120-i*40, x=560+i*30+Math.sin(tb*10+i)*10; ctx.save(); ctx.translate(x,y); ctx.scale(1.2,1.2); ctx.beginPath(); ctx.moveTo(0,6); ctx.bezierCurveTo(-14,-6,-6,-16,0,-8); ctx.bezierCurveTo(6,-16,14,-6,0,6); ctx.fill(); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  tableDraw();
  if (!broke){ cake(letterAt(ri, lf, round.A, frame), worry, frame); dog(0.46*e, frame, e, 0); }
  else { const tb=(lf-round.A)/FPS; cake('', 0, frame, 1); dog(0.46-0.25*clamp(tb/0.2,0,1), frame, 1, 1); nham(round, tb); }
}
function coverScene(){ ctx.translate(0,-90); tableDraw(); cake('', 1, 4); dog(0.42, 4, 0.9, 0); }
""")
