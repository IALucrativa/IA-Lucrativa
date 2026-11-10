"""Monta o áudio do episódio e mede os tempos de cada frase.

Uso: python3 montar_audio.py <pasta_audio>
  A pasta precisa ter narrador.mp3, bia.mp3 e sandra.mp3.
Gera:
  <pasta_audio>/mix.wav       narrador + falas da Bia e da Sandra encaixadas
  video/audio-tempos.js       início/fim de cada frase e de cada trecho (para a legenda)

Como acha as frases no áudio do narrador (sem reconhecimento de fala):
  mede as pausas com o ffmpeg e escolhe, entre elas, as que dividem melhor
  o texto, sabendo que o tempo de cada frase é proporcional ao número de letras.
"""
import json, re, subprocess, sys, os

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = sys.argv[1]
SR = 44100


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))


def silencios(f, db=-38, d=0.25):
    out = subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=noise={db}dB:d={d}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]
    fim = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    return list(zip(ini, fim))


def fim_da_fala(f):
    s = silencios(f, d=0.1)
    D = dur(f)
    return s[-1][0] if s and s[-1][1] >= D - 0.05 else D


# --- textos (lidos do timeline.js)
tl = open(os.path.join(AQUI, 'timeline.js'), encoding='utf-8').read()
frases = re.findall(r"\{ id: '(\w+)', voz: '(\w+)', cena: '\w+', texto: '([^']+)' \}", tl)
# Falas que NÃO estão no narrador.mp3: cada uma vem de um arquivo próprio e é encaixada depois de outra frase.
CLIPES = [('N7', 'B1', 'bia.mp3'), ('N8', 'N8b', 'gorjetas.mp3'), ('N11', 'S1', 'sandra.mp3')]
PROVISORIO = 7.0  # segundos de silêncio enquanto o áudio de um clipe não chega
narr = [(i, t.replace('*', '')) for i, v, t in frases if v == 'narrador' and i not in {c[1] for c in CLIPES}]


def trechos(txt):
    """Divide a frase em trechos onde o narrador costuma pausar (... . , ?)."""
    partes = re.split(r'(?<=[.,?!])\s+', txt)
    return [p for p in partes if p]


def peso(txt):
    return len(re.sub(r'[^\wÀ-ú]', '', txt)) + 2 * len(txt.split())


# --- narrador: segmentos de fala
fN = os.path.join(PASTA, 'narrador.mp3')
DN = dur(fN)
sil = [s for s in silencios(fN) if s[0] > 0.05 and s[1] < DN - 0.05]
# fronteiras possíveis: cada silêncio. Começo = 0, fim = DN
ini_fala = 0.0
for a, b in silencios(fN):
    if a <= 0.05:
        ini_fala = b
fim_fala = fim_da_fala(fN)

pesos = [peso(t) for _, t in narr]
fala_total = fim_fala - ini_fala - sum(b - a for a, b in sil)
r = fala_total / sum(pesos)

# DP: escolher len(narr)-1 silêncios como fronteiras entre frases.
n, m = len(narr), len(sil)
INF = float('inf')


def custo(i, a, b):
    """frase i de a até b (em segundos), tirando pausas internas."""
    internos = sum(min(y, b) - max(x, a) for x, y in sil if x >= a and y <= b)
    falado = b - a - internos
    esp = pesos[i] * r
    return ((falado - esp) / esp) ** 2


best = {}
# estado: (frase i, terminou no silêncio j) -> custo
for j in range(m):
    best[(0, j)] = (custo(0, ini_fala, sil[j][0]), None)
for i in range(1, n - 1):
    for j in range(i, m):
        cand = [(best[(i - 1, k)][0] + custo(i, sil[k][1], sil[j][0]), k) for k in range(i - 1, j) if (i - 1, k) in best]
        if cand:
            best[(i, j)] = min(cand)
fin = min((best[(n - 2, k)][0] + custo(n - 1, sil[k][1], fim_fala), k) for k in range(n - 2, m) if (n - 2, k) in best)
fronteiras = []
k = fin[1]
for i in range(n - 2, -1, -1):
    fronteiras.append(k)
    k = best[(i, k)][1]
fronteiras.reverse()

spans = []
a = ini_fala
for i in range(n):
    b = sil[fronteiras[i]][0] if i < n - 1 else fim_fala
    spans.append((a, b))
    if i < n - 1:
        a = sil[fronteiras[i]][1]


