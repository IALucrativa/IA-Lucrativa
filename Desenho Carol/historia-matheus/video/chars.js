// Personagens da série Matheus & Bia.
// Cada função devolve um pedaço de SVG no seu próprio sistema de coordenadas.
// Adultos: pés em (300, 892). Bia: pés em (300, 712).
// A classe "o" (contorno escuro) é definida no index.html.

const SK = '#f6d3b6';      // pele
const INK = '#2a2233';     // contorno

function limb(d, col = SK, w = 30) {
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 14}" stroke-linecap="round"/>` +
         `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
}
const hand = (x, y, r = 22) => `<circle class="o" cx="${x}" cy="${y}" r="${r}" fill="${SK}"/>`;

// Olhos genéricos. lid: 0 (aberto) a 1 (fechado). look: deslocamento da pupila.
function eyes(cx1, cx2, cy, r, pr, { lid = 0, lx = 3, ly = 4, lidCol = SK } = {}) {
  let s = '';
  for (const cx of [cx1, cx2]) {
    s += `<circle class="o" cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>`;
    if (lid < 0.95) {
      s += `<circle cx="${cx + lx}" cy="${cy + ly}" r="${pr}" fill="#3b2a20"/>`;
      s += `<circle cx="${cx + lx + pr * 0.35}" cy="${cy + ly - pr * 0.45}" r="${pr * 0.36}" fill="#fff"/>`;
    }
    if (lid > 0.02) {
      const yl = cy - r + 2 * r * lid; // linha da pálpebra
      s += `<clipPath id="c${cx}${cy}${r}"><circle cx="${cx}" cy="${cy}" r="${r - 1}"/></clipPath>`;
      s += `<rect x="${cx - r}" y="${cy - r - 2}" width="${2 * r}" height="${yl - cy + r + 2}" fill="${lidCol}" clip-path="url(#c${cx}${cy}${r})"/>`;
      s += `<path d="M${cx - r * Math.sqrt(Math.max(0, 1 - ((yl - cy) / r) ** 2))},${yl} L${cx + r * Math.sqrt(Math.max(0, 1 - ((yl - cy) / r) ** 2))},${yl}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="7"/>`;
    }
  }
  return s;
}

const sweat = (x, y) => `<path class="o" d="M${x},${y} Q${x + 12},${y + 22} ${x},${y + 30} Q${x - 12},${y + 22} ${x},${y} Z" fill="#8fd3ff" stroke-width="4"/>`;

