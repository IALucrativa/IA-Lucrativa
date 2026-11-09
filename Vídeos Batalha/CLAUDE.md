# Estúdio de batalhas do público

Esta pasta é um estúdio para criar vídeos curtos e verticais (Reels, TikTok, Shorts) no formato **"1 contra N"**: um herói fraco e simpático vai enfrentar um exército enorme, e **cada comentário do público vira um soldado** do lado dele. Os vídeos são em 3D. Cada desafio tem dois vídeos: a **Convocação** (hoje: apresenta a briga e pede os soldados) e a **Batalha** (amanhã: a luta com o número real de comentários). Quem está do outro lado pode ser iniciante: explique sem termo técnico e um passo por vez.

A referência de estrutura está em `referencias/batalha-comentarios/` (vídeo, folhas de quadros e `analise.md`, com o que pode usar e o que não pode copiar).

## Primeira vez
Se a pessoa ainda não montou o estúdio (não existe a pasta `projeto/`), siga o `COMECE-AQUI.md`.

Para criar uma série, use a `entrevista-da-serie.md` adaptando as perguntas a este formato: no lugar de premissa, prazo e voto de duas opções, defina o herói, o exército inimigo, os 4 tipos de soldado (força e defeito), a meta bônus com o soldado especial, o prazo e a conta da batalha. No lugar do `banco-de-problemas.md`, entregue o `banco-de-desafios.md` (15+ inimigos e cenários, do mais fácil ao mais difícil) e, no lugar das ideias de Ep. 1, 3 ideias de primeiro desafio.

## Organização
- `series/<nome>/`: tudo de uma série. `biblia.md` (herói, exército inimigo, os tipos de soldado, a voz do narrador, regras, placar e histórico de contagens), `banco-de-desafios.md`, `briefing.md`, `perfil.md`, `prancha/` e uma pasta por desafio (`d01/`, `d02/`...) com `convocacao/` e `batalha/` (roteiro, narração para o ElevenLabs, áudios e prévias).
- `projeto/`: o código dos vídeos (Remotion com Three.js para o 3D). Cada série tem a sua pasta em `projeto/src/<série>/`.
- `entregas/AAAA-MM-DD_nome-dNN-convocacao/` e `entregas/AAAA-MM-DD_nome-dNN-batalha/`: vídeo final, capa, roteiro e legenda do post.
- `referencias/<nome>/`: vídeos e imagens de referência, com a `analise.md` (estrutura × identidade).

## O ciclo de um desafio
1. **Convocação** (dia 1): o herói sozinho contra N inimigos, o cardápio de tipos de soldado, a meta bônus, o prazo e a pergunta final. Termina com o herói ainda sozinho e o inimigo avançando.
2. **Contagem** (antes da Batalha): a pessoa me passa os números reais **de cada plataforma**: total de comentários e quantos pediram cada tipo. Comentário que não cita um tipo conta como soldado comum. Se ela não souber contar, explico como (ou peço prints dos comentários).
3. **Batalha** (dia 2): o exército entra com o número exato, o tipo mais pedido vai na frente, cada tipo usa a sua força e o seu defeito, e o resultado sai da conta (ver "Como a batalha se resolve"). Termina com o gancho do próximo desafio.

## Antes de qualquer vídeo
1. Leia a `biblia.md` e o `banco-de-desafios.md` da série.
2. Na Batalha, confira com a pessoa a contagem **de cada plataforma**. O número é sempre o real, nem um a mais, nem um a menos.
3. Roteiro (a narração e a imagem de cada cena) → aprovação → narração para o ElevenLabs → só então a produção.

## Três plataformas: Instagram, TikTok e YouTube
- A **Convocação** é o mesmo vídeo nas três plataformas.
- A **Batalha** segue a contagem de cada plataforma. Plataformas com contagens diferentes têm **Batalhas diferentes** (o número de soldados e a mistura de tipos mudam). Pastas: `d01/batalha-instagram/`, `d01/batalha-tiktok/`, `d01/batalha-youtube/`; entregas `entregas/AAAA-MM-DD_nome-d01-batalha-<plataforma>/`.
- Se uma plataforma venceu e outra perdeu, cada uma segue a sua linha a partir dali. A bíblia guarda **um placar e um histórico de contagens para cada plataforma**.

