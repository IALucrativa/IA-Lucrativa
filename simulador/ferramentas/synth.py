import json, sys, wave, numpy as np
ev = json.load(open(sys.argv[1])); out = sys.argv[2]
SR = 44100; FPS = 30; n = int((len(ev) / FPS + 1.5) * SR); buf = np.zeros(n)
SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28]
def tone(t0, f, dur, vol, kind='pling'):
    i0 = int(t0 * SR); m = int(dur * SR); t = np.arange(m) / SR
    if kind == 'pling':
        w = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t) + 0.12*np.sin(2*np.pi*3.01*f*t)
        env = np.exp(-t * 14) * np.minimum(1, t * 800)
    elif kind == 'thud':
        ff = 150 * np.exp(-t * 9) + 50; w = np.sin(2*np.pi*np.cumsum(ff)/SR); env = np.exp(-t * 16)
    else:  # boom
        rng = np.random.default_rng(1); w = rng.standard_normal(m) * 0.6 + np.sin(2*np.pi*np.cumsum(70*np.exp(-t*3)+25)/SR)
        env = np.exp(-t * 2.5)
    seg = w * env * vol; e = min(n, i0 + m); buf[i0:e] += seg[:e - i0]
last = -1
for fi, steps in enumerate(ev):
    t0 = fi / FPS
    brk = sum(s['brk'] for s in steps); kill = sum(s['kill'] for s in steps)
    sp = sum(s['split'] + s['eat'] for s in steps); gen = max(s['maxGen'] for s in steps)
    if brk: tone(t0, 0, 2.5, 0.9, 'boom'); last = fi; continue
    if fi - last < 2: continue
    if kill: tone(t0, 0, 0.25, 0.5, 'thud'); last = fi
    elif sp:
        f = 523.25 * 2 ** (SCALE[gen % len(SCALE)] / 12)
        tone(t0, f, 0.45, min(0.45, 0.16 + np.log2(sp + 1) * 0.05)); last = fi
# eco curto
d = int(0.11 * SR); wet = np.zeros_like(buf); wet[d:] = buf[:-d] * 0.28; wet[2*d:] += buf[:-2*d] * 0.12; buf += wet
buf = np.tanh(buf * 1.1) * 0.9
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype('<i2').tobytes())
