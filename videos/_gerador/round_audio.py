# Uso: python3 round_audio.py meta.json saida.wav  -- efeitos sinteticos por tema
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100; th = meta['theme']
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(17)
def add(sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
lp = lambda x, k: np.convolve(x, np.ones(k) / k, 'same')
def tone(f, d, v, dec): n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / dec) * v
for r in meta['rounds']:
    t0, tc = r['start'] / FPS, r['contact'] / FPS; A = tc - t0
    n = int(A * SR); t = np.arange(n) / SR; p = t / A
    if th == 'prensa':   # zumbido hidraulico subindo
        ph = 2 * np.pi * np.cumsum(60 + 50 * p) / SR
        add((np.sin(ph) + 0.5 * np.sign(np.sin(ph))) * (0.05 + 0.12 * p) + lp(rng.standard_normal(n), 30) * 0.04, t0)
    elif th == 'fuga':   # sirene de dois tons chegando + motor
        f2 = np.where((t * 2.2) % 1 < 0.5, 720, 960)
        add(np.sin(2 * np.pi * np.cumsum(f2) / SR) * (0.02 + 0.13 * p ** 1.5) + lp(np.sign(np.sin(2*np.pi*np.cumsum(55+30*p)/SR)), 20) * 0.05, t0)
    elif th == 'vulcao': # ronco + borbulhas
        add(lp(rng.standard_normal(n), 60) * (0.1 + 0.6 * p) + np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.03 + 0.2 * p) * 0.25, t0)
    elif th == 'arroz':  # fervura + tampa batendo
        add(np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.02 + 0.15 * p) * 0.3 + lp(rng.standard_normal(n), 20) * 0.08 * p, t0)
    elif th == 'privada': # celular vibrando
        add(lp(np.sign(np.sin(2 * np.pi * 170 * t)), 8) * (np.sin(2 * np.pi * (2 + 3 * p) * t) > 0) * (0.05 + 0.12 * p), t0)
    elif th == 'pneu':   # compressor + ar entrando
        motor = lp(np.sign(np.sin(2 * np.pi * (18 + 6 * p) * t)), 40) * 0.06
        add(motor + lp(rng.standard_normal(n), 3) * (0.03 + 0.1 * p), t0)
    elif th == 'sorvete': # calor de verao (cigarras) baixinho
        add(np.sin(2 * np.pi * 4200 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * t))) * (0.01 + 0.03 * p), t0)
    elif th == 'espumante': # borbulhas + rolha rangendo
        add(np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.05 + 0.2 * p) * 0.25, t0)
        add(np.sin(2 * np.pi * np.cumsum(500 + 300 * np.sin(2 * np.pi * 7 * t)) / SR) * 0.05 * p ** 2, t0)
    elif th == 'liqui':  # motor do liquidificador subindo
        ph = 2 * np.pi * np.cumsum(90 + 320 * p) / SR
        add(lp(2 * ((ph / (2 * np.pi)) % 1) - 1, 6) * (0.05 + 0.12 * p) + np.diff(rng.standard_normal(n), prepend=0) * 0.03 * p, t0)
    elif th == 'chaleira': # borbulhar + apito subindo
        add(np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.02 + 0.2 * p) * 0.3, t0)
        add(np.sin(2 * np.pi * np.cumsum(1200 + 1400 * p ** 2) / SR) * 0.1 * p ** 3, t0)
    elif th == 'torra':  # relogio da torradeira + chiado
        add(np.diff(rng.standard_normal(n), prepend=0) * 0.03 * (0.5 + p), t0)
    elif th == 'dog':    # cachorro ofegante
        pant = np.diff(rng.standard_normal(n), prepend=0) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (3 + 5 * p) * t)))
        add(lp(pant, 3) * (0.04 + 0.12 * p), t0)
    elif th == 'pipoca': # oleo chiando
        add(np.diff(rng.standard_normal(n), prepend=0) * (0.04 + 0.2 * p) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * t)), t0)
    elif th == 'gato':   # copo arrastando na mesa + ronronar
        sq = np.sin(2 * np.pi * np.cumsum(700 + 300 * p + 80 * rng.standard_normal(n)) / SR) * (rng.random(n) < 0.6)
        purr = np.sin(2 * np.pi * 60 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 25 * t))
        add(lp(sq, 4) * (0.01 + 0.07 * p) + purr * 0.04, t0)
    elif th == 'micro':  # zumbido do micro-ondas + faiscas estalando
        hum = np.sin(2 * np.pi * 120 * t) + 0.5 * np.sign(np.sin(2 * np.pi * 60 * t))
        cr = np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.03 + 0.25 * p)
        add(lp(hum, 8) * 0.05 + cr * (0.1 + 0.4 * p), t0)
    elif th == 'jacare': # rosnado do jacare chegando
        ph = 2 * np.pi * np.cumsum(70 + 40 * p + 10 * np.sin(2 * np.pi * 9 * t)) / SR
        add(lp(np.sign(np.sin(ph)), 12) * (0.03 + 0.16 * p ** 1.5), t0)
    elif th == 'bomba':  # pavio chiando com estalos
        cr = np.diff(rng.standard_normal(n), prepend=0) * (rng.random(n) < 0.08 + 0.3 * p)
        add(cr * (0.15 + 0.35 * p) + np.diff(rng.standard_normal(n), prepend=0) * 0.03 * (1 + 2 * p), t0)
    elif th == 'refri':  # gas borbulhando + liquido chacoalhando
        add(np.diff(rng.standard_normal(n), prepend=0) * (0.02 + 0.16 * p ** 1.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * t)), t0)
    else:                # chiado da panela + apito subindo
        add(np.diff(rng.standard_normal(n), prepend=0) * (0.02 + 0.22 * p ** 1.5), t0)
        add(np.sin(2 * np.pi * np.cumsum(900 + 1400 * p ** 2) / SR) * 0.08 * p ** 2, t0)
    tb = tc + 1 / FPS + ({'gato':0.25,'sorvete':0.22,'privada':0.25}.get(th, 0)); n = int(0.7 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (100 * np.exp(-t * 10) + 40) * t) * np.exp(-t / 0.15) * 0.9, tb)
    add(lp(rng.standard_normal(n), 3) * np.exp(-t / 0.05) * 0.6, tb)
    for _ in range(16):
        m = int(0.08 * SR); tm = np.arange(m) / SR
        f = rng.uniform(2500, 6000) if th in ('prensa', 'gato') else rng.uniform(400, 1200)
        add(np.sin(2 * np.pi * f * tm) * np.exp(-tm / 0.02) * 0.08, tb + 0.05 + rng.uniform(0, 0.5))
for f in meta['events']:
    m = int(0.05 * SR); tm = np.arange(m) / SR
    add((np.sin(2 * np.pi * ({'prensa':180,'fuga':1568,'refri':220,'bomba':3200,'jacare':140,'micro':3400,'gato':500,'pipoca':2600,'dog':900,'liqui':1200,'chaleira':600,'torra':2200,'pneu':160,'sorvete':1500,'espumante':700,'vulcao':300,'arroz':2400,'privada':170}.get(th, 2400)) * tm)) * np.exp(-tm / 0.012) * 0.12, f / FPS)
to = meta['outro'] / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
add(lp(rng.standard_normal(n), 30) * np.sin(np.pi * t / 0.5) * 0.6, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
