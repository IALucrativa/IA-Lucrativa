"""Cria os efeitos sonoros do Bisnaga (tudo sintetizado aqui, sem gravação de ninguém)."""
import numpy as np, wave, pathlib
SR = 44100
OUT = pathlib.Path(__file__).resolve().parents[1] / 'public/sfx'
rng = np.random.default_rng(3)

def salva(nome, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(str(OUT / nome), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

# tlec: louça batendo (parciais agudos que somem rápido)
def tlec():
    x = t(0.18); s = 0
    for f, a in [(2650, 1), (4120, .6), (6900, .35), (1730, .4)]:
        s = s + a * np.sin(2 * np.pi * f * x) * np.exp(-x * 38)
    return s
salva('tlec.wav', tlec())

# vários tlecs: pinguins pulando
x = np.zeros(int(SR * 2.2))
for k in range(26):
    i = int(SR * (0.05 + rng.random() * 2.0)); s = tlec() * (0.4 + rng.random() * 0.6)
    s = np.interp(np.arange(len(s)) * (0.8 + rng.random() * 0.5), np.arange(len(s)), s)
    x[i:i + len(s)] += s[: len(x) - i]
salva('tlec_varios.wav', x)

# ronco: ruído grave filtrado, entra e sai
x = t(3.2); n = rng.standard_normal(len(x))
k = np.ones(60) / 60; n = np.convolve(n, k, 'same')
env = np.clip(np.sin(np.pi * x / 1.6), 0, None) ** 2
salva('ronco.wav', n * env * (1 + 0.5 * np.sin(2 * np.pi * 28 * x)))

# baque: gato caindo no balcão
x = t(0.35)
salva('baque.wav', np.sin(2 * np.pi * (90 - 60 * x) * x) * np.exp(-x * 18) + 0.15 * rng.standard_normal(len(x)) * np.exp(-x * 60))

# pop: gato aparecendo/sumindo
x = t(0.12)
salva('pop.wav', np.sin(2 * np.pi * (500 + 2500 * x) * x) * np.exp(-x * 40))

# escorregar: chiado que passa
x = t(0.9); n = rng.standard_normal(len(x)); n = n - np.convolve(n, np.ones(6) / 6, 'same')
salva('escorregar.wav', n * np.sin(np.pi * x / 0.9) ** 2)

# caixinha de música: início de "Pour Elise" (Beethoven, domínio público), sintetizado aqui
notas = [('E5', .25), ('D#5', .25), ('E5', .25), ('D#5', .25), ('E5', .25), ('B4', .25), ('D5', .25), ('C5', .25), ('A4', .6),
         ('C4', .25), ('E4', .25), ('A4', .25), ('B4', .6), ('E4', .25), ('G#4', .25), ('B4', .25), ('C5', .8)]
base = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
def freq(n): return 440 * 2 ** ((base[n[:-1]] + 12 * (int(n[-1]) - 4)) / 12)
tot = sum(d for _, d in notas) + 1.5
x = np.zeros(int(SR * tot)); pos = 0.0
for n, d in notas:
    f = freq(n); y = t(1.4)
    s = (np.sin(2 * np.pi * f * y) + .4 * np.sin(2 * np.pi * 2 * f * y) + .15 * np.sin(2 * np.pi * 4.2 * f * y)) * np.exp(-y * 3.5)
    i = int(SR * pos); x[i:i + len(s)] += s[: len(x) - i]; pos += d * 0.9
salva('caixinha.wav', x)
print('ok')