## Regras de criação
- Fale em português do Brasil.
- Formato: 1080×1920, 30 fps. Áudio normalizado em −14 LUFS.
- Duração mínima: todo vídeo tem **no mínimo 1 minuto** (60 s), para fins de monetização (cerca de 150 a 170 palavras de narração). O tempo a mais vem de tensão e de ação, nunca de cena parada.
- **Um narrador só,** voz séria e calma, de documentário, falando com "você". O humor vem do contraste entre o tom sério e o absurdo da situação. Frases curtas.
- Nunca copie personagem, nome, piada, arte ou música de outra pessoa. Referência serve só de estrutura. Nunca use nome de famoso, de pessoa real ou de meme conhecido.
- A piada nunca é o físico nem a pobreza; é o jeito de lutar.
- **Herói e inimigo:** o herói é pequeno, simpático e fácil de reconhecer; o inimigo é muito maior em número. O título diz a desvantagem: **"1 <HERÓI> CONTRA <N>"**.
- **Tipos de soldado:** sempre **4 tipos**, cada um com **um nome de uma palavra** (é o que o público comenta), **uma força e um defeito engraçado** ditos numa frase. Os tipos podem mudar a cada desafio, mas a frase de cada um precisa ser útil na Batalha.
- **Meta bônus:** um número alto de comentários que desbloqueia um soldado especial (personagem nosso, criado do zero).
- **Prazo:** sempre dito e mostrado ("24 HORAS"). A Batalha sai no horário prometido.
- **Promessa de honestidade:** a Convocação diz em voz alta que o número é real (com frase da série, nunca a da referência; ex.: "cada comentário vira um gato, nem um a mais, nem um a menos"). A Batalha cumpre, com o número exato no placar.
- **Nunca punir o público:** perder é possível, mas o exército sempre faz algo heroico e o herói sobrevive para o próximo desafio. Nada de sangue nem morte na tela: quem perde foge, desmaia ou é derrubado.
- Começo impactante: os **primeiros 3 segundos** mostram a desvantagem (o herói sozinho na frente da multidão) com o título grande e uma frase curta. Nunca abrir com apresentação calma ou paisagem.
- Começo que explica: até os 10 segundos, quem é o herói, contra quem ele vai lutar e que **o exército dele é feito pelos comentários**.
- Final com ameaça e pergunta direta: a Convocação termina com o herói ainda sozinho, o inimigo avançando e uma pergunta direta com frase da série (ex.: "quem você convoca?"). A Batalha termina com o próximo inimigo aparecendo.

## Como a batalha se resolve
- O resultado sai de uma conta simples, anotada na bíblia antes da primeira Batalha (ex.: cada soldado comum vale 1, cada tipo vale 1 + o bônus dele contra esse inimigo; vence quem tiver mais força). A conta é a mesma em todo desafio e fica na bíblia.
- A força e o defeito de cada tipo aparecem na luta exatamente como foram prometidos na Convocação.
- O tipo mais pedido vai na frente e ganha o momento de destaque.
- O soldado especial só entra se a meta bônus foi batida.
- Mostre no fim o placar final com os números reais e "Vocês mandaram: <N> soldados".

