# Estúdio de séries: Vídeos GTA 6

Esta pasta é uma cópia do estúdio do Bilhete na Porta, adaptada para uma série curta sobre a **espera pelo lançamento do GTA 6** (19/11/2026). Mesma estrutura: séries animadas curtas e verticais (Reels, TikTok, Shorts) em que o público vota no próximo episódio. A diferença: aqui **seguir o perfil também mexe na história** (a Meta dos Seguidores). Quem está do outro lado pode ser iniciante: explique sem termo técnico e um passo por vez.

> O foco desta pasta é **visualização**: o começo de cada vídeo prende, o meio não deixa sair, o fim faz comentar e seguir. Leia `series/corre-pro-gta-6/manual-do-gancho.md` antes de qualquer roteiro.

## Primeira vez
Se a pessoa ainda não montou o estúdio (não existe `projeto/node_modules/`), siga o `COMECE-AQUI.md`.

## Organização
- `series/<nome>/`: tudo de uma série. `biblia.md` (personagens, estado atual, regras, placar, metas e histórico de votos), `banco-de-problemas.md`, `briefing.md`, `perfil.md`, `manual-do-gancho.md` e uma pasta por episódio (`ep01/`, `ep02/`...) com roteiro e prévias.
- `projeto/`: o código dos vídeos (Remotion).
- `entregas/AAAA-MM-DD_nome/`: vídeo final, capa, roteiro e legenda do post.
- `referencias/<nome>/`: vídeos e imagens de referência.

## Antes de qualquer episódio
1. Leia a `biblia.md`, o `banco-de-problemas.md` e o `manual-do-gancho.md` da série.
2. Confira com a pessoa o resultado do voto **de cada plataforma** (Instagram, TikTok e YouTube) e **quantos seguidores novos** o perfil ganhou desde o último episódio (soma das três). Os números são sempre os reais.
3. Roteiro curto (o texto da narração) → aprovação → só então a produção.

## Meta dos Seguidores (regra própria desta série)
- Todo episódio mostra, no placar e na narração, uma meta de seguidores: **"Se o perfil ganhar +N seguidores até amanhã, 12h, o Kaique desbloqueia: <item>"**.
- A contagem é a **soma dos seguidores novos nas três plataformas**, conferida pela pessoa antes de produzir. Nunca inventar número.
- O item desbloqueado ajuda de verdade na missão (ver a escada de desbloqueios na bíblia) e aparece no episódio seguinte com "VOCÊS DESBLOQUEARAM: <item>".
- **Meta não batida acumula**: o item continua trancado e volta como meta do dia seguinte (com o número somado). Nunca punir quem assiste: não bater a meta é um "ainda não", nunca um desastre.
- A meta é pequena e alcançável (comece em +100 e ajuste ao tamanho real do perfil). Meta impossível desanima.
- O voto (comentários) e a meta (seguidores) são coisas separadas: o voto decide **o que** ele faz, a meta decide **com o que** ele conta.

## Três plataformas: Instagram, TikTok e YouTube
- Cada plataforma (Instagram, TikTok e YouTube Shorts) é uma **linha da história própria**, que segue o voto do seu público.
- Plataformas que tiveram **exatamente os mesmos resultados em todos os votos** dividem a mesma linha e usam **o mesmo vídeo**.
- No primeiro voto diferente, a plataforma que votou diferente **se separa** e não volta mais a dividir, mesmo que os votos voltem a coincidir.
- A Meta dos Seguidores é **uma só para todas as linhas** (soma das três plataformas).
- Cada linha separada tem o seu roteiro, a sua narração, o seu vídeo, a sua capa e a sua legenda.
- A bíblia guarda **um estado, um placar e um histórico de votos para cada plataforma**.
- Pastas: enquanto as três estão juntas, `series/<nome>/epNN/`. Depois de separar, uma pasta por linha, com o nome das plataformas que ela atende (ex.: `ep02-instagram-youtube/` e `ep02-tiktok/`). As entregas seguem o mesmo padrão.

## GTA 6: o que pode e o que não pode
- **Pode:** falar o nome "GTA 6" (é o assunto da série e o que as pessoas pesquisam), usar a data real de lançamento (19/11/2026) e fatos públicos e confirmados.
- **Não pode:** logo, arte oficial, capa, trailer, música, fonte de letra, personagens, cidade ou qualquer imagem do jogo. Nada que imite a tela do jogo (as estrelinhas de procurado, a tela de "missão cumprida" do jogo, o mapa do jogo). O nosso HUD é desenho nosso, com cara própria.
- **Não pode:** dizer ou insinuar que o vídeo é oficial, inventar novidade, vazamento ou preço do jogo. Se algum fato do jogo mudar (ex.: novo adiamento), a pessoa confirma e a história se adapta.
- O videogame da série é **desenhado de forma genérica** (sem marca nem formato de console real). Na narração, "o videogame".
- O Kaique, o Wesley e todo o elenco são 100% nossos.

