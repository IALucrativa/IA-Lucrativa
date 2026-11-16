"""Mistura as vozes (pasta vozes/) com a trilha de efeitos.
Uso: python3 vozes.py audio_sfx.wav saida.wav
Nomeie os áudios da ElevenLabs como em FALAS.md (ex.: vozes/04_leo.mp3).
Cada entrada: (arquivo, início no vídeo em s, corte em s ou None, efeito)
"""
import sys, subprocess, wave
import numpy as np

SR = 44100
VOZES = [  # arquivos que faltarem são ignorados
    ('01_davi.mp3', 0.4, None, 'porta'),
    ('02_leo.mp3', 3.5, None, None),
    ('03_davi.mp3', 7.5, None, 'porta'),
    ('04_leo.mp3', 15.3, None, None),
    ('05_voce.mp3', 18.6, None, None),
    ('06_bia.mp3', 21.8, None, None),
    ('07_professor.mp3', 25.4, None, None),
    ('08_voce.mp3', 34.6, None, None),
    ('09_leo.mp3', 38.7, None, None),
    ('10_bia.mp3', 44.8, None, None),
    ('11_voce.mp3', 53.8, None, None),
    ('12_professor.mp3', 58.7, None, None),
    ('13_professor.mp3', 60.5, None, None),
    ('14_leo.mp3', 63.9, None, None),
    ('15_professor.mp3', 71.6, None, None),
]
FILTROS = {
    None: 'anull',
    'radio': 'highpass=f=450,lowpass=f=3200,acrusher=bits=10:mode=log:aa=1,volume=1.4',
    'porta': 'lowpass=f=2200,aecho=0.6:0.4:18:0.25,volume=1.2',
}

def load(path, cut, fx):
    args = ['ffmpeg', '-v', 'error', '-i', path]
    if cut: args += ['-t', str(cut)]
    flt = FILTROS[fx] + (f',afade=t=out:st={cut - 0.08}:d=0.08' if cut else '')
    args += ['-af', flt, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(args, capture_output=True, check=True).stdout, np.int16).astype(np.float32) / 32768

with wave.open(sys.argv[1]) as w:
    sfx = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2)[:, 0].astype(np.float32) / 32768
voice = np.zeros_like(sfx)
import os
for f, t0, cut, fx in VOZES:
    if not os.path.exists('vozes/' + f):
        print('faltando:', f); continue
    a = load('vozes/' + f, cut, fx)
    i = int(t0 * SR); n = min(len(a), len(voice) - i)
    voice[i:i + n] += a[:n]
# abaixa os efeitos enquanto alguém fala (envelope suavizado)
env = np.abs(voice)
k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
duck = 1 - 0.55 * np.clip(env / 0.03, 0, 1)
mix = sfx * duck + voice * 1.1
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix = mix / np.max(np.abs(mix)) * 0.95
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
