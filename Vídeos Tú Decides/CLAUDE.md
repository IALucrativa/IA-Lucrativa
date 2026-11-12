# Estúdio de séries: Tú Decides (Espanha)

Esta pasta é uma cópia do estúdio "Vídeos GTA 6" (Você Decide Aí), adaptada para a conta **Tú Decides**, voltada ao público da **Espanha**. Mesma estrutura: séries animadas curtas e verticais (Reels, TikTok, Shorts) em que o público vota no próximo episódio, e seguir o perfil também mexe na história (o Reto de Seguidores). Série atual: **A por el GTA 6** (versão espanhola de "Corre Pro GTA 6").

## Idioma (a regra mais importante desta pasta)
- **A pessoa fala com você em português do Brasil.** Responda, explique e pergunte sempre em português, simples e sem termo técnico.
- **Tudo o que vai para o público é em espanhol da Espanha (castelhano peninsular):** narração, legendas queimadas no vídeo, textos na tela, placar, capa, legenda do post, comentário fixado, hashtags, bio e nomes do perfil.
- Espanhol **da Espanha**, não da América Latina: "vosotros/os" ("os toca a vosotros", "comentad"), "vale", "móvil" (não "celular"), "consola" (não "videojuego" para o aparelho), "mando" (não "control"), "ordenador", "tele", "coger" é normal. Moeda em **euros**, com o símbolo depois do número e espaço ("190 €"). Horários no formato 24 h ("a las 12:00", hora peninsular).
- **Para aprovar um roteiro**, mostre a narração em espanhol com a tradução em português ao lado (tabela com duas colunas). A pessoa aprova lendo o português; o vídeo sai em espanhol.
- Revise a ortografia espanhola antes de renderizar: acentos (días, mañana, está), "¿" e "¡" de abertura, aspas «».
- Ao entregar a legenda do post, mostre também uma tradução rápida em português logo abaixo (só no chat, nunca no arquivo da entrega).

> O foco desta pasta é **visualização**: o começo de cada vídeo prende, o meio não deixa sair, o fim faz comentar e seguir. Leia `series/a-por-el-gta-6/manual-do-gancho.md` antes de qualquer roteiro.

## Primeira vez
Se a pessoa ainda não montou o estúdio (não existe `projeto/node_modules/`), siga o `COMECE-AQUI.md`.

## Organização
- `series/<nome>/`: tudo de uma série. `biblia.md` (personagens, estado atual, regras, placar, metas e histórico de votos), `banco-de-problemas.md`, `briefing.md`, `perfil.md`, `manual-do-gancho.md` e uma pasta por episódio (`ep01/`, `ep02/`...) com roteiro e prévias.
- `projeto/`: o código dos vídeos (Remotion). A série está em `projeto/src/gta/`.
- `entregas/AAAA-MM-DD_nome/`: vídeo final, capa, roteiro e legenda do post.
- `referencias/<nome>/`: vídeos e imagens de referência.

## Antes de qualquer episódio
1. Leia a `biblia.md`, o `banco-de-problemas.md` e o `manual-do-gancho.md` da série.
2. Confira com a pessoa o resultado do voto **de cada plataforma** (Instagram, TikTok e YouTube) e **quantos seguidores novos** o perfil ganhou desde o último episódio (soma das três). Os números são sempre os reais.
3. Roteiro curto (narração em espanhol + tradução em português) → aprovação → texto para o ElevenLabs → a pessoa manda o áudio → produção.

## Narração em espanhol
- A pessoa gera a voz no ElevenLabs e manda o arquivo. Sugira uma **voz masculina grave, de trailer, com sotaque da Espanha** (castelhano), e o modelo multilíngue.
- No texto para o ElevenLabs, escreva números por extenso ("ciento noventa euros", "GTA seis") para a voz não errar.
- Quando o áudio chegar, salve em `projeto/public/` e **reajuste os tempos** das cenas e das legendas pelo áudio real (transcrição local). Nunca use tempos de outra versão.

## Reto de Seguidores (regra própria desta série)
- Todo episódio mostra, no placar e na narração, uma meta de seguidores: **"Si este perfil gana +N seguidores antes de mañana a las 12:00, Kike desbloquea: <item>"**.
- A contagem é a **soma dos seguidores novos nas três plataformas**, conferida pela pessoa antes de produzir. Nunca inventar número.
- O item desbloqueado ajuda de verdade na missão (ver a escada de desbloqueios na bíblia) e aparece no episódio seguinte com "HABÉIS DESBLOQUEADO: <item>".
- **Meta não batida acumula**: o item continua trancado e volta como meta do dia seguinte (com o número somado). Nunca punir quem assiste: não bater a meta é um "todavía no", nunca um desastre.
- A meta é pequena e alcançável (comece em +100 e ajuste ao tamanho real do perfil).
- O voto (comentários) e a meta (seguidores) são coisas separadas: o voto decide **o que** ele faz, a meta decide **com o que** ele conta.

