# D&D 5e - Ficha de Personagem Digital

Aplicacao web para montar e acompanhar fichas de personagem de Dungeons & Dragons 5a Edicao, com foco em uso de mesa, edicao rapida, autenticacao por email e multiplas fichas salvas por usuario.

O projeto foi construido com Next.js 14, React 18, TypeScript, Tailwind CSS e Zustand.

## Visao Geral

Esta ficha foi evoluida para funcionar como uma folha completa e editavel, com:

- atributos, modificadores, salvaguardas e pericias
- classes e multiclasse
- arquetipos e subclasses com paineis proprios
- antecedentes e tracos raciais expansivos
- ataques, armaduras, acoes bonus e reacoes
- HP, dados de vida e testes de morte
- dinheiro por denominacao oficial do D&D
- anotacoes, inventario e campos personalizados
- login por email e senha
- varias fichas salvas por conta
- API interna para carregar, criar, salvar e excluir fichas

O projeto agora combina estado local no navegador para a ficha ativa com persistencia em banco via API para cada usuario autenticado.

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand com persistencia local da ficha ativa
- Prisma 6 + PostgreSQL
- Zod para validacao de payloads
- bcryptjs para hash de senha
- jose para sessao via cookie JWT
- clsx + tailwind-merge para composicao de classes

## Como Rodar

Pre-requisitos:

- Node.js 18 ou superior
- npm

Instalacao e desenvolvimento:

```bash
npm install
npm run db:migrate:dev
npm run dev
```

