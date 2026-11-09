"""Gera os tempos da legenda a partir dos áudios da narração.

Uso: python3 scripts/tempos_legenda.py <falas-para-elevenlabs.txt> <pasta dos áudios> <saida.json>
Divide cada bloco em frases curtas e encaixa o fim de cada frase na pausa
(silêncio) mais próxima do áudio. Sem internet e sem programa pago.
"""
import json, re, subprocess, sys

falas, pasta, saida = sys.argv[1:4]

def duracao(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

def pausas(f):
    log = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-38dB:d=0.22', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    fim = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    return list(zip(ini, fim))

def frases(texto):
    return [x.strip() for x in re.findall(r'[^.?!…]+(?:\.\.\.|[.?!…])?"?', texto) if x.strip()]

def quebra(frase, maximo=9):
    # frase longa quebra na vírgula; se ainda for longa, no meio
    if len(frase.split()) <= maximo:
        return [frase]
    out = []
    for p in re.split(r'(?<=,)\s', frase):
        w = p.split()
        while len(w) > maximo:
            corte = (len(w) + 1) // 2
            out.append(' '.join(w[:corte])); w = w[corte:]
        if w:
            out.append(' '.join(w))
    return out

def encaixa(alvos, internas):
    # escolhe, em ordem, uma pausa para cada fim de frase (programação dinâmica)
    n, m = len(alvos), len(internas)
    INF = 1e9
    custo = [[INF] * (m + 1) for _ in range(n + 1)]
    volta = [[None] * (m + 1) for _ in range(n + 1)]
    for j in range(m + 1):
        custo[0][j] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            meio = sum(internas[j - 1]) / 2
            c = custo[i - 1][j - 1] + abs(meio - alvos[i - 1])
            if c < custo[i][j]:
                custo[i][j], volta[i][j] = c, ('usa', j - 1)
            if custo[i][j - 1] < custo[i][j]:
                custo[i][j], volta[i][j] = custo[i][j - 1], ('pula', None)
    if n == 0:
        return []
    if custo[n][m] >= INF:
        return [(a, a) for a in alvos]
    res, i, j = [], n, m
    while i > 0:
        tipo, k = volta[i][j]
        if tipo == 'usa':
            res.append(internas[k]); i -= 1; j -= 1
        else:
            j -= 1
    return res[::-1]

blocos = re.findall(r'^(\d\d-[\w]+)\.mp3\nTEXTO: (.+)$', open(falas, encoding='utf-8').read(), re.M)
resultado = []
for nome, texto in blocos:
    arq = f'{pasta}/{nome}.mp3'
    dur = duracao(arq)
    pp = pausas(arq)
    voz_ini = pp[0][1] if pp and pp[0][0] < 0.05 else 0.0
    voz_fim = pp[-1][0] if pp and pp[-1][1] > dur - 0.05 else dur
    internas = [p for p in pp if p[0] > voz_ini + 0.1 and p[1] < voz_fim - 0.1]
    fr = frases(texto)
    total = sum(len(f) for f in fr)
    alvos, acum = [], 0
    for f in fr[:-1]:
        acum += len(f)
        alvos.append(voz_ini + (voz_fim - voz_ini) * acum / total)
    cortes = encaixa(alvos, internas) + [(voz_fim, voz_fim)]
    legendas, t = [], voz_ini
    for f, c in zip(fr, cortes):
        pedacos = quebra(f)
        tam = sum(len(p) for p in pedacos)
        fim_fala = c[0]
        tt = t
        for k, p in enumerate(pedacos):
            ate = fim_fala if k == len(pedacos) - 1 else tt + (fim_fala - t) * len(p) / tam
            legendas.append({'texto': p, 'de': round(tt, 2), 'ate': round(ate + (0.15 if k == len(pedacos) - 1 else 0), 2)})
            tt = ate
        t = c[1]
    resultado.append({'bloco': nome, 'duracao': round(dur, 3), 'legendas': legendas})
json.dump(resultado, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for b in resultado:
    print(b['bloco'], b['duracao'], len(b['legendas']), 'legendas')