// ---------------------------------------------------------------- MATHEUS
function matheus({ pose = 'box', face = 'happy', blink = 0, backpack = false, look = [3, 4] } = {}) {
  let s = '';
  // caixa atrás das costas (aparece só a pontinha)
  if (pose === 'behind') {
    s += `<g transform="rotate(8 420 600)"><path class="o" d="M352,560 L462,560 L456,640 L358,640 Z" fill="#c98a4b"/>` +
         `<rect class="o" x="370" y="586" width="74" height="30" rx="8" fill="#fff6e3"/></g>`;
  }
  if (backpack) {
    s += `<path class="o" d="M196,440 Q190,410 230,410 L370,410 Q410,410 404,440 L410,640 L190,640 Z" fill="#e5484d"/>`;
  }
  // pernas
  s += `<path class="o" d="M212,640 L206,868 L292,868 L300,712 L308,868 L394,868 L388,640 Z" fill="#3d6fb8"/>
  <path d="M300,712 L300,660" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <path class="o" d="M204,842 L294,842 L292,872 L204,872 Z" fill="#5d8fd6"/>
  <path class="o" d="M306,842 L396,842 L396,872 L308,872 Z" fill="#5d8fd6"/>
  <path class="o" d="M186,872 Q186,850 212,852 L276,856 Q296,866 294,892 L186,892 Z" fill="#fff"/>
  <path class="o" d="M414,872 Q414,850 388,852 L324,856 Q304,866 306,892 L414,892 Z" fill="#fff"/>
  <path d="M196,880 L284,880 M316,880 L404,880" stroke="#ff7a2f" stroke-width="7" stroke-linecap="round"/>
  <path class="o" d="M272,372 L272,418 L328,418 L328,372 Z" fill="#f2c7a5"/>`;
  // braços
  if (pose === 'box') {
    s += limb('M196,430 Q160,520 230,575') + limb('M404,430 Q440,520 370,575');
  } else if (pose === 'behind') {
    s += limb('M196,430 Q176,520 236,600') + limb('M404,430 Q424,520 364,600');
  } else if (pose === 'wave') {
    s += limb('M196,430 Q176,540 196,630') + limb('M404,430 Q470,380 470,290');
  } else { // down
    s += limb('M196,430 Q176,540 196,630') + limb('M404,430 Q424,540 404,630');
  }
  // camiseta
  s += `<path class="o" d="M222,404 Q300,428 378,404 L420,424 L446,492 L398,510 L392,486 L392,652 L208,652 L208,486 L202,510 L154,492 L180,424 Z" fill="#ffc72c"/>
  <path d="M160,480 L204,496 M440,480 L396,496" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <path class="o" d="M262,410 Q300,446 338,410" fill="${SK}"/>
  <path d="M262,410 Q300,446 338,410" fill="none" stroke="#e8a400" stroke-width="5"/>`;
  if (backpack) {
    s += `<path d="M232,420 L226,600 M368,420 L374,600" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>` +
         `<path d="M232,420 L226,600 M368,420 L374,600" stroke="#e5484d" stroke-width="12" stroke-linecap="round"/>`;
  }
  if (pose === 'box') {
    s += `<g transform="rotate(-3 300 580)">
      <path class="o" d="M206,540 L394,540 L384,632 L216,632 Z" fill="#c98a4b"/>
      <path class="o" d="M206,540 L394,540 L388,560 L212,560 Z" fill="#e0a565"/>
      <rect class="o" x="236" y="572" width="128" height="40" rx="10" fill="#fff6e3"/>
      <text x="300" y="603" text-anchor="middle" class="t" font-size="27" fill="#c0392b">PAÇOCA</text>
      <rect class="o" x="232" y="520" width="34" height="26" rx="5" fill="#e9c08a"/>
      <rect class="o" x="272" y="514" width="34" height="26" rx="5" fill="#e9c08a"/>
      <rect class="o" x="312" y="520" width="34" height="26" rx="5" fill="#e9c08a"/>
      <rect class="o" x="350" y="516" width="30" height="26" rx="5" fill="#ff6fa8"/></g>`;
    s += hand(222, 584) + hand(378, 584);
  } else if (pose === 'wave') {
    s += hand(196, 640) + hand(470, 280, 24);
  } else if (pose === 'down') {
    s += hand(196, 640) + hand(404, 640);
  }
  // cabeça
  s += `<circle class="o" cx="174" cy="270" r="24" fill="${SK}"/><circle class="o" cx="426" cy="270" r="24" fill="${SK}"/>
  <ellipse class="o" cx="300" cy="258" rx="128" ry="124" fill="${SK}"/>
  <path class="o" d="M176,236 Q170,282 190,300 Q196,262 214,240 Z" fill="#6b4423"/>
  <path class="o" d="M424,236 Q430,282 410,300 Q404,262 386,240 Z" fill="#6b4423"/>
  <path class="o" d="M168,232 Q168,108 300,104 Q432,108 432,232 Z" fill="#2449a8"/>
  <path d="M300,108 L300,226" stroke="#1a357d" stroke-width="5"/>
  <path d="M232,122 Q214,170 214,228 M368,122 Q386,170 386,228" stroke="#1a357d" stroke-width="5" fill="none"/>
  <circle class="o" cx="300" cy="106" r="10" fill="#2449a8"/>
  <circle class="o" cx="300" cy="176" r="30" fill="#fff"/>
  <text x="300" y="194" text-anchor="middle" class="t" font-size="44" fill="#2449a8">M</text>
  <path class="o" d="M150,232 Q300,206 450,232 Q456,258 430,256 Q300,238 170,256 Q144,258 150,232 Z" fill="#183784"/>`;
  if (face === 'nervous') {
    s += `<path d="M226,270 Q250,262 274,272" stroke="#6b4423" stroke-width="9" fill="none" stroke-linecap="round" transform="rotate(-10 250 268)"/>
    <path d="M326,272 Q350,262 374,270" stroke="#6b4423" stroke-width="9" fill="none" stroke-linecap="round" transform="rotate(10 350 268)"/>`;
  } else {
    s += `<path d="M226,276 Q250,264 274,274" stroke="#6b4423" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M326,274 Q350,264 374,276" stroke="#6b4423" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  }
  s += eyes(252, 348, 306, 27, 15, { lid: blink, lx: look[0], ly: look[1] });
  s += `<ellipse cx="210" cy="342" rx="18" ry="11" fill="#f39a9a" opacity=".75"/><ellipse cx="390" cy="342" rx="18" ry="11" fill="#f39a9a" opacity=".75"/>
  <path d="M294,330 Q300,340 308,332" stroke="#c98a6a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (face === 'nervous') {
    s += `<path d="M268,364 q8,-8 16,0 q8,8 16,0 q8,-8 16,0 q8,8 16,0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>` + sweat(430, 200);
  } else if (face === 'talk') {
    s += `<ellipse class="o" cx="300" cy="362" rx="22" ry="16" fill="#7a2b2b"/>`;
  } else {
    s += `<path class="o" d="M262,350 Q300,392 338,350 Q300,362 262,350 Z" fill="#7a2b2b"/>
    <path d="M278,366 Q300,380 322,366" stroke="#ff8f8f" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

// ---------------------------------------------------------------- SANDRA
function sandra({ pose = 'down', face = 'tired', blink = 0, look = [2, 6] } = {}) {
  let s = `<path class="o" d="M174,250 Q166,118 300,112 Q434,118 426,250 L438,438 Q300,462 162,438 Z" fill="#4a2e1f"/>
  <path class="o" d="M214,650 L210,866 L292,866 L300,716 L308,866 L390,866 L386,650 Z" fill="#2f2f3a"/>
  <path class="o" d="M196,872 Q198,850 222,852 L284,856 Q300,866 298,890 L196,890 Z" fill="#14141a"/>
  <path class="o" d="M404,872 Q402,850 378,852 L316,856 Q300,866 302,890 L404,890 Z" fill="#14141a"/>
  <path class="o" d="M274,372 L274,418 L326,418 L326,372 Z" fill="#efc6a6"/>`;
  if (pose === 'scan') {
    s += limb('M192,440 Q170,560 250,600') + limb('M408,440 Q440,560 360,600');
  } else if (pose === 'forehead') {
    s += limb('M192,440 Q170,540 190,630');
  } else if (pose === 'arms') { // braços cruzados
    s += limb('M192,440 Q170,540 330,560') + limb('M408,440 Q430,540 270,540');
  } else {
    s += limb('M192,440 Q170,540 190,630') + limb('M408,440 Q430,540 410,630');
  }
  s += `<path class="o" d="M224,404 Q300,424 376,404 L414,420 L436,500 L394,512 L390,490 L390,660 L210,660 L210,490 L206,512 L164,500 L186,420 Z" fill="#d6453d"/>
  <path d="M170,486 L208,498 M430,486 L392,498" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <path class="o" d="M258,406 L300,446 L280,456 L246,416 Z" fill="#fff"/>
  <path class="o" d="M342,406 L300,446 L320,456 L354,416 Z" fill="#fff"/>
  <path d="M300,446 L300,500" stroke="${INK}" stroke-width="5"/>
  <rect class="o" x="318" y="500" width="62" height="40" rx="6" fill="#fff"/>
  <rect x="322" y="504" width="54" height="12" rx="3" fill="#1f9d55"/>
  <text x="349" y="534" text-anchor="middle" class="t" font-size="14" fill="${INK}">SANDRA</text>
  <text x="252" y="532" text-anchor="middle" class="t" font-size="19" fill="#ffd34d">MAIS</text>
  <text x="252" y="550" text-anchor="middle" class="t" font-size="13" fill="#ffd34d">MERCADO</text>`;
  if (pose === 'arms') {
    s += limb('M300,555 Q330,560 350,545', SK, 30) + hand(352, 545) + hand(262, 540);
  } else if (pose === 'scan') {
    s += hand(250, 604) + hand(360, 604);
  } else if (pose === 'down') {
    s += hand(190, 640) + hand(410, 640);
  } else if (pose === 'forehead') {
    s += hand(190, 640);
  }
  s += `<circle class="o" cx="182" cy="276" r="22" fill="${SK}"/><circle class="o" cx="418" cy="276" r="22" fill="${SK}"/>
  <ellipse class="o" cx="300" cy="262" rx="120" ry="122" fill="${SK}"/>
  <path class="o" d="M180,262 Q176,132 300,124 Q424,132 420,262 Q408,196 356,172 Q300,160 262,178 Q214,200 180,262 Z" fill="#4a2e1f"/>
  <path d="M262,178 Q300,140 356,140" stroke="#6b4a36" stroke-width="5" fill="none"/>
  <path d="M372,150 Q404,190 410,236" stroke="#cfc7c2" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (face === 'stern') {
    s += `<path d="M226,252 Q250,258 276,266" stroke="#4a2e1f" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M324,266 Q350,258 374,252" stroke="#4a2e1f" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  } else {
    s += `<path d="M226,262 Q250,256 274,248" stroke="#4a2e1f" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M326,248 Q350,256 374,262" stroke="#4a2e1f" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  }
  const lid = Math.max(blink, face === 'stern' ? 0.32 : 0.45);
  s += eyes(252, 348, 300, 24, 13, { lid, lx: look[0], ly: look[1], lidCol: '#f0c4a6' });
  s += `<path d="M234,334 Q252,344 272,334 M328,334 Q348,344 366,334" stroke="#b98a7a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="214" cy="342" rx="15" ry="9" fill="#f39a9a" opacity=".45"/><ellipse cx="386" cy="342" rx="15" ry="9" fill="#f39a9a" opacity=".45"/>
  <path d="M294,322 Q300,334 308,326" stroke="#c98a6a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (face === 'talk') {
    s += `<ellipse class="o" cx="300" cy="360" rx="16" ry="12" fill="#7a2b2b"/>`;
  } else if (face === 'stern') {
    s += `<path d="M278,362 L322,362" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  } else {
    s += `<path d="M276,360 Q300,368 324,358" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  if (face !== 'stern' && face !== 'talk') s += sweat(420, 214);
  if (pose === 'forehead') {
    s += limb('M408,440 Q470,330 380,226') + hand(376, 222, 26);
  }
  return s;
}

// ---------------------------------------------------------------- BIA
let _biaCurls = null;
function biaCurls() {
  if (_biaCurls) return _biaCurls;
  const c = [];
  for (let i = 0; i < 15; i++) {
    const a = (180 + i * (220 / 14) - 20) * Math.PI / 180;
    c.push([300 + 150 * Math.cos(a), 280 + 138 * Math.sin(a), i % 2 ? 44 : 38]);
  }
  c.push([170, 350, 36], [430, 350, 36], [176, 400, 30], [424, 400, 30]);
  return (_biaCurls = c);
}
function bia({ pose = 'down', face = 'happy', blink = 0, look = [2, 6] } = {}) {
  const curls = biaCurls();
  const HC = '#9a6432';
  let s = curls.map(([x, y, r]) => `<circle class="o" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${HC}"/>`).join('') +
          curls.map(([x, y, r]) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r - 3.5}" fill="${HC}"/>`).join('') +
          curls.filter((_, i) => i % 2 === 0).map(([x, y]) => `<path d="M${(x - 10).toFixed(0)},${y.toFixed(0)} q8,-12 16,0 q-6,8 -12,2" stroke="#6e431c" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
  s += `<path class="o" d="M262,610 L258,700 L292,700 L294,610 Z" fill="${SK}"/>
  <path class="o" d="M306,610 L308,700 L342,700 L338,610 Z" fill="${SK}"/>
  <path class="o" d="M240,690 Q244,676 262,678 L296,680 Q306,690 302,712 L240,712 Z" fill="#ff6fa8"/>
  <path class="o" d="M360,690 Q356,676 338,678 L304,680 Q294,690 298,712 L360,712 Z" fill="#ff6fa8"/>`;
  s += limb('M228,470 Q196,520 206,566', SK, 28);
  if (pose === 'point') s += limb('M372,470 Q440,420 450,330', SK, 28);
  else if (pose === 'up') s += limb('M372,470 Q440,420 450,330', SK, 28) + limb('M228,470 Q160,420 150,330', SK, 28);
  else s += limb('M372,470 Q404,520 394,566', SK, 28);
  s += `<path class="o" d="M246,440 Q300,452 354,440 L376,470 L404,624 Q300,646 196,624 L224,470 Z" fill="#2bb3a3"/>
  <path class="o" d="M262,442 Q300,478 338,442 Q300,456 262,442 Z" fill="#fff"/>
  <path d="M210,606 Q300,626 390,606" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="2 16" stroke-linecap="round"/>
  <path class="o" d="M300,520 l9,18 20,3 -14,14 3,20 -18,-9 -18,9 3,-20 -14,-14 20,-3 Z" fill="#ffd34d" stroke-width="5"/>`;
  if (pose === 'up') s += hand(150, 322) + hand(450, 322);
  else s += hand(206, 574) + (pose === 'point' ? hand(450, 322) : hand(394, 574));
  s += `<circle class="o" cx="170" cy="318" r="26" fill="${SK}"/><circle class="o" cx="430" cy="318" r="26" fill="${SK}"/>
  <ellipse class="o" cx="300" cy="310" rx="136" ry="130" fill="${SK}"/>`;
  const bangs = [[236, 190, 30], [272, 176, 32], [310, 172, 32], [348, 180, 30], [380, 198, 26]];
  s += bangs.map(([x, y, r]) => `<circle class="o" cx="${x}" cy="${y}" r="${r}" fill="${HC}"/>`).join('') +
       bangs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3.5}" fill="${HC}"/>`).join('');
  s += `<path class="o" d="M392,160 L360,140 L362,184 Z M392,160 L424,140 L422,184 Z" fill="#ff6fa8"/>
  <circle class="o" cx="392" cy="162" r="11" fill="#ff8fbf"/>`;
  s += eyes(250, 350, 326, 32, 20, { lid: blink, lx: look[0], ly: look[1] });
  s += `<path d="M220,284 Q234,276 248,280 M352,280 Q366,276 380,284" stroke="#6e431c" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="208" cy="372" rx="22" ry="13" fill="#f39a9a" opacity=".8"/><ellipse cx="392" cy="372" rx="22" ry="13" fill="#f39a9a" opacity=".8"/>
  <path d="M296,356 Q300,362 306,358" stroke="#c98a6a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (face === 'ask') {
    s += `<ellipse class="o" cx="300" cy="390" rx="16" ry="18" fill="#7a2b2b"/>`;
  } else {
    s += `<path class="o" d="M276,378 Q300,408 324,378 Z" fill="#7a2b2b"/>
    <path d="M288,392 Q300,400 312,392" stroke="#ff8f8f" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

// ---------------------------------------------------------------- VÓ (dona Lurdes)
function vo({ pose = 'wave', blink = 0, wave = 0 } = {}) {
  const HC = '#e9e6e3';
  let s = `<path class="o" d="M216,640 L212,866 L292,866 L300,730 L308,866 L388,866 L384,640 Z" fill="${SK}"/>
  <path class="o" d="M198,872 Q200,850 222,852 L284,856 Q300,866 298,890 L198,890 Z" fill="#7b4fa0"/>
  <path class="o" d="M402,872 Q400,850 378,852 L316,856 Q300,866 302,890 L402,890 Z" fill="#7b4fa0"/>
  <path class="o" d="M274,372 L274,418 L326,418 L326,372 Z" fill="#efc6a6"/>`;
  s += limb('M196,440 Q170,540 196,620', '#ff8fb1');
  const ang = Math.sin(wave) * 14;
  if (pose === 'wave') s += `<g transform="rotate(${ang} 404 440)">${limb('M404,440 Q470,380 466,280', '#ff8fb1')}${hand(466, 270, 24)}</g>`;
  else s += limb('M404,440 Q430,540 404,620', '#ff8fb1');
  // vestido verde florido + casaquinho rosa
  s += `<path class="o" d="M226,404 Q300,424 374,404 L410,430 L430,760 Q300,790 170,760 L190,430 Z" fill="#3aa36b"/>`;
  for (const [x, y] of [[230, 520], [300, 600], [360, 520], [250, 690], [350, 700], [300, 470]]) {
    s += `<circle cx="${x}" cy="${y}" r="9" fill="#ffd34d"/><circle cx="${x}" cy="${y}" r="4" fill="#ff6fa8"/>`;
  }
  s += `<path class="o" d="M226,404 L190,430 L176,640 L240,650 L262,430 Z" fill="#ff8fb1"/>
  <path class="o" d="M374,404 L410,430 L424,640 L360,650 L338,430 Z" fill="#ff8fb1"/>`;
  s += hand(196, 630);
  if (pose !== 'wave') s += hand(404, 630);
  // cabeça
  s += `<circle class="o" cx="300" cy="118" r="42" fill="${HC}"/>
  <circle class="o" cx="182" cy="276" r="22" fill="${SK}"/><circle class="o" cx="418" cy="276" r="22" fill="${SK}"/>
  <ellipse class="o" cx="300" cy="262" rx="118" ry="118" fill="${SK}"/>
  <path class="o" d="M182,262 Q170,150 300,146 Q430,150 418,262 Q404,214 360,200 Q330,226 300,204 Q270,226 240,200 Q196,214 182,262 Z" fill="${HC}"/>`;
  s += eyes(254, 346, 300, 20, 11, { lid: blink, lx: 2, ly: 4 });
  s += `<circle cx="254" cy="300" r="34" fill="none" stroke="#c0392b" stroke-width="7"/>
  <circle cx="346" cy="300" r="34" fill="none" stroke="#c0392b" stroke-width="7"/>
  <path d="M288,296 Q300,288 312,296" stroke="#c0392b" stroke-width="6" fill="none"/>
  <path d="M232,252 Q254,244 276,252 M324,252 Q346,244 368,252" stroke="#bdb6b0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M206,330 q10,8 20,0 M374,330 q10,8 20,0" stroke="#d9a58a" stroke-width="4" fill="none"/>
  <ellipse cx="216" cy="350" rx="16" ry="10" fill="#f39a9a" opacity=".7"/><ellipse cx="384" cy="350" rx="16" ry="10" fill="#f39a9a" opacity=".7"/>
  <path d="M294,330 Q300,342 308,334" stroke="#c98a6a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path class="o" d="M266,356 Q300,392 334,356 Q300,366 266,356 Z" fill="#7a2b2b"/>`;
  return s;
}

// Coloca um personagem na cena: pés em (x, y), com escala.
function place(svg, x, y, scale = 1, { kid = false, flip = false, rot = 0 } = {}) {
  const fy = kid ? 712 : 892;
  const sx = flip ? -scale : scale;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sx},${scale}) translate(-300,-${fy})">${svg}</g>`;
}

if (typeof module !== 'undefined') module.exports = { matheus, sandra, bia, vo, place };
