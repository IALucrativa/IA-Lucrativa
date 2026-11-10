"""Mede os áudios da Convocação e gera src/bisnaga/d01/tempos.json:
a duração de cada cena e quando cada pedaço da legenda entra (pelas pausas da voz)."""
import json, re, subprocess, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parents[1]
AUD = RAIZ / 'public/bisnaga/d01'
FPS = 30
FOLGA = 0.45  # respiro depois de cada fala (s)

CENAS = [
 ('01-abertura', ['Dez mil pinguins de geladeira...', 'acabaram de ganhar vida.']),
 ('02-dormindo', ['E o único que pode parar eles...', 'está dormindo.']),
 ('03-bisnaga', ['Esse é o Bisnaga, gato da padaria.', 'E o exército dele...', 'quem monta é você.']),
 ('04-sozinho', ['Sozinho, ele não segura', 'nem o primeiro pinguim.']),
 ('05-regra', ['Cada comentário...', 'é um gato a mais.']),
 ('06-acougue', ['Se comentar AÇOUGUE,', 'chega o mais forte do bairro...', 'mas ele só luta depois de comer.']),
 ('07-feirante', ['Se comentar FEIRANTE,', 'chega um que grita mais alto que a feira inteira...', 'até ficar rouco.']),
 ('08-loterica', ['LOTÉRICA acerta tudo sem querer...', 'e erra tudo quando tenta.']),
 ('09-salao', ['E SALÃO luta com estilo...', 'mas foge se despentear.']),
 ('10-pinguins', ['Os pinguins: vinte centímetros de louça.', 'Não sentem frio.', 'E escorregam mais rápido', 'do que qualquer gato corre.']),
 ('11-meta', ['Se passar de quinhentos comentários...', 'vocês vão ouvir uma musiquinha.', 'E o bairro inteiro vai abrir a janela.']),
 ('12-prazo', ['Vocês têm vinte e quatro horas.', 'Amanhã, ao meio-dia,', 'a gente conta comentário por comentário.', 'Nem um gato a mais, nem um a menos.', 'E quem tiver mais pedidos...', 'abre a fila.']),
 ('13-ameaca', ['Por enquanto, o exército do Bisnaga...', 'é o Bisnaga.', 'E os pinguins já desceram da geladeira.']),
 ('14-pergunta', ['Quem você convoca?']),
]

def dur(f):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(f)]))

def pausas(f):
    out = subprocess.run(['ffmpeg','-i',str(f),'-af','silencedetect=noise=-38dB:d=0.16','-f','null','-'],capture_output=True,text=True).stderr
    ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]
    fim = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    return list(zip(ini, fim))

saida, t0 = [], 0.0
for nome, pedacos in CENAS:
    f = AUD / f'{nome}.mp3'
    d = dur(f)
    meio = [(a + b) / 2 for a, b in pausas(f) if a > 0.25 and b < d - 0.2]
    n = len(pedacos) - 1
    if len(meio) >= n:
        # escolhe as n pausas mais longas, em ordem
        ps = sorted(sorted(pausas(f), key=lambda p: -(p[1]-p[0])), key=lambda p: p[0])
        ps = [p for p in ps if p[0] > 0.25 and p[1] < d - 0.2]
        ps = sorted(sorted(ps, key=lambda p: -(p[1]-p[0]))[:n], key=lambda p: p[0])
        cortes = [p[1] - 0.05 for p in ps]
        modo = 'pausas'
    else:
        tot = sum(len(p) for p in pedacos); acc = 0; cortes = []
        for p in pedacos[:-1]:
            acc += len(p); cortes.append(d * acc / tot)
        modo = 'proporcional'
    inicios = [0.0] + cortes
    total = d + FOLGA
    saida.append({'nome': nome, 'inicio': round(t0 * FPS), 'duracao': round(total * FPS), 'audio': round(d, 2),
                  'legendas': [{'de': round(s * FPS), 'texto': p} for s, p in zip(inicios, pedacos)]})
    print(f'{nome}: {d:.2f}s, {len(pedacos)} legendas ({modo})')
    t0 += total

final = 1.2  # corte seco depois da pergunta
json.dump({'fps': FPS, 'total': round((t0 + final) * FPS), 'cenas': saida}, open(RAIZ / 'src/bisnaga/d01/tempos.json', 'w'), ensure_ascii=False, indent=1)
print(f'Total: {t0 + final:.1f} s')
