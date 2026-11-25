function pig(cx, gold, letter, worry, t){
  const by = 870;      // centro do corpo
  ctx.save();
  // sombra
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx, TABLE_Y+2, 135, 12, 0, 0, 7); ctx.fill();
  const body = gold ? ['#fff2a8','#f5c842','#b8860b'] : ['#ffc4d6','#ff8fb1','#d9577f'];
  const edge = gold ? '#8a6200' : '#b8466a';
  // pernas
  ctx.fillStyle = gold ? '#d9a520' : '#f07aa0';
  for (const lx of [-78,-42,40,76]) { rr(cx+lx-14, by+40, 28, TABLE_Y-(by+40), 8); ctx.fill(); }
  // rabo
  ctx.strokeStyle=body[2]; ctx.lineWidth=5; ctx.beginPath();
  for(let a=0;a<=Math.PI*3;a+=0.2){ const r=4+a*2.2; const x=cx-128-r*Math.cos(a), y=by-10-r*Math.sin(a)*0.8; a===0?ctx.moveTo(x,y):ctx.lineTo(x,y);} ctx.stroke();
  // orelha de tras
  ctx.fillStyle=body[2]; ctx.beginPath(); ctx.moveTo(cx+38,by-66); ctx.lineTo(cx+50,by-86); ctx.lineTo(cx+76,by-70); ctx.fill();
  // corpo
  const g=ctx.createRadialGradient(cx-40,by-50,10,cx,by,150); g.addColorStop(0,body[0]); g.addColorStop(.5,body[1]); g.addColorStop(1,body[2]);
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,by,132,78,0,0,7); ctx.fill();
  ctx.strokeStyle=edge; ctx.lineWidth=2.5; ctx.stroke();
  // fenda da moeda
  ctx.fillStyle = gold ? '#7a5600' : '#6b1f3a'; rr(cx-34, by-77, 60, 9, 4); ctx.fill();
  // focinho
  ctx.fillStyle = gold ? '#e8b42a' : '#ff7aa3'; ctx.beginPath(); ctx.ellipse(cx+132,by+8,24,30,0,0,7); ctx.fill();
  ctx.strokeStyle=edge; ctx.lineWidth=2.5; ctx.stroke();
  ctx.fillStyle=edge; ctx.beginPath(); ctx.ellipse(cx+136,by-2,4,7,0,0,7); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+136,by+18,4,7,0,0,7); ctx.fill();
  // orelha da frente
  ctx.fillStyle = gold ? '#f0c040' : '#ff9fbd'; ctx.beginPath(); ctx.moveTo(cx+62,by-66); ctx.lineTo(cx+80,by-88); ctx.lineTo(cx+106,by-58); ctx.fill();
  ctx.strokeStyle=edge; ctx.lineWidth=2; ctx.stroke();
  // olho (olha pra cima quando preocupado)
  const ex=cx+92, ey=by-22;
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ex,ey,13,15+worry*3,0,0,7); ctx.fill();
  ctx.fillStyle='#10131c'; ctx.beginPath(); ctx.arc(ex+3-worry*2, ey+4-worry*10, 6.5, 0, 7); ctx.fill();
  if (worry>0.3){ // sobrancelha preocupada
    ctx.strokeStyle=edge; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ex-14,ey-22-worry*4); ctx.lineTo(ex+12,ey-30); ctx.stroke();
  }
  // bochecha
  if(!gold){ ctx.fillStyle='rgba(255,90,140,0.35)'; ctx.beginPath(); ctx.ellipse(cx+90,by+16,16,9,0,0,7); ctx.fill(); }
  // gota de suor
  if (worry>0.55 && !gold){
    const dy = (t*60)%26;
    ctx.fillStyle='rgba(126,224,255,0.9)'; ctx.beginPath(); ctx.moveTo(cx+60,by-60+dy); ctx.quadraticCurveTo(cx+50,by-44+dy,cx+60,by-40+dy); ctx.quadraticCurveTo(cx+70,by-44+dy,cx+60,by-60+dy); ctx.fill();
  }
  // letra dourada
  if (gold){
    ctx.save(); ctx.shadowColor='rgba(90,60,0,0.8)'; ctx.shadowOffsetY=5; ctx.shadowBlur=0;
    text(letter, cx-24, by+8, 104, '#fffbe6', 900); ctx.restore();
    ctx.textAlign='center'; ctx.strokeStyle='rgba(122,86,0,0.6)'; ctx.lineWidth=2; ctx.font='900 104px Inter'; ctx.strokeText(letter,cx-24,by+8);
  }
  ctx.restore();
}
