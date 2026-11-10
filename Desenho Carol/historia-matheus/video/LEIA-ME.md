# Como o vídeo é montado

O vídeo é desenhado em código (SVG) e gravado quadro a quadro.

- `chars.js`: os personagens (Matheus, Sandra, Bia, Vó Lurdes) com poses e expressões.
- `timeline.js`: o texto de cada frase, com as palavras destacadas entre *asteriscos*, e os tempos.
- `scenes.js`: os cenários, as etiquetas, a legenda e o topo da tela de cada cena.
- `index.html`: junta tudo. Aberto no navegador, toca a animação.
- `render.js`: grava.
  - `node render.js previa saida.png`: folha com quadros de todas as cenas.
  - `node render.js video saida.mp4 [audio.mp3]`: vídeo 720x1280, 30 fps.

Sem áudio, os tempos são estimados (2,6 palavras por segundo). Quando chegar a narração do ElevenLabs, os tempos de cada frase são medidos no áudio e salvos em `audio-tempos.js`, e as cenas e legendas acompanham a voz.