## Três plataformas: Instagram, TikTok e YouTube
- Cada plataforma é uma **linha da história própria**, que segue o voto do seu público.
- Plataformas que tiveram **exatamente os mesmos resultados em todos os votos** dividem a mesma linha e usam **o mesmo vídeo**.
- No primeiro voto diferente, a plataforma que votou diferente **se separa** e não volta mais a dividir.
- O Reto de Seguidores é **um só para todas as linhas** (soma das três plataformas).
- Cada linha separada tem o seu roteiro, a sua narração, o seu vídeo, a sua capa e a sua legenda.
- A bíblia guarda **um estado, um placar e um histórico de votos para cada plataforma**.
- Pastas: enquanto as três estão juntas, `series/<nome>/epNN/`. Depois de separar, uma pasta por linha (ex.: `ep02-instagram-youtube/` e `ep02-tiktok/`). As entregas seguem o mesmo padrão.

## GTA 6: o que pode e o que não pode
- **Pode:** falar o nome "GTA 6", usar a data real de lançamento (19/11/2026) e fatos públicos e confirmados.
- **Não pode:** logo, arte oficial, capa, trailer, música, fonte de letra, personagens, cidade ou qualquer imagem do jogo. Nada que imite a tela do jogo. O nosso HUD é desenho nosso.
- **Não pode:** dizer ou insinuar que o vídeo é oficial, inventar novidade, vazamento ou preço do jogo.
- A consola da série é **desenhada de forma genérica** (sem marca nem formato real). Na narração, "la consola".
- Kike, Borja e todo o elenco são 100% nossos.

## Regras de criação
- Formato: 1080×1920, 30 fps. Áudio normalizado em −14 LUFS.
- Duração mínima: **no mínimo 1 minuto** (60 s), para monetização (cerca de 150 a 170 palavras de narração em espanhol). O tempo a mais vem de história, nunca de enrolação.
- Nunca copie personagem, nome, piada, arte ou música de outra pessoa. Nunca use nome de famoso ou de pessoa real, nem marca real (ex.: apps de entrega).
- A piada nunca é o físico nem a pobreza; é o jeito de resolver.
- Voto: duas opções de uma palavra, em espanhol. Nunca punir o voto. Não mostrar a %, só "Habéis elegido: X".
- Continuidade: o estado do personagem segue entre os episódios.
- O dinheiro é finito, em euros, e as contas fecham na tela.
- **Começo impactante:** os **primeiros 3 segundos** prendem, com "QUEDAN N DÍAS" grande e uma frase curta que já diz o problema. O primeiro quadro funciona **sem som**.
- Até os 10 segundos: quem é o Kike, o que ele quer (jogar à meia-noite do dia 19) e o que está em jogo.
- **Segundo gancho no meio** (25 a 35 s): "Pero lo peor todavía no había llegado."
- Toda cena empurra a história.
- Final com ameaça, depois a meta e o voto.

## Regras de arte
- O personagem é um boneco articulado em código (`projeto/src/gta/Kike.tsx`). **Nunca mude o rosto ou o corpo sem pedido.**
- Cenas completas, nada de fundo liso, nada solto no cenário.
- O contador "QUEDAN N DÍAS" fica sempre no mesmo canto e no mesmo estilo.
- A legenda nunca cobre rosto, balão, contador ou informação.
- Placas e textos dos cenários também em espanhol (ex.: "REPARACIONES PACO", "NO HACEMOS MILAGROS").
- Texto em espanhol costuma ser mais longo: confira num quadro se cabe em cada botão e cartão antes de renderizar.
- Sem áudio repetitivo em loop. Nenhuma música do jogo.

## Como trabalhar
- Mostre prévias em folha de quadros antes do render final e só avance com aprovação.
- O trabalho pesado roda no computador: rode o script e leia só o resumo.
- Depois de cada episódio publicado, atualize a bíblia.
- Ao finalizar um episódio, entregue a legenda do post (`legenda-do-post.txt` na pasta da entrega e no chat), sempre nesta estrutura, em espanhol:
  ```
  EP. <n> | <título del episodio> <emoji>
  <lo que ha pasado, en 1 o 2 frases cortas>
  <el gancho: la amenaza o la duda, en 1 frase> 👀

  🗳️ TÚ DECIDES: ¿<la pregunta del voto>?
  Comenta <OPCIÓN 1> o <OPCIÓN 2>.
  🎮 RETO: +<N> seguidores antes de mañana a las 12:00 = Kike desbloquea <item>.
  Quedan <N> días para el GTA 6. Nuevo episodio mañana a las 12:00.

  #tudecides #aporelgta6 #gta6 #gtavi #serieanimada
  ```
  No YouTube, acrescente no fim: "Serie animada de fan. No tiene relación con Rockstar Games."
- Entregue também a capa (`capa.png`, 1080×1920) feita com o molde `projeto/src/gta/Capa.tsx` (troque só os textos e a pose). Tudo o que importa fica dentro do recorte da grade do perfil, e nada cobre o rosto.
- Junto com cada entrega, sugira o **comentário fixado** em espanhol (com tradução em português no chat).
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Confira cada coisa criada. Se der erro, explique em uma linha (sem termo técnico) e tente corrigir.

## Dinheiro e downloads
- Nunca use API paga nem crie conta sem a pessoa pedir.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