## Regras de criação
- Fale em português do Brasil.
- Formato: 1080×1920, 30 fps. Áudio normalizado em −14 LUFS.
- Duração mínima: todo vídeo tem **no mínimo 1 minuto** (60 s), para fins de monetização (cerca de 150 a 170 palavras de narração). O tempo a mais vem de história que empurra a missão, nunca de enrolação.
- Nunca copie personagem, nome, piada, arte ou música de outra pessoa. Referência serve só de estrutura. Nunca use nome de famoso ou de pessoa real.
- A piada nunca é o físico nem a pobreza; é o jeito de resolver.
- Voto: duas opções de uma palavra. Nunca punir o voto: o episódio do vencedor é uma vitória. Não mostrar a % de quem ganhou, só "Vocês escolheram: X".
- Continuidade: o estado do personagem segue entre os episódios. O que mudou continua mudado.
- O dinheiro é finito e as contas fecham na tela.
- **Começo impactante desde o Ep. 1:** os **primeiros 3 segundos** prendem. O vídeo abre direto no momento mais forte (o desastre, a ameaça, a descoberta), com o contador "FALTAM N DIAS" grande na tela e uma frase curta de narração que **já diz o problema**. O primeiro quadro precisa funcionar **sem som** (texto na tela). Nunca abrir com apresentação calma, paisagem ou "esse é o...".
- Começo que explica: até os 10 segundos, quem é o Kaique, o que ele quer (jogar à meia-noite do dia 19) e o que está em jogo.
- **Segundo gancho no meio** (por volta dos 25 a 35 s): uma virada ou uma frase do tipo "mas o pior ainda nem tinha chegado". É onde mais gente desiste.
- Toda cena empurra a história. Se não avança, sai.
- Final com ameaça: todo episódio termina com algo em jogo para o próximo, depois a meta e o voto.

## Regras de arte
- O personagem é um boneco articulado em código. **Nunca mude o rosto ou o corpo do personagem sem pedido.** Foto ou vídeo de referência guia só o movimento e a pose.
- Cenas completas, sempre: nada de fundo liso. Todo cenário tem objetos que contam onde estamos.
- Nada solto no cenário: tudo apoiado em algo. Cada objeto precisa parecer o que é.
- O contador "FALTAM N DIAS" fica sempre no mesmo canto e no mesmo estilo (é a marca da série).
- A legenda nunca cobre rosto, balão, contador ou informação.
- Revise o corpo do personagem em todo plano novo (braço duplicado, objeto atravessando, roupa atrás do tronco).
- Antes de renderizar, confira cada semente plantada num close grande.
- Sem áudio repetitivo em loop: fundo baixo e efeitos pontuais. Nenhuma música do jogo.

## Como trabalhar
- Mostre prévias em folha de quadros (vários quadros numa imagem) antes do render final, e só avance com aprovação.
- O trabalho pesado roda no computador (render, transcrição, mixagem): rode o script e leia só o resumo.
- Depois de cada episódio publicado, atualize a bíblia com o "estado após o episódio", o resultado do voto e o resultado da meta.
- Ao finalizar um episódio, entregue junto a legenda do post (`legenda-do-post.txt` na pasta da entrega e no chat, pronta para copiar), sempre nesta estrutura:
  ```
  EP. <n> | <título do episódio> <emoji>
  <o que aconteceu, em 1 ou 2 frases curtas>
  <o gancho: a ameaça ou a dúvida, em 1 frase> 👀

  🗳️ VOCÊ DECIDE: <a pergunta do voto>?
  Comente <OPÇÃO 1> ou <OPÇÃO 2>.
  🎮 META: +<N> seguidores até amanhã, 12h = o Kaique desbloqueia <item>.
  Faltam <N> dias pro GTA 6. Próximo episódio amanhã, 12h.

  #vocedecideai #correprogta6 #gta6 #gtavi #serieanimada
  ```
- Ao finalizar um episódio, entregue também a capa (`capa.png`, 1080×1920), feita a partir de um molde em `projeto/src/gta/Capa.tsx` (crie o molde no Ep. 1, com a mesma estrutura da capa do Bilhete na Porta, e nos seguintes troque só os textos e a pose):
  - selinho com o nome da série no alto;
  - "EPISÓDIO <n>" grande, com o número em amarelo;
  - faixa amarela inclinada com o prazo ("FALTAM 6 DIAS");
  - selinho escuro com o gancho do episódio;
  - o Kaique no centro, no cenário do episódio;
  - cartão inclinado com a ameaça e uma faixa vermelha embaixo;
  - etiqueta curta do personagem.
  A capa **não** leva a barra de voto. Tudo o que importa fica dentro do recorte da grade do perfil (sem os 240 px de cima e de baixo), e nada cobre o rosto. Confira a capa recortada antes de entregar.
- Junto com cada entrega, sugira o **comentário fixado** (ver o manual do gancho).
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Confira cada coisa criada. Se der erro, leia a mensagem inteira, explique em uma linha (sem termo técnico) e tente corrigir. Se a correção precisar baixar algo, avise antes com o tamanho.

## Dinheiro e downloads
- Nunca use API paga nem crie conta sem a pessoa pedir.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