Variaveis de ambiente:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dnd_sheet?schema=public"
AUTH_SECRET="troque-por-um-segredo-longo"
```

O projeto inclui `.env.example` com esses valores base.

Aplicacao local:

```text
http://localhost:3000
```

Outros comandos:

```bash
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm run admin:reset-password -- email@exemplo.com novaSenha123
```

Reset manual de senha:

- este projeto nao usa recuperacao por email
- quando alguem esquecer a senha, rode `npm run admin:reset-password -- email@exemplo.com novaSenha123`
- o script atualiza o `passwordHash` direto no banco via Prisma
- depois basta informar a nova senha para a pessoa pelo canal que voces usam

## Funcionalidades Atuais

### Identidade do personagem

- nome do personagem
- nome do jogador
- alinhamento
- selecao de raca
- selecao de antecedente

### Contas e fichas salvas

- cadastro por email e senha
- login por sessao com cookie httpOnly
- cada usuario possui sua propria lista de fichas
- criacao, carregamento, renomeacao, duplicacao, salvamento e exclusao de fichas pelo workspace autenticado
- a ficha ativa continua espelhada no Zustand para edicao imediata na interface

### Racas

- catalogo modular em arquivos separados dentro de `src/data/races/`
- aplicacao automatica de bonus raciais de atributo
- aplicacao automatica de deslocamento racial quando informado
- tracos raciais exibidos em painel expansivel
- descricoes completas centralizadas em `src/data/races/raceTraits.ts`

### Antecedentes

- catalogo modular em arquivos separados dentro de `src/data/backgrounds/`
- suporte a antecedentes do PHB e de outras fontes adicionadas ao projeto
- painel expansivel com bonus e feature do antecedente
- opcao de antecedente personalizado

### Classes e multiclasse

- multiplas classes por personagem
- nivel por classe
- dado de vida por classe
- automacao de hit die e salvaguardas padrao para classes configuradas em `CLASS_PRESETS`
- campo de arquetipo/subclasse por classe
- criacao de painel proprio de subclasse a partir da aba de classes

### Subclasses

- cada subclasse adicionada cria seu proprio painel expansivel
- cada painel guarda habilidades exclusivas daquela classe/subclasse
- cada habilidade possui nome clicavel e descricao editavel
- dados persistidos no store por `ownerClassId`

### Atributos, salvaguardas e pericias

- 6 atributos editaveis
- modificador calculado automaticamente
- salvaguardas por atributo
- pericias agrupadas por atributo
- 4 estados de pericia: nenhum, metade, proficiente, especialista 2x
- bonus de proficiencia calculado pelo nivel total
- legenda visual dos estados de proficiencia
- passivas calculadas automaticamente

### Proficiencias extras

- selecao compacta de proficiencia em armaduras
- selecao compacta de proficiencia em armas
- campo de proficiencias personalizadas com crescimento automatico de altura

### Combate

- CA total calculada
- HP maximo, atual e temporario
- controle rapido de cura e dano
- dados de vida totais e atuais
- testes de morte clicaveis

### Armaduras

- tabela de armaduras editavel
- suporte a armaduras oficiais em `src/data/armors.ts`
- forca minima por armadura
- indicacao de desvantagem em furtividade
- bloqueio de equipamento quando o personagem nao possui forca suficiente

### Ataques e equipamento de combate

- tabela de ataques editavel
- selecao de armas oficiais a partir de `src/data/weapons.ts`
- preenchimento de dano, tipo, alcance e propriedades com base na arma selecionada
- suporte a ataques totalmente customizados

### Acoes bonus e reacoes

- paineis expansivos na secao de ataques
- nomes clicaveis
- descricoes completas editaveis
- entradas persistidas separadamente para acoes bonus e reacoes

### Conjuracao e anotacoes

- atributo de conjuracao selecionavel
- CD de magia calculada
- bonus de ataque magico calculado
- campo de habilidades raciais e anotacoes gerais
- inventario para kits, consumiveis e itens diversos
- blocos de tracos/caracteristicas, equipamentos/tesouro e notas/magias

### Dinheiro

- campos separados para cp, sp, ep, gp e pp
- valor total calculado em gp
- controles de adicionar e remover por denominacao
- logica de conversao entre moedas implementada no store

## Novidades e Melhorias Recentes

- Campos expansíveis (magias, habilidades, traços raciais, antecedentes, ações bônus, reações, habilidades consumíveis) agora recebem um contorno vermelho quando abertos, facilitando a identificação visual do item expandido.
- Campo de anotações gerais para magias, expansivo e sem scroll, ao final da seção de magias.
- Campo de iniciativa agora mostra valor automático (mod DEX + bônus racial) por padrão, mas permite override manual.
- Correções de UX em todos os campos editáveis e expansíveis.

## Estrutura do Projeto

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── sheets/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── sheet/
│   │   │   ├── ArmorSection.tsx
│   │   │   ├── AttacksSection.tsx
│   │   │   ├── AttributesSection.tsx
│   │   │   ├── CharacterHeader.tsx
│   │   │   ├── CharacterSheet.tsx
│   │   │   ├── ClassesSection.tsx
│   │   │   ├── CombatSection.tsx
│   │   │   ├── NotesSection.tsx
│   │   │   ├── ProficienciesSection.tsx
│   │   │   └── SavesAndSkillsSection.tsx
│   │   └── ui/
│   │       └── index.tsx
│   ├── data/
│   │   ├── armors.ts
│   │   ├── backgrounds/
│   │   ├── constants.ts
│   │   ├── races/
│   │   └── weapons.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── calc.ts
│   │   ├── character-state.ts
│   │   ├── prisma.ts
│   │   ├── store.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Componentes Principais

### `src/components/sheet/CharacterSheet.tsx`

Compoe a ficha inteira, organiza o layout em duas colunas e monta as secoes principais.

### `src/components/auth/AuthScreen.tsx`

Renderiza a tela de login e cadastro por email, enviando requisicoes para os endpoints de autenticacao.

### `src/components/sheet/SheetWorkspace.tsx`

Envolve a ficha principal no modo autenticado, lista as fichas do usuario e concentra os botoes de criar, salvar, carregar, excluir e sair.

### `src/components/sheet/CharacterHeader.tsx`

Responsavel por identidade do personagem, escolha de raca e escolha de antecedente.

### `src/components/sheet/AttributesSection.tsx`

Renderiza atributos, salvaguardas, pericias por atributo, passivas e bonus de proficiencia.

Observacao: `SavesAndSkillsSection.tsx` ainda existe no projeto, mas o layout principal atual utiliza `AttributesSection.tsx`.

### `src/components/sheet/ClassesSection.tsx`

Gerencia classes, multiclasse, nivel, hit die, automacao basica por preset e criacao dos paineis de subclasse.

### `src/components/sheet/ProficienciesSection.tsx`

Centraliza:

- proficiencias de armas e armaduras
- proficiencias personalizadas
- painel de antecedente
- painel de tracos raciais
- paineis de subclasse por classe

### `src/components/sheet/CombatSection.tsx`

Renderiza CA, HP, dados de vida, testes de morte e controles rapidos de vida.

### `src/components/sheet/ArmorSection.tsx`

Gerencia armaduras, escudos, requisitos de forca e efeitos sobre furtividade.

### `src/components/sheet/AttacksSection.tsx`

Renderiza ataques, acoes bonus e reacoes.

### `src/components/sheet/NotesSection.tsx`

Reune conjuracao, dinheiro, habilidades/anotacoes, inventario e campos livres de observacoes.

## Dados Modulares

### Racas

Local:

- `src/data/races/index.ts`
- `src/data/races/*.ts`
- `src/data/races/raceTraits.ts`

Cada arquivo exporta um `RaceData` com:

- `label`
- `source`
- `asi`
- `speed`
- `traits`

### Antecedentes

Local:

- `src/data/backgrounds/index.ts`
- `src/data/backgrounds/*.ts`

Cada arquivo exporta um `BackgroundData` com:

- `label`
- `source`
- `bonuses`
- `featureName`
- `featureDescription`

### Constantes gerais

`src/data/constants.ts` concentra listas e presets como:

- atributos
- pericias
- pericias passivas
- tipos de dano
- atributos de ataque
- presets de classe
- listas de proficiencia de armas e armaduras

### Armas e armaduras

- `src/data/weapons.ts`
- `src/data/armors.ts`

Esses catalogos abastecem os campos automatizados de combate.

## Store e Persistencia

O estado global da ficha ativa fica em `src/lib/store.ts` com Zustand e `persist`.

Principais grupos de estado:

- identidade do personagem
- classes
- atributos
- salvaguardas
- pericias
- HP e combate
- armaduras
- ataques
- moedas
- antecedentes/raca selecionados
- paineis de subclasses
- habilidades de subclass
- acoes bonus e reacoes
- campos de anotacao

Persistencia:

- chave atual: `dnd-sheet-storage`
- armazenamento local: `localStorage`
- armazenamento remoto: PostgreSQL via Prisma
- sincronizacao remota: endpoints em `src/app/api/sheets/`

### Fluxo de persistencia

1. o usuario autentica por email e senha
2. a pagina inicial consulta a sessao e a lista de fichas do usuario
3. ao carregar uma ficha, os dados sao normalizados e enviados para o store local
4. durante a edicao, a interface trabalha sobre o Zustand para resposta imediata
5. ao salvar, a ficha atual e serializada e enviada para a API

## Autenticacao e API

### Sessao

- cookie: `dnd-sheet-session`
- formato: JWT assinado
- armazenamento: cookie httpOnly com `sameSite=lax`

### Endpoints de autenticacao

- `POST /api/auth/register`: cria usuario e abre sessao
- `POST /api/auth/login`: autentica usuario existente
- `POST /api/auth/logout`: encerra a sessao
- `GET /api/auth/session`: retorna o usuario autenticado ou `null`

### Endpoints de fichas

- `GET /api/sheets`: lista fichas do usuario autenticado
- `POST /api/sheets`: cria uma nova ficha vazia para o usuario
- `GET /api/sheets/[sheetId]`: carrega uma ficha especifica
- `PUT /api/sheets/[sheetId]`: atualiza nome e dados da ficha
- `DELETE /api/sheets/[sheetId]`: exclui a ficha

### Modelos do banco

`User`

- `id`
- `email`
- `name`
- `passwordHash`
- `createdAt`
- `updatedAt`

`Sheet`

- `id`
- `name`
- `data` em JSON
- `userId`
- `createdAt`
- `updatedAt`

## Calculos

As formulas ficam em `src/lib/calc.ts`.

Ali vivem calculos como:

- modificador de atributo
- bonus de proficiencia por nivel total
- salvaguardas
- bonus de pericia
- CA total
- bonus de ataque
- CD de magia
- bonus de ataque magico
- resumo de dados de vida

## Componentes UI Reutilizaveis

Em `src/components/ui/index.tsx` ficam os componentes base usados pela ficha, como:

- `SectionTitle`
- `FieldLabel`
- `TextInput`
- `NumberInput`
- `SelectInput`
- `StatPill`
- `ProfCircle`
- `ProficiencyLegend`
- `ToggleSwitch`
- `DeathDot`
- `AddRowButton`
- `DeleteButton`

## Como Estender o Projeto

### Adicionar uma nova raca

1. criar um novo arquivo em `src/data/races/`
2. exportar um objeto `RaceData`
3. registrar no `src/data/races/index.ts`
4. opcionalmente adicionar descricoes em `src/data/races/raceTraits.ts`

### Adicionar um novo antecedente

1. criar um novo arquivo em `src/data/backgrounds/`
2. exportar um objeto `BackgroundData`
3. registrar no `src/data/backgrounds/index.ts`
4. incluir no grupo de livro/fonte correspondente

### Adicionar automacao de nova classe

Editar `CLASS_PRESETS` em `src/data/constants.ts`.

### Alterar a estrutura da ficha

O ponto central de montagem e `src/components/sheet/CharacterSheet.tsx`.

### Alterar o schema salvo da ficha

O ponto central para defaults e normalizacao e `src/lib/character-state.ts`.

Qualquer novo campo persistido deve ser refletido em:

1. `src/types/index.ts`
2. `src/lib/character-state.ts`
3. `src/lib/store.ts`
4. componentes que editam ou consomem esse campo

## Observacoes de Manutencao

- o projeto agora combina persistencia local da ficha ativa com persistencia remota por usuario
- a autenticacao atual e proprietaria e baseada em email, senha e cookie JWT
- o banco local de desenvolvimento e producao usa PostgreSQL via Prisma
- o Prisma esta fixado na linha 6.x para manter compatibilidade com a configuracao atual do schema
- varias interfaces usam texto livre para preservar flexibilidade de mesa
- as secoes expansivas usam estado local de abertura e dados persistidos no store
- o codigo privilegia edicao manual e velocidade de uso durante a sessao de jogo

## Validacao Recomendada

Durante alteracoes, a validacao mais segura hoje e:

```bash
npx tsc --noEmit
npm run build
```

Validacao manual recomendada da segunda etapa:

1. criar uma conta nova
2. criar duas fichas
3. editar e salvar uma ficha
4. trocar para outra ficha e voltar
5. excluir uma ficha
6. sair e entrar novamente

## Deploy no Railway

O projeto esta preparado para ser hospedado no Railway com PostgreSQL.

### Servicos necessarios

1. criar um projeto no Railway
2. adicionar um servico PostgreSQL
3. adicionar o servico da aplicacao apontando para este repositorio
4. vincular a variavel `DATABASE_URL` fornecida pelo PostgreSQL ao servico web
5. configurar `AUTH_SECRET` com um valor longo e aleatorio

### Comandos de deploy

O repositorio inclui suporte para deploy com:

- build padrao do Next.js
- migracao via `prisma migrate deploy`
- runtime via `next start`

Se quiser configurar manualmente no Railway:

- Build Command: `npm run build`
- Start Command: `npm run railway:start`

### Observacoes do Railway

- SQLite nao e apropriado aqui porque o filesystem do host nao deve ser tratado como banco persistente
- o `output: "standalone"` do Next ajuda a gerar um build mais enxuto para o deploy
- antes do primeiro acesso, o Railway vai aplicar as migrations na inicializacao do servico web

## Licenca

Sem licenca formal definida no repositorio neste momento.
