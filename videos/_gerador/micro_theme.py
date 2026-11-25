TH['micro'] = dict(
title='Pare o Micro-ondas', word='ESTRELA', approach='[57, 42, 63, 48, 39, 60, 51]', style='[1, 2, 0, 3, 1, 2, 0]', bands='[96, 104, 88, 112, 99, 118, 107]', subtle=True,
T="""const T = {
  title:'PARE ANTES DO MICRO-ONDAS EXPLODIR', lvl:'NÍVEL IMPOSSÍVEL', sub:' · SÓ 1 FRAME REVELA A LETRA',
  item:'MICRO-ONDAS', bands:'FAÍSCAS', st:['LIGADO','ESQUENTANDO','FAISCANDO','QUASE!','AGORA!','EXPLODIU!'],
  lim:'LIMITE', boom:'EXPLOSÃO', gauge:'', items:'MICRO-ONDAS', gold:'', join:'',
  q:'ACHOU AS 7 LETRAS?', hint:'PAUSE NO FRAME CERTO EM CADA MICRO-ONDAS', cta:'COMENTA A PALAVRA', follow:'e me segue pra mais desafios',
  c1:'SÓ 1 FRAME', c2:'REVELA A PALAVRA', c3:'VOCÊ CONSEGUE PAUSAR?', fx:'BOOM!'
};""",
tint=('#0c0a14','rgba(126,224,255,0.05)','rgba(126,224,255,0)','rgba(126,224,255,0.10)'), cover_n='118',
geo=r"""const TABLE_Y = 968, MX = 360, MY0 = 690, MY1 = 958, MXL = 140, MXR = 580;
const EVENTS = [];   // estalos das faiscas (audio)
ROUNDS.forEach((r,i)=>{ let last=0; for(let lf=0; lf<=r.A; lf++){ const n=Math.floor(ease(lf/r.A,r.style)*16); if(n>last){ EVENTS.push(r.start+lf); last=n; } } });""",
draw=r"""function micro(e, ms, letter, worry, frame, jit, dead=false){
  ctx.save(); ctx.translate(jit,0);
  const sx=1+0.03*e, cx=MX, w=(MXR-MXL)*sx, x=cx-w/2, y=MY0, h=MY1-MY0;
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx,TABLE_Y+2,w*0.55,10,0,0,7); ctx.fill();
  // pezinhos e corpo
  ctx.fillStyle='#222'; ctx.fillRect(x+30,MY1,30,8); ctx.fillRect(x+w-60,MY1,30,8);
  const g=ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,dead?'#5a5a60':'#f2f3f7'); g.addColorStop(1,dead?'#2a2a2e':'#b9bdc9');
  ctx.fillStyle=g; rr(x,y,w,h,22); ctx.fill(); ctx.strokeStyle='#5d6270'; ctx.lineWidth=3; ctx.stroke();
  if (!dead && worry>0){ ctx.fillStyle=`rgba(255,60,40,${0.2*worry})`; rr(x,y,w,h,22); ctx.fill(); }
  // grade de ventilacao
  ctx.fillStyle='#8a90a0'; for (let i=0;i<6;i++) ctx.fillRect(x+w-118+i*16, y+12, 8, 4);
  // porta + janela
  const dx=x+16, dw=w*0.68, wx=dx+18, wy=y+26, ww=dw-36, wh=h-52;
  ctx.fillStyle=dead?'#3a3a40':'#d7dae2'; rr(dx,y+12,dw,h-24,14); ctx.fill(); ctx.strokeStyle='#8a90a0'; ctx.lineWidth=2; ctx.stroke();
  const lit = dead ? 'rgba(40,30,20,0.95)' : `rgba(255,${210-60*e},${120-80*e},0.92)`;
  ctx.fillStyle=lit; rr(wx,wy,ww,wh,10); ctx.fill();
  ctx.save(); rr(wx,wy,ww,wh,10); ctx.clip();
  ctx.fillStyle='rgba(0,0,0,0.12)'; for (let yy=wy; yy<wy+wh; yy+=6) for (let xx=wx+((yy/6)&1)*3; xx<wx+ww; xx+=6) ctx.fillRect(xx,yy,2,2);
  if (!dead){
    // prato girando + marmita + garfo
    const pc=wx+ww/2, py=wy+wh-26, rot=frame*0.08;
    ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.ellipse(pc,py,ww*0.38,12,0,0,7); ctx.fill();
    const off=Math.sin(rot)*18;
    ctx.fillStyle='#e8e3d6'; rr(pc-60+off,py-58,120,50,8); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(pc-54+off,py-58,108,12);
    ctx.fillStyle='#5a2e14'; for (let i=0;i<8;i++){ ctx.beginPath(); ctx.arc(pc-40+off+i*11,py-52,4,0,7); ctx.fill(); }
    const fx=pc+20+off, fy=py-76; ctx.strokeStyle='#c9ced9'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(fx-30,fy+40); ctx.lineTo(fx,fy); ctx.stroke();
    ctx.lineWidth=3; for (let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(fx+k*6,fy); ctx.lineTo(fx+k*6+4,fy-18); ctx.stroke(); }
    // faiscas
    const R=rng(frame*13+1), n=2+Math.floor(24*e);
    for (let i=0;i<n;i++){ const a=R()*Math.PI*2, l=8+R()*(20+60*e); ctx.strokeStyle= i%3?'#e8f6ff':'#7ec8ff'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(fx+2,fy-14);
      let px=fx+2, py2=fy-14; for (let s=1;s<=3;s++){ px+=Math.cos(a+(R()-0.5)*0.9)*l/3; py2+=Math.sin(a+(R()-0.5)*0.9)*l/3; ctx.lineTo(px,py2); } ctx.stroke(); }
    if (e>0.2){ const rg=ctx.createRadialGradient(fx,fy-14,2,fx,fy-14,90*e); rg.addColorStop(0,`rgba(200,235,255,${0.6*e})`); rg.addColorStop(1,'rgba(200,235,255,0)'); ctx.fillStyle=rg; ctx.fillRect(wx,wy,ww,wh); }
  }
  ctx.restore();
  // rosto na janela
  const ey=wy+44, ex0=wx+ww/2, es=17;
  if (dead){ ctx.strokeStyle='#ddd'; ctx.lineWidth=5; for (const s of [-1,1]){ const ex=ex0+s*40; ctx.beginPath(); ctx.moveTo(ex-11,ey-11); ctx.lineTo(ex+11,ey+11); ctx.moveTo(ex+11,ey-11); ctx.lineTo(ex-11,ey+11); ctx.stroke(); } }
  else {
    for (const s of [-1,1]){ const ex=ex0+s*40;
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,es,es*(1.15+worry*0.3),0,0,7); ctx.fill(); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+2, ey+4+worry*6, es*0.5, 0, 7); ctx.fill();
      if (worry>0.3){ ctx.strokeStyle='#333'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(ex-s*16, ey-es*1.6-worry*4); ctx.lineTo(ex+s*12, ey-es*2.2); ctx.stroke(); } }
    if (worry>0.55){ const dy=(frame*2)%24, sx2=ex0+86, sy=ey-20+dy; ctx.fillStyle='rgba(126,224,255,0.95)'; ctx.beginPath(); ctx.moveTo(sx2,sy-10); ctx.quadraticCurveTo(sx2-8,sy+4,sx2,sy+6); ctx.quadraticCurveTo(sx2+8,sy+4,sx2,sy-10); ctx.fill(); }
  }
  // painel: visor + botoes
  const px0=dx+dw+12, pw=x+w-px0-14;
  ctx.fillStyle='#10141c'; rr(px0,y+30,pw,46,8); ctx.fill();
  const lcd = dead ? '#ff4d5e' : '#5cff8f';
  let disp; if (dead) disp='ERR'; else if (letter) disp=letter; else { const s=Math.max(0,Math.ceil(ms/1000)); disp='0:'+String(s).padStart(2,'0'); }
  text(disp, px0+pw/2, y+54, letter?34:26, lcd, 700, 'center', 'DejaVu Sans Mono');      // letra discreta no visor
  ctx.fillStyle='#9aa0ae'; for (let r2=0;r2<3;r2++) for (let c=0;c<3;c++){ rr(px0+8+c*(pw-16)/3, y+92+r2*34, (pw-16)/3-8, 24, 5); ctx.fill(); }
  ctx.fillStyle= dead?'#555':'#2bb673'; rr(px0+8, y+200, pw-16, 30, 6); ctx.fill();
  ctx.restore();
}
function smoke(e, frame){
  const n=Math.floor(12*e);
  for (let k=0;k<n;k++){ const age=((frame*(1+2*e)+k*19)%50)/50, xx=MXR-70+Math.sin(k*2.1+age*3)*26*age, yy=MY0-age*(150+150*e), r=8+age*(20+30*e);
    ctx.fillStyle=`rgba(90,90,100,${(1-age)*0.5*e})`; ctx.beginPath(); ctx.arc(xx,yy,r,0,7); ctx.fill(); }
}
function blast(round, tb){
  const R=rng(round.start*7919+77), g=2200;
  micro(0, 0, '', 0, 0, 0, true);
  if (tb<0.08){ ctx.fillStyle=`rgba(220,240,255,${0.5*(1-tb/0.08)})`; ctx.fillRect(0,0,W,H); }
  for (let k=0;k<12;k++){ const a=R()*Math.PI*2, d=(80+R()*150)*Math.min(1,tb*3), r=40+R()*60+tb*120;
    ctx.fillStyle=`rgba(60,60,70,${0.6*Math.max(0,1-tb*1.3)})`; ctx.beginPath(); ctx.arc(MX+Math.cos(a)*d, MY0+40+Math.sin(a)*d*0.6-tb*220, r, 0, 7); ctx.fill(); }
  // porta voando
  const dx=MXL+16-900*tb, dy=MY0+12-700*tb+0.5*g*tb*tb; ctx.save(); ctx.translate(dx+150,dy+120); ctx.rotate(-tb*9);
  ctx.fillStyle='#d7dae2'; rr(-150,-120,300,240,14); ctx.fill(); ctx.fillStyle='rgba(60,40,20,0.9)'; rr(-130,-100,260,200,10); ctx.fill(); ctx.restore();
  // arroz, feijao e faiscas
  for (let i=0;i<50;i++){ const a=-Math.PI*(0.05+0.9*R()), sp=500+R()*1000, x=MX-60+R()*120+Math.cos(a)*sp*tb, y=MY0+150+Math.sin(a)*sp*tb+0.5*g*tb*tb;
    ctx.save(); ctx.translate(x,y); ctx.rotate(i+tb*8);
    if (i%3===0){ ctx.fillStyle='#5a2e14'; ctx.beginPath(); ctx.ellipse(0,0,7,4.5,0,0,7); ctx.fill(); }
    else if (i%3===1){ ctx.fillStyle='#fffbe8'; ctx.beginPath(); ctx.ellipse(0,0,5,2.4,0,0,7); ctx.fill(); }
    else if (tb<0.4){ ctx.strokeStyle='#bfe6ff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(14,0); ctx.stroke(); }
    ctx.restore(); }
  const sk=clamp(tb/0.4,0,1); ctx.fillStyle='rgba(90,60,30,0.75)'; ctx.beginPath(); ctx.ellipse(MX,TABLE_Y+2,100+170*sk,5+4*sk,0,0,7); ctx.fill();
  if (tb<0.32){ const kk=tb/0.32, s=1+0.5*kk; ctx.save(); ctx.globalAlpha=1-kk*kk; ctx.translate(MX,640); ctx.scale(s,s); ctx.rotate(-0.08);
    ctx.font='900 100px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=14; ctx.strokeStyle='#ff4d5e'; ctx.strokeText(T.fx,0,0); ctx.fillStyle='#fff'; ctx.fillText(T.fx,0,0); ctx.restore(); }
}
function scene(ri, round, lf, e, gold, broke, worry, jitter, frame){
  table();
  const ms=(round.A-lf)*1000/FPS;
  if (!broke){ smoke(e, frame); micro(e, ms, gold?WORD[ri]:'', worry, frame, jitter||0); }
  else blast(round, (lf-round.A)/FPS);
}
function coverScene(){ table(); smoke(1, 5); smoke(0.8, 30); micro(1, 1000, '', 1, 7, 0); }
""")
