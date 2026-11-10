# Regras do projeto

## Desenho Carol: série "Matheus & Bia" (`Desenho Carol/historia-matheus/`)

### Entrega de todo vídeo finalizado (regra da Carol)
Toda vez que um vídeo ficar pronto, entregue junto, sem esperar pedido:
1. **O vídeo**: `epNN/matheus-e-bia-epNN.mp4`.
2. **A capa**: `epNN/capa.png` (1080×1920), feita com `video/capa.js` e o `epNN/capa.json` do episódio (troque só os textos, a pose e o cenário). Confira também `epNN/capa-recorte-grade.png`: tudo o que importa tem que caber no recorte da grade do perfil, e nada cobre o rosto.
   - Selinho com o nome da série no alto; "EPISÓDIO <n>" grande, com o número em amarelo; faixa amarela inclinada com o prazo ("FALTAM N DIAS"); selinho escuro com o gancho; o Matheus no cenário do episódio; cartão inclinado com a ameaça e faixa vermelha embaixo; etiqueta curta do personagem.
   - A capa **não** leva a barra de voto: o voto fica no vídeo e na legenda.
3. **A legenda do post**: `epNN/legenda-do-post.txt` e também no chat, pronta para copiar, nesta estrutura:
   ```
   EP. <n> | <título do episódio> <emoji>
   <o que aconteceu, em 1 ou 2 frases curtas>
   <o gancho: a ameaça ou a dúvida, em 1 frase> 👀

   🗳️ VOCÊ DECIDE: <a pergunta do voto>?
   Comente A (<OPÇÃO A>) ou B (<OPÇÃO B>).
   O próximo episódio é o que vocês escolherem. Amanhã, 12h.

   💛 Cada seguidor novo vale R$ 1 pro Matheus. Curtida, compartilhamento, salvamento e comentário também contam. (Gorjetas fictícias, valores da animação.)

   #vocedecideai #matheusebia #drama #serieanimada
   ```

### Regras da série
- Todo episódio tem **entre 1 e 2 minutos** (alvo: 80 a 100 s).
- Estrutura e estilo do vídeo de referência: `referencia/estrutura.md`. Topo fixo com `MATHEUS & BIA • EP. N`, dinheiro, `META R$ 2.800,00` e `@vocedecideai.tv`.
- Gorjetas do público: seguidor R$ 1,00, curtida R$ 0,70, compartilhamento R$ 0,75, salvamento R$ 0,35, comentário R$ 0,05. Sempre com o aviso "GORJETAS FICTÍCIAS • VALORES DA ANIMAÇÃO".
- A narração é feita pela Carol no ElevenLabs. Entregue o texto em `epNN/narracao-para-elevenlabs.txt`, uma parte por voz. Os áudios ficam em `epNN/audio/` e são encaixados com `video/montar_audio.py`.
- A história, os personagens e as decisões ficam em `historia.md`. Atualize depois de cada episódio.