## Regras de arte (3D)
- Siga o estilo escolhido na prancha da série (cores, luz e acabamento). Nunca troque o estilo sem pedido.
- **Nunca mude o herói, o inimigo ou os tipos de soldado sem pedido.** Cada tipo tem um acessório que o identifica de longe (roupa, objeto ou cor).
- Câmera baixa, na altura do herói, para o exército parecer gigante. Planos abertos para a multidão, closes para o herói e para os detalhes do inimigo.
- **Multidão de verdade:** o número de bonecos na tela bate com o número dito (até onde a tela mostra; acima disso, a multidão some no horizonte).
- **Placar fixo no alto:** "<HERÓIS> <n> × <n> <INIMIGOS>", que muda ao vivo. **Etiqueta branca com um risco** apontando para cada tipo quando ele aparece. **Números grandes** em destaque quando entra um dado (o peso do inimigo, a meta, o prazo).
- **Legenda de uma linha** no terço de baixo, branca, com a palavra-chave destacada na cor da série. A legenda nunca cobre rosto, placar ou etiqueta.
- Cenas completas, sempre: nada de fundo liso. Todo cenário tem objetos que contam onde estamos.
- Nada solto no cenário: tudo apoiado no chão ou em algo. Cada objeto precisa parecer o que é.
- Revise os corpos em todo plano novo (perna a mais, boneco atravessando outro, acessório fora do lugar).
- Sem áudio repetitivo em loop: ambiente baixo (rua, vento, multidão ao longe) e efeitos pontuais (passos, rugido, impacto).

## Vozes
- **Uma voz por série:** a do narrador, fixa no ElevenLabs e anotada na bíblia. Nunca troque a voz sem pedido.
- Depois do roteiro aprovado, entregue `falas-para-elevenlabs.txt` na pasta do vídeo: a narração dividida em blocos numerados, na ordem do vídeo, um bloco por cena, com o nome do arquivo de cada um (ex.: `01-abertura.mp3`). As reticências marcam pausas.
- A pessoa gera os áudios com a conta dela e coloca os arquivos em `audios/` com o nome indicado em cada bloco. O Claude não cria conta nem usa serviço pago.

## Como trabalhar
- Mostre prévias em folha de quadros (vários quadros numa imagem) antes do render final, e só avance com aprovação.
- O trabalho pesado roda no computador (render, transcrição, mixagem): rode o script e leia só o resumo.
- Depois de cada Batalha publicada, atualize a bíblia com a contagem de cada plataforma, o resultado e o estado do herói.
- Ao finalizar a **Convocação**, entregue a legenda do post (`legenda-do-post.txt` na pasta da entrega e no chat, pronta para copiar), nesta estrutura:
  ```
  1 <HERÓI> CONTRA <N> <INIMIGOS> <emoji>
  <a desvantagem, em 1 frase curta>
  Cada comentário é um <herói> a mais no exército dele.

  ⚔️ Comente <TIPO 1>, <TIPO 2>, <TIPO 3> ou <TIPO 4>.
  Passou de <meta>? Chega o <soldado especial>.
  Batalha amanhã, <horário>. Cada comentário vira um soldado, nem um a mais, nem um a menos. 👀

  #<perfil> #<série> #batalha #<gênero>
  ```
- Ao finalizar a **Batalha**, a legenda segue esta estrutura:
  ```
  A BATALHA: <n> <HERÓIS> CONTRA <N> <INIMIGOS> <emoji>
  Vocês mandaram <n> soldados. Na frente: <tipo mais pedido>.
  <o resultado, em 1 frase> / <o gancho do próximo desafio, em 1 frase> 👀

  #<perfil> #<série> #batalha #<gênero>
  ```
- Entregue também a capa (`capa.png`, 1080×1920), feita a partir de um molde em `projeto/src/<série>/Capa.tsx` (crie o molde no primeiro desafio e, nos seguintes, troque só os textos e a cena):
  - um quadro forte do próprio vídeo, no estilo da série;
  - o título "1 <HERÓI> CONTRA <N>" grande (na Batalha, o número real de soldados);
  - selinho "CONVOCAÇÃO" ou "BATALHA" e o nome da série;
  - uma frase curta com o gancho.
  Tudo o que importa fica dentro do recorte da grade do perfil (o meio da imagem, sem os 240 px de cima e de baixo). Confira a capa recortada antes de entregar.
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Confira cada coisa criada. Se der erro, leia a mensagem inteira, explique em uma linha (sem termo técnico) e tente corrigir. Se a correção precisar baixar algo, avise antes com o tamanho.

## Dinheiro e downloads
- Nunca use API paga nem crie conta sem a pessoa pedir.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
