# D&D 5e - Ficha de Personagem Digital

Aplicacao web para montar e acompanhar fichas de personagem de Dungeons & Dragons 5a Edicao, com foco em uso de mesa, persistencia local e edicao rapida.

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

Toda a ficha e salva automaticamente no navegador via localStorage, sem backend.

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand com persistencia
- clsx + tailwind-merge para composicao de classes

## Como Rodar

Pre-requisitos:

- Node.js 18 ou superior
- npm

Instalacao e desenvolvimento:

```bash
npm install
npm run dev
```

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
```

## Funcionalidades Atuais

### Identidade do personagem

- nome do personagem
- nome do jogador
- alinhamento
- selecao de raca
- selecao de antecedente

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

## Estrutura do Projeto

```text
.
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
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
│   │   ├── calc.ts
│   │   ├── store.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Componentes Principais

### `src/components/sheet/CharacterSheet.tsx`

Compoe a ficha inteira, organiza o layout em duas colunas e monta as secoes principais.

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

O estado global fica em `src/lib/store.ts` com Zustand e `persist`.

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
- armazenamento: `localStorage`

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

## Observacoes de Manutencao

- o projeto esta orientado a persistencia local, nao multiusuario
- nao existe backend nem autenticacao
- varias interfaces usam texto livre para preservar flexibilidade de mesa
- as secoes expansivas usam estado local de abertura e dados persistidos no store
- o codigo privilegia edicao manual e velocidade de uso durante a sessao de jogo

## Validacao Recomendada

Durante alteracoes, a validacao mais segura hoje e:

```bash
npx tsc --noEmit
```

## Licenca

Sem licenca formal definida no repositorio neste momento.
