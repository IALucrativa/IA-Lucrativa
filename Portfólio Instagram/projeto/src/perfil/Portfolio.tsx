import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, T, Tf} from '../bilhete/cores';
import {Rodnei} from '../bilhete/Rodnei';
import {Fundo, Selo, Titulo, Texto, Comentario} from './Perfil';

// Kit do portfólio do Instagram "Você Decide Aí":
// - novas capas de destaque (1080×1920, o ícone fica no círculo do meio);
// - carrossel "Arquivo do caso" (1080×1350, 6 telas);
// - carrossel "Quem é o Rodnei" (1080×1350, 3 telas);
// - modelos de Stories (1080×1920) com espaço vazio para a figurinha do Instagram.
// Desenho em metade da escala: feed = 540×675, story = 540×960.

const F = 'Inter, Arial, sans-serif';
const SERIF = "FreeSerif, 'DejaVu Serif', serif";

// ---------- peças comuns ----------
const Pontos: React.FC<{n: number; total: number}> = ({n, total}) => (
  <g>
    {Array.from({length: total}, (_, i) => (
      <circle key={i} cx={270 - ((total - 1) * 20) / 2 + i * 20} cy={652} r={5} fill={i + 1 === n ? C.acento : '#ffffff55'} />
    ))}
  </g>
);

const Deslize: React.FC = () => (
  <text x={505} y={630} fontSize={15} fontWeight="900" textAnchor="end" fill={C.acento} fontFamily={F}>
    deslize →
  </text>
);

const Bilhete: React.FC<{x: number; y: number; w: number; linhas: string[]; rot?: number; tam?: number}> = ({x, y, w, linhas, rot = -4, tam = 21}) => {
  const h = 40 + linhas.length * (tam + 10);
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} fill="#000" opacity={0.3} transform="translate(5,6)" />
      <rect x={x} y={y} width={w} height={h} fill={C.papel} {...T} />
      {linhas.map((l, i) => (
        <text key={i} x={x + 22} y={y + 40 + i * (tam + 10)} fontSize={tam} fontStyle="italic" fontFamily={SERIF} fill="#1f2a5a">
          {l}
        </text>
      ))}
    </g>
  );
};

