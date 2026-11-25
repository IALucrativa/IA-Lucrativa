# Gerador da série "Pare antes de…"

Cópia dos scripts usados para gerar os vídeos de 7 rodadas com letras falsas.

- `build_round.py <tema> <saida.html>`: monta o HTML do vídeo a partir de `melancia_base.html` + um tema (`*_theme.py`).
- `round_audio.py meta.json saida.wav`: sintetiza o áudio (sem "ding" no frame da letra).
- `render_mp4.sh <pasta> <saida.mp4>`: renderiza os frames (Playwright), gera o áudio e codifica o MP4.

Os caminhos dentro dos scripts apontam para a pasta temporária da sessão em que foram criados;
para usar de novo, ajuste a variável `S` / os caminhos para esta pasta.

Regras da série: 7 rodadas (1 letra por rodada), tempos de 1,3 a 2,1 s com curvas variadas e "fintas",
letra falsa diferente a cada frame e a certa só no frame do 0 ms, explosão de desenho, painel com 6 estados.
