// Texto do Ep. 1 e tempos de cada frase.
// *palavra* = palavra destacada em amarelo na legenda.
// Os tempos (start/end) são estimados até chegar o áudio do ElevenLabs.
// Depois, o build.js troca pelos tempos medidos no áudio (audio-tempos.json).

const EP = {
  serie: 'MATHEUS & BIA',
  ep: 1,
  arroba: '@vocedecideai.tv',
  meta: 'R$ 2.800,00',
  frases: [
    { id: 'N1', voz: 'narrador', cena: 'gancho', texto: 'Se você comprou *bala* ou *paçoca* essa semana... provavelmente você *encontrou* com *ele*.' },
    { id: 'N2', voz: 'narrador', cena: 'convite', texto: 'Quem *decide* a vida dele... é *você*, no *final* do vídeo.' },
    { id: 'N3', voz: 'narrador', cena: 'quem', texto: 'Esse é o *Matheus*. *Dezessete* anos. Ainda tá na *escola*.' },
    { id: 'N4', voz: 'narrador', cena: 'mae', texto: 'A mãe dele, a dona *Sandra*, trabalha o dia inteiro no *caixa* de um mercado. E ganha *pouco*.' },
    { id: 'N5', voz: 'narrador', cena: 'aluguel', texto: 'O *aluguel* tá atrasado há *três meses*. Mil e *oitocentos* reais.' },
    { id: 'N6', voz: 'narrador', cena: 'contas', texto: 'E ainda tem *quinhentos* de conta *atrasada*.' },
    { id: 'N7', voz: 'narrador', cena: 'aniver', texto: 'E daqui a *sete dias*... a *Bia*, irmãzinha dele, faz *três anos*.' },
    { id: 'B1', voz: 'bia', cena: 'aniver', texto: 'Vai ter *bolo*, Matheus?' },
    { id: 'N8', voz: 'narrador', cena: 'meta', texto: 'Dois mil e *oitocentos* reais. Em *sete dias*.' },
    { id: 'N8b', voz: 'narrador', cena: 'gorjetas', texto: 'E você pode *ajudar*! Cada *seguidor* novo vale *um real* pro Matheus. *Curtida*, *compartilhamento*, *salvamento* e *comentário* também *contam*.' },
    { id: 'N9', voz: 'narrador', cena: 'rotina', texto: 'Então todo dia, ele sai da *escola*, busca a *Bia*, deixa na casa da *vó*... e vai pro *semáforo*.' },
    { id: 'N10', voz: 'narrador', cena: 'rotina', texto: 'No primeiro dia, vendeu *trinta e oito* paçocas.' },
    { id: 'N11', voz: 'narrador', cena: 'virada', texto: 'Só que naquela *noite*... a mãe dele tava *esperando*.' },
    { id: 'S1', voz: 'sandra', cena: 'virada', texto: 'Onde você tava até *agora*, Matheus?' },
    { id: 'N12', voz: 'narrador', cena: 'escolha', texto: 'Ele conta a *verdade*... ou *esconde* da mãe e continua vendendo *escondido*?' },
    { id: 'N13', voz: 'narrador', cena: 'cta', texto: 'Comenta *A* ou *B*. O próximo episódio é *escolha* de vocês.' },
  ],
  sobraFinal: 2.5, // segundos de tela depois da última frase
};

// Estimativa (sem áudio): palavras por segundo e pausa entre frases.
function estimarTempos(ep, pps = 2.6, pausa = 0.5) {
  let t = 0.3;
  for (const f of ep.frases) {
    const n = f.texto.replace(/\*/g, '').split(/\s+/).length;
    const extra = (f.texto.match(/\.\.\./g) || []).length * 0.35;
    f.start = t;
    f.end = t + n / pps + extra;
    t = f.end + pausa;
  }
}

// Divide cada frase em palavras com tempo (proporcional ao tamanho da palavra).
// Se a frase tem "trechos" medidos no áudio (pausas reais), distribui dentro de cada trecho.
function distribuir(crus, a, b) {
  const pesos = crus.map(w => w.replace(/[*.,?!]/g, '').length + 2 + (/[.,?!]$/.test(w) ? 1 : 0));
  const total = pesos.reduce((x, y) => x + y, 0);
  let acc = 0;
  return crus.map((w, i) => {
    const s = a + (b - a) * acc / total;
    acc += pesos[i];
    return { w: w.replace(/\*/g, ''), hi: /\*/.test(w), start: s, end: a + (b - a) * acc / total };
  });
}
function prepararPalavras(ep) {
  for (const f of ep.frases) {
    const partes = f.texto.split(/(?<=[.,?!])\s+/).filter(Boolean);
    if (f.trechos && f.trechos.length === partes.length) {
      f.palavras = partes.flatMap((p, i) => distribuir(p.split(/\s+/), f.trechos[i].start, f.trechos[i].end));
    } else {
      f.palavras = distribuir(f.texto.split(/\s+/), f.start, f.end);
    }
  }
}

// Blocos de legenda: até 3 palavras, quebra depois de pontuação.
function prepararLegendas(ep) {
  const blocos = [];
  for (const f of ep.frases) {
    let cur = [];
    const flush = () => { if (cur.length) blocos.push({ frase: f.id, palavras: cur }); cur = []; };
    for (const p of f.palavras) {
      cur.push(p);
      const len = cur.map(x => x.w).join(' ').length;
      if (/[.,?!]$/.test(p.w) || cur.length >= 3 || len >= 16) flush();
    }
    flush();
  }
  blocos.forEach((b, i) => {
    b.start = b.palavras[0].start;
    const prox = blocos[i + 1];
    const fimFrase = b.palavras[b.palavras.length - 1].end;
    b.end = prox && prox.frase === b.frase ? prox.start : fimFrase + 0.25;
  });
  ep.legendas = blocos;
}

function prepararCenas(ep) {
  const cenas = [];
  for (const f of ep.frases) {
    const last = cenas[cenas.length - 1];
    if (!last || last.id !== f.cena) cenas.push({ id: f.cena, start: cenas.length ? f.start - 0.15 : 0 });
  }
  const fim = ep.frases[ep.frases.length - 1].end + ep.sobraFinal;
  cenas.forEach((c, i) => { c.end = i + 1 < cenas.length ? cenas[i + 1].start : fim; });
  ep.cenas = cenas;
  ep.duracao = fim;
}

function prepararEpisodio(ep, tempos) {
  if (tempos) {
    for (const f of ep.frases) { f.start = tempos[f.id].start; f.end = tempos[f.id].end; f.trechos = tempos[f.id].trechos; }
  } else {
    estimarTempos(ep);
  }
  prepararPalavras(ep);
  prepararLegendas(ep);
  prepararCenas(ep);
  return ep;
}

// Tempo (global) em que uma palavra é falada. Ex.: wt('N2', 'você').
function wt(ep, fraseId, palavra, n = 1) {
  const f = ep.frases.find(x => x.id === fraseId);
  let k = 0;
  for (const p of f.palavras) {
    if (p.w.toLowerCase().replace(/[.,?!]/g, '') === palavra.toLowerCase() && ++k === n) return p.start;
  }
  throw new Error(`palavra não achada: ${fraseId} ${palavra}`);
}

if (typeof module !== 'undefined') module.exports = { EP, prepararEpisodio, wt };