// Etiqueta amarela inclinada (horário, número da pista...).
const Etiqueta: React.FC<{x: number; y: number; texto: string; rot?: number; w?: number}> = ({x, y, texto, rot = -3, w}) => {
  const larg = w ?? texto.length * 11 + 34;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`} fontFamily={F}>
      <rect x={x - larg / 2} y={y - 20} width={larg} height={40} rx={8} fill={C.acento} stroke={C.hud} strokeWidth={3} />
      <text x={x} y={y + 7.5} fontSize={20} fontWeight="900" textAnchor="middle" fill={C.hud}>
        {texto}
      </text>
    </g>
  );
};

// Silhueta de suspeito: sem rosto (o visual das outras personagens ainda não foi decidido).
const Silhueta: React.FC<{x: number; y: number; escala?: number; cor?: string}> = ({x, y, escala = 1, cor = '#14111f'}) => (
  <g transform={`translate(${x},${y}) scale(${escala})`}>
    <circle cx={0} cy={-62} r={34} fill={cor} />
    <path d="M-62,40 Q-60,-22 0,-22 Q60,-22 62,40 Z" fill={cor} />
    <text x={0} y={-48} fontSize={40} fontWeight="900" textAnchor="middle" fill={C.acento} fontFamily={F}>
      ?
    </text>
  </g>
);

// Ficha de suspeito (cartão de arquivo).
const Ficha: React.FC<{x: number; y: number; nome: string; linhas: string[]; rot?: number; carimbo?: string}> = ({x, y, nome, linhas, rot = 0, carimbo}) => (
  <g transform={`rotate(${rot} ${x + 105} ${y + 150})`} fontFamily={F}>
    <rect x={x} y={y} width={210} height={300} rx={8} fill="#000" opacity={0.35} transform="translate(5,6)" />
    <rect x={x} y={y} width={210} height={300} rx={8} fill="#f6efdc" {...T} />
    <rect x={x + 14} y={y + 14} width={182} height={120} fill="#3b3550" />
    <Silhueta x={x + 105} y={y + 100} escala={0.8} />
    <text x={x + 105} y={y + 166} fontSize={20} fontWeight="900" textAnchor="middle" fill={C.hud}>
      {nome}
    </text>
    {linhas.map((l, i) => (
      <text key={i} x={x + 105} y={y + 196 + i * 22} fontSize={14} fontWeight="bold" textAnchor="middle" fill="#4a4560">
        {l}
      </text>
    ))}
    {carimbo && (
      <g transform={`rotate(-12 ${x + 105} ${y + 270})`}>
        <rect x={x + 40} y={y + 252} width={130} height={32} rx={4} fill="none" stroke="#e0463a" strokeWidth={3} />
        <text x={x + 105} y={y + 274} fontSize={15} fontWeight="900" textAnchor="middle" fill="#e0463a">
          {carimbo}
        </text>
      </g>
    )}
  </g>
);

// Visor do elevador apoiado numa parede (pista do 5º andar).
const Visor: React.FC<{x: number; y: number; andar: string}> = ({x, y, andar}) => (
  <g>
    <rect x={x - 130} y={y + 150} width={260} height={150} fill="#8793a3" {...T} />
    <rect x={x - 118} y={y + 162} width={117} height={138} fill="#a9b4c2" {...T} />
    <rect x={x + 1} y={y + 162} width={117} height={138} fill="#a9b4c2" {...T} />
    <rect x={x - 90} y={y} width={180} height={130} rx={14} fill="#111" {...T} />
    <polygon points={`${x - 66},${y + 92} ${x - 50},${y + 62} ${x - 34},${y + 92}`} fill="#ff8a2a" />
    <text x={x + 22} y={y + 104} fontSize={96} fontWeight="bold" textAnchor="middle" fill="#ff8a2a" fontFamily="JetBrains Mono, monospace">
      {andar}
    </text>
  </g>
);

// ---------- 1. Capas de destaque ----------
export type TipoDestaque = 'vote' | 'suspeitos' | 'rodnei' | 'bastidores' | 'novidades';

export const DestaqueNovo: React.FC<{tipo: TipoDestaque}> = ({tipo}) => (
  <AbsoluteFill style={{background: '#f2a91c'}}>
    <svg viewBox="0 0 540 960" width={1080} height={1920}>
      <rect width={540} height={960} fill="#f2a91c" />
      <circle cx={270} cy={480} r={230} fill="#ffcc33" />
      {tipo === 'vote' && (
        // urna com o voto entrando
        <g>
          <g transform="rotate(-8 270 380)">
            <rect x={220} y={330} width={100} height={110} rx={6} fill="#fff" stroke={C.hud} strokeWidth={10} />
            <path d="M242,385 L262,407 L300,360" fill="none" stroke={C.hud} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <rect x={160} y={440} width={220} height={150} rx={12} fill={C.hud} />
          <rect x={200} y={432} width={140} height={16} rx={8} fill="#000" />
        </g>
      )}
      {tipo === 'suspeitos' && (
        // lupa
        <g>
          <circle cx={245} cy={455} r={92} fill="#fff" stroke={C.hud} strokeWidth={26} />
          <text x={245} y={500} fontSize={130} fontWeight="900" textAnchor="middle" fill={C.hud} fontFamily={F}>
            ?
          </text>
          <rect x={300} y={520} width={46} height={130} rx={20} fill={C.hud} transform="rotate(-42 323 585)" />
        </g>
      )}
      {tipo === 'rodnei' && (
        // o molho de chaves do Rodnei (o recurso da série)
        <g fill={C.hud}>
          <circle cx={270} cy={400} r={52} fill="none" stroke={C.hud} strokeWidth={20} />
          {[-34, 0, 34].map((r, i) => (
            <g key={i} transform={`rotate(${r} 270 400)`}>
              <circle cx={270} cy={500} r={34} />
              <circle cx={270} cy={500} r={12} fill="#ffcc33" />
              <rect x={260} y={530} width={20} height={90} rx={4} />
              <rect x={280} y={580} width={24} height={14} />
              <rect x={280} y={602} width={16} height={12} />
            </g>
          ))}
        </g>
      )}
      {tipo === 'bastidores' && (
        // claquete
        <g>
          <rect x={150} y={420} width={240} height={160} rx={10} fill={C.hud} />
          <g transform="rotate(-14 150 420)">
            <rect x={150} y={360} width={240} height={52} rx={6} fill={C.hud} />
            {[0, 1, 2, 3].map((i) => (
              <polygon key={i} points={`${170 + i * 56},360 ${200 + i * 56},360 ${180 + i * 56},412 ${150 + i * 56},412`} fill="#ffcc33" />
            ))}
          </g>
          {[0, 1].map((i) => (
            <rect key={i} x={180} y={460 + i * 50} width={i ? 120 : 180} height={16} rx={8} fill="#ffcc33" />
          ))}
        </g>
      )}
      {tipo === 'novidades' && (
        // sino de notificação
        <g fill={C.hud}>
          <path d="M270,330 Q190,330 185,430 L180,520 L150,560 L390,560 L360,520 L355,430 Q350,330 270,330 Z" />
          <circle cx={270} cy={322} r={18} />
          <circle cx={270} cy={588} r={30} />
          <path d="M120,400 Q110,450 130,500" fill="none" stroke={C.hud} strokeWidth={16} strokeLinecap="round" />
          <path d="M420,400 Q430,450 410,500" fill="none" stroke={C.hud} strokeWidth={16} strokeLinecap="round" />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

// ---------- 2. Carrossel "Arquivo do caso · Noite 1" (6 telas) ----------
// Só usa o que o Ep. 1 já mostrou. Nada de spoiler.
export const ArquivoDoCaso: React.FC<{slide: number}> = ({slide}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 675" width={1080} height={1350}>
      <Fundo h={675} />
      {slide === 1 && (
        <g>
          <Selo y={36} texto="BILHETE NA PORTA" />
          <Titulo y={128} linhas={['ARQUIVO', ['DO CASO · ', 'NOITE 1']]} tam={46} />
          <Texto y={232} linhas={['Você notou estas pistas', 'no Ep. 1? 👀']} tam={21} cor="#fff" />
          <Rodnei x={150} y={640} escala={0.78} frame={0} maoD="bilhete" bracoD={{ombro: 20, cotovelo: 100}} olhar={[0.6, -0.2]} boca="o" medo suor />
          {/* pasta de arquivo apoiada na faixa de baixo */}
          <g transform="rotate(5 400 480)" fontFamily={F}>
            <path d="M300,380 L360,380 L372,398 L500,398 L500,590 L300,590 Z" fill="#d9a441" {...T} />
            <rect x={300} y={410} width={200} height={180} rx={4} fill="#f2c25a" {...T} />
            <text x={400} y={480} fontSize={20} fontWeight="900" textAnchor="middle" fill={C.hud}>
              CASO
            </text>
            <text x={400} y={506} fontSize={20} fontWeight="900" textAnchor="middle" fill={C.hud}>
              Nº 1
            </text>
            <g transform="rotate(-10 400 548)">
              <rect x={345} y={530} width={110} height={30} rx={4} fill="none" stroke="#e0463a" strokeWidth={3} />
              <text x={400} y={551} fontSize={14} fontWeight="900" textAnchor="middle" fill="#e0463a">
                EM ABERTO
              </text>
            </g>
          </g>
          <Deslize />
          <Pontos n={1} total={6} />
        </g>
      )}
      {slide === 2 && (
        <g>
          <Selo y={36} texto="PISTA 1 · O BILHETE" />
          <Titulo y={128} linhas={[['ÀS ', '23H'], 'POR BAIXO DA PORTA']} tam={38} />
          <Bilhete x={95} y={230} w={350} linhas={['Você não vai embora', 'antes de devolver', 'o que é meu.']} tam={26} />
          <Etiqueta x={400} y={432} texto="BILHETE 1" rot={6} />
          <Texto y={505} linhas={['Devolver o quê?', 'O Rodnei nunca pegou', 'nada de ninguém...']} tam={21} cor="#fff" />
          <Deslize />
          <Pontos n={2} total={6} />
        </g>
      )}
      {slide === 3 && (
        <g>
          <Selo y={36} texto="PISTA 2 · O ELEVADOR" />
          <Titulo y={128} linhas={['ALGUÉM ENTROU', ['E ELE PAROU NO ', '5º']]} tam={36} />
          <Visor x={270} y={200} andar="5" />
          <Texto y={555} linhas={['Ele abriu a porta a tempo de ver', 'uma sombra entrando no elevador.']} tam={19} cor="#fff" />
          <Deslize />
          <Pontos n={3} total={6} />
        </g>
      )}
      {slide === 4 && (
        <g>
          <Selo y={36} texto="PISTA 3 · A AMEAÇA" />
          <Titulo y={128} linhas={['QUANDO ELE VOLTOU,', ['TINHA ', 'OUTRO']]} tam={36} />
          <Bilhete x={95} y={225} w={350} linhas={['Se contar pra alguém,', 'eu conto o', 'seu segredo.']} tam={26} rot={3} />
          <Etiqueta x={140} y={430} texto="BILHETE 2" rot={-6} />
          <g fontFamily={F}>
            <rect x={110} y={480} width={320} height={56} rx={10} fill="#e0463a" stroke="#fff" strokeWidth={2.5} />
            <text x={270} y={516} fontSize={22} fontWeight="900" textAnchor="middle" fill="#fff">
              QUE SEGREDO É ESSE? 👀
            </text>
          </g>
          <Deslize />
          <Pontos n={4} total={6} />
        </g>
      )}
      {slide === 5 && (
        <g>
          <Selo y={36} texto="OS SUSPEITOS" />
          <Titulo y={118} linhas={[['QUEM ', 'ESCREVE?']]} tam={44} />
          <Ficha x={50} y={160} nome="TÂNIA, DO 501" linhas={['Chegou faz 1 semana.', 'A luz dela estava', 'acesa às 23h.']} rot={-4} carimbo="SUSPEITA" />
          <Ficha x={280} y={170} nome="???" linhas={['Alguém que sabe', 'o segredo dele.', 'Mora no prédio?']} rot={4} carimbo="SEM NOME" />
          <Deslize />
          <Pontos n={5} total={6} />
        </g>
      )}
      {slide === 6 && (
        <g>
          <Selo y={36} texto="SUA VEZ" />
          <Titulo y={128} linhas={['QUEM VOCÊ ACHA', ['QUE ', 'ESCREVE?']]} tam={40} />
          <Texto y={232} linhas={['Comente o seu suspeito:']} tam={21} cor="#fff" />
          <Comentario y={258} nome="você" texto="FOI A TÂNIA" />
          <Comentario y={338} nome="seu amigo" texto="NÃO, É OUTRA PESSOA" />
          <g fontFamily={F}>
            <rect x={70} y={440} width={400} height={120} rx={18} fill={C.hud} opacity={0.92} {...Tf} />
            {/* ícone de salvar */}
            <path d="M110,470 L146,470 L146,530 L128,516 L110,530 Z" fill={C.acento} {...Tf} />
            <text x={300} y={492} fontSize={21} fontWeight="900" textAnchor="middle" fill="#fff">
              SALVE ESTE POST
            </text>
            <text x={300} y={522} fontSize={16} fontWeight="bold" textAnchor="middle" fill={C.acento}>
              e confira se acertou
            </text>
            <text x={300} y={544} fontSize={16} fontWeight="bold" textAnchor="middle" fill={C.acento}>
              no fim das 30 noites
            </text>
          </g>
          <Texto y={605} linhas={['Ep. novo todo dia, 12h 🔔']} tam={18} cor="#fff" />
          <Pontos n={6} total={6} />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

// ---------- 3. Carrossel "Quem é o Rodnei" (3 telas) ----------
// Só o que é público: nada sobre a chave mestra.
export const QuemEORodnei: React.FC<{slide: number}> = ({slide}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 675" width={1080} height={1350}>
      <Fundo h={675} />
      {slide === 1 && (
        <g>
          <Selo y={36} texto="BILHETE NA PORTA" />
          <Titulo y={128} linhas={['ESSE É O', ['', 'RODNEI']]} tam={50} />
          <Rodnei x={270} y={735} escala={1.0} frame={0} maoE="chaves" bracoE={{ombro: -20, cotovelo: -40}} olhar={[0, 0]} boca="o" medo />
          <g fontFamily={F} transform="rotate(-3 120 330)">
            <rect x={30} y={312} width={170} height={36} rx={6} fill="#fff" {...Tf} />
            <text x={115} y={336} fontSize={15} fontWeight="900" textAnchor="middle" fill={C.hud}>
              TÉC. DE ELEVADOR
            </text>
          </g>
          <Deslize />
          <Pontos n={1} total={3} />
        </g>
      )}
      {slide === 2 && (
        <g>
          <Selo y={36} texto="FICHA DO PERSONAGEM" />
          <g fontFamily={F}>
            <rect x={50} y={90} width={440} height={470} rx={16} fill="#f6efdc" {...T} />
            {[
              ['NOME', 'Rodnei'],
              ['IDADE', '41 anos'],
              ['TRABALHO', 'Técnico de elevador'],
              ['MORA', 'No térreo do prédio'],
              ['QUER', 'Recomeçar do zero'],
              ['PRAZO', 'Se muda em 30 dias'],
              ['CHAVES', '12 do trabalho'],
              ['MEDO', 'Do escuro 😨'],
            ].map(([k, v], i) => (
              <g key={k}>
                <text x={80} y={140 + i * 52} fontSize={15} fontWeight="900" fill="#8a8299">
                  {k}
                </text>
                <text x={210} y={140 + i * 52} fontSize={22} fontWeight="900" fill={C.hud}>
                  {v}
                </text>
                {i < 7 && <line x1={80} y1={156 + i * 52} x2={460} y2={156 + i * 52} stroke="#d9cfb6" strokeWidth={2} />}
              </g>
            ))}
          </g>
          <Texto y={605} linhas={['Ele conhece todo prédio por dentro.', 'Menos o próprio.']} tam={18} cor="#fff" />
          <Deslize />
          <Pontos n={2} total={3} />
        </g>
      )}
      {slide === 3 && (
        <g>
          <Selo y={36} texto="O PROBLEMA" />
          <Titulo y={128} linhas={['TEM MEDO DO ESCURO.', ['MAS OS BILHETES SÓ ', ''], ['CHEGAM ', 'DE NOITE.']]} tam={30} />
          <Rodnei x={170} y={650} escala={0.72} frame={0} maoD="lanterna" bracoD={{ombro: -70, cotovelo: -20}} olhar={[0.8, 0]} boca="o" medo suor />
          <g fontFamily={F}>
            <rect x={300} y={300} width={200} height={190} rx={16} fill={C.hud} opacity={0.92} {...Tf} />
            <text x={400} y={345} fontSize={17} fontWeight="900" textAnchor="middle" fill="#fff">
              MARQUE AQUELE
            </text>
            <text x={400} y={372} fontSize={17} fontWeight="900" textAnchor="middle" fill="#fff">
              AMIGO MEDROSO
            </text>
            <text x={400} y={399} fontSize={17} fontWeight="900" textAnchor="middle" fill="#fff">
              IGUAL O RODNEI
            </text>
            <text x={400} y={450} fontSize={36} fontWeight="900" textAnchor="middle" fill={C.acento}>
              @...
            </text>
          </g>
          <Pontos n={3} total={3} />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

// ---------- 4. Modelos de Stories ----------
// Área segura: nada importante nos 125 de cima e nos 170 de baixo (no desenho de 540×960).
// O retângulo tracejado mostra onde colar a figurinha (enquete, contagem, caixinha, quiz) e
// é só guia: some quando a figurinha é colocada por cima.
export type TipoStory = 'votacao' | 'ep-novo' | 'amanha' | 'pergunte' | 'quiz' | 'resultado';

const LugarFigurinha: React.FC<{y: number; h: number; texto: string}> = ({y, h, texto}) => (
  <g fontFamily={F}>
    <rect x={70} y={y} width={400} height={h} rx={22} fill="#ffffff14" stroke="#ffffff66" strokeWidth={2.5} strokeDasharray="10 8" />
    <text x={270} y={y + h / 2 + 6} fontSize={15} fontWeight="bold" textAnchor="middle" fill="#ffffffaa">
      {texto}
    </text>
  </g>
);

export const Story: React.FC<{tipo: TipoStory; ep?: number; escolha?: string}> = ({tipo, ep = 1, escolha = 'CONTAR'}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 960" width={1080} height={1920}>
      <Fundo h={960} />
      <Selo y={135} texto="VOCÊ DECIDE AÍ · BILHETE NA PORTA" />
      {tipo === 'votacao' && (
        <g>
          <Titulo y={240} linhas={['VOTAÇÃO', ['', 'ABERTA 🗳️']]} tam={54} />
          <Texto y={345} linhas={[`O que acontece no Ep. ${ep + 1}`, 'é você quem decide.']} tam={22} cor="#fff" />
          <LugarFigurinha y={400} h={170} texto="cole aqui a figurinha ENQUETE" />
          <Rodnei x={270} y={790} escala={0.62} frame={0} maoD="bilhete" bracoD={{ombro: 20, cotovelo: 100}} olhar={[0, -0.4]} boca="o" medo />
        </g>
      )}
      {tipo === 'ep-novo' && (
        <g>
          <Titulo y={240} linhas={[['EP. ', `${ep}`], ['NO ', 'AR 🔴']]} tam={64} />
          <Texto y={360} linhas={['Já chegou o bilhete de hoje.', 'Assiste e vota nos comentários.']} tam={21} cor="#fff" />
          <LugarFigurinha y={400} h={330} texto="cole aqui o Reels (botão enviar → story)" />
          <g fontFamily={F}>
            <rect x={130} y={745} width={280} height={46} rx={23} fill={C.acento} {...Tf} />
            <text x={270} y={775} fontSize={18} fontWeight="900" textAnchor="middle" fill={C.hud}>
              TOQUE PARA ASSISTIR 👆
            </text>
          </g>
        </g>
      )}
      {tipo === 'amanha' && (
        <g>
          <Titulo y={240} linhas={['AMANHÃ,', ['', '12H ⏰']]} tam={60} />
          <Texto y={355} linhas={[`Ep. ${ep + 1}: o que vocês escolheram`, 'vai acontecer.']} tam={21} cor="#fff" />
          <LugarFigurinha y={400} h={150} texto="cole aqui a figurinha CONTAGEM REGRESSIVA" />
          <Bilhete x={110} y={590} w={320} linhas={['Mais uma noite.', 'Mais um bilhete.']} tam={24} />
        </g>
      )}
      {tipo === 'pergunte' && (
        <g>
          <Titulo y={240} linhas={['PERGUNTE', ['AO ', 'RODNEI']]} tam={56} />
          <Texto y={350} linhas={['Ele responde (se tiver coragem).']} tam={21} cor="#fff" />
          <LugarFigurinha y={385} h={190} texto="cole aqui a CAIXINHA DE PERGUNTAS" />
          <Rodnei x={270} y={790} escala={0.6} frame={0} olhar={[0, -0.6]} boca="o" medo suor />
        </g>
      )}
      {tipo === 'quiz' && (
        <g>
          <Titulo y={240} linhas={['VOCÊ', ['', 'LEMBRA? 🧠']]} tam={58} />
          <Texto y={350} linhas={['Em que andar o elevador parou', 'na noite 1?']} tam={22} cor="#fff" />
          <LugarFigurinha y={400} h={260} texto="cole aqui a figurinha QUIZ (2º, 5º, 8º)" />
          <Texto y={720} linhas={['Errou? O Ep. 1 está fixado no perfil. 📌']} tam={18} cor={C.acento} />
        </g>
      )}
      {tipo === 'resultado' && (
        <g>
          <Titulo y={240} linhas={['VOCÊS', ['', 'ESCOLHERAM:']]} tam={50} />
          <g transform="rotate(-4 270 410)" fontFamily={F}>
            <rect x={90} y={370} width={360} height={84} rx={12} fill="#000" opacity={0.35} transform="translate(5,6)" />
            <rect x={90} y={370} width={360} height={84} rx={12} fill={C.acento} stroke={C.hud} strokeWidth={4} />
            <text x={270} y={428} fontSize={46} fontWeight="900" textAnchor="middle" fill={C.hud}>
              {escolha}
            </text>
          </g>
          <Texto y={515} linhas={[`O Ep. ${ep + 1} sai hoje, às 12h.`, 'Ativa o lembrete 🔔']} tam={22} cor="#fff" />
          <LugarFigurinha y={575} h={120} texto="cole aqui a figurinha LEMBRETE (opcional)" />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

// ---------- 5. Pesquisa com o público: que história e que conteúdo vocês querem? ----------
// 3 Stories em sequência. Os cartões mostram o que já existe no canal; a enquete (até 4 opções)
// vai no espaço tracejado.
type Icone = 'bilhete' | 'pin' | 'coracao' | 'espadas' | 'controle' | 'olho' | 'claquete' | 'lupa' | 'urna';

const IconeCartao: React.FC<{tipo: Icone; x: number; y: number}> = ({tipo, x, y}) => (
  <g transform={`translate(${x},${y})`} fill={C.hud}>
    {tipo === 'bilhete' && (
      <g transform="rotate(-8)">
        <rect x={-20} y={-15} width={40} height={30} rx={2} fill={C.papel} stroke={C.hud} strokeWidth={3} />
        <rect x={-13} y={-7} width={26} height={3.5} rx={1.5} />
        <rect x={-13} y={1} width={18} height={3.5} rx={1.5} />
      </g>
    )}
    {tipo === 'pin' && (
      <g>
        <path d="M0,22 Q-20,-2 -20,-8 A20,20 0 1 1 20,-8 Q20,-2 0,22 Z" />
        <text x={0} y={-1} fontSize={22} fontWeight="900" textAnchor="middle" fill={C.acento} fontFamily={F}>
          ?
        </text>
      </g>
    )}
    {tipo === 'coracao' && <path d="M0,18 L-20,-2 A11,11 0 0 1 0,-14 A11,11 0 0 1 20,-2 Z" fill="#e0463a" stroke={C.hud} strokeWidth={3} strokeLinejoin="round" />}
    {tipo === 'espadas' && (
      <g stroke={C.hud} strokeWidth={6} strokeLinecap="round">
        <line x1={-16} y1={-16} x2={16} y2={16} />
        <line x1={16} y1={-16} x2={-16} y2={16} />
        <line x1={-20} y1={8} x2={-8} y2={20} />
        <line x1={20} y1={8} x2={8} y2={20} />
      </g>
    )}
    {tipo === 'controle' && (
      <g>
        <path d="M-24,-10 Q0,-16 24,-10 Q30,14 22,16 Q14,18 8,6 L-8,6 Q-14,18 -22,16 Q-30,14 -24,-10 Z" />
        <rect x={-17} y={-5} width={10} height={3} fill={C.acento} />
        <rect x={-13.5} y={-8.5} width={3} height={10} fill={C.acento} />
        <circle cx={12} cy={-5} r={2.5} fill={C.acento} />
        <circle cx={17} cy={0} r={2.5} fill={C.acento} />
      </g>
    )}
    {tipo === 'olho' && (
      <g>
        <path d="M-24,0 Q0,-22 24,0 Q0,22 -24,0 Z" fill="#fff" stroke={C.hud} strokeWidth={3.5} />
        <circle cx={0} cy={0} r={8} />
      </g>
    )}
    {tipo === 'claquete' && (
      <g>
        <rect x={-20} y={-4} width={40} height={24} rx={3} />
        <g transform="rotate(-14 -20 -4)">
          <rect x={-20} y={-14} width={40} height={9} rx={2} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={-15 + i * 12} y={-14} width={5} height={9} fill={C.acento} />
          ))}
        </g>
      </g>
    )}
    {tipo === 'lupa' && (
      <g>
        <circle cx={-4} cy={-4} r={14} fill="#fff" stroke={C.hud} strokeWidth={5} />
        <rect x={6} y={6} width={8} height={18} rx={3} transform="rotate(-45 10 15)" />
      </g>
    )}
    {tipo === 'urna' && (
      <g>
        <rect x={-10} y={-20} width={20} height={20} rx={2} fill="#fff" stroke={C.hud} strokeWidth={3} />
        <path d="M-5,-11 L-1,-6 L6,-15" fill="none" stroke={C.hud} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={-20} y={-2} width={40} height={22} rx={3} />
      </g>
    )}
  </g>
);

const CartaoOpcao: React.FC<{x: number; y: number; icone: Icone; titulo: string; sub: string; rot?: number}> = ({x, y, icone, titulo, sub, rot = 0}) => (
  <g transform={`rotate(${rot} ${x + 95} ${y + 45})`} fontFamily={F}>
    <rect x={x} y={y} width={190} height={90} rx={12} fill="#000" opacity={0.3} transform="translate(4,5)" />
    <rect x={x} y={y} width={190} height={90} rx={12} fill="#f6efdc" {...T} />
    <circle cx={x + 40} cy={y + 45} r={28} fill={C.acento} {...Tf} />
    <IconeCartao tipo={icone} x={x + 40} y={y + 45} />
    <text x={x + 78} y={y + 42} fontSize={17} fontWeight="900" fill={C.hud}>
      {titulo}
    </text>
    <text x={x + 78} y={y + 62} fontSize={11.5} fontWeight="bold" fill="#6a6380">
      {sub}
    </text>
  </g>
);

export const PesquisaPublico: React.FC<{tela: 1 | 2 | 3}> = ({tela}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg viewBox="0 0 540 960" width={1080} height={1920}>
      <Fundo h={960} />
      <Selo y={135} texto={`VOCÊ DECIDE AÍ · PESQUISA ${tela}/3`} />
      {tela === 1 && (
        <g>
          <Titulo y={215} linhas={['QUE HISTÓRIA', ['VOCÊ QUER ', 'VER?']]} tam={44} />
          <Texto y={300} linhas={['Aqui você já decide o episódio.', 'Agora decide o próximo GÊNERO. 👀']} tam={19} cor="#fff" />
          <CartaoOpcao x={65} y={340} icone="lupa" titulo="MISTÉRIO" sub="Bilhete na Porta" rot={-2} />
          <CartaoOpcao x={285} y={340} icone="pin" titulo="SUSPENSE" sub="Fora do Mapa" rot={2} />
          <CartaoOpcao x={65} y={445} icone="coracao" titulo="DRAMA" sub="Matheus e Bia" rot={2} />
          <CartaoOpcao x={285} y={445} icone="espadas" titulo="BATALHA" sub="Bisnaga" rot={-2} />
          <LugarFigurinha y={560} h={215} texto="cole aqui a ENQUETE (4 opções)" />
        </g>
      )}
      {tela === 2 && (
        <g>
          <Titulo y={215} linhas={['QUE VÍDEO', ['VOCÊ QUER ', 'MAIS?']]} tam={44} />
          <Texto y={300} linhas={['O jeito de contar também', 'é você quem escolhe. 🗳️']} tam={19} cor="#fff" />
          <CartaoOpcao x={65} y={340} icone="urna" titulo="SÉRIE" sub="você vota no final" rot={-2} />
          <CartaoOpcao x={285} y={340} icone="olho" titulo="POV" sub="você é o herói" rot={2} />
          <CartaoOpcao x={65} y={445} icone="espadas" titulo="EXÉRCITO" sub="comente e lute" rot={2} />
          <CartaoOpcao x={285} y={445} icone="claquete" titulo="BASTIDOR" sub="como é feito" rot={-2} />
          <LugarFigurinha y={560} h={215} texto="cole aqui a ENQUETE (4 opções)" />
        </g>
      )}
      {tela === 3 && (
        <g>
          <Titulo y={215} linhas={['ME CONTA A', ['HISTÓRIA ', 'QUE VOCÊ'], 'QUER VER AQUI']} tam={40} />
          <Texto y={360} linhas={['A melhor ideia pode virar', 'a próxima série do canal. ✍️']} tam={19} cor="#fff" />
          <LugarFigurinha y={400} h={190} texto="cole aqui a CAIXINHA DE PERGUNTAS" />
          <Bilhete x={95} y={625} w={350} linhas={['Ex.: "um porteiro que', 'ouve tudo pelo interfone..."']} tam={20} rot={-3} />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);