def dividir(txt, a, b):
    """Trechos da frase com tempo, usando as pausas internas quando batem."""
    tr = trechos(txt)
    internos = [(x, y) for x, y in sil if x > a and y < b]
    if len(tr) > 1 and len(internos) >= len(tr) - 1:
        # escolhe as len(tr)-1 pausas mais longas, na ordem
        escolha = sorted(sorted(internos, key=lambda s: s[1] - s[0], reverse=True)[:len(tr) - 1])
        out, ini = [], a
        for (x, y), t in zip(escolha, tr):
            out.append({'start': ini, 'end': x})
            ini = y
        out.append({'start': ini, 'end': b})
        return out
    # proporcional
    ws = [peso(t) for t in tr]
    out, acc = [], 0
    for w in ws:
        out.append({'start': a + (b - a) * acc / sum(ws), 'end': a + (b - a) * (acc + w) / sum(ws)})
        acc += w
    return out


# --- encaixar Bia (depois de N7) e Sandra (depois de N11) no áudio final
ids = [i for i, _ in narr]
idx = {i: k for k, i in enumerate(ids)}
GAP = 0.35
insercoes = CLIPES
faltando = [a for _, _, a in CLIPES if not os.path.exists(os.path.join(PASTA, a))]
tempos = {}
offset = 0.0
pecas = []  # (arquivo, ini, fim) do narrador ou clipe
cursor = 0.0
for apos, fid, arq in insercoes:
    corte = spans[idx[apos]][1] + 0.12
    pecas.append(('N', cursor, corte))
    cursor = corte
    pecas.append((arq, 0.0, PROVISORIO if arq in faltando else fim_da_fala(os.path.join(PASTA, arq))))
pecas.append(('N', cursor, DN))

# tempos: narrador desloca conforme os clipes inseridos antes
t_final = 0.0
desloc = []  # (inicio_no_narrador, deslocamento)
clip_pos = {}
for p in pecas:
    if p[0] == 'N':
        desloc.append((p[1], t_final - p[1]))
        t_final += p[2] - p[1]
    else:
        t_final += GAP
        clip_pos[p[0]] = (t_final, t_final + p[2])
        t_final += p[2] + GAP


def mover(t):
    d = 0
    for ini, off in desloc:
        if t >= ini - 1e-6:
            d = off
    return t + d


for (fid, txt), (a, b) in zip(narr, spans):
    tempos[fid] = {'start': mover(a), 'end': mover(b),
                   'trechos': [{'start': mover(x['start']), 'end': mover(x['end'])} for x in dividir(txt, a, b)]}
for apos, fid, arq in insercoes:
    a, b = clip_pos[arq]
    txt = [t for i, v, t in frases if i == fid][0].replace('*', '')
    tr = trechos(txt)
    if arq == 'bia.mp3' and len(tr) == 2:  # "Vai ter bolo," | "Matheus?" (pausa medida no clipe)
        ps = [s for s in silencios(os.path.join(PASTA, arq), d=0.1) if s[0] > 0.1 and s[1] < b - a]
        if ps:
            tempos[fid] = {'start': a, 'end': b, 'trechos': [{'start': a, 'end': a + ps[0][0]}, {'start': a + ps[0][1], 'end': b}]}
            continue
    tempos[fid] = {'start': a, 'end': b, 'trechos': [{'start': a + (b - a) * k / len(tr), 'end': a + (b - a) * (k + 1) / len(tr)} for k in range(len(tr))]}

# --- montar o áudio com ffmpeg
filtros, entradas = [], []
for k, p in enumerate(pecas):
    if p[0] in faltando:
        entradas += ['-f', 'lavfi', '-t', str(PROVISORIO), '-i', f'anullsrc=r={SR}:cl=mono']
    else:
        entradas += ['-i', fN if p[0] == 'N' else os.path.join(PASTA, p[0])]
    f = f'[{k}:a]aresample={SR},aformat=channel_layouts=mono,atrim={p[1]}:{p[2]},asetpts=PTS-STARTPTS'
    if p[0] != 'N':
        f += f',adelay={int(GAP * 1000)},apad=pad_dur={GAP}'
    filtros.append(f + f'[p{k}]')
concat = ''.join(f'[p{k}]' for k in range(len(pecas))) + f'concat=n={len(pecas)}:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=11[out]'
mix = os.path.join(PASTA, 'mix.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *entradas, '-filter_complex', ';'.join(filtros) + ';' + concat,
                '-map', '[out]', '-ar', str(SR), mix], check=True)

open(os.path.join(AQUI, 'audio-tempos.js'), 'w', encoding='utf-8').write(
    '// Gerado por montar_audio.py a partir dos áudios do ElevenLabs. Não editar à mão.\n'
    'window.TEMPOS = ' + json.dumps(tempos, ensure_ascii=False, indent=1) + ';\n')

print(f'narrador: {DN:.1f} s, áudio final: {dur(mix):.1f} s')
if faltando: print('AINDA SEM ÁUDIO (silêncio no lugar):', ', '.join(faltando))
for fid, v in tempos.items():
    print(f"{fid:4s} {v['start']:6.2f} – {v['end']:6.2f}  trechos: {len(v['trechos'])}")
